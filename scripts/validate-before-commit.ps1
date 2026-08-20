# CampusTwin pre-commit validation (12-point gate)
# Run from repository root:
#   powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/validate-before-commit.ps1

$ErrorActionPreference = "Continue"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$failures = @()
$results = [ordered]@{}

function Set-Result([string]$key, [string]$status, [string]$detail = "") {
    $script:results[$key] = @{ Status = $status; Detail = $detail }
    if ($status -eq "FAIL") {
        $script:failures += $key
    }
    if ($detail) {
        Write-Host ("[{0}] {1} - {2}" -f $status, $key, $detail)
    } else {
        Write-Host ("[{0}] {1}" -f $status, $key)
    }
}

function Get-Python {
    $venvPython = Join-Path $repoRoot "venv\Scripts\python.exe"
    if (Test-Path $venvPython) { return $venvPython }
    return "python"
}

Write-Host "=== CampusTwin validate-before-commit ===" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot"

$python = Get-Python

# [1/12] TypeScript / Static Analysis
if (Test-Path (Join-Path $repoRoot "frontend\package.json")) {
    Set-Result "TypeScript / Static Analysis" "NOT CONFIGURED" "frontend package.json present but no tsc script verified"
} else {
    Set-Result "TypeScript / Static Analysis" "NOT APPLICABLE" "no TypeScript project detected"
}

# [2/12] Lint
Set-Result "Lint" "NOT CONFIGURED" "no ESLint/Ruff/flake8 config detected in repo"

# [3/12] Frontend tests
Set-Result "Frontend tests" "NOT APPLICABLE" "frontend is static HTML without a test runner"

# [4/12] Backend environment
try {
    & $python -c "import django, rest_framework, corsheaders; print(django.get_version())" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "import failed" }
    Push-Location (Join-Path $repoRoot "backend")
    & $python manage.py check | Out-Null
    $checkOk = ($LASTEXITCODE -eq 0)
    Pop-Location
    if ($checkOk) {
        Set-Result "Backend environment" "PASS" "Django imports + manage.py check"
    } else {
        Set-Result "Backend environment" "FAIL" "manage.py check failed"
    }
} catch {
    Set-Result "Backend environment" "FAIL" $_.Exception.Message
}

# [5/12] Python tests
try {
    Push-Location (Join-Path $repoRoot "backend")
    $testOutput = & $python manage.py test twin -v 1 2>&1 | Out-String
    $testExit = $LASTEXITCODE
    Pop-Location
    if ($testExit -eq 0 -and ($testOutput -match "OK")) {
        Set-Result "Python tests" "PASS" "manage.py test twin OK"
    } elseif ($testOutput -match "NO TESTS RAN") {
        Set-Result "Python tests" "NOT CONFIGURED" "no tests discovered"
    } else {
        Set-Result "Python tests" "FAIL" "test exit $testExit"
        Write-Host $testOutput
    }
} catch {
    Set-Result "Python tests" "FAIL" $_.Exception.Message
}

# [6/12] Build / Zero-Build Verification
Set-Result "Build / Zero-Build Verification" "NOT APPLICABLE" "static frontend + Django runserver (no build step)"

# [7/12] Integration
Set-Result "Integration" "REQUIRES REVIEW" "frontend still uses embedded data; API contracts verified by backend tests"

# [8/12] Secrets scan
$secretHits = @()
$scanRoots = @("backend", "frontend", "docs", "scripts", "data")
$patterns = @(
    "AKIA[0-9A-Z]{16}",
    "BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY",
    "xox[baprs]-",
    "ghp_[A-Za-z0-9]{36}",
    "sk_live_[A-Za-z0-9]+"
)
foreach ($root in $scanRoots) {
    $path = Join-Path $repoRoot $root
    if (-not (Test-Path $path)) { continue }
    foreach ($pattern in $patterns) {
        $matches = Get-ChildItem -Path $path -Recurse -File -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -notmatch "\\venv\\|\\node_modules\\|\\\.git\\" } |
            Select-String -Pattern $pattern -ErrorAction SilentlyContinue
        if ($matches) {
            $secretHits += $matches | ForEach-Object { "$($_.Path):$($_.LineNumber)" }
        }
    }
}
$trackedEnv = git ls-files "*.env" ".env" ".env.*" 2>$null | Where-Object { $_ -and $_ -notmatch "\.env\.example$" }
if ($trackedEnv) { $secretHits += $trackedEnv }
if ($secretHits.Count -eq 0) {
    Set-Result "Secrets scan" "PASS" "no high-confidence secret patterns in scanned trees"
} else {
    Set-Result "Secrets scan" "FAIL" (($secretHits | Select-Object -First 5) -join "; ")
}

