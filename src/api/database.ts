// TODO: looks like the file is not needed as there is no a model approach in lowdb

// import {Store} from "../types";
// import {JSONFilePreset} from "lowdb/lib/presets/node";

//
// export interface Product {
//     storeName: Store,
//     id: string,
//     name: string,
//     updateTime: Date,
// }

// interface Data {
//     products: Product[]
// }
//
// const defaultData: Data = { products: [] };
// export const db = await JSONFilePreset<Data>('db.json', defaultData)

import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node'
import("lowdb/node")
// import {DBData, Product} from "../types";
import config from "./config/index.js";
import {DBData, Product} from "./types.js";


const adapter = new JSONFileSync<DBData>(config.database.path)
export const db = new LowSync<DBData>(adapter, {
    productsIn: [],
    productsOut: [],
    unprocessed: []
})

// persist old data if server restarted
export const PersistDb = () => {
    db.read();
    db.write();
}

// db.data = {...db.data}
// export default {
//         ops: db,
//     initDb: () => {
//         db.read();
//         db.write();
//     },
//     removeFromObject: <T>(objectName: string, filterCallBack): T  => {
//         db.read();
//         db.data[objectName] = (db.data[objectName] as T).filter(filterCallBack);
//         db.write();
//         return db.data[objectName] as T;
//     }
// }
