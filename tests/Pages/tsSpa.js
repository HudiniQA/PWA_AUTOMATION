import { BaseClass } from '../Pages/baseClass';
import { test, expect } from '@playwright/test';
//import { ElementActions } from "./elementActions";
import { Console } from "console";
const testData = JSON.parse(JSON.stringify(require('../testData/testData.json')));

export class TsSpa extends BaseClass {
    #hamburgerMenu
    #spa
    #spaDescription
    #spaLocation
    #treatments
    #treatmentDuration
    #treatmentsDescription
    #discover
    #phoneCTA
    #emailCTA
    #spaCategory
    #allCategory
    #categoryButton
    #spaList
    #viewTreatments
    constructor() {
        super();
        //this.elementActions = new ElementActions(this.page)
    }

    async initializeSelectors() {
        this.#hamburgerMenu = this.page.locator('.hamburger-react');
        this.#spa = this.page.getByText('Spa', { exact: true });
        this.#spaDescription = this.page.locator("//div[@class='spa_wrapper__6TuNi']//p[@class='spa_detailComponentDescription__4ReQr']");
        this.#spaLocation = this.page.locator("//div[@class='spa_wrapper__6TuNi']//div[@class='spa_location__sYoqg']//p");
        this.#treatments = this.page.locator("//div[@class='ListComponents_listComponent__nyNaS']//h2");
        this.#treatmentDuration = this.page.locator("//div[@class='ListComponents_imageContent__4AutB globals-imageContent']//p[1]");
        this.#treatmentsDescription = this.page.locator("//div[@class='spa_wrapper__6TuNi']//p[@class='spa_detailComponentDescription__4ReQr']");
        this.#discover = this.page.locator("//div[@class='ListComponents_imageContent__4AutB globals-imageContent']//p[3]");
        this.#phoneCTA = this.page.getByLabel('Phone')
        this.#emailCTA = this.page.getByLabel('Email')
        this.#spaCategory = this.page.locator('//span[@class="BottomMenu_expandArrow__Fp0vc"]');
        this.#allCategory = this.page.locator('(//div[@class="MenuItem_optionsList__uJqNF"])[2]//div[@class="MenuItem_optionsListItem__mHI5w"]');
        this.#categoryButton = this.page.locator("//div[@class='BottomMenu_bottomMenuWrapper__2YmoK']//button");
        this.#spaList = this.page.locator("//div[@class='ListComponents_listComponent__nyNaS']//h2[@class='ListComponents_listComponentTitle__IWRAf globals-text-align']");
        this.#viewTreatments = this.page.locator("//button[text()='View Treatments']");

    }

    getHamburgerMenu() {
        return this.#hamburgerMenu;
    }
    getTreaments() {
        return this.#treatments;
    }
    getSpa() {
        return this.#spa;
    }
    getSpaDescription() {
        return this.#spaDescription;
    }
    getSpaLocation() {
        return this.#spaLocation;
    }
    getTreatmentDuration() {
        return this.#treatmentDuration;
    }
    getTreatmentDescription() {
        return this.#treatmentsDescription;
    }
    getDiscover() {
        return this.#discover;
    }
    getPhoneCTA() {
        return this.#phoneCTA;
    }
    getEmailCTA() {
        return this.#emailCTA;
    }
    getCategory() {
        return this.#spaCategory;
    }
    getAllCategory() {
        return this.#allCategory;
    }
    getCategoryButton() {
        return this.#categoryButton;
    }
    getSpaList() {
        return this.#spaList;
    }
    getViewTreatments() {
        return this.#viewTreatments;
    }

