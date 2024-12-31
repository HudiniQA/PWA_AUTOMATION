import { TsSpa } from '../Pages/tsSpa';
import { test } from '@playwright/test';
const testData=JSON.parse(JSON.stringify(require('../testData/testData.json')));

test.describe('To verify the spa are displayed', () => {
    let tsSpa;

    test.beforeEach(async ({ browser }) => {
        tsSpa = new TsSpa();  
        await tsSpa.setup('Chrome');  
        await tsSpa.navigateToUrl(testData.fairmontMakkahPWA.endPoint);
    });
    test.afterEach(async () => {
        if (tsSpa) {
            await tsSpa.teardown();  
        }
    });
    test('Verify the spa', async () => { 
        await tsSpa.navigateToSpa(); 
        await tsSpa.verifyTheSpa();
    });

});