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

// import { LowSync } from 'lowdb';
// import { JSONFileSync } from 'lowdb/node'
// import {DBData, Product} from "../types";
// import config from "../config";

// const adapter = new JSONFileSync<DBData>(config.database.path)
// const db = new LowSync(adapter, {products: []})

// const productModel = {
//     async getAllProducts(): Promise<Product>[] { return db.read() },
//     async addProduct(product: Product): Promise<void> {
//         db.data = product
//         await db.write()
//     }
// }

// export const dbConnect = () => {
//     const adapter = new JSONFileSync<DBData>(config.database.path)
//     const db = new LowSync(adapter, {})
// }

import { db } from "../database.js";

import {DBData, Product, ProductOut} from "../types.js";

import {LowSync} from "lowdb";

// const products = new LowSync<DBData>(adapter, {products: []});



// (async () => {
//     products.data = {
//         ...products.data,
//         products: []
//     }
//
//     await products.write();
// })()


const productModel = {
    getDbData: async (): Promise<Product | {}>  => { //TODO: test method. Delete later
        await db.read()
        return db.data;
    },
    findProduct: (id: string, storeName: string): Product | undefined => {
        db.read()
        const { productsIn } = db.data;
        return productsIn.find((product) => product.id === id && product.storeName === storeName)
    },
    removeProducts: (product: Product): Product[] | [] => {
        db.read()
        db.data.productsIn = db.data.productsIn.filter(item =>
            item.id !== product.id || item.storeName !== product.storeName
        );
        db.write();

        return db.data.productsIn
    },
    getProducts: (): Product[] => {
        db.read()
        return db.data.productsIn;
    },
    addProduct: (product: Product): Product[] => {
        // await dbConnection.read();
        // // dbConnection.data = { products: [ ...dbConnection.data.products, product] };
        // dbConnection.data = { products: [ ...(dbConnection.data as DBData).products, product] };
        // await dbConnection.write();
        // dbConnection.read();
        // return dbConnection.data;

        // await dbConnection.update(({ db }) => db.push(product))
        console.log('debug pr: ', product)
        // implement no duplicates
        if (db.data.productsIn.find((productIn: Product) =>
            productIn.id === product.id && productIn.storeName === product.storeName
        )) {
            console.log(`Product with id: ${product.id} already exists in the input database`)
        } else {
            db.data.productsIn.push(product);
            db.write();
        }
        return db.data.productsIn
    }
}

export default productModel;
