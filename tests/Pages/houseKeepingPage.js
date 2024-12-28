import { BaseClass } from './baseClass';
import { expect } from '@playwright/test';
import { ElementActions } from './elementActions'
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class HouseKeepingPage extends BaseClass {
    #hamburgerMenu;
    #houseKeepingIcon;
    #connectToRoomBtn;
    #roomNoTxtBx;
    #lastNameTxtBx;
    #getStartedBtn;
    #serviceTitle;
    #serviceDescription;
    #plusCouterBtn;
    #minusCounterBtn;
    #maxQuantityToastMsg;
    #placeRequestBtn;


    constructor(page) {
        super(page);
        this.elementActions = new ElementActions(this.page)
    }
    async initializeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#houseKeepingIcon = this.page.getByText('House keeping');
        this.#connectToRoomBtn = this.page.getByRole('button', { name: 'Connect to Room' });
        this.#roomNoTxtBx = this.page.getByLabel('Room No');
        this.#lastNameTxtBx = this.page.getByLabel('Last Name');
        this.#getStartedBtn = this.page.getByRole('button', { name: 'Get Started' });
        this.#serviceTitle = this.page.locator('h2.housekeeping_title__2LOj7');
        this.#serviceDescription = this.page.locator("//div[@class='housekeeping_description__oTh4l']//p[1]");
        this.#plusCouterBtn = `//text()[contains(., '{itemName}')]/following::button[2]`
        this.#minusCounterBtn = `//text()[contains(., '{itemName}')]/following::button[1]`
        this.#maxQuantityToastMsg = this.page.locator('div').filter({ hasText: 'Max limit exceeded!Max limit' }).nth(1);
        this.#placeRequestBtn = this.page.getByRole('button', { name: 'Place Request' })
    }
    gethamburgerMenu() {
        return this.#hamburgerMenu;
    }
    gethouseKeepingIcon() {
        return this.#houseKeepingIcon;
    }
    getconnectToRoomBtn() {
        return this.#connectToRoomBtn;
    }
    getroomNoTxtBx() {
        return this.#roomNoTxtBx;
    }
    getlastNameTxtBx() {
        return this.#lastNameTxtBx;
    }
    getgetStartedBtn() {
        return this.#getStartedBtn;
    }
    getserviceTitle() {
        return this.#serviceTitle;
    }
    getserviceDescription() {
        return this.#serviceDescription;
    }
    getplusCouterBtn(itemName) {
        const plusCouterBtn = this.#plusCouterBtn.replace('{itemName}', itemName);
        return this.page.locator(plusCouterBtn);
    }
    getminusCounterBtn(itemName) {
        const minusCounterBtn = this.#minusCounterBtn.replace('{itemName}', itemName);
        return this.page.locator(minusCounterBtn);
    };
    async getmaxQuantityToastMsg() {
        return this.#maxQuantityToastMsg;
    }
    getplaceRequestBtn() {
        return this.#placeRequestBtn;
    }
    async navigateToPostCheckInPage() {
        await this.initializeSelectors();
        await this.elementActions.click(this.getconnectToRoomBtn());
        await this.elementActions.click(this.getroomNoTxtBx());
        await this.elementActions.type(this.getroomNoTxtBx(), testData.fairmontMakkahPWA.roomNo);
        await this.elementActions.click(this.getlastNameTxtBx());
        await this.elementActions.type(this.getlastNameTxtBx(), testData.fairmontMakkahPWA.lastName);
        await this.elementActions.click(this.getconnectToRoomBtn());
        await this.elementActions.click(this.getgetStartedBtn());
    }
    async captureThegetServiceRequestDetailsApiResponse() {
        const endPoint = testData.fairmontMakkahPWA.houseKeeping.getHouseKeepingDetailsEndpoint;
        const apiKey = testData.fairmontMakkahPWA.houseKeeping.getHouseKeepingDetailsApiKey;
        const query = testData.fairmontMakkahPWA.houseKeeping.getHouseKeepingDetailsQuery;
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
        return responseBody
    }
    async verifyTheHouseKeepingPage() {
        await this.initializeSelectors();
        const responseBody = await this.captureThegetServiceRequestDetailsApiResponse();
        await this.elementActions.click(this.gethamburgerMenu());
        await this.elementActions.click(this.gethouseKeepingIcon());
        const houseKeepingDetails = responseBody.data.getServiceRequestDetails.houseKeeping;
        // console.dir(responseBody, { depth: null });
        for (let housekeeping of houseKeepingDetails) {
            if (!housekeeping.isActive || !housekeeping.isItemActive) continue;
            await this.elementActions.click(this.page.getByRole('heading', { name: `${housekeeping.name}`, exact: true }));
            let actualServiceTitle = await this.elementActions.getText(this.getserviceTitle());
            let actualServiceDescription = await this.elementActions.getText(this.getserviceDescription());
            const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
            const expectedServiceTitle = normalizeText(housekeeping.name);
            const expectedServiceDescription = normalizeText(housekeeping.description);
            expect.soft(actualServiceTitle).toContain(expectedServiceTitle);
            expect.soft(actualServiceDescription).toContain(expectedServiceDescription);
            for (let item of housekeeping.items) {
                const maxQuantityActive = item.maxQuantityActive;
                const maxQuantity = item.maxQuantity;
                if (maxQuantityActive && maxQuantity > 0) {
                    for (let i = 0; i < maxQuantity; i++) {
                        await this.elementActions.click(this.getplusCouterBtn(item.name));
                    }
                    await this.elementActions.click(this.getplusCouterBtn(item.name));
                    const maxQuantityToastMsg = await this.getmaxQuantityToastMsg();
                    expect.soft(maxQuantityToastMsg.isVisible()).toBeTruthy();
                    await maxQuantityToastMsg.waitFor({ state: 'hidden' })
                    for (let i = 0; i < maxQuantity; i++) {
                        await this.elementActions.click(this.getminusCounterBtn(item.name));
                    }
                }
                if (!maxQuantityActive && maxQuantity <= 0) {
                    await this.elementActions.checkTheCheckbox(this.page.getByRole('checkbox', { name: item.name, exact: true }));
                    await this.elementActions.uncheckTheCheckbox(this.page.getByRole('checkbox', { name: item.name, exact: true }));
                }
            }
            await this.page.keyboard.press('Escape');
        }

    }
    async placeTheHouseKeepingRequest() {
        await this.navigateToPostCheckInPage();
        await this.initializeSelectors();
        const responseBody = await this.captureThegetServiceRequestDetailsApiResponse();
        await this.elementActions.click(this.gethamburgerMenu());
        await this.elementActions.click(this.gethouseKeepingIcon());
        const houseKeepingDetails = responseBody.data.getServiceRequestDetails.houseKeeping;
        for (let housekeeping of houseKeepingDetails) {
            if (!housekeeping.isActive || !housekeeping.isItemActive) continue;
            await this.elementActions.click(this.page.getByRole('heading', { name: `${housekeeping.name}`, exact: true }));
            for (let item of housekeeping.items) {
                if (item.maxQuantityActive && item.maxQuantity > 0) {
                    await this.elementActions.click(this.getplusCouterBtn(item.name));

                    if (!item.maxQuantityActive && item.maxQuantity <= 0) {
                        await this.elementActions.checkTheCheckbox(this.page.getByRole('checkbox', { name: item.name, exact: true }));
                    }
                    // await this.elementActions.click(this.getplaceRequestBtn());

                }
                await this.page.keyboard.press('Escape');
            }
        }
    }
}