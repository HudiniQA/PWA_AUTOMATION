import { BaseClass } from './baseClass';

export class Login extends BaseClass {
    #userNameTxtBx;
    #passwordTxtBx;
    #loginBtn;
    #arrowBtn;

    constructor() {
        super();  // Calls the BaseClass constructor to initialize browser, context, and page.
    }
    async initializeSelectors() {
        this.#userNameTxtBx = this.page.getByLabel('Email')// Use locators to get elements
        this.#passwordTxtBx = this.page.getByLabel('Password');
        this.#loginBtn = this.page.getByRole('button',{name:'LOGIN'});
        this.#arrowBtn = this.page.getByRole('img',{name:'btn'})
    }
    getUserNameTxtBx() {
        return this.#userNameTxtBx;
    }

    getPasswordTxtBx() {
        return this.#passwordTxtBx;
    }

    getLoginBtn() {
        return this.#loginBtn;
    }
    async loginAsUser(username, password) {
        await this.initializeSelectors();  // Initialize selectors after page is loaded
        await this.getUserNameTxtBx().fill(username);
        await this.getPasswordTxtBx().fill(password);
        await this.getLoginBtn().click();
        await this.#arrowBtn.click({ clickCount: 3 });
        // await this.captureScreenshot('after login');
    }
}
