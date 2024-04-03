import productModel from "../api/models/productModel.js";
import ProductModel from "../api/models/productModel.js";
import {Product, ProductAmazon, ProductEbay, ProductOut, StoreEnum, UnprocessedProduct} from "../api/types.js";
import unprocessedModel from "../api/models/unprocessedModel.js";
import productOutModel from "../api/models/pricesModel.js";
import pricesModel from "../api/models/pricesModel.js";
import {generateQueue} from "./scoutsService.js";
import {spreadProducts} from "./index.js";

interface Response<T> {
    message: string,
    products: T[]
}

// interface ProductsResponse extends Response {
//     products: Product[]
// }
//
// interface ProcessedProductsResponse extends Response {
//     products: ProductOut[]
// }
//
// interface UnprocessedProductsResponse extends Response {
//     products: UnprocessedProduct[]
// }

const message = 'Success';

const inputsQueueAmazon = generateQueue<ProductAmazon, StoreEnum.Amazon>(StoreEnum.Amazon);
const inputsQueueEbay = generateQueue<ProductEbay, StoreEnum.Ebay>(StoreEnum.Ebay);
console.log('queues are generated: ', inputsQueueAmazon.print(), inputsQueueEbay.print())

const productService = {
    // read products db object and return queue for each known product. Unknown products move to dedicated db object
    initStoreQueus: () => ({ inputsQueueAmazon, inputsQueueEbay }),
    spreadProducts: (): void => {
        const products = ProductModel.getProducts();

        // splitProductsByStore(products).forEach(productsByStore => {
        //     if (productsByStore.name === StoreEnum.Amazon) {
        //         productsByStore.list.forEach((product: ProductAmazon) => { inputsQueueAmazon.add(product) });
        //     } else if (productsByStore.name === StoreEnum.Ebay) {
        //         productsByStore.list.forEach((product: ProductEbay) => { inputsQueueEbay.add(product) });
        //     } else {
        //         productsByStore.list.forEach((product: ProductUnknown) => {
        //             productService.moveProductToUnknown({...product, error: 'Unknown Store'});
        //         })
        //     }
        // })
         const knownStoresProducts = spreadProducts(products, false);
        // //TODO: figure out whether there is really a case when unrecognized items can seat in productsIn db or service can handle it when it comes from user
        // unrecognizedProducts.forEach((product: ProductUnknown) => { productService.moveProductToUnknown(product); })
        //
        // const inputsQueueAmazon = generateQueue<ProductAmazon, StoreEnum.Amazon>();
        // productsAmazon.forEach((product: ProductAmazon) => { inputsQueueAmazon.add(product) });
        //
        // const inputsQueueEbay = generateQueue<ProductEbay, StoreEnum.Ebay>();
        // productsEbay.forEach((product: ProductEbay) => { inputsQueueEbay.add(product) });
        //
    },
    showProducts: (): Response<ProductOut> => {
        return {
            message,
            products: productOutModel.getProducts()
        };
    },
    moveProductToUnknown: (product: UnprocessedProduct): Response<UnprocessedProduct> => {
        productModel.removeProducts({ storeName: product.storeName, id: product.id });
        unprocessedModel.addProduct(product);
        return {
            message,
            products: unprocessedModel.getProducts()
        };
    },
    moveProductToProcessed: (product: ProductOut): Response<UnprocessedProduct> => {
        productModel.removeProducts({ storeName: product.storeName, id: product.id });
        pricesModel.addProduct(product);
        return {
            message,
            products: unprocessedModel.getProducts()
        };
    },
    processProduct: (product: Product): Response<Product> => {
        const productFound = productModel.findProduct(product.id, product.storeName)
        if (productFound) {
            return {
                message: `Product with id: ${product.id} already is in the processing queue. Skipping...`,
                products: productModel.getProducts()
            }
        } else {
            const products = productModel.addProduct(product)
            return { message, products }
        }
    },
    processProducts: (products: Product[]): Response<Product> => {
        //TODO: implement avoiding duplicates in destination db object
        // const productFound = productModel.findProduct(product.id, product.storeName)
        // if (productFound) {
        //     return {
        //         message: `Product with id: ${product.id} already is in the processing queue. Skipping...`,
        //         products: productModel.getProducts()
        //     }
        // } else {
        //     const products = productModel.addProduct(product)
        //     return { message, products }
        // }


        // const knownStoresProducts: Product[] = spreadProducts(products).reduce(
        //     (finalList, store) => store.name === StoreEnum.Unknown ? finalList : [...finalList, ...store.list],
        //     []
        // );

        const knownStoresProducts: Product[] = spreadProducts(products);

        return {
            message,
            products: productModel.addProducts(knownStoresProducts)
        }
    },
}

export default productService;
