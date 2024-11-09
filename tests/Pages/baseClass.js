import { chromium, firefox, webkit } from 'playwright';

export class BaseClass {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async setup(browserType) {
        if (browserType === 'Chrome') {
            this.browser = await chromium.launch({ headless: false });
        } else if (browserType === 'Firefox') {
            this.browser = await firefox.launch({ headless: false });
        } else if (browserType === 'Webkit') {
            this.browser = await webkit.launch({ headless: false });
        } else {
            throw new Error("Unsupported browser type. Choose 'Chrome', 'Firefox', or 'Webkit'.");
        }

        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }

    async teardown() {
        await this.page.close();
        await this.context.close();
        await this.browser.close();
    }

    async navigateToUrl(url) {
        await this.page.goto(url);
    }

    async captureScreenshot(name) {
        await this.page.screenshot({ path: `.../errorshots/${name}.jpg` });
    }
}