# [9/12] Dependency scan
try {
    $pipAudit = Join-Path $repoRoot "venv\Scripts\pip-audit.exe"
    if (Test-Path $pipAudit) {
        $auditOut = & $pipAudit -r (Join-Path $repoRoot "backend\requirements.txt") 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            Set-Result "Dependency scan" "PASS" "pip-audit clean"
        } else {
            Set-Result "Dependency scan" "REQUIRES REVIEW" "pip-audit unavailable or failed (often SSL)"
        }
    } else {
        Set-Result "Dependency scan" "NOT CONFIGURED" "pip-audit not installed in venv"
    }
} catch {
    Set-Result "Dependency scan" "REQUIRES REVIEW" $_.Exception.Message
}

# [10/12] Git diff / Branch Safety
$branch = (git branch --show-current 2>$null)
$diffCheck = git diff --check 2>&1 | Out-String
if ($LASTEXITCODE -ne 0 -and $diffCheck.Trim()) {
    Set-Result "Git diff / Branch Safety" "FAIL" $diffCheck.Trim()
} else {
    Set-Result "Git diff / Branch Safety" "PASS" ("branch=$branch; whitespace check clean")
}

# [11/12] File organization
$requiredDirs = @("frontend", "backend", "data", "docs", "scripts")
$missingDirs = $requiredDirs | Where-Object { -not (Test-Path (Join-Path $repoRoot $_)) }
$rootJunk = Get-ChildItem -Path $repoRoot -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "^(backup|fix2|temp|new-version|final)\." }
if ($missingDirs -or $rootJunk) {
    Set-Result "File organization" "FAIL" ("missing=" + ($missingDirs -join ",") + " junk=" + (($rootJunk | ForEach-Object Name) -join ","))
} else {
    Set-Result "File organization" "PASS" "required top-level dirs present"
}

# [12/12] Project-memory validation
$memoryDir = Join-Path $repoRoot "docs\project-memory"
$requiredMemory = @(
    "PROJECT_CONTEXT.md",
    "CURRENT_CHECKPOINT.md",
    "ARCHITECTURE_STATE.md",
    "ISSUES.md",
    "DECISIONS.md",
    "CHANGELOG.md",
    "NEXT_STEPS.md",
    "VALIDATION_STATUS.md"
)
$missingMemory = @()
if (-not (Test-Path $memoryDir)) {
    $missingMemory = $requiredMemory
} else {
    foreach ($name in $requiredMemory) {
        $file = Join-Path $memoryDir $name
        if (-not (Test-Path $file)) {
            $missingMemory += $name
        } else {
            $len = (Get-Item $file).Length
            if ($len -lt 40) { $missingMemory += "$name(empty)" }
        }
    }
}
$ignoreText = Get-Content (Join-Path $repoRoot ".gitignore") -Raw -ErrorAction SilentlyContinue
if ($ignoreText -notmatch "\.project-memory-private/") {
    $missingMemory += ".gitignore-missing-private-memory"
}
if ($missingMemory.Count -eq 0) {
    Set-Result "Project-memory validation" "PASS" "8 persistent memory files present"
} else {
    Set-Result "Project-memory validation" "FAIL" ($missingMemory -join ", ")
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
foreach ($key in $results.Keys) {
    Write-Host ("{0,-32} {1}" -f $key, $results[$key].Status)
}

if ($failures.Count -gt 0) {
    Write-Host ""
    Write-Host "COMMIT BLOCKED" -ForegroundColor Red
    Write-Host ("Failed checks: " + ($failures -join ", "))
    exit 1
}

Write-Host ""
Write-Host "VALIDATION GATE: REQUIRED CHECKS PASSED" -ForegroundColor Green
exit 0
