 // @ts-check
 const { defineConfig, devices } = require('@playwright/test');

 /**
  * Read environment variables from file.
  * https://github.com/motdotla/dotenv
  */
 // require('dotenv').config({ path: path.resolve(__dirname, '.env') });
 
 /**
  * @see https://playwright.dev/docs/test-configuration
  */
 module.exports = defineConfig({
  globalSetup: './allureGlobalSetup.js',
  timeout: 300000,
   testDir: './tests',
   /* Run tests in files in parallel */
   fullyParallel: false,
   /* Fail the build on CI if you accidentally left test.only in the source code. */
   forbidOnly: !!process.env.CI,
   /* Retry on CI only */
   retries: process.env.CI ? 0 : 3,  // Retries set to 2 in local CLI, 0 in CI
   /* Opt out of parallel tests on CI. */
   workers: process.env.CI ? 3 : undefined,
   /* Reporter to use. See https://playwright.dev/docs/test-reporters */
   reporter: [
    ['list'],                           // Standard console output
    ['html', { open: 'always' }],        // HTML report
    ['json', { outputFile: 'report.json' }], // JSON report for integration with other tools
    ['junit', { outputFile: 'results.xml' }], // JUnit report (useful for CI)
    ['allure-playwright'],// Allure reporter for Allure reporting
    ['dot'],                            // Dot reporter (minimal output)
  ],
   /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
   use: {
    actionTimeout:10000,
    navigationTimeout:30000,
     /* Base URL to use in actions like await page.goto('/'). */
     // baseURL: 'http://127.0.0.1:3000',
 
     /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //  trace: 'on-first-retry',
     video: {
      mode: 'retain-on-failure',
      // size: { width: 1920, height: 1080 }
    },
    screenshot: 'only-on-failure', // Capture screenshots on test failure
   },
   outputDir: 'test-results/videos',
   
   /* Configure projects for major browsers */
   projects: [
     {
       name: 'chromium',
       use: { ...devices['Desktop Chrome'] },
     },
 
     {
       name: 'firefox',
       use: { ...devices['Desktop Firefox'] },
     },
 
     {
       name: 'webkit',
       use: { ...devices['Desktop Safari'] },
     },
 
     /* Test against mobile viewports. */
     // {
     //   name: 'Mobile Chrome',
     //   use: { ...devices['Pixel 5'] },
     // },
     // {
     //   name: 'Mobile Safari',
     //   use: { ...devices['iPhone 12'] },
     // },
 
     /* Test against branded browsers. */
     // {
     //   name: 'Microsoft Edge',
     //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
     // },
     // {
     //   name: 'Google Chrome',
     //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
     // },
   ],
 
   /* Run your local dev server before starting the tests */
   // webServer: {
   //   command: 'npm run start',
   //   url: 'http://127.0.0.1:3000',
   //   reuseExistingServer: !process.env.CI,
   // },
 });