import productModel from "../api/models/productModel.js";
import {Product} from "../api/types.js";

const productService = {
    processProduct: async (product: Product): Promise<{ message: string, products: Product[] }> => {
        const productFound = await productModel.findProductIn(product.id, product.storeName)
        if (productFound) {
            return {
                message: `Product with id: ${product.id} already is in the processing queue. Skipping...`,
                products: await productModel.getProductsIn()
            }
        } else {
            const products = await productModel.addProductIn(product)
            return { message: 'Success', products }
        }
    }
}

export default productService;
