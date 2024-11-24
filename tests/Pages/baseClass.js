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
            console.log(`${browserType} Browser launched successfully ✅ `)
        } else if (browserType === 'Firefox') {
            this.browser = await firefox.launch({ headless: false });
            console.log(`${browserType} Browser launched successfully ✅ `)
        } else if (browserType === 'Webkit') {
            this.browser = await webkit.launch({ headless: false });
            console.log(`${browserType} Browser launched successfully ✅ `)
        } else {
            throw new Error("❌ Unsupported browser type. Choose 'Chrome', 'Firefox', or 'Webkit'.");
        }

        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }

    async teardown() {
        await this.page.close();
        console.log(`Page has been closed ✅ `)
        await this.context.close();
        console.log(`Context has been closed ✅ `)
        await this.browser.close();
        console.log(`Browser has been closed ✅ `)
    }

    async navigateToUrl(url) {
        await this.page.goto(url);
        if(url)
        console.log(`Navigated to the ${url} successfully ✅ .`)
        else
        console.log(` ${url} is invalid ❌. Please provide fully qualified url `)
    }

    async captureScreenshot(name) {
        await this.page.screenshot({ path: `.../errorshots/${name}.jpg` });
    }
}
