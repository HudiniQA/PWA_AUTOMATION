import { chromium, firefox, webkit } from 'playwright';

export class BaseClass {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async setup(browserType) {
        // Validate input browser type
        if (browserType === 'Chrome') {
            this.browser = await chromium.launch({ headless: false }); // Launching Chrome browser in headed mode
        } else if (browserType === 'Firefox') {
            this.browser = await firefox.launch({ headless: false }); // Launching Firefox browser in headed mode
        } else if (browserType === 'Webkit') {
            this.browser = await webkit.launch({ headless: false }); // Launching Webkit browser in headed mode
        } else {
            throw new Error("Unsupported browser type. Choose 'Chrome', 'Firefox', or 'Webkit'.");
        }

        this.context = await this.browser.newContext(); // Creating a new browser context
        this.page = await this.context.newPage();       // Opening a new page in the browser context
    }

    async teardown() {
        await this.page.close(); // Closing the page
        await this.context.close(); // Closing the context
        await this.browser.close(); // Closing the browser
    }

    async navigateToElevate(url) {
        await this.page.goto(url); // Navigate to the specified URL
    }

    async captureScreenshot(name) {
        await this.page.screenshot({ path: `../errorshots/${name}.jpg` }); // Capture a screenshot
    }
}
