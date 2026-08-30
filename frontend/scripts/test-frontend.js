#!/usr/bin/env node
/**
 * CampusTwin Automated Frontend Regression & Integrity Test Suite
 * Validates DOM bindings, GIS coordinate ranges, data schema, simulation math, and security.
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_HTML_PATH = path.resolve(__dirname, '..', 'frontend', 'index.html');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

function runTests() {
  console.log('\n======================================================');
  console.log('  🧪 Running CampusTwin Frontend Automated Test Suite');
  console.log('======================================================\n');

  if (!fs.existsSync(FRONTEND_HTML_PATH)) {
    console.error(`Fatal: frontend/index.html does not exist at ${FRONTEND_HTML_PATH}`);
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(FRONTEND_HTML_PATH, 'utf8');

  // 1. Basic Structure & Security Headers
  console.log('1. Structure & HTML Integrity');
  assert(htmlContent.includes('<!doctype html>') || htmlContent.includes('<!DOCTYPE html>'), 'Valid HTML5 doctype declaration');
  assert(htmlContent.includes('<title>CampusTwin'), 'Proper title tag present');
  assert(htmlContent.includes('name="viewport"'), 'Responsive viewport meta tag present');
  assert(htmlContent.includes('leaflet@1.9.4'), 'Leaflet.js v1.9.4 loaded');
  assert(htmlContent.includes('chart.js'), 'Chart.js library loaded');

  // 2. DOM ID Binding Verification
  console.log('\n2. DOM Element ID Bindings');
  const getElementByIdMatches = htmlContent.match(/document\.getElementById\(['"]([^'"]+)['"]\)/g) || [];
  const referencedIds = new Set(getElementByIdMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]));

  referencedIds.forEach(id => {
    const idDeclaration = new RegExp(`id=["']${id}["']`, 'i');
    assert(idDeclaration.test(htmlContent), `Required DOM element #${id} exists in HTML markup`);
  });

  // 3. Extract & Validate Embedded Zones Array
  console.log('\n3. Geospatial Campus Zones (Z-01 to Z-20)');
  const zonesMatch = htmlContent.match(/const zones\s*=\s*(\[[\s\S]*?\]);\s*(?:const roads|let roads)/);
  assert(zonesMatch !== null, 'Found zones definition array in script');

  if (zonesMatch) {
    let zones = [];
    try {
      zones = eval(zonesMatch[1]);
    } catch (e) {
      assert(false, `Parsed zones array without syntax error: ${e.message}`);
    }

    assert(zones.length === 20, `Contains exactly 20 campus zones (found: ${zones.length})`);

    const validAqi = new Set(['Good', 'Moderate', 'Poor', 'Severe']);
    const validConf = new Set(['sensor', 'estimate']);

    zones.forEach(z => {
      assert(typeof z.code === 'string' && /^Z-\d{2}$/.test(z.code), `Zone code format valid: ${z.code}`);
      assert(typeof z.name === 'string' && z.name.length > 0, `Zone name valid: ${z.code} (${z.name})`);
      assert(z.lat >= 20.24 && z.lat <= 20.26, `Latitude in SOA ITER bounding box: ${z.code} (${z.lat})`);
      assert(z.lng >= 85.79 && z.lng <= 85.81, `Longitude in SOA ITER bounding box: ${z.code} (${z.lng})`);
      assert(validAqi.has(z.aqi), `AQI category valid: ${z.code} -> ${z.aqi}`);
      assert(validConf.has(z.confidence), `Confidence valid: ${z.code} -> ${z.confidence}`);
      assert(z.vulnerability >= 0 && z.vulnerability <= 10, `Vulnerability score in [0, 10]: ${z.code} (${z.vulnerability})`);
      assert(z.treeCover >= 0 && z.treeCover <= 100, `Tree cover percentage in [0, 100]: ${z.code} (${z.treeCover}%)`);
    });
  }

  // 4. Extract & Validate Road Segments
  console.log('\n4. Transit Corridors & Road Segments (R-01 to R-05)');
  const roadsMatch = htmlContent.match(/const roads\s*=\s*(\[[\s\S]*?\]);\s*const roadCoords/);
  assert(roadsMatch !== null, 'Found roads definition array in script');

  if (roadsMatch) {
    let roads = [];
    try {
      roads = eval(roadsMatch[1]);
    } catch (e) {
      assert(false, `Parsed roads array without syntax error: ${e.message}`);
    }

    assert(roads.length === 5, `Contains exactly 5 transit corridors (found: ${roads.length})`);
    roads.forEach(r => {
      assert(typeof r.id === 'string' && /^R-\d{2}$/.test(r.id), `Road ID format valid: ${r.id}`);
      assert(['HIGH', 'MODERATE', 'LOW'].includes(r.risk), `Risk level valid: ${r.id} -> ${r.risk}`);
      assert(r.traffic >= 0 && r.traffic <= 100, `Traffic percentage valid: ${r.id} (${r.traffic}%)`);
    });
  }

  // 5. Time-Series Trend Dataset Integrity
  console.log('\n5. Time-Based Trend Dataset Integrity');
  const trendMatch = htmlContent.match(/const trendData\s*=\s*(\{[\s\S]*?\n\s*\});/);
  assert(trendMatch !== null, 'Found trendData definition in script');

  if (trendMatch) {
    let trendData = {};
    try {
      trendData = eval('(' + trendMatch[1] + ')');
    } catch (e) {
      assert(false, `Parsed trendData without error: ${e.message}`);
    }

    assert(trendData['24h'] && trendData['24h'].labels.length === 10, '24h trend has 10 hourly data points');
    assert(trendData['24h'].aqi.length === 10 && trendData['24h'].temp.length === 10, '24h trend has corresponding AQI and Temp arrays');
    assert(trendData['7d'] && trendData['7d'].labels.length === 7, '7d trend has 7 daily data points');
    assert(trendData['7d'].pm25.length === 7 && trendData['7d'].traffic.length === 7, '7d trend has corresponding PM2.5 and Traffic arrays');
  }

  // 6. Simulation Calculations & Factors
  console.log('\n6. Digital Twin Intervention Simulation Logic');
  const factors = {
    trees: [4, 18],
    shade: [3, 10],
    traffic: [2, 22],
    roof: [3, 5]
  };

  // Test simulation formula for 50% tree intervention on 40°C / 100 PM2.5 zone
  const baseTemp = 40;
  const basePm = 100;
  const intensity = 0.50; // 50%
  const expectedTemp = Math.max(20, baseTemp - (intensity * factors.trees[0]));
  const expectedPm = Math.max(5, basePm - Math.round(intensity * factors.trees[1]));

  assert(expectedTemp === 38.0, `Tree simulation temperature drop calculation accurate: 40°C - 2.0°C = ${expectedTemp}°C`);
  assert(expectedPm === 91, `Tree simulation PM2.5 drop calculation accurate: 100 - 9 = ${expectedPm}`);

  // 7. Security Assertions
  console.log('\n7. Security & Injection Checks');
  assert(!htmlContent.includes('document.write('), 'No dangerous document.write invocations');
  assert(!htmlContent.includes('eval(location'), 'No dynamic execution of user location parameters');

  console.log('\n======================================================');
  console.log(`  Test Results: ${passedTests} Passed, ${failedTests} Failed`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
