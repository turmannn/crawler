export type Store = 'amazon' | 'ebay'

export enum StoreEnum {
    Amazon = 'amazon',
    Ebay = 'ebay',
    Unknown = ''
}

interface ProductTemplate {
    storeName: string,
    id: string,
}

export interface Product extends ProductTemplate {
    storeName: StoreEnum,
}

export interface ProductAmazon extends ProductTemplate {
    storeName: StoreEnum.Amazon,
}

export interface ProductEbay extends ProductTemplate {
    storeName: StoreEnum.Ebay,
}

export interface UnprocessedProduct {
    storeName: string,
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