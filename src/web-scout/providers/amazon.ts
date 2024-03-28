import {Page} from "playwright-chromium";
import {StoreEnum} from "../../api/types.js";
import {Action} from "../types.js";
// import {Action, Store} from "../types.js";

export default (page: Page, asin: string): Action => {
    const storeName: StoreEnum = StoreEnum.Amazon;
    const url = 'https://amazon.com'
    const selFldSearch = '#twotabsearchtextbox'
    const labelFldSearch = 'Search Amazon'
    const locBtnSearch = page.locator('#nav-search-submit-button');
    const selProductTile = `//div[@data-asin="${asin}"]`
    const locSpanPrice = page.locator(`${selProductTile}//*[@class='a-price']//*[@class="a-offscreen"]`);
    const locH2Name = page.locator(`${selProductTile}//h2`);

    const searchProduct = async () => {
        await page.getByLabel(labelFldSearch).fill(asin);
        await locBtnSearch.click();
    }

    const getPrice = () => {
        return locSpanPrice.innerText();
    }

    const getProductName = () => {
        return locH2Name.innerText();
    }

    return {
        storeName,
        url,
        steps: [searchProduct],
        getProductName,
        getPrice
    }
}