import {Product, ProductAmazon, ProductEbay, ProductUnknown, StoreEnum} from "../api/types.js";
import {ProductsLists} from "./scoutsService.js";
import productService from "./productService.js";
import {inputsQueueAmazon, inputsQueueEbay} from "../app.js";

const splitProductsByStore = (productsList: Product[], adjust = true): ProductsLists[] => {
    // const productsAmazon: ProductsList<ProductAmazon> = {};
    // const productsAmazon: ProductAmazon[] = [];
    // const productsEbay: ProductEbay[] = [];
    // const unrecognizedProducts: UnprocessedProduct[] =[];

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


export const spreadProducts = (products: Product[], adjust = true) => {
    // spread known products into appropriate store queues. Move unknown products to dedicated db object

    splitProductsByStore(products, adjust).forEach(productsByStore => {
        if (productsByStore.name === StoreEnum.Amazon) {
            productsByStore.list.forEach((product) => { inputsQueueAmazon.add(product as ProductAmazon) });
        } else if (productsByStore.name === StoreEnum.Ebay) {
            productsByStore.list.forEach((product) => { inputsQueueEbay.add(product as ProductEbay) });
        } else {
            productsByStore.list.forEach((product) => {
                console.log(`debug about to move item to unknown db object: ${JSON.stringify(product)}`)
                productService.moveProductToUnknown({...product, error: 'Unknown Store'});
            })
        }
    })
}