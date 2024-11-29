import { BaseClass } from './baseClass';
import { expect } from '@playwright/test';
import {ElementActions} from './elementActions'
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class IrdPage extends BaseClass
{
    #hamburgerMenu;
    #irdIcon
    #categoryBtn
    #checkinBtn
    #roomNoTxtBx
    #lastNameTxtBx
    #connectToRoomBtn
    #getStartedBtn
    constructor()
    {
        super();
        this.elementActions=new ElementActions(this.page)
    }
    async initilizeSelectors()
    {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#irdIcon=this.page.getByText('In-Room Dining')
        this.#checkinBtn=this.page.getByRole('button',{name:'Connect to Room'})
        this.#roomNoTxtBx=this.page.getByLabel('Room No')
        this.#lastNameTxtBx=this.page.getByLabel('Last Name')
        this.#connectToRoomBtn=this.page.getByRole('button', { name: 'Connect to Room' })
        this.#getStartedBtn=this.page.getByRole('button', { name: 'Get Started' })
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
    async navigateToPostCheckin()
    {
        await this.elementActions.click(this.getconnectToRoomBtn())
        await this.elementActions.type(this.getroomNoTxtBx(),'309')
        await this.elementActions.type(this.getlastNameTxtBx(),'Chawla')
        await this.elementActions.click(this.getconnectToRoomBtn())
        await this.elementActions.click(this.getgetStartedBtn())
    }
}