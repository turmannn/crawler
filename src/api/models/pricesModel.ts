import { db} from '../database.js';
import { ProductOut } from '../types.js';


const productOutModel = {
    getProducts: async (): Promise<ProductOut[]>  => {
        await db.read()
        return db.data.productsOut;
    },
    addProduct: async (product: ProductOut): Promise<void>  => {
        db.data.productsOut.push(product);
        await db.write();
    }
}

export default productOutModel;
