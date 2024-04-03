import {Product, ProductAmazon, ProductEbay, ProductUnknown, StoreEnum} from "../api/types.js";
import {StoreProducts} from "./scoutsService.js";
import productService from "./productService.js";
import {inputsQueueAmazon, inputsQueueEbay} from "../app.js";
import unprocessedModel from "../api/models/unprocessedModel.js";

const splitProductsByStore = (productsList: Product[], adjust = true): StoreProducts[] => {
    const supportedStores: StoreEnum[] = [StoreEnum.Unknown, StoreEnum.Amazon, StoreEnum.Ebay]
    const [productsUnknown, productsAmazon, productsEbay] = supportedStores.map(
        (store): {name: StoreEnum, list: Product[]} => ({ name: store, list: [] })
    )

    for (const product of productsList) {
        if (adjust) {
            product.storeName = product.storeName.toString().toLowerCase() as StoreEnum;
            product.id = product.id.toString();
        }

        if (product.storeName === StoreEnum.Amazon) {
            productsAmazon.list.push(product);
        } else if (product.storeName === StoreEnum.Ebay) {
            productsEbay.list.push(product as ProductEbay);
        } else productsUnknown.list.push(product as ProductUnknown);
    }
    return [productsAmazon, productsEbay, productsUnknown]
}


export const spreadProducts = (products: Product[], adjust = true): Product[]  => {
    // spread known products into appropriate store queues. Move unknown products to dedicated db object. Return store lists for known products

    const stores = splitProductsByStore(products, adjust);
    stores.forEach(store => {
        if (store.name === StoreEnum.Amazon) {
            store.list.forEach((product) => { inputsQueueAmazon.add(product as ProductAmazon) });
        } else if (store.name === StoreEnum.Ebay) {
            store.list.forEach((product) => { inputsQueueEbay.add(product as ProductEbay) });
        } else {
            store.list.forEach((product) => {
                console.log(`debug about to move item to unknown db object: ${JSON.stringify(product)}`)
                unprocessedModel.addProduct({...product, error: 'Unknown Store'})
                // productService.moveProductToUnknown({...product, error: 'Unknown Store'});
            })
        }
    })

    return stores.reduce(
        (finalList, store) => store.name === StoreEnum.Unknown ? finalList : [...finalList, ...store.list],
        [] as Product[]
    );
    // return stores.filter(store => store.name !== StoreEnum.Unknown);
}