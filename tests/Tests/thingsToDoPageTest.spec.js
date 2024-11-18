import { test, expect } from '@playwright/test'

test('Demo things to do', async ({ page }) => {
    await page.goto('https://fairmont.hudini.app/en/fairmont-makkah-clock-royal-tower/')
    await page.locator('.hamburger-react').click()
    await page.locator('p').filter({ hasText: 'Things To Do' }).click()
    //    Perform API test
    const query = `query MyQuery($hotelId: String!, $lang: String) {
  getHotelAmenityDetails(input: {hotelId: $hotelId, lang: $lang}) {
    amenities {
      categoryId
      categoryIds
      createdAt
      createdBy
      description
      highlights
      hotelId
      id
      images {
        fileName
        index
        master
        ratio16to9
        ratio1to1
        ratio21to9
      }
      information {
        displayTitle
        field
        index
        type
        value
      }
      isActive
      name
      pk
      sk
      updatedAt
      updatedBy
      version
    }
    categories {
      createdAt
      createdBy
      hotelId
      id
      name
      sk
      pk
      updatedAt
      updatedBy
      version
    }
  }
}`;
    const variables = {
        hotelId: "9bcdef3a-e0b7-45bd-908d-d555db8bd4be"
    };

    // Make API request directly using request object
    const response = await page.request.post('https://api-properties-a.hudini.io/graphql', {
        data: {
            query: query,
            variables: variables
        },
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'da2-6czgvkngsrhenerfydlymzprsa'
        }
    });

    const responseBody = await response.json();
    console.dir(responseBody, { depth: null });
    // Extract amenity names
    const amenitys = responseBody.data.getHotelAmenityDetails.amenities.map((amenity) => amenity.name);
    // Extract amenity description
    const amenityDescription = responseBody.data.getHotelAmenityDetails.amenities.map((amenity) => amenity.description);
    // Extract category names
    const categories = responseBody.data.getHotelAmenityDetails.categories.map((category) => category.name);

    console.log('Amenity Names:', amenitys);
    console.log('Amenity Description:', amenityDescription);
    console.log('Category Names:', categories);
    await page.locator("//button[@id=':r5:']").click()
    

})