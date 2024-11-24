import { BaseClass } from './baseClass';
import { expect } from '@playwright/test';
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class AboutHotel extends BaseClass {
    #hamburgerMenu;
    #aboutHotelIcon;
    #hotelTitle;
    #hotelDescription;
    #redirectionLink
    #emailCTA
    #phoneCTA
    #locationPinCTA

    constructor(page) {
        super();
        this.page = page;
    }

    async initializeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#aboutHotelIcon = this.page.getByText('About Us');
        this.#hotelTitle = this.page.locator('.HotelInfoDrawer_title__Djjb3');
        this.#hotelDescription = this.page.locator('.HotelInfoDrawer_body__h1M_G');
        this.#redirectionLink = this.page.getByLabel('Link')
        this.#phoneCTA = this.page.getByLabel('Phone')
        this.#emailCTA = this.page.getByLabel('Email')
        this.#locationPinCTA = this.page.locator('.HotelInfoDrawer_phoneEmailCtaWrapper__M3B4h > div:nth-child(5)')

    }
    gethamburgerMenu() {
        return this.#hamburgerMenu;
    }

    getaboutHotelIcon() {
        return this.#aboutHotelIcon;
    }

    gethotelTitle() {
        return this.#hotelTitle;
    }

    gethotelDescription() {
        return this.#hotelDescription;
    }

    getredirectionLink() {
        return this.#redirectionLink;
    }
    getemailCTA() {
        return this.#emailCTA;
    }
    getphoneCTA() {
        return this.#phoneCTA;
    }
    getlocationPinCTA() {
        return this.#locationPinCTA;
    }

    async verifyTheHotelInfoPopup() {
        await this.initializeSelectors();
        await this.gethamburgerMenu().click();
        await this.getaboutHotelIcon().click();
        const endPoint = testData.fairmontMakkahPWA.aboutHotel.getPropertyDetailsByHotelIdEndpont;
        const apiKey = testData.fairmontMakkahPWA.aboutHotel.getPropertyDetailsByHotelIdApiKey;
        const query = testData.fairmontMakkahPWA.aboutHotel.getPropertyDetailsByHotelIdQuery;
        const hotelId = testData.fairmontMakkahPWA.hotelId
        const variables = {
            hotelId: hotelId
        };

        // Make API request to capture the actual data
        const response = await this.page.request.post(endPoint, {
            data: {
                query: query,
                variables: variables
            },
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });
        const responseBody = await response.json();
        if (responseBody) {
            console.log(' API call was successful.✅ ');
        } else {
            console.error(' API call failed. Response body is null or undefined.❌');
        }
        // console.dir(responseBody, { depth: null });
        expect(response.ok()).toBeTruthy();
        const actualHotelTitle = await this.gethotelTitle().textContent();
        const actualDescription = await this.gethotelDescription().textContent();

        //validating the hotel title and description
        const hotelObject = responseBody.data.getPropertyDetailsByHotelId.hotel;
        expect(actualHotelTitle).toBe(hotelObject.name);
        expect(actualDescription).toBe(hotelObject.description);

        //Validating Call,Email and URL CTA buttons
        const hotelInformation = responseBody.data.getPropertyDetailsByHotelId.hotel.information;//Extracting the information array from the response
        for (const info of hotelInformation) {
            if (info.type === 'EMAIl') {
                await expect(this.getemailCTA()).toBeVisible()
                console.log(`Email CTA is visible for ${actualHotelTitle} ✅ `)
            }
            else if (info.type === 'PHONE') {
                await expect(this.getphoneCTA().first()).toBeVisible()
                console.log(`Phone CTA is visible for ${actualHotelTitle} ✅ `)
            }
            else if (info.type === 'URL') {
                await expect(this.getredirectionLink()).toBeVisible();
                const pagePromise = this.context.waitForEvent('page')
                await this.getredirectionLink().click()
                const newPage = await pagePromise;
                const actualRedirectUrl = newPage.url()
                expect(actualRedirectUrl).toBe(info.value)
                console.log(`Redirect link verfied successfully ✅ `)
                newPage.close()
            }
        }

        //Validating Location CTA button
        const hotelLocation = responseBody.data.getPropertyDetailsByHotelId.hotel.location;
        // console.log(hotelLocation)
        if (hotelLocation.latitude && hotelLocation.longitude) {
            await expect(this.getlocationPinCTA()).toBeVisible();
            console.log(`Location pin is visible for ${actualHotelTitle} ✅ `)
        } else {
            console.warn('Latitude and/or Longitude is missing, skipping location pin verification.');
        }
    }
}
