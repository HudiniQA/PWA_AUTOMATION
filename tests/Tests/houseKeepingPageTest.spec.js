import { HouseKeepingPage } from '../Pages/houseKeepingPage';
import { test } from '@playwright/test';
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

test.describe('To verify the houseKeeping services', () => {
    let houseKeepingPage;

    test.beforeEach(async ({ browser }) => {
        houseKeepingPage = new HouseKeepingPage();  // Instantiate the houseKeepingPage class
        await houseKeepingPage.setup('Chrome');  // Call setup to initialize the browser and page
        await houseKeepingPage.navigateToUrl(testData.fairmontMakkahPWA.endPoint); // Navigate to the URL
    });

    test.afterEach(async () => {
        if (houseKeepingPage) {
            await houseKeepingPage.teardown();  // Call teardown to clean up after each test
        }
    });

    test('Verify the houseKeeping page', async () => {
        await houseKeepingPage.navigateToPostCheckInPage();
        await houseKeepingPage.verifyTheHouseKeepingPage();
    });
});