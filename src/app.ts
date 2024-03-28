// import {JSONFilePreset} from "lowdb/node";
import express from "express";

import routes from './api/routes/index.js'
// import {DBData} from "./api/types";
// import {index} from "./api/config";

// import { LowSync } from 'lowdb';
// import { JSONFileSync } from 'lowdb/node'
import config from './api/config/index.js';
// import webScout from "./web-scout/index.js";
import { initScoutService } from "./services/scoutsService.js";
import {webScout} from "./web-scout/index.js";
import {initDb} from "./api/database.js";
// import {dbConnect} from "./api/models/productModel";

// db
// console.log('initialize db')
// const defaultData: DBData = { products: [] };
// export const db = await JSONFilePreset<DBData>('db.json', defaultData)
// const adapter = new FileSync('db.json');
// const adapter = new JSONFileSync<DBData>(index.database.path)
// const db = new LowSync(adapter, {products: []}) //TODO: does ot rewrite existing data? if so fix it!
// export const connect = dbConnect();

initDb()


console.log('about to move products from db to stores queues')
initScoutService();

// express app
const app = express();

//Middleware // TODO: do i need it? several examples used it!
app.use(express.json())

// Routes
// app.use('/api/users', routes)
app.use('/api', routes)

const PORT =  process.env.PORT || config.server.port;

app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})
