import { Login } from './login';
import { test, expect } from '@playwright/test';

test.describe('To verify the login functionality', () => {
    let login;

    test.beforeEach(async ({ browser }) => {
        login = new Login();
        await login.setup('Chrome'); 
        await login.navigateToElevate('https://cms.hudinielevate-stage.io'); 
    });

    test.afterEach(async () => {
        await login.teardown(); 
    });

    test('Verify the login', async () => {
        await login.loginAsUser('uppara.raviteja@hudini.io', 'Test@123'); // Perform login
      
    });
});
