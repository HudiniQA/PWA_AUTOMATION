import{test} from'@playwright/test'
import{BaseClass} from './baseClass'
export class ElementActions extends BaseClass  {

    /**
     * @param {object} page - Playwright's page object
     */
    constructor(page) {
        super()
        this.page = page;
    }

    /**
     * Click on an element
     * @param {Locator} locator - The locator for the element to click
     */
    async click(locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
        // console.log(`Clicked on the element: ${locator}`);
    }

    /**
     * Type into an input field
     * @param {Locator} locator - The locator for the input field
     * @param {string} text - Text to type
     */
    async type(locator, text) {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(text);
        // console.log(`Typed '${text}' into the element: ${locator}`);
    }

    /**
     * Get text content of an element
     * @param {Locator} locator - The locator for the element
     * @returns {Promise<string>} - The text content of the element
     */
    async getText(locator) {
        await locator.waitFor({ state: 'visible' });
        const text = await locator.textContent();
        const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
        const normilizedText=normalizeText(text)
        // console.log(`Text from element: ${text}`);
        return normilizedText;
    }

    /**
     * Check if an element is visible
     * @param {Locator} locator - The locator for the element
     * @returns {Promise<boolean>} - True if the element is visible, otherwise false
     */
    async isVisible(locator) {
        const visible = await locator.isVisible();
        // console.log(`Element visibility: ${visible}`);
        return visible;
    }

    /**
     * Scroll to an element
     * @param {Locator} locator - The locator for the element
     */
    async scrollToElement(locator) {
        await locator.scrollIntoViewIfNeeded();
        // console.log(`Scrolled to element: ${locator}`);
    }

    /**
     * Select a dropdown value
     * @param {Locator} locator - The locator for the dropdown
     * @param {string} value - The value to select
     */
    async selectDropdownValue(locator, value) {
        await locator.waitFor({ state: 'visible' });
        await locator.selectOption({ value });
        // console.log(`Selected value '${value}' in dropdown: ${locator}`);
    }

    /**
     * Hover over an element
     * @param {Locator} locator - The locator for the element
     */
    async hover(locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.hover();
        // console.log(`Hovered over the element: ${locator}`);
    }

    /**
     * Drag and drop an element
     * @param {Locator} source - The source element
     * @param {Locator} target - The target element
     */
    async dragAndDrop(source, target) {
        await source.waitFor({ state: 'visible' });
        await target.waitFor({ state: 'visible' });
        await source.dragTo(target);
        // console.log(`Dragged element ${source} to target ${target}`);
    }

    /**
     * Check if an element contains a specific text
     * @param {Locator} locator - The locator for the element
     * @param {string} text - Text to check
     * @returns {Promise<boolean>} - True if the element contains the text, otherwise false
     */
    async containsText(locator, text) {
        const elementText = await this.getText(locator);
        const contains = elementText.includes(text);
        // console.log(`Element contains text '${text}': ${contains}`);
        return contains;
    }

    /**
     * Take a screenshot of an element
     * @param {Locator} locator - The locator for the element
     * @param {string} name - File name for the screenshot
     */
    async captureElementScreenshot(locator, name) {
        await locator.screenshot({ path: `screenshots/${name}.png` });
        // console.log(`Captured screenshot of element as '${name}.png'`);
    }
    /**
 * Press a key on the keyboard globally
 * @param {string} key - The key to press (e.g., 'Escape', 'Enter', 'Tab', etc.)
 */
async pressKey(key) {
    await this.page.keyboard.press(key);
    // console.log(`Pressed the key '${key}'.`);
}
/**
 * Wait for an element to be visible
 * @param {Locator} locator - The locator for the element
 */
async waitForVisibility(locator) {
    await locator.waitFor({ state: 'visible' });
    // console.log(`Element is visible: ${locator}`);
}


}
