import { InRoomDinig } from '../Pages/inRoomDiningPage';
import { test } from '@playwright/test';
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

test.describe('To verify the In-Room Dining service', () => {
    let inRoomDining;

    test.beforeEach(async ({ browser }) => {
        inRoomDining = new InRoomDinig();  // Instantiate the houseKeepingPage class
        await inRoomDining.setup('Chrome');  // Call setup to initialize the browser and page
        await inRoomDining.navigateToUrl(testData.fairmontMakkahPWA.endPoint); // Navigate to the URL
    });

    test.afterEach(async () => {
        if (inRoomDining) {
            await inRoomDining.teardown();  // Call teardown to clean up after each test
        }
    });

    test.only('Verify the houseKeeping page', async () => {
        await inRoomDining.navigateToPostCheckInPage();
        await inRoomDining.verifyTheIrdPage();

    });
});