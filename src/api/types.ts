export enum StoreEnum {
    Amazon = 'amazon',
    Ebay = 'ebay',
    Unknown = ''
}

export interface Product<T = StoreEnum> {
    storeName: T,
    id: string,
}

export type ProductAmazon = Product<StoreEnum.Amazon>

export interface ProductEbay extends Product {
    storeName: StoreEnum.Ebay,
}

export interface ProductUnknown extends Product {
    storeName: StoreEnum.Unknown,
}

export interface UnprocessedProduct extends Product {
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
