import { OffersPage } from '../Pages/offersPage';
import { test, request } from '@playwright/test';
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

test.describe('To verify the offers page @pre-checkin', () => {
    let offersPage;

    test.beforeEach(async ({ browser }) => {
        offersPage = new OffersPage();  // Instantiate the hotelInfo class
        await offersPage.setup('Chrome');  // Call setup to initialize the browser and page
        await offersPage.navigateToUrl(testData.fairmontMakkahPWA.endPoint); // Navigate to the URL
    });

    test.afterEach(async () => {
        if (offersPage) {
            await offersPage.teardown();  // Call teardown to clean up after each test
        }
    });

    test('Verify the offerstypes and corrosponding offers', async () => {
        await offersPage.navigateToOffersPage()
        await offersPage.verifyTheOffersDetails() 
       
    });
});
