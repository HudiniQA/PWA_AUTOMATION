import { BaseClass } from './baseClass';
import { test, expect } from '@playwright/test';
const testData=JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class aboutHotel extends BaseClass
{
    #hamburgerMenu
    #aboutHotelIcon
    #hotelTitle
    #hotelDescription
    constructor()
    {
        super()
    }  
    async initializeSelectors() {
    this.#hamburgerMenu = this.page.locator('.hamburger-react');
    this.#aboutHotelIcon=this.page.getByText('About Us')
    this.#hotelTitle=this.page.locator('.HotelInfoDrawer_title__Djjb3')
    }

}