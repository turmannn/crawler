import {Product, ProductAmazon, ProductEbay, StoreEnum} from "../api/types.js";
import productService from "./productService.js";
import {webScout} from "../web-scout/index.js";
import amazon from "../web-scout/providers/amazon.js";

export type Queue<T, N = string> = {
    add: (item: T) => void;
    pop: () => T | undefined;
    isEmpty: boolean;
    len: number;
    name: string | N;
    print: () => string;
}

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


export interface StoreProducts {
    name: StoreEnum
    list: Product[]
}

export const startScoutService = async (
    inputsQueueAmazon: Queue<ProductAmazon, StoreEnum.Amazon>,
    inputsQueueEbay: Queue<ProductEbay, StoreEnum.Ebay>
): Promise<void> => {
    console.log('debug input queues: ', inputsQueueAmazon.print(), '\n', inputsQueueEbay.print());

    await webScout(
        amazon,
        inputsQueueAmazon as Queue<Product>,
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
