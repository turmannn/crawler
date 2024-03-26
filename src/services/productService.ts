import productModel from "../api/models/productModel.js";
import {Product, ProductOut} from "../api/types.js";

interface Response {
    message: string,
}

interface ProductsResponse extends Response {
    products: Product[]
}

interface ProcessedProductsResponse extends Response {
    products: ProductOut[]
}

const productService = {
    showProducts: async (): Promise<ProcessedProductsResponse> => {
        return {
            message: 'Success',
            products: await productModel.getProcessedProducts()
        };
    },
    processProduct: async (product: Product): Promise<ProductsResponse> => {
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
