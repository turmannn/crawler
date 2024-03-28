// TODO: looks like the file is not needed as there is no a model approach in lowdb

import { db} from "../database.js";

import {DBData, Product, ProductOut, UnprocessedProduct} from "../types.js";

import {LowSync} from "lowdb";


const productModel = {
    getProducts: async (): Promise<UnprocessedProduct[]>  => {
        await db.read();
        return db.data.unprocessed;
    },
    addProduct: async (product: UnprocessedProduct): Promise<void>  => {
        await db.read();
        db.data.unprocessed.push(product);
        await db.write();
    },
    removeProducts: async (product: Product): Promise<Product[] | []> => {
        await db.read();
        db.data.productsIn.filter(item =>
            item.id !== product.id || item.storeName !== product.storeName
        );
        db.write();
        db.read();
        return db.data.productsIn;
    },
}

export default productModel;
