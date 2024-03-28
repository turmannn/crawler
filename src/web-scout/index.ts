// @ts-check
// ...

import {chromium, devices, Page} from 'playwright-chromium';
import {Action} from "./types.js";
import amazon from "./providers/amazon.js";
import {Browser, BrowserContext, errors} from "playwright-core";
import { Product, ProductOut, StoreEnum, UnprocessedProduct} from "../api/types.js";
import {generateQueue, Queue} from "../services/scoutsService.js";
import TimeoutError = errors.TimeoutError;

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

// const generateQueue = <T>() => {
//     const queue: T[] = [];
//     const add = (item: T) => {
//         queue.unshift(item)
//     }
//     const pop = () => queue.pop();
//     return {
//         add,
//         pop ,
//         get len () { return queue.length }
//     };
// }


export const webScout = async (
    inputQueue: Queue<Product>,
    // outputQueue: Queue<Good>,
    // errorQueue: Queue<UnprocessedProduct>
    moveToOutputObject: (product: ProductOut) => any,
    moveToUnprocessed: (product: UnprocessedProduct) => any
) => {

    // interface Input {
    //     productId: string,
    //     storeName: Store
    // }

// const asins = ['B00ATHBO86', 'B07PRRRLHT', 'B002UP153Y', 'B00136MKEO'];
// asins.forEach(asin => {
//     inputsQueue.add({productId: asin, storeName: 'amazon'})
// })

// const actionQueue = generateQueue<Action>();

    // const pricesQueue = generateQueue<Good>();

    // const runWebCrawler = (async (getProducts?: any, removeProduct?: any, addProcessedProduct?: any) => {

    console.log('debug in webScout')
        // restart web-scout if some error happened
    const maxErrorsCounter = 100;
    const waitAfterEmptyQueueSeconds = 5;
    let product: Product;
    const antiScrapperTimerSeconds = 3; //so program looks more like a human from the Store point of veiw
    for (let i = 0; i < maxErrorsCounter; i++) {
        let context: BrowserContext;
        let browser: Browser;
        try {
            console.log('debug start web-scout in async')
            // Setup
            browser = await chromium.launch({headless: false});
            // const context = await browser.newContext(devices['iPhone 11']);
            context = await browser.newContext();
            const page = await context.newPage();

            // The actual interesting bit
            // await context.route('**.jpg', route => route.abort());
            await context.route('**/*.{jpg,png,svg,}', route => route.abort());

            let url;

            // console.log('debug asuns and inptsQueue: ', asins, inputsQueue)
            while (true) { //TODO: may be while true instead? so it will check even after queue is 0
                if (inputQueue.isEmpty) {
                    console.log(`input queue is empty. Will wait ${waitAfterEmptyQueueSeconds} second/s until retry...`)
                    await new Promise(resolve => setTimeout((resolve), waitAfterEmptyQueueSeconds * 1000));
                    continue;
                }
                const newProduct = inputQueue.pop() as Product;
                // wait antiScrapperTimerSeconds to mimic human speed
                if (product === newProduct) {
                    await new Promise(resolve => setTimeout((resolve), antiScrapperTimerSeconds * 1000));
                }
                product = newProduct;


                let provider: Action
                if (product.storeName === 'amazon') {
                    provider = amazon(page, product.id);
                } else throw 'Not Implemented';

                try {
                    // do not visit url if it is already set
                    console.log(page.url(), url, provider.url)

                    url !== provider.url && await page.goto(provider.url);
                    url = provider.url

                    for (const step of provider.steps) { await step() }
                    const price = await provider.getPrice();
                    const name = await provider.getProductName();
                    console.log('debug: about to add to priceQueue: ', {store: product.storeName, price, name})
                    // outputQueue.add({ storeName: product.storeName, price, name, id: product.id });
                    console.log('about to add processed product to output object')
                    console.log(page.url())
                    await moveToOutputObject({
                        storeName: product.storeName,
                        price,
                        name,
                        id: product.id,
                        updateTime: new Date()
                    });
                } catch (e) {
                    if (e instanceof TimeoutError) {
                        console.error('product can not be found for a long time. Will go to next product')
                    } else throw e;
                }

            }
            // Teardown

        } catch (e) {
            console.error('web scout error: ', e)
            // @ts-ignore
            // errorQueue.add({ storeName: product.storeName, id: product.id, error: e.toString() })
            await moveToUnprocessed({ storeName: product.storeName, id: product.id, error: e.toString() })

            setTimeout(() => {}, 1000) //save resources in case it will get into while loop with unexpected instructions
        } finally {
            // @ts-ignore
            if (context) await context.close();
            // @ts-ignore
            if (browser) await browser.close();
        }
        console.log(`web-scout stopped because limit errors of ${maxErrorsCounter} achieved`)
    }
    // });

    // console.log('priceQueue: ', outputQueue)

}

