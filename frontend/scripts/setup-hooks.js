#!/usr/bin/env node
/**
 * Setup Git Pre-Commit Hook for CampusTwin
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const HOOKS_DIR = path.join(ROOT_DIR, '.git', 'hooks');
const PRE_COMMIT_HOOK_PATH = path.join(HOOKS_DIR, 'pre-commit');

const HOOK_CONTENT = `#!/bin/sh
# CampusTwin Pre-Commit Automated Validation Gate
echo "Running CampusTwin pre-commit validation..."
node scripts/validate-before-commit.js
RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo "Commit rejected by CampusTwin validation gate."
  exit 1
fi
exit 0
`;

try {
  if (!fs.existsSync(HOOKS_DIR)) {
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }

  fs.writeFileSync(PRE_COMMIT_HOOK_PATH, HOOK_CONTENT, { mode: 0o755 });
  console.log(`\n✓ Git pre-commit hook successfully installed at: ${PRE_COMMIT_HOOK_PATH}\n`);
} catch (err) {
  console.error(`Failed to install Git hook: ${err.message}`);
  process.exit(1);
}
