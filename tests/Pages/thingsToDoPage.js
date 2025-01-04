import { BaseClass } from './baseClass';
import { test, expect } from '@playwright/test';
import {ElementActions} from './elementActions'
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class ThingsToDoPage extends BaseClass {
    #hamburgerMenu;
    #thingsToDoIcon;
    #activityTitle;
    #activitytDescription;
    #phoneCTA;
    #emailCTA;
    #categoryBtn;
    #categoryOption;

    constructor() {
        super();
        this.elementActions=new ElementActions(this.page)
    }
    async initializeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#thingsToDoIcon = this.page.locator('p').filter({ hasText: 'Things To Do' });
        this.#categoryBtn = this.page.locator("//div[@class='BottomMenu_bottomMenuWrapper__2YmoK']//button[1]")
        this.#activityTitle = this.page.locator('p.hotel-compendium_title__ECdl7');
        this.#activitytDescription = this.page.locator('p.hotel-compendium_description__n_HmG');
        this.#emailCTA = this.page.getByRole('link', { name: 'Email' });
        this.#phoneCTA = this.page.getByRole('link', { name: 'Phone' });
        this.#categoryOption= this.page.locator('p');
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
    getcategoryOption() {
        return this.#categoryOption;
    }
    async navigateToThingsToPage()
    {
        await this.initializeSelectors();
        await this.elementActions.click(this.gethamburgerMenu())
        await this.elementActions.click(this.getthingsToDoIcon())
    }
    async captureGetHotelAmenityDetailsApiResponse()
    {
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
        return responseBody;
    }
    async verifyThingsToDoDetails() {
        await this.initializeSelectors();
        // Extract categories and amenities
        const responseBody=await this.captureGetHotelAmenityDetailsApiResponse()
        const { amenities, categories } = responseBody.data?.getHotelAmenityDetails || {};
        if (!categories || !amenities) {
            throw new Error('Invalid API response: missing categories or amenities.');
            }
            const filteredCategories = categories.filter((category) => 
                amenities.some((amenity) => 
                    amenity.categoryIds.includes(category.id) && amenity.isActive
                )
            );
        for (const category of filteredCategories) {
            const { name: categoryName, id: categoryId } = category;

            let maxRetries = 3;
            let retryCount = 0;

            while (retryCount < maxRetries) {
                if (await this.getcategoryBtn().isVisible()) 
                    {
                    const buttonText = (await this.getcategoryBtn().textContent()).trim();
                    if (buttonText !== categoryName)
                         {
                            await this.getcategoryBtn().click();
                            await this.elementActions.click(this.page.locator(`//p[normalize-space(text())='${categoryName}']`));
                            // await this.page.locator('p').filter({hasText:categoryName}).click();
                            
                        }
                    break;
                    }
                 else
                 {
                    await this.page.mouse.wheel(0, -100);
                    await this.page.waitForTimeout(500);
                }
                retryCount++;
                if (retryCount === maxRetries) {
                    throw new Error(`Category button not visible for "${categoryName}" after ${maxRetries} attempts.`);
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
                const activityLink = this.page.getByRole('heading', { name: activityName ,exact:true});
                await this.elementActions.waitForVisibility(activityLink)
                await this.elementActions.click(activityLink)
                console.log(`Opened the ${activityName} activity successfully ✅`);
 
                // Validate activity details
                const actualActivityName = (await this.elementActions.getText(this.getactivityTitle()))
                const actualDescription = await this.elementActions.getText(this.getactivitytDescription())

                const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
                const expectedDescription=normalizeText(description)
                const expectedActivityName=normalizeText(activityName)
                
                expect.soft(actualActivityName).toBe(expectedActivityName);
                expect.soft(actualDescription).toBe(expectedDescription);

                // Validating email and phone CTA
                const emailInfo = information.find((info) => info.type === 'EMAIL');
                const phoneInfo = information.find((info) => info.type === 'PHONE');

                if (emailInfo) {
                    const isEmailCTAVisible=await this.elementActions.isVisible(this.getemailCTA())
                    expect.soft(isEmailCTAVisible).toBeTruthy()
                    console.log(`Email CTA is visible for ${actualActivityName} ✅`);
                }
                if (phoneInfo) {
                    const isPhoneCTAVisible=await this.elementActions.isVisible(this.getphoneCTA())
                    expect.soft(isPhoneCTAVisible).toBeTruthy()
                    console.log(`Phone CTA is visible for ${actualActivityName} ✅`);
                }

                // Closing the activity Modal
                await this.page.keyboard.press('Escape');
                console.log(`Contents verified and closing the ${actualActivityName} activity Modal ✅`);
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