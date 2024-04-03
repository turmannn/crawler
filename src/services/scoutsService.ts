import {Product, ProductAmazon, ProductEbay, ProductUnknown, StoreEnum} from "../api/types.js";
import ProductModel from "../api/models/productModel.js";
import productService from "./productService.js";

export type Queue<T, N = string> = {
    add: (item: T) => void;
    pop: () => T | undefined;
    isEmpty: boolean;
    len: number;
    name: string | N;
    print: () => string;
}

// export const generateQueue = <T, N = string>(name?: N): Queue<T, N> => {
//     const queueName = name || '';
//     const queueId = Math.floor(Math.random() * 1000)
//     const queue: T[] = [];
//     const add = (item: T) => {
//         console.log(`item added to queue. QueueId ${queueId}, QueueName: ${queueName}. item: ${item}`)
//         queue.unshift(item)
//     }
//     const pop = () => queue.pop();
//     return {
//         add,
//         pop ,
//         get isEmpty() { return queue.length === 0 },
//         get len() { return queue.length },
//         get name() { return queueName },
//         print: () => `Queue Name: ${queueName}. Object: ${JSON.stringify(queue)}`
//     };
// }

export const generateQueue = <T, N = string>(name: N): Queue<T, N> => {
    const queueName = name;
    const queueId = Math.floor(Math.random() * 1000)
    const queue: T[] = [];
    const add = (item: T) => {
        console.log(`item added to queue. QueueId ${queueId}, QueueName: ${queueName}. item: ${JSON.stringify(item)}`)
        queue.unshift(item)
    }
    const pop = () => queue.pop();
    return {
        add,
        pop ,
        get isEmpty() { return queue.length === 0 },
        get len() { return queue.length },
        get name() { return queueName },
        print: () => `Queue Name: ${queueName}. Object: ${JSON.stringify(queue)}`
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


// interface Input {
//     productId: string,
//     storeName: Store
// }


export const startScoutService = async (
    inputsQueueAmazon: Queue<ProductAmazon, StoreEnum.Amazon>,
    inputsQueueEbay: Queue<ProductEbay, StoreEnum.Ebay>
): Promise<void> => {
    console.log('about to start web scout: ', inputsQueueAmazon.print(), )

    // await webScout(
    //     amazon,
    //     // inputsQueueAmazon as Queue<Product>, //TODO: why ts complains if used without ' as Queue<Product>'
    //     inputsQueueAmazon,
    //     productService.moveProductToProcessed,
    //     productService.moveProductToUnknown
    // );

    console.log('debug input queues: ', inputsQueueAmazon.print(), inputsQueueEbay.print())


    // await webScout(
    //     ebay,
    //     inputsQueueEbay,
    //     productService.moveProductToProcessed,
    //     productService.moveProductToUnknown
    // );
}



//TODO> implement object with methods so controller can add t oqueues

