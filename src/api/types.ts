export type Store = 'amazon' | 'ebay'

export enum StoreEnum {
    Amazon = 'amazon',
    Ebay = 'ebay'
}

export interface Product {
    storeName: StoreEnum,
    id: string,
}

export interface UnprocessedProduct {
    storeName: StoreEnum,
    id: string,
    error: string
}

// export interface Good extends Product {
//     price: string,
//     name: string
// }

export interface ProductOut extends Product {
    price: string,
    name: string,
    updateTime: Date,
}

export interface DBData {
    productsIn: Product[],
    productsOut: ProductOut[],
    unprocessed: UnprocessedProduct[]
}



// export interface Action {
//     storeName: StoreEnum
//     url: string
//     steps: (() => Promise<void>)[];
//     getProductName: () => Promise<string>;
//     getPrice: () => Promise<string>;
// }