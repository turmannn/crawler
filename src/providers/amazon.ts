import {Page} from "playwright-chromium";
import {Action, Store} from "../types";

export default (page: Page, asin): Action => {
    const storeName: Store = 'amazon';
    const url = 'https://amazon.com'
    const selFldSearch = '#twotabsearchtextbox'
    const labelFldSearch = 'Search Amazon'
    const valBtnSearch = 'Go';
    const selProductTile = `//div[@data-asin="${asin}"]`
    const locSpanPrice = page.locator(`${selProductTile}//*[@class="a-offscreen"]`);
    const locH2Name = page.locator(`${selProductTile}//a`);

    const searchProduct = async () => {
        await page.getByLabel(labelFldSearch).fill(asin);
        await page.getByAltText(valBtnSearch).click();
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