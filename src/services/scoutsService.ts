import { Product, UnprocessedProduct} from "../api/types.js";
import ProductModel from "../api/models/productModel.js";
import amazon from "../web-scout/providers/amazon.js";
import {webScout} from "../web-scout/index.js";
import productService from "./productService.js";

export type Queue<T> = {
    add: (item: T) => void;
    pop: () => T | undefined;
    isEmpty: boolean;
    len: number;
    print: () => string;
}

export const generateQueue = <T>(): Queue<T> => {
    const queue: T[] = [];
    const add = (item: T) => {
        queue.unshift(item)
    }
    const pop = () => queue.pop();
    return {
        add,
        pop ,
        get isEmpty() { return queue.length === 0 },
        get len() { return queue.length },
        print: () => JSON.stringify(queue)
    };
}

const splitProductsByStore = (productsList: Product[]) => {
    const productsAmazon: Product[] = [];
    const ebayProducts: Product[] = [];
    const unrecognizedProducts: UnprocessedProduct[] =[];

    for (const product of productsList) {
        if (product.storeName === 'amazon') {
            productsAmazon.push(product);
        } else if (product.storeName === 'ebay') {
            ebayProducts.push();
        } else unrecognizedProducts.push({ ...product, error: 'unsupported store' });
    }
    return { productsAmazon, ebayProducts, unrecognizedProducts }
}

// interface Input {
//     productId: string,
//     storeName: Store
// }



export const initScoutService = async () => {
    const products = await ProductModel.getProducts();

    console.log('debug products: ', products)
    const { productsAmazon, ebayProducts, unrecognizedProducts  } = splitProductsByStore(products);


    const inputsQueueAmazon = generateQueue<Product>();

    // const  = generateQueue<Good>();

    //TODO: figure out wheter there is really a case when unrecognized items can seat in productsIn db or service can handle it when it comes from user
    for (const product of unrecognizedProducts) {
        productService.moveProductToUnknown(product);
    }

    console.log('debug products amazon: ', productsAmazon)
    productsAmazon.forEach((product: Product) => { inputsQueueAmazon.add(product) });

    console.log('about to start web scout: ', inputsQueueAmazon.print(), )
    const webScoutPromise = webScout(
        inputsQueueAmazon,
        productService.moveProductToProcessed,
        productService.moveProductToUnknown
    );
    console.log(111, webScoutPromise)
    console.log(112, webScoutPromise)
}



//TODO> implement object with methods so controller can add t oqueues

