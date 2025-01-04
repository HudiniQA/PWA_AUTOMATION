import { BaseClass } from './baseClass';
import { expect } from '@playwright/test';
import { ElementActions } from './elementActions'
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class InRoomDinig extends BaseClass {
    #hamburgerMenu;
    #irdIcon
    #categoryBtn
    #checkinBtn
    #roomNoTxtBx
    #lastNameTxtBx
    #connectToRoomBtn
    #getStartedBtn
    #itemHeader
    #itemTitle
    #itemDescription
    #irdCategoryBtn
    constructor(page) {
        super();
        this.elementActions = new ElementActions(this.page)
    }
    async initilizeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#irdIcon = this.page.locator('.MenuItem_menuItemTitle__g9gG4').filter({ hasText: 'In-Room Dining' });
        this.#checkinBtn = this.page.getByRole('button', { name: 'Connect to Room' })
        this.#roomNoTxtBx = this.page.getByLabel('Room No')
        this.#lastNameTxtBx = this.page.getByLabel('Last Name')
        this.#connectToRoomBtn = this.page.getByRole('button', { name: 'Connect to Room' })
        this.#getStartedBtn = this.page.getByRole('button', { name: 'Get Started' });
        this.#itemHeader = { role: 'heading', name: '{itemName}' }
        this.#itemTitle = this.page.locator('.DiningDetailsDrawer_title__zeGhA')
        this.#itemDescription = this.page.getByRole('paragraph').nth(0);
        this.#irdCategoryBtn = { role: 'button', name: '{categoryName}' }



    }
    gethamburgerMenu() {
        return this.#hamburgerMenu;
    }
    getirdIcon() {
        return this.#irdIcon;
    }
    getcheckinBtn() {
        return this.#checkinBtn;
    }
    getroomNoTxtBx() {
        return this.#roomNoTxtBx;
    }
    getlastNameTxtBx() {
        return this.#lastNameTxtBx;
    }
    getconnectToRoomBtn() {
        return this.#connectToRoomBtn;
    }
    getgetStartedBtn() {
        return this.#getStartedBtn;
    }
    getitemHeader(itemName) {
        const itemProperties = {
            role: this.#itemHeader.role,
            name: itemName
        }
        return this.page.getByRole(itemProperties.role, { name: itemProperties.name ,exact:true}).nth(0);
    }
    getcategoryBtn(categoryName) {
        const categoryProperties = {
            role: this.#irdCategoryBtn.role,
            name: categoryName
        }
        return this.page.getByRole(categoryProperties.role, { name: categoryProperties.name });
    }
    getitemTitle() {
        return this.#itemTitle;
    }
    getitemDescription() {
        return this.#itemDescription;
    }
    async handleDynamicElements() {
        const toastMsg = this.page.locator("//*[@class='Notification_close__eOEx_']")
        const getStartedBtn = this.getgetStartedBtn();
        // if (toastMsg) {
        //     try {
        //         await toastMsg.click();
        //     } catch (error) {
        //         console.log('Toast message is not available');

        //     }
        // }
        if (getStartedBtn) {
            try {
                await getStartedBtn.click();
            } catch (error) {
                console.log('Get Started button is not available');
            }
        }
    }
    async navigateToPostCheckInPage() {
        await this.initilizeSelectors();
        await this.elementActions.click(this.getconnectToRoomBtn());
        await this.elementActions.click(this.getroomNoTxtBx());
        await this.elementActions.type(this.getroomNoTxtBx(), testData.fairmontMakkahPWA.roomNo);
        await this.elementActions.click(this.getlastNameTxtBx());
        await this.elementActions.type(this.getlastNameTxtBx(), testData.fairmontMakkahPWA.lastName);
        await this.elementActions.click(this.getconnectToRoomBtn());
        await this.handleDynamicElements();
    }
    async captureGetIRDMenuOutputDetailsApiResponse() {
        const endPoint = testData.fairmontMakkahPWA.inRoomDinig.getIrdMenuOutputDetailsEndpoint;
        const apiKey = testData.fairmontMakkahPWA.inRoomDinig.getIrdMenuOutputDetailsApiKey;
        const query = testData.fairmontMakkahPWA.inRoomDinig.getIrdMenuOutputDetailsQuery;
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

    async verifyTheIrdPage() {
        await this.initilizeSelectors();
        await this.elementActions.click(this.gethamburgerMenu());
        await this.elementActions.click(this.getirdIcon());
        const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
        const responseBody = await this.captureGetIRDMenuOutputDetailsApiResponse();
        const getIRDMenuOutputDetails = responseBody.data.getIRDMenuOutputDetails;
        // Loop through menus
        for (const menu of getIRDMenuOutputDetails) {
            if (menu.name === 'In-Room Dining' && menu.isActive) {
                const categories = menu.categories;

                // Loop through categories
                for (const category of categories) {
                    if (category.isActive) {
                        await this.elementActions.click(this.getcategoryBtn(category.name));

                        // Loop through items
                        for (const item of category.items) {
                            if (!item.isActive) continue;

                            await this.elementActions.click(this.getitemHeader(item.name));

                            // Validate Item Title
                            const actualItemTitle = normalizeText(await this.getitemTitle().textContent());
                            const expectedItemTitle = normalizeText(item.name);
                            expect.soft(actualItemTitle).toBe(expectedItemTitle);

                            // Validate Item Description
                            const actualItemDescription = normalizeText(await this.elementActions.getText(this.getitemDescription()));
                            const expectedItemDescription = normalizeText(item.description);
                            expect.soft(actualItemDescription).toBe(expectedItemDescription);

                            // Close the item details
                            await this.page.keyboard.press('Escape');
                        }
                    }
                }
            }

        }


    }
}

