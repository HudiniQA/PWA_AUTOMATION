import { RestaurantPage } from '../Pages/restautantsPage'; // Corrected import name
import { test, expect } from '@playwright/test';
const testData=JSON.parse(JSON.stringify(require('../testData/testData.json')));

test.describe('To verify the restaurants are displayed @pre-checkin', () => {
    let restaurantPage;

    test.beforeEach(async ({ browser }) => {
        restaurantPage = new RestaurantPage();  // Instantiate the RestaurantPage class
        await restaurantPage.setup('Chrome');  // Call setup to initialize the browser and page
        await restaurantPage.navigateToUrl(testData.fairmontMakkahPWA.endPoint); // Navigate to the URL
    });

    test.afterEach(async () => {
        if (restaurantPage) {
            await restaurantPage.teardown();  // Call teardown to clean up after each test
        }
    });

    test('Verify the restaurants', async () => {
        await restaurantPage.navigateToRestaurantsPage();
        await restaurantPage.verifyRestaurantDetails(); // Perform restaurant page navigation and verification
    });
});



// test('demotest',async({page})=>
// {
//    await page.goto('https://fairmont.hudini.app/en/fairmont-makkah-clock-royal-tower/')
//    await page.locator('.hamburger-react').click()
//    await page.getByText('Restaurants & Bars').click()
//    await page.waitForLoadState()
//    const restaurantsResponse= await page.waitForResponse('https://api-properties-a.hudini.io/graphql')
//    const responseBody= await restaurantsResponse.json()
//    // console.dir(responseBody, { depth: null });
// const restaurantDetails = responseBody.data.getRestaurantDetails.restaurant;
// for (let index = 0; index < restaurantDetails.length; index++) {
//   const restaurant = restaurantDetails[index];
//   if (restaurant.isActive) {
//     const restaurantName= restaurant.name;
//     const restaurantDescription = restaurant.description;
//     await page.keyboard.press('Escape')
//     await page.getByRole('heading',{name:`${restaurantName}`}).click()
//     const actualRestaurantName=await page.locator("//div[@class='RestaurantDetails_listComponentData__eVZli']//h2[1]").textContent()
//     const actualRestaurantDescription=await page.locator("//div[@class='RestaurantDetails_gapList__EaE_B']//p[1]").textContent()
//    expect(restaurantName).toEqual(actualRestaurantName)
//    expect(restaurantDescription).toEqual(actualRestaurantDescription)
//   }
// }

// })