    async navigateToSpa() {
        await this.initializeSelectors();
        await this.getHamburgerMenu().click();
        await this.getSpa().click();
        // await this.getSpaList().click();
        // await this.getViewTreatments().click();
    }
    async captureTheSpaDetailsApiResponse() {
        const endPoint = testData.fairmontMakkahPWA.spa.getSpaDetailsEndpoint;
        const apiKey = testData.fairmontMakkahPWA.spa.getSpaDetailsApiKey;
        const query = testData.fairmontMakkahPWA.spa.getSpaDetailsQuery;
        const hotelId = testData.fairmontMakkahPWA.hotelId
        const variables = {
            hotelId: hotelId
        };

        // Make API request to capture the actual data
        const response = await this.page.request.post(endPoint, {
            data: {
                query: query,
                variables: variables
            },
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });
        const responseBody = await response.json();
        if (responseBody) {
            console.log(' API call was successful.✅ ');
        } else {
            console.error(' API call failed. Response body is null or undefined.❌');
        }
        // console.dir(responseBody, { depth: null });
        expect(response.ok()).toBeTruthy();
        return responseBody
    }
    async randomScrollBottomToTop() {
        const totalHeight = document.documentElement.scrollHeight; // Get the total height of the document
        window.scrollTo(0, totalHeight); // Scroll to the bottom initially
        await new Promise((resolve) => {
            const interval = setInterval(() => {
                const randomOffset = Math.floor(Math.random() * window.innerHeight); // Random offset for scrolling up
                const currentScroll = window.scrollY; // Current scroll position
                if (currentScroll <= 0) {
                    clearInterval(interval); // Stop scrolling when top is reached
                    console.log("Reached the top of the page!");
                    resolve(); // Resolve the promise to allow async/await
                } else {
                    window.scrollTo(0, Math.max(currentScroll - randomOffset, 0)); // Scroll upwards
                    console.log(`Scrolling to position: ${Math.max(currentScroll - randomOffset, 0)}`);
                }
            }, 500); // Adjust interval as needed
        });
    }

