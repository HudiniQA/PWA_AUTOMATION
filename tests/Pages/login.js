import { BaseClass } from './baseClass';

export class Login extends BaseClass {
    #userNameTxtBx;
    #passwordTxtBx;
    #loginBtn;

    constructor() {
        super();
    }

    // Initialize locators after the page is set up
    initializeLocators() {
        this.#userNameTxtBx = this.page.locator('#Email');
        this.#passwordTxtBx = this.page.locator('#password');
        this.#loginBtn = this.page.getByRole('button', { name: 'LOGIN' });
    }

    async loginAsUser(username, password) {
        this.initializeLocators(); // Ensure locators are initialized
        await this.#userNameTxtBx.fill(username);
        await this.#passwordTxtBx.fill(password);
        await this.#loginBtn.click({count:3});
    }
}
