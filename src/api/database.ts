import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node'
import config from "./config/index.js";
import { DBData } from "./types.js";

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
