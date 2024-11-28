import test from 'node:test';
import { BaseClass } from './baseClass';
import { ElementActions } from './elementActions';
import { expect } from '@playwright/test';
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class OffersPage extends BaseClass {
    #hamburgerMenu;
    #offersIcon
    #phoneCTA
    #emailCTA
    #categoryBtn
    #offerTitle
    #offerDescription
    constructor() {
        super()
        this.elementActions = new ElementActions(this.page)
    }
    async initilizeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#offersIcon = this.page.getByText('Offers', { exact: true });
        this.#phoneCTA = this.page.getByRole('link', { name: 'Phone' })
        this.#emailCTA = this.page.getByRole('link', { name: 'Email' })
        this.#categoryBtn = this.page.getByRole('button').first();//this.page.locator("//button[@id=':r1q:']")
        this.#offerTitle = this.page.locator("//h2[@class='OffersCarousel_listComponentTitle__7Sqcs']")
        this.#offerDescription = this.page.locator("(//p[@class='OffersCarousel_listComponentDataTitle__nnGbR']/following-sibling::p)[1]")
    }
    gethamburgerMenu() {
        return this.#hamburgerMenu;
    }
    getoffersIcon() {
        return this.#offersIcon;
    }
    getphoneCTA() {
        return this.#phoneCTA;
    }
    getemailCTA() {
        return this.#emailCTA;
    }
    getcategoryBtn() {
        return this.#categoryBtn;
    }
    getofferTitle() {
        return this.#offerTitle;
    }
    getofferDescription() {
        return this.#offerDescription;
    }
    async navigateToOffersPage() {
        await this.initilizeSelectors()
        await this.elementActions.click(this.gethamburgerMenu())
        await this.elementActions.click(this.getoffersIcon())
    }
    async captureGetOffersDetailsApiResponse() {
        const endpoint = testData.fairmontMakkahPWA.offers.getOffersDetailsEndpoint;
        const query = testData.fairmontMakkahPWA.offers.getOffersDetailsQuery;
        const apiKey = testData.fairmontMakkahPWA.offers.getOffersDetailsApiKey;
        const hotelId = testData.fairmontMakkahPWA.hotelId
        const variables = {
            hotelId: hotelId
        };
        const response = await this.page.request.post(endpoint, {
            data:
            {
                query: query,
                variables: variables
            },
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });
        const responseBody = await response.json()
        if (responseBody) {
            console.log(' API call was successful.✅ ');
        } else {
            console.error(' API call failed. Response body is null or undefined.❌');
        }
        // console.dir(responseBody, { depth: null });
        expect(response.ok()).toBeTruthy();
        return responseBody

    }
    async verifyTheOffersDetails() {
        await this.initilizeSelectors();
        const responseBody = await this.captureGetOffersDetailsApiResponse();
        const offers = responseBody.data?.getOffersDetails;
    
        if (!offers || offers.length === 0) {
            throw new Error('No offers found in the response.');
        }
    
        const offerTypes = []; // Array to hold unique offer types
        const today = new Date(); // Get today's date once for reusability
    
        // Utility function to check if the current date lies between startDate and endDate
        const isWithinDateRange = (duration) => {
            if (!duration?.startDate || !duration?.endDate) return false;
    
            const startDate = new Date(duration.startDate.split('-').reverse().join('-'));
            const endDate = new Date(duration.endDate.split('-').reverse().join('-'));
            return today >= startDate && today <= endDate;
        };
    
        // Loop through the offers to filter based on isActive, alwaysActive, and date range
        for (const offer of offers) {
            if (offer.isActive || (offer.duration?.alwaysActive || isWithinDateRange(offer.duration))) {
                if (!offerTypes.includes(offer.type)) {
                    offerTypes.push(offer.type);
                }
            }
        }
    
        console.log('Unique Offer Types:', offerTypes);
    
        // Loop through each offer type
        for (const offerType of offerTypes) {
            let maxRetries = 3;
            let retryCount = 0;
    
            while (retryCount < maxRetries) {
                if (await this.elementActions.isVisible(this.getcategoryBtn())) {
                    const buttonTxt = await this.elementActions.getText(this.getcategoryBtn());
                    if (buttonTxt !== offerType) {
                        await this.elementActions.click(this.getcategoryBtn());
                        await this.elementActions.click(
                            this.page.locator(`//p[normalize-space(text())='${offerType}']`)
                        );
                    }
                    break;
                } else {
                    await this.page.mouse.wheel(0, -100);
                    await this.page.waitForTimeout(500);
                }
                retryCount++;
                if (retryCount === maxRetries) {
                    throw new Error(`Failed to select offer type "${offerType}" after ${maxRetries} attempts.`);
                }
            }
    
            // Filter offers for the current type and condition
            const currentOffers = offers.filter(
                (offer) =>
                    offer.type === offerType &&
                    (offer.isActive || (offer.duration?.alwaysActive || isWithinDateRange(offer.duration)))
            );
    
            // Loop through filtered offers
            for (const offer of currentOffers) {
                const { name, description } = offer;
    
                const offerLink = this.page.getByRole('heading', { name, exact: true });
                await this.elementActions.waitForVisibility(offerLink);
                await this.elementActions.click(offerLink);
                console.log(`Opened the ${name} offer successfully ✅`);
    
                const actualOfferName = await this.elementActions.getText(this.getofferTitle());
                const actualOfferDescription = await this.elementActions.getText(this.getofferDescription());
    
                const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
                const expectedOfferName = normalizeText(name);
                const expectedOfferDescription = normalizeText(description);
    
                expect(actualOfferName).toBe(expectedOfferName);
                expect(actualOfferDescription).toBe(expectedOfferDescription);
    
                await this.page.keyboard.press('Escape');
                console.log(`Verified and closing the ${actualOfferName} offer modal under ${offerType}`);
            }
        }
    }
    
}