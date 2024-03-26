export type Store = 'amazon' | 'ebay'

export enum StoreEnum {
    Amazon = 'amazon',
    Ebay = 'ebay'
}

export interface Product {
    storeName: StoreEnum,
    id: string,
}

export interface ProductOut extends Product {
    name: string,
    updateTime: Date,
}

export interface DBData {
    productsIn: Product[],
    productsOut: ProductOut[]
}