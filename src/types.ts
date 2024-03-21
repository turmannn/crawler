export type Store = 'amazon' | 'ebay'

export interface Action {
    storeName: Store
    url: string
    steps: (() => Promise<void>)[];
    getProductName: () => Promise<string>;
    getPrice: () => Promise<string>;
}