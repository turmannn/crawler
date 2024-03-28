import { db } from '../database.js';
import { ProductOut } from '../types.js';


const productOutModel = {
    getProducts: (): ProductOut[]  => {
        db.read()
        return db.data.productsOut;
    },
    addProduct: (product: ProductOut): void => {
        db.data.productsOut.push(product);
        db.write();
    }
}

export default productOutModel;
