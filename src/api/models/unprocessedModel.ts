// TODO: looks like the file is not needed as there is no a model approach in lowdb
import { db } from "../database.js";
import { Product, UnprocessedProduct } from "../types.js";

const productModel = {
    getProducts: (): UnprocessedProduct[]  => {
        db.read();
        return db.data.unprocessed;
    },
    addProduct: (product: UnprocessedProduct): void  => {
        db.read();
        db.data.unprocessed.push(product);
        db.write();
    },
    removeProducts: (product: Product): Product[] | [] => {
        db.read();
        db.data.productsIn = db.data.productsIn.filter(item =>
            !(item.id === product.id && item.storeName === product.storeName)
        );
        db.write();
        db.read();
        return db.data.productsIn;
    },
}

export default productModel;
