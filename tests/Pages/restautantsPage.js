import { BaseClass } from './baseClass';
import { test, expect } from '@playwright/test';
import{ElementActions} from'./elementActions'
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
        this.elementActions=new ElementActions(this.page)
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

    getrestaurantDescription() {
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
    async navigateToRestaurantsPage()
    {
        await this.initializeSelectors(); 
        await this.elementActions.click(this.getHamburgerMenu())
        if(await this.elementActions.isVisible(this.getRestaurantsAndBars()))
        {
            await this.elementActions.click(this.getRestaurantsAndBars());
        }
        else if(await this.elementActions.isVisible(this.getrestaurantsAndBar()))
        {
            await this.elementActions.click(this.getrestaurantsAndBar());
        }
        else if(await this.elementActions.isVisible(this.getrestaurants()))
        {
            await this.elementActions.click(this.getrestaurants());
        }
        else{
            throw new Error('No restaurants available for this hotel')
        }
    }
    async captureTheGetRestaurantDetailsApiResponse()
    {
        const endPoint=testData.fairmontMakkahPWA.getRestaurantDetailsEndpoint
        const restaurantsResponse = await this.page.waitForResponse(endPoint);//https://api-properties-a.hudini.io/graphql
        const responseBody = await restaurantsResponse.json();
        if (responseBody) {
            console.log(' API call was successful.✅ ');
        } else {
            console.error(' API call failed. Response body is null or undefined.❌');
        }
        return responseBody;
    }
    // Call initializeSelectors before using any selectors
    async verifyRestaurantDetails() {
        await this.initializeSelectors();  // Ensure selectors are initialized first
        const responseBody=await this.captureTheGetRestaurantDetailsApiResponse()
        // console.dir(responseBody,{depth:null})
        const restaurantDetails = responseBody.data.getRestaurantDetails.restaurant;
        for (let index = 0; index < restaurantDetails.length; index++) {
            const restaurant = restaurantDetails[index];
            if (restaurant.isActive) {
                const restaurantName = restaurant.name;
                const restaurantDescription = restaurant.description;
                await this.elementActions.click(this.page.getByRole('heading', { name: `${restaurantName}` }))
                const actualRestaurantName = await this.elementActions.getText(this.getRestaurantTitle())
                let actualRestaurantDescription;
                if(await this.elementActions.isVisible(this.getrestaurantDescription().nth(1)))
                {
                    actualRestaurantDescription = await this.elementActions.getText(this.getrestaurantDescription().nth(1))
                }
               else if(await this.elementActions.isVisible(this.getrestaurantDescription()))
                {
                    actualRestaurantDescription=(await this.elementActions.getText(this.getrestaurantDescription()));
                }
                else
                {
                    throw new Error(`${actualRestaurantName} does not contains description skipping the description verification.`)
                }
                const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
                const normalizedExpectedDescription = normalizeText(restaurantDescription);//Removing extra spaces,tab spaces globally in

                expect(actualRestaurantName).toEqual(restaurantName);
                expect(actualRestaurantDescription).toEqual(normalizedExpectedDescription);

                if(restaurant.contactNumber)
                {  
                    const isPhoneCTAVisible=await this.elementActions.isVisible(this.getphoneCTA())
                    expect(isPhoneCTAVisible).toBeTruthy()
                    console.log(`Phone CTA is visible for ${actualRestaurantName} restaurant ✅ `)
                }
                if(restaurant.email)
                {
                    const isEmailCTAVisible=await this.elementActions.isVisible(this.getemailCTA())
                    expect(isEmailCTAVisible).toBeTruthy()
                    console.log(`Email CTA is visible for ${actualRestaurantName} restaurant✅`)
                }
                if(restaurant.menu && restaurant.menu.url)
                {
                    const isMenuCTAVisible=await this.elementActions.isVisible(this.getmenuCTA())
                    expect(isMenuCTAVisible).toBeTruthy()
                    console.log(`Menu CTA is visible for ${actualRestaurantName} restaurant✅ `)
                }
                await this.page.keyboard.press('Escape')
                console.log(`Contents verified and closing the ${actualRestaurantName} restaurant Modal ✅`)
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