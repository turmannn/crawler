// @ts-check
// ...


import {BrowserContext, chromium, devices, Page} from 'playwright-chromium';
import {Action, Store} from "./types";
import amazon from "./providers/amazon";





// const step = async (page: Page) => {
//     await page.goto('https://example.com/');
//
// }

// const generateActionsQueue = () => {
//     const queue: Action[] = [];
//
//     const add = (action: Action) => { queue.unshift(action) }
//
//     const pop = () => queue.pop();
//
//     // const get = () => queue;
//
//     return { add, pop , len: queue.length };
// }

const generateQueue = <T>() => {
    const queue: T[] = [];
    const add = (item: T) => {
        queue.unshift(item)
    }
    const pop = () => queue.pop();
    return {
        add,
        pop ,
        get len () { return queue.length }
    };
}

interface Input {
    productId: string,
    storeName: Store
}

const inputsQueue = generateQueue<Input>();
const asins = ['B00ATHBO86', 'B07PRRRLHT', 'B002UP153Y', 'B00136MKEO'];
asins.forEach(asin => {
    inputsQueue.add({productId: asin, storeName: 'amazon'})
})

const actionQueue = generateQueue<Action>();

interface Good {
    price: string,
    store: Store,
    name: string
}

const pricesQueue = generateQueue<Good>();

(async () => {
    console.log('debug start in async')
    // Setup
    const browser = await chromium.launch({headless: false});
    // const context = await browser.newContext(devices['iPhone 11']);
    const context = await browser.newContext();
    const page = await context.newPage();

    // The actual interesting bit
    await context.route('**.jpg', route => route.abort());

    console.log('debug asuns and inptsQueue: ', asins, inputsQueue)
    while (inputsQueue.len > 0) { //TODO: may be while true instead? so it will check even after queue is 0
        const input = inputsQueue.pop()

        let provider: Action
        if (input.storeName === 'amazon') {
            provider = amazon(page, input.productId);
        } else throw 'Not Implemented';

        await page.goto(provider.url);
        for (const step of provider.steps) { await step();}
        const price = await provider.getPrice();
        const name = await provider.getProductName();
        console.log('debug: about to add to priceQueue: ', {store: input.storeName, price, name})
        pricesQueue.add({ store: input.storeName, price, name });
    }


    // Teardown
    await context.close();
    await browser.close();
})();

console.log('priceQueue: ', pricesQueue)