import { BaseClass } from './baseClass';
import { test, expect } from '@playwright/test';

export class RestaurantPage extends BaseClass {
    #hamburgerMenu;
    #restaurantsAndBars;
    #restaurantTitle;
    #restaurantDescription;

    constructor() {
        super(); // Calls the BaseClass constructor to initialize browser, context, and page
    }

    async initializeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#restaurantsAndBars = this.page.getByText('Restaurants & Bars');
        this.#restaurantTitle = this.page.locator("//div[@class='RestaurantDetails_listComponentData__eVZli']//h2[1]");
        this.#restaurantDescription = this.page.locator("//div[@class='RestaurantDetails_gapList__EaE_B']//p[1]");
    }

    getHamburgerMenu() {
        return this.#hamburgerMenu;
    }

    getRestaurantsAndBars() {
        return this.#restaurantsAndBars;
    }

    getRestaurantTitle() {
        return this.#restaurantTitle;
    }

    getRestaurantDescription() {
        return this.#restaurantDescription;
    }

    // Call initializeSelectors before using any selectors
    async navigateToRestaurantsPage() {
        await this.initializeSelectors();  // Ensure selectors are initialized first
        await this.getHamburgerMenu().click();
        await this.getRestaurantsAndBars().click();
        const restaurantsResponse = await this.page.waitForResponse('https://api-properties-a.hudini.io/graphql');
        const responseBody = await restaurantsResponse.json();
        console.dir(responseBody,{depth:null})
        const restaurantDetails = responseBody.data.getRestaurantDetails.restaurant;
        for (let index = 0; index < restaurantDetails.length; index++) {
            const restaurant = restaurantDetails[index];
            if (restaurant.isActive) {
                const restaurantName = restaurant.name;
                const restaurantDescription = restaurant.description;

                await this.page.keyboard.press('Escape');
                await this.page.getByRole('heading', { name: `${restaurantName}` }).click();

                const actualRestaurantName = await this.getRestaurantTitle().textContent();
                const actualRestaurantDescription = await this.getRestaurantDescription().textContent();

                expect(restaurantName).toEqual(actualRestaurantName);
                expect(restaurantDescription).toEqual(actualRestaurantDescription);
            }
        }
    }
}



























// const { expect, test } = require('@playwright/test');
// export class restaurantsPage {
//     constructor(page) {
//         this.page = page
//         this.hamburgerMenu = page.locator('.hamburger-react')
//         this.restaurantsAndBarsOption = page.getByText('Restaurants & Bars')
//         this.restaurantTitle = page.locator("//div[@class='RestaurantDetails_listComponentData__eVZli']//h2[1]")
//         this.restaurantDescription = page.locator("//div[@class='RestaurantDetails_gapList__EaE_B']//p[1]")
//     }
//     async navigateToRestaurantsPage() {
//         await this.page.goto('https://fairmont.hudini.app/en/fairmont-makkah-clock-royal-tower/')
//         await this.hamburgerMenu.click()
//         await this.restaurantsAndBarsOption.click()
//         const restaurantsResponse = await this.page.waitForResponse('https://api-properties-a.hudini.io/graphql')
//         const responseBody = await restaurantsResponse.json()
//         // console.dir(responseBody, { depth: null });
//         const restaurantDetails = responseBody.data.getRestaurantDetails.restaurant;
//         for (let index = 0; index < restaurantDetails.length; index++) {
//             const restaurant = restaurantDetails[index];
//             if (restaurant.isActive) {
//                 const restaurantName = restaurant.name;
//                 const restaurantDescription = restaurant.description;
//                 await this.page.keyboard.press('Escape')
//                 await this.page.getByRole('heading', { name: `${restaurantName}` }).click()
//                 const actualRestaurantName = this.restaurantTitle.textContent()
//                 const actualRestaurantDescription = this.restaurantDescription.textContent()
//                 expect(restaurantName).toEqual(actualRestaurantName)
//                 expect(restaurantDescription).toEqual(actualRestaurantDescription)
//             }
//         }
//     }
// }