import {Product, ProductAmazon, ProductEbay, StoreEnum} from "../api/types.js";
import ProductModel from "../api/models/productModel.js";
import amazon from "../web-scout/providers/amazon.js";
import {webScout} from "../web-scout/index.js";
import productService from "./productService.js";

export type Queue<T, N = string> = {
    add: (item: T) => void;
    pop: () => T | undefined;
    isEmpty: boolean;
    len: number;
    name: string | N;
    print: () => string;
}

export const generateQueue = <T, N = string>(name?: N): Queue<T, N> => {
    const queueName = name || '';
    const queueId = Math.floor(Math.random() * 1000)
    const queue: T[] = [];
    const add = (item: T) => {
        console.log(`item added to queue ${queueId}: `, item)
        queue.unshift(item)
    }
    const pop = () => queue.pop();
    return {
        add,
        pop ,
        get isEmpty() { return queue.length === 0 },
        get len() { return queue.length },
        get name() { return queueName },
        print: () => JSON.stringify(`Queue Name: ${queueName}. Object: ${JSON.stringify(queue)}`)
    };
}

// export interface ProductsList<T extends StoreEnum | '' = ''> {
export interface ProductsLists {
    name: StoreEnum
    list: Product[]
}

// export interface ProductsLists<T> {
//     productsAmazon: ProductsList<T>
//     productsEbay: ProductsList<T>
//     unrecognizedProducts: ProductsList<T>
// }

// export interface ProductsLists {
//     productsAmazon: ProductsList<StoreEnum.Amazon>;
//     productsEbay: ProductsList<StoreEnum.Ebay>;
//     unrecognizedProducts: ProductsList;
// }


export const splitProductsByStore = (productsList: Product[]): ProductsLists[] => {
    // const productsAmazon: ProductsList<ProductAmazon> = {};
    // const productsAmazon: ProductAmazon[] = [];
    // const productsEbay: ProductEbay[] = [];
    // const unrecognizedProducts: UnprocessedProduct[] =[];

    const supportedStores: StoreEnum[] = [StoreEnum.Unknown, StoreEnum.Amazon, StoreEnum.Ebay]
    const [productsUnknown, productsAmazon, productsEbay] = supportedStores.map(
        store => ({ name: store, list: [] })
    )

    for (const product of productsList) {
        if (product.storeName === StoreEnum.Amazon) {
            productsAmazon.list.push(product as ProductAmazon);
        } else if (product.storeName === StoreEnum.Ebay) {
            productsEbay.list.push(product as ProductEbay);
        } else productsUnknown.list.push({ ...product, error: `Store ${product.storeName} is Unsupported` });
    }
    return [productsAmazon, productsEbay, productsUnknown]
}

// interface Input {
//     productId: string,
//     storeName: Store
// }

export const getSoreQueues = () => {
    const products = ProductModel.getProducts();

    const { productsAmazon, productsEbay, unrecognizedProducts  } = splitProductsByStore(products);

    //TODO: figure out whether there is really a case when unrecognized items can seat in productsIn db or service can handle it when it comes from user
    unrecognizedProducts.forEach(product => { productService.moveProductToUnknown(product); })

    const inputsQueueAmazon = generateQueue<ProductAmazon, StoreEnum.Amazon>();
    productsAmazon.forEach((product: ProductAmazon) => { inputsQueueAmazon.add(product) });

    const inputsQueueEbay = generateQueue<ProductEbay, StoreEnum.Ebay>();
    productsEbay.forEach((product) => { inputsQueueEbay.add(product) });

    return {inputsQueueAmazon, inputsQueueEbay}
}

export const initScoutService = async (
    inputsQueueAmazon: Queue<ProductAmazon, StoreEnum.Amazon>,
    inputsQueueEbay: Queue<ProductEbay, StoreEnum.Ebay>
) => {
    console.log('about to start web scout: ', inputsQueueAmazon.print(), )

    await webScout(
        amazon,
        // inputsQueueAmazon as Queue<Product>, //TODO: why ts complains if used without ' as Queue<Product>'
        inputsQueueAmazon,
        productService.moveProductToProcessed,
        productService.moveProductToUnknown
    );

    // await webScout(
    //     ebay,
    //     inputsQueueEbay,
    //     productService.moveProductToProcessed,
    //     productService.moveProductToUnknown
    // );
}



//TODO> implement object with methods so controller can add t oqueues