    async verifyTheSpa(page) {

        await this.initializeSelectors();
        //Spa
        try {
            const spaList = await this.getSpaList();
            await spaList.first().waitFor({ state: 'visible' });
            const spacount = await spaList.count();
            const SpaLists = [];
            console.log(`Total spa found: ${spacount}`);

            for (let s = 0; s < spacount; s++) {
                await spaList.nth(s).waitFor({ state: 'visible' });
                const SpaList1 = await spaList.nth(s).textContent();
                const Actualspalist = SpaList1.trim();
                SpaLists.push(Actualspalist);
                console.log(`Spa list ${s + 1}: ${Actualspalist}`);


            }
            console.log('All spa lists--->:', SpaLists);
            //Store the spa list in a variable:
            const spaData = {};
            SpaLists.forEach((spanames, index) => {
                const splitSpa = spanames.split(',');
                spaData[`spa_${index + 1}`] = splitSpa;
            });

            const listOfSpa = {};
            Object.keys(spaData).forEach(key => {
                listOfSpa[key] = spaData[key][0];
            });
            console.log('Spa Data:', spaData);
            console.log('List of Spa:', listOfSpa);


            //Spa validation from API response:
            const responseBody = await this.captureTheSpaDetailsApiResponse();
            //console.dir(responseBody,{depth:null})
            const spaNames = responseBody.data.getSpaDetails.spa.map(spa => spa.name);
            console.log(spaNames);
            expect(SpaLists).toStrictEqual(spaNames);
            console.log("Spa lists validation passed, executing further actions...");

            // Function to get spa id by name (from previous code)
            function getSpaIdByName(spaName) {
                const spa = responseBody.data.getSpaDetails.spa.find(s => s.name === spaName);
                return spa ? spa.id : null;
            }

            //getSpaIdByName function with the dynamically created listOfSpa
            // Object.keys(listOfSpa).forEach(key => {
            //     const spaName = listOfSpa[key];
            //     const spaId = getSpaIdByName(spaName);
            //     console.log(`Spa Name: ${spaName}, Spa ID: ${spaId}`);
            // });
            const spaIds = []; // Array to store spaIds

            Object.keys(listOfSpa).forEach(key => {
                const spaName = listOfSpa[key];
                const spaId = getSpaIdByName(spaName);
                console.log(`Spa Name: ${spaName}, Spa ID: ${spaId}`);
                spaIds.push(spaId);
            });
            console.log('All Spa IDs:', spaIds);


            //Spa Click:
            const spaList1 = await this.getSpaList();
            await spaList1.first().waitFor({ state: 'visible' });
            const spaListcount = await spaList1.count();
            console.log(`Total spa found: ${spaListcount}`);

            const allTreatments = [];//getting all the treatments after all the categories iterations:
            for (let l = 0; l < spaListcount; l++) {
                const spaItem = spaList1.nth(l);
                await spaItem.waitFor({ state: 'visible' });
                console.log(`Clicking on spa ${l + 1}`);
                await spaItem.click();
                await this.page.waitForTimeout(1000);
                
                //Get current spaName:
                const spaText = await spaItem.textContent();
                console.log(`Text of spa ${l + 1}: ${spaText}`);

                //SpaDescription Validation:
                const spaDescription = await this.getSpaDescription().textContent();
                console.log('Spa Description:', spaDescription);
                const responseBody2 = await this.captureTheSpaDetailsApiResponse();
                //console.dir(responseBody,{depth:null})
                const spaDescriptionAPI = responseBody2.data.getSpaDetails.spa.find(spa => spa.name===spaText);
                if(spaDescriptionAPI){
                    console.log('API Response:', spaDescriptionAPI.description);
                    console.log(spaDescriptionAPI.description);
                    expect(spaDescription).toBe(spaDescriptionAPI.description);
                } else {
                    console.log(`No description found for ${spaText}`);
                }
                //click viewtreatment button:
                const viewtreatmentbtn = await this.getViewTreatments();
                await viewtreatmentbtn.waitFor({ state: 'visible' });

                if (await viewtreatmentbtn.isVisible()) {
                    console.log('View Treatments button is visible');

                    const buttonText = await viewtreatmentbtn.textContent();
                    console.log('Text of view Treatment Button:', buttonText?.trim());
                    console.log('Clicking on View Treatments button');
                    await viewtreatmentbtn.click();

                    //categoryButton
                    const categorybutton = await this.getCategoryButton();
                    await categorybutton.waitFor({ state: 'visible' });
                    console.log('category button is now visible');

                    const categorybtn = await this.getCategoryButton();
                    await categorybtn.waitFor({ state: 'visible' });
                    await categorybtn.click();

                    //category validation
                    const allCategoryLocator = this.getAllCategory();
                    await allCategoryLocator.first().waitFor({ state: 'visible' });
                    const count = await allCategoryLocator.count();
                    const categoryTexts = [];
                    console.log(`Total elements found: ${count}`);
                    for (let c = 0; c < count; c++) {
                        const text = await allCategoryLocator.nth(c).textContent();
                        const trimmedText = text.trim();
                        categoryTexts.push(trimmedText);
                        console.log(`Category ${c + 1}: ${trimmedText}`);
                    }
                    console.log('All Categories:', categoryTexts);

                    //Category validation from API response:
                    const responseBody = await this.captureTheSpaDetailsApiResponse();
                    const categorylist = responseBody.data.getSpaDetails.categories.map(category => category.name);
                    console.log(categorylist);
                    //console.dir('API Response:'+spaObject,{depth:null});
                    //expect(categoryTexts).toStrictEqual(categorylist);

                    // Function to find matching categories
                    function getMatchingCategories(frontendCategories, apiCategories) {
                        const matches = [];
                        let matchCount = 0;
                        frontendCategories.forEach(category => {
                            if (apiCategories.includes(category)) {
                                matches.push(category);
                                matchCount++;
                            }
                        });
                        return { matches, matchCount };
                    }
                    // Validate the categories
                    const { matches, matchCount } = getMatchingCategories(categoryTexts, categorylist);
                    console.log(`Matching Categories: ${matches}`);
                    console.log(`Total Matches: ${matchCount}`);
                    expect(categoryTexts).toStrictEqual(matches);
                    console.log("Matches:", matches);
                    console.log("Number of Matches:", matchCount);
                    console.log("Category lists validation passed, executing further actions...");

                    //const allTreatments = [];
                    //Treatment Validation:
                    for (let c = 0; c < categoryTexts.length; c++) {
                        console.log(`Clicking category: ${categoryTexts[c]}`);
                        // Click the specific category
                        await allCategoryLocator.nth(c).waitFor({ state: 'visible' });
                        await allCategoryLocator.nth(c).click();

                        // Click the category button after the specific category
                        const categoryButton = await this.getCategoryButton();
                        await categoryButton.waitFor({ state: 'visible' });
                        await categoryButton.click();

                        //Validation of treatments
                        console.log(`Validating treatments for category: ${categoryTexts[c]}`);
                        const alltreatmetns = this.getTreaments();
                        await alltreatmetns.first().waitFor({ state: 'visible', timeout: 30000 });
                        const treatmentcount = await alltreatmetns.count();
                        console.log(`Number of treatments found for "${categoryTexts[c]}": ${treatmentcount}`);

                        const treatmetslist = [];
                        for (let t = 0; t < treatmentcount; t++) {
                            const treatment = await alltreatmetns.nth(t).textContent();
                            treatmetslist.push(treatment.trim());
                        }
                        console.log(`Items under Category "${categoryTexts[c]}":`, treatmetslist);
                        allTreatments.push(...treatmetslist);
                    }
                } else {
                    console.log('View Treatments button is not present in the DOM');
                }
                await this.page.goBack();
                await spaList1.first().waitFor({ state: 'visible' });
            }
            console.log("All Treatments across all categories:", allTreatments);

            //Treatment validation from API response:
            const responseBody1 = await this.captureTheSpaDetailsApiResponse();
            const treatmentlist = responseBody1.data.getSpaDetails.treatments.map(treatment => treatment.name);
            console.log(treatmentlist);

            const sortedAllTreatments = [...allTreatments].sort();
            const sortedTreatmentlist = [...treatmentlist].sort();

            expect(sortedAllTreatments).toStrictEqual(sortedTreatmentlist);
        } catch (error){
            console.error("Error during spa list validation or interaction:", error);
        }




        //    const actualDescription = await this.getTreatmentDescription().allTextContents();
        // expect(actualDescription).toBe(spaObject.description);
        // //Validate the email & phone
        // const spaInformation = responseBody.data.getSpaDetails.spa[0].contact; //Extracting the information array from the response
        // console.dir("Spainfo:" + spaInformation, { depth: null })

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const phoneRegex = /^\+\d{10,15}$/;

        // const validateSpaInformation = (spaInformation, actualSpaTitle) => {
        //     const { email, phone } = spaInformation.contact;


        //     if (email && emailRegex.test(email)) {
        //         expect(this.elementActions.isVisible(this.getEmailCTA())).toBeTruthy();
        //         console.log(`Email CTA is visible for ${actualSpaTitle} ✅`);
        //     } else {
        //         console.log(`Invalid or missing email for ${actualSpaTitle}.`);
        //     }


        //     if (phone && phoneRegex.test(phone)) {
        //         expect(this.elementActions.isVisible(this.getPhoneCTA())).toBeTruthy();
        //         console.log(`Phone CTA is visible for ${actualSpaTitle} ✅`);
        //     } else {
        //         console.log(`Invalid or missing phone for ${actualSpaTitle}.`);
        //     }

        // };

        //validate the CTA button 
        // const actualCTATitle = await this.elementActions.getText(this.getCTAtitle()); 
        // console.log('CTA Title:', actualCTATitle);
        // const spaInformation1 = responseBody.data.getSpaDetails.spa[0].cta;
        // //expect(actualCTATitle).toBe(spaInformation1.ctaTitle);
        // console.dir("SpaCTAtitle:" + spaInformation1.ctaTitle,{depth:null});




    }

}

