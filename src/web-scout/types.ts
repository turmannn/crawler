// export type Store = 'amazon' | 'ebay'

import {StoreEnum} from "../api/types.js";

export interface Action {
    storeName: StoreEnum
    url: string
    steps: (() => Promise<void>)[];
    getProductName: () => Promise<string>;
    getPrice: () => Promise<string>;
}