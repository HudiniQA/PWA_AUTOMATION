import { ThingsToDoPage } from '../Pages/thingsToDoPage';
import { test } from '@playwright/test';
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

test.describe('To verify the things to do page', () => {
  let thingsToDo;

  test.beforeEach(async ({ browser }) => {
    thingsToDo = new ThingsToDoPage();  // Instantiate the ThingsToDoPage class
    await thingsToDo.setup('Chrome');  // Call setup to initialize the browser and page
    await thingsToDo.navigateToUrl(testData.fairmontMakkahPWA.endPoint); // Navigate to the URL
  });

  test.afterEach(async () => {
    if (thingsToDo) {
      await thingsToDo.teardown();  // Call teardown to clean up after each test
    }
  });

  test('Verify the things to do activities and categories', async () => {
    await thingsToDo.navigateToThingsToPage()
    await thingsToDo.verifyThingsToDoDetails();
  });
});














































































































// import { test, expect } from '@playwright/test'

// test('Demo things to do', async ({ page }) => {
//     // Navigate to the website
//     await page.goto('https://fairmont.hudini.app/en/fairmont-makkah-clock-royal-tower/');
//     await page.locator('.hamburger-react').click();
//     await page.locator('p').filter({ hasText: 'Things To Do' }).click();

//     // Define the GraphQL query
//     const query = `query MyQuery($hotelId: String!, $lang: String) {
//       getHotelAmenityDetails(input: {hotelId: $hotelId, lang: $lang}) {
//         amenities {
//           categoryId
//           categoryIds
//           createdAt
//           createdBy
//           description
//           highlights
//           hotelId
//           id
//           images {
//             fileName
//             index
//             master
//             ratio16to9
//             ratio1to1
//             ratio21to9
//           }
//           information {
//             displayTitle
//             field
//             index
//             type
//             value
//           }
//           isActive
//           name
//           pk
//           sk
//           updatedAt
//           updatedBy
//           version
//         }
//         categories {
//           createdAt
//           createdBy
//           hotelId
//           id
//           name
//           sk
//           pk
//           updatedAt
//           updatedBy
//           version
//         }
//       }
//     }`;

//     const variables = {
//         hotelId: "9bcdef3a-e0b7-45bd-908d-d555db8bd4be"
//     };

//     // Make API request to fetch amenities and categories
//     const response = await page.request.post('https://api-properties-a.hudini.io/graphql', {
//         data: {
//             query: query,
//             variables: variables
//         },
//         headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': 'da2-6czgvkngsrhenerfydlymzprsa'
//         }
//     });

//     const responseBody = await response.json();
//     // console.dir(responseBody, { depth: null });

//     // Extract categories and amenities
//     const { amenities, categories } = responseBody.data.getHotelAmenityDetails;
//     categories.map((c) => c.name)//listing the category names
//     amenities.map((a) => a.name)//listing the amenity names
//     // console.log('Categories:', categories.map((c) => c.name));
//     // console.log('Amenities:', amenities.map((a) => a.name));

//     // Navigate through categories and validate activities
//     const categoryButton = page.locator("//button[@id=':r5:']");

//     for (const category of categories) {
//         const { name: categoryName, id: categoryId } = category;

//         // Click to change the category if not default
//         if ((await categoryButton.textContent()).trim() !== categoryName) {
//             await categoryButton.click();
//             await page.getByText(categoryName).click();
//         }

//         // Filter amenities for the current category
//         const currentAmenities = amenities.filter((amenity) =>
//             amenity.categoryIds.includes(categoryId)
//         );

//         // Validate each activity in the current category
//         for (const amenity of currentAmenities) {
//             if (!amenity.isActive) continue; // Skip inactive amenities

//             const { name: activityName, description,information } = amenity;

//             // Click on the activity
//             const activityLink = page.getByRole('heading', { name: activityName });
//             await activityLink.click();

//             // Validate activity details
//             const actualActivityName = await page.locator('p.hotel-compendium_title__ECdl7').textContent();
//             const actualDescription = await page.locator('p.hotel-compendium_description__n_HmG').textContent();

//             expect(actualActivityName.trim()).toBe(activityName);
//             expect(actualDescription.trim()).toBe(description);

//             //Validating email and phone CTA
//             const emailInfo = information.find((info) => info.type === 'EMAIL');
//             const phoneInfo = information.find((info) => info.type === 'PHONE');

//             if (emailInfo) {
//                 const emailCTA = page.getByRole('link', { name: 'Email' });
//                 await expect(emailCTA).toBeVisible();
//             }

//             if (phoneInfo) {
//                 const phoneCTA = page.getByRole('link', { name: 'Phone' });
//                 await expect(phoneCTA).toBeVisible();
//             }
//             // Closing the activity Modal
//             await page.keyboard.press('Escape');
//         }
//     }
// });
