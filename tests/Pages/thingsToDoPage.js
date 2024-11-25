import { BaseClass } from './baseClass';
import { test, expect } from '@playwright/test';
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class ThingsToDoPage extends BaseClass {
    #hamburgerMenu;
    #thingsToDoIcon;
    #activityTitle;
    #activitytDescription;
    #phoneCTA;
    #emailCTA;
    #categoryBtn;

    constructor() {
        super();
    }
    async initializeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#thingsToDoIcon = this.page.locator('p').filter({ hasText: 'Things To Do' });
        this.#categoryBtn = this.page.getByRole('button').first();
        this.#activityTitle = this.page.locator('p.hotel-compendium_title__ECdl7');
        this.#activitytDescription = this.page.locator('p.hotel-compendium_description__n_HmG');
        this.#emailCTA = this.page.getByRole('link', { name: 'Email' });
        this.#phoneCTA = this.page.getByRole('link', { name: 'Phone' });
    }
    gethamburgerMenu() {
        return this.#hamburgerMenu;
    }
    getthingsToDoIcon() {
        return this.#thingsToDoIcon;
    }
    getcategoryBtn() {
        return this.#categoryBtn;
    }
    getactivityTitle() {
        return this.#activityTitle;
    }
    getactivitytDescription() {
        return this.#activitytDescription;
    }
    getemailCTA() {
        return this.#emailCTA;
    }
    getphoneCTA() {
        return this.#phoneCTA;
    }
    async verifyThingsToDoDetails() {
        await this.initializeSelectors();
        await this.gethamburgerMenu().click();
        await this.getthingsToDoIcon().click();
        const endPoint = testData.fairmontMakkahPWA.thingsToDo.getHotelAmenityDetailsEndpoint;
        const query = testData.fairmontMakkahPWA.thingsToDo.getHotelAmenityDetailsQuery;
        const apiKey = testData.fairmontMakkahPWA.thingsToDo.getHotelAmenityDetailsApiKey;
        const hotelId = testData.fairmontMakkahPWA.hotelId
        const variables =
        {
            hotelId: hotelId
        }
        // Make API request to capture the actual data
        const response = await this.page.request.post(endPoint, {
            data: {
                query: query,
                variables: variables,
            },
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
        });
        const responseBody = await response.json()
        if (responseBody) {
            console.log(' API call was successful.✅');
        } else {
            console.error('API call failed. Response body is null or undefined. ❌');
            return; // Exit if API response is invalid
        }

        // Extract categories and amenities
        const { amenities, categories } = responseBody.data.getHotelAmenityDetails;
        categories.map((c) => c.name)//listing the categories into the categories array
        categories.map((a) => a.name)// listing the amenities into the amenities array

        for (const category of categories) {
            const { name: categoryName, id: categoryId } = category;
            // Click to change the category if not default

            if (await this.getcategoryBtn().isVisible()) {
                if ((await this.getcategoryBtn().textContent()).trim() !== categoryName) {
                    await this.getcategoryBtn().click();
                    await this.page.getByText(categoryName, { exact: true }).click();
                }
            }
            else {
                //   If not visible, scroll up and check again
                await this.page.mouse.wheel(0, -100); // Scroll up slightly
                await this.page.waitForTimeout(500); // Allow UI to update
                if (await this.getcategoryBtn().isVisible()) {
                    if ((await this.getcategoryBtn().textContent()).trim() !== categoryName) {
                        await this.getcategoryBtn().click();
                        await this.page.getByText(categoryName, { exact: true }).click();
                    }
                    else{
                        // Throw an error if the button is still not visible
                        throw new Error('Category button is not visible even after scrolling.');
                    }

                }
            }
            
            // Filter amenities for the current category based on category id
            const currentAmenities = amenities.filter((amenity) =>
                amenity.categoryIds.includes(categoryId)
            );
            // Validate each activity in the current category
            for (const amenity of currentAmenities) {
                if (!amenity.isActive) continue; // Skip inactive amenities

                const { name: activityName, description, information } = amenity;
                // Click on the activity
                await this.page.waitForTimeout(500); 
                const activityLink = this.page.getByRole('heading', { name: activityName });
                await activityLink.click();
                console.log(`Opened the ${activityName} successfully ✅`)
                // Validate activity details
                const actualActivityName = await this.getactivityTitle().textContent();
                const actualDescription = await this.getactivitytDescription().textContent();

                expect(actualActivityName).toBe(activityName);
                expect(actualDescription).toBe(description);

                //Validating email and phone CTA
                const emailInfo = information.find((info) => info.type === 'EMAIL');
                const phoneInfo = information.find((info) => info.type === 'PHONE');

                if (emailInfo) {
                    await expect(this.getemailCTA()).toBeVisible();
                    console.log(`Email CTA is visible for ${actualActivityName}✅ `)
                }
                if (phoneInfo) {
                    await expect(this.getphoneCTA()).toBeVisible();
                    console.log(`Phone CTA is visible for ${actualActivityName}✅ `)
                }
                // Closing the activity Modal
                await this.page.keyboard.press('Escape');
                console.log(`Contents verified and closing the ${actualActivityName} activity Modal ✅`)
            }
        }
    }
}


// if ((await this.getcategoryBtn().textContent()).trim() !== categoryName) {
            //     if (await this.getcategoryBtn().isVisible()) {
            //         // If the category button is visible, click it
            //         await this.getcategoryBtn().click();
            //     } else {
            //         // If not visible, scroll up and check again
            //         await this.page.mouse.wheel(0, -100); // Scroll up slightly
            //         await this.page.waitForTimeout(500); // Allow UI to update

            //         if (await this.getcategoryBtn().isVisible()) {
            //             // Click the button if it becomes visible after scrolling
            //             await this.getcategoryBtn().click();
            //         } else {
            //             // Throw an error if the button is still not visible
            //             throw new Error('Category button is not visible even after scrolling.');
            //         }
            //     }                
            //     await this.page.getByText(categoryName,{exact:true}).click();
            // }