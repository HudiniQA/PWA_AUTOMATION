import { AboutHotel } from '../Pages/aboutHotelPage';
import { test, request } from '@playwright/test';
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

test.describe('To verify the hotel info ', () => {
    let aboutHotePage;

    test.beforeEach(async ({ browser }) => {
        aboutHotePage = new AboutHotel();  // Instantiate the hotelInfo class
        await aboutHotePage.setup('Chrome');  // Call setup to initialize the browser and page
        await aboutHotePage.navigateToUrl(testData.fairmontMakkahPWA.endPoint); // Navigate to the URL
    });

    test.afterEach(async () => {
        if (aboutHotePage) {
            await aboutHotePage.teardown();  // Call teardown to clean up after each test
        }
    });

    test('Verify the hotel info popup', async () => {
        await aboutHotePage.navigateToAboutHotelModal()
        await aboutHotePage.verifyTheHotelInfoPopup(); // Perform aboutHotel page navigation and verification
    });
});


// test('Verify API response from About Hotel Page', async ({ page,request }) => {
//     // Perform UI actions
//     await page.goto('https://fairmont.hudini.app/en/fairmont-makkah-clock-royal-tower/');
//     await page.locator('.hamburger-react').click();
//     await page.getByText('About Us').click();
//     // Perform API test
//     const query = testData.fairmontMakkahPWA.aboutHotel.getPropertyDetailsByHotelIdQuery;
//     const variables = {
//         hotelId: testData.fairmontMakkahPWA.hotelId
//     };

//      // Make API request directly using request object
//      const response = await request.post(testData.fairmontMakkahPWA.getPropertyDetailsByHotelIdEndpont, {
//          data: {
//              query: query,
//              variables: variables
//          },
//          headers: {
//              'Content-Type': 'application/json',
//              'x-api-key': testData.fairmontMakkahPWA.aboutHotel.getPropertyDetailsByHotelIdApiKey
//          }
//      });

//     const responseBody = await response.json();
//     console.dir(responseBody, { depth: null });

//     expect(response.ok()).toBeTruthy();
//     expect(responseBody).toHaveProperty('data')
//     console.log(responseBody.data.getPropertyDetailsByHotelId.hotel.description)
//     console.log(responseBody.data.getPropertyDetailsByHotelId.hotel.name)
// });


