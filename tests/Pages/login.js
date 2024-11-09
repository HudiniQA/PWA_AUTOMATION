import { BaseClass } from './baseClass';

export class Login extends BaseClass {
    #userNameTxtBx;
    #passwordTxtBx;
    #loginBtn;

    constructor(page) {
        super();
        this.page = page;
        this.#userNameTxtBx = this.page.locator('#Email');
        this.#passwordTxtBx = this.page.locator('#password');
        this.#loginBtn = this.page.getByRole('button', { name: 'LOGIN' });
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
        await this.getUserNameTxtBx().fill(username);
        await this.getPasswordTxtBx().fill(password);
        await this.getLoginBtn().click();
    }
}
