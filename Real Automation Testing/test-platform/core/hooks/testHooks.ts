import { test } from '@playwright/test';

test.beforeEach(async ({}, testInfo) => {
  console.log(`\n🚀 Starting Test: ${testInfo.title}`);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    console.error(`❌ Test Failed: ${testInfo.title}`);

    // Screenshot on failure
    await page.screenshot({
      path: `test-platform/reports/screenshots/${testInfo.title}.png`,
      fullPage: true
    });
  } else {
    console.log(`✅ Test Passed: ${testInfo.title}`);
  }
});