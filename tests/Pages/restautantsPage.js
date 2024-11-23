import { error } from 'console';
import { BaseClass } from './baseClass';
import { test, expect } from '@playwright/test';
const testData=JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class RestaurantPage extends BaseClass {
    #hamburgerMenu;
    #restaurantsAndBars;
    #restaurants
    #restaurantsAndBar
    #restaurantTitle;
    #restaurantDescription;
    #phoneCTA
    #emailCTA
    #menuCTA

    constructor() {
        super(); // Calls the BaseClass constructor to initialize browser, context, and page
    }

    async initializeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#restaurantsAndBars = this.page.getByText('Restaurants & Bars');
        this.#restaurants=this.page.getByText('Restaurants')
        this.#restaurantsAndBar=this.page.getByText('Restaurants & Bar')
        this.#restaurantTitle = this.page.locator("//div[@class='RestaurantDetails_listComponentData__eVZli']//h2[1]");
        this.#restaurantDescription = this.page.locator("//div[@class='RestaurantDetails_gapList__EaE_B']//p[1]");
        this.#phoneCTA=this.page.getByRole('link', { name: 'Phone' })
        this.#emailCTA=this.page.getByRole('link', { name: 'Email' })
        this.#menuCTA=this.page.getByRole('button', { name: 'Menu' })
    }

    getHamburgerMenu() {
        return this.#hamburgerMenu;
    }

    getRestaurantsAndBars() {
        return this.#restaurantsAndBars;
    }
    getrestaurants() {
        return this.#restaurants;
    }
    getrestaurantsAndBar() {
        return this.#restaurantsAndBar;
    }
    getRestaurantTitle() {
        return this.#restaurantTitle;
    }

    getRestaurantDescription() {
        return this.#restaurantDescription;
    }
    getphoneCTA() {
        return this.#phoneCTA;
    }
    getemailCTA() {
        return this.#emailCTA;
    }
    getmenuCTA() {
        return this.#menuCTA;
    }

    // Call initializeSelectors before using any selectors
    async verifyRestaurantDetails() {
        await this.initializeSelectors();  // Ensure selectors are initialized first
        await this.getHamburgerMenu().click();
        // await this.getRestaurantsAndBars().click();
        if(await this.getRestaurantsAndBars().isVisible())
        {
            await this.getRestaurantsAndBars().click()
        }
        else if(await this.getrestaurantsAndBar().isVisible())
        {
            await this.getrestaurantsAndBar().click()
        }
        else if(await this.getrestaurants().isVisible())
        {
            await this.getrestaurants().click()
        }
        else{
            throw new Error('No restaurants available for this hotel')
        }
        const restaurantsResponse = await this.page.waitForResponse(testData.fairmontMakkahPWA.getRestaurantDetailsEndpoint);//https://api-properties-a.hudini.io/graphql
        const responseBody = await restaurantsResponse.json();
        // console.dir(responseBody,{depth:null})
        const restaurantDetails = responseBody.data.getRestaurantDetails.restaurant;
        for (let index = 0; index < restaurantDetails.length; index++) {
            const restaurant = restaurantDetails[index];
            if (restaurant.isActive) {
                const restaurantName = restaurant.name;
                const restaurantDescription = restaurant.description;

                await this.page.keyboard.press('Escape');
                await this.page.getByRole('heading', { name: `${restaurantName}` }).click();

                const actualRestaurantName = await this.getRestaurantTitle().textContent();
                let actualRestaurantDescription;
                if(await this.getRestaurantDescription().nth(1).isVisible())
                {
                    actualRestaurantDescription = await this.getRestaurantDescription().nth(1).textContent();
                }
                else if (await this.getrestaurantDescription().isVisible())
                {
                    actualRestaurantDescription=await this.getrestaurantDescription().textContent();
                }
                else
                {
                    throw new Error(`${actualRestaurantName} does not contains description skipping the description verification.`)
                }
                expect(restaurantName).toEqual(actualRestaurantName);
                expect(restaurantDescription).toEqual(actualRestaurantDescription);

                if(restaurant.contactNumber)
                {  
                    const phoneCTA=this.getphoneCTA()
                    await expect(phoneCTA).toBeVisible()
                }
                else if(restaurant.email)
                {
                    const emailCTA=this.getemailCTA()
                    await expect(emailCTA).toBeVisible()
                }
                else if(restaurant.menu)
                {
                    const menuCTA=this.getmenuCTA()
                    await expect(menuCTA).toBeVisible()
                }
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