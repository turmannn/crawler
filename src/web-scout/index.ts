// @ts-check
// ...

import {chromium, Page} from 'playwright-chromium';
import {Action} from "./types.js";
import {Browser, BrowserContext, errors} from "playwright-core";
import { Product, ProductOut, StoreEnum, UnprocessedProduct} from "../api/types.js";
import {Queue} from "../services/scoutsService.js";
import TimeoutError = errors.TimeoutError;


export const webScout = async (
    scoutProvider: (page: Page, productId: string) => Action,
    inputQueue: Queue<Product>,
    // outputQueue: Queue<Good>,
    // errorQueue: Queue<UnprocessedProduct>
    moveToOutputObject: (product: ProductOut) => any,
    moveToUnprocessed: (product: UnprocessedProduct) => any
) => {
    console.log('debug in webScout')
        // restart web-scout if some error happened
    const maxErrorsCounter = 10;
    const waitAfterEmptyQueueSeconds = 5;
    const productTimeoutMaxRetry = 2;
    type ProductsWithTimeoutes = Record<string, Product & {counter: number}>
    const productsWithTimeoutes: ProductsWithTimeoutes  = {};
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
                // @ts-ignore
                if (product === newProduct) {
                    await new Promise(resolve => setTimeout((resolve), antiScrapperTimerSeconds * 1000));
                }
                product = newProduct;

                const provider = scoutProvider(page, product.id);


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
                        const counterObj = productsWithTimeoutes[product.id]

                        console.log('debug timeout retry counter: ', counterObj)
                        if (counterObj?.counter >= productTimeoutMaxRetry) {
                            delete productsWithTimeoutes[product.id]
                            throw e
                        } else {
                            productsWithTimeoutes[product.id] = {
                                ...product,
                                counter: counterObj ? counterObj.counter + 1 : 1
                            };
                            console.error('product can not be found for a long time. Will requeue it!')
                            inputQueue.add(product);
                        }
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
}
