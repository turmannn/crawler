import productModel from "../api/models/productModel.js";
import {Product, ProductOut, UnprocessedProduct} from "../api/types.js";
import unprocessedModel from "../api/models/unprocessedModel.js";
import productOutModel from "../api/models/pricesModel.js";
import pricesModel from "../api/models/pricesModel.js";

interface Response<T> {
    message: string,
    products: T[]
}

// interface ProductsResponse extends Response {
//     products: Product[]
// }
//
// interface ProcessedProductsResponse extends Response {
//     products: ProductOut[]
// }
//
// interface UnprocessedProductsResponse extends Response {
//     products: UnprocessedProduct[]
// }

const message = 'Success';

const productService = {
    showProducts: async (): Promise<Response<ProductOut>> => {
        return {
            message,
            products: await productOutModel.getProducts()
        };
    },
    moveProductToUnknown: async (product: UnprocessedProduct): Promise<Response<UnprocessedProduct>> => {
        await productModel.removeProducts({ storeName: product.storeName, id: product.id });
        await unprocessedModel.addProduct(product);
        return {
            message,
            products: await unprocessedModel.getProducts()
        };
    },
    moveProductToProcessed: async (product: ProductOut): Promise<Response<UnprocessedProduct>> => {
        await productModel.removeProducts({ storeName: product.storeName, id: product.id });
        await pricesModel.addProduct(product);
        return {
            message,
            products: await unprocessedModel.getProducts()
        };
    },
    processProduct: async (product: Product): Promise<Response<Product>> => {
        const productFound = await productModel.findProduct(product.id, product.storeName)
        if (productFound) {
            return {
                message: `Product with id: ${product.id} already is in the processing queue. Skipping...`,
                products: await productModel.getProducts()
            }
        } else {
            const products = await productModel.addProduct(product)
            return { message, products }
        }
    }
}

export default productService;
