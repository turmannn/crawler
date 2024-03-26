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
import {DBData} from "./types.js";


const adapter = new JSONFileSync<DBData>(config.database.path)
export const db = new LowSync<DBData>(adapter, {productsIn: [], productsOut: []})

// persist old data if server restarted
await db.read()
db.data = {...db.data}
await db.write()

