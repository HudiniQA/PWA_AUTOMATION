import { Login } from './login';
import { test, expect } from '@playwright/test';

test.describe('To verify the login functionality', () => {
    let login;

    test.beforeEach(async ({ browser }) => {
        login = new Login();  // Instantiate the Login class
        await login.setup('Chrome');  // Call setup to initialize the browser and page
        await login.navigateToUrl('https://cms.hudinielevate-stage.io'); // Navigate to the URL
    });

    test.afterEach(async () => {
        if (login) {
            await login.teardown();  // Call teardown to clean up after each test
        }
    });

    test('Verify the login', async () => {
        await login.loginAsUser('uppara.raviteja@hudini.io', 'Test@123'); // Perform login
    });
});
