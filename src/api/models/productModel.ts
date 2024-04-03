import { db } from "../database.js";

import { Product } from "../types.js";

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
        db.read();
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
        db.read();

        console.log('debug pr: ', product)
        if (db.data.productsIn.find((productIn: Product) =>
            productIn.id === product.id && productIn.storeName === product.storeName
        )) {
            console.warn(`Product with id: ${product.id} already exists in the input database`)
        } else {
            db.data.productsIn.push(product);
            db.write();
        }
        return db.data.productsIn;
    },
    addProducts: (products: Product[]): Product[] => {
        // TODO: implement no duplicates here or in service?
        db.read();
        db.data.productsIn.push(...products);
        db.write();
        return db.data.productsIn
    }
}

export default productModel;
