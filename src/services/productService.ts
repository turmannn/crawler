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
    showProducts: (): Response<ProductOut> => {
        return {
            message,
            products: productOutModel.getProducts()
        };
    },
    moveProductToUnknown: (product: UnprocessedProduct): Response<UnprocessedProduct> => {
        productModel.removeProducts({ storeName: product.storeName, id: product.id });
        unprocessedModel.addProduct(product);
        return {
            message,
            products: unprocessedModel.getProducts()
        };
    },
    moveProductToProcessed: (product: ProductOut): Response<UnprocessedProduct> => {
        productModel.removeProducts({ storeName: product.storeName, id: product.id });
        pricesModel.addProduct(product);
        return {
            message,
            products: unprocessedModel.getProducts()
        };
    },
    processProduct: (product: Product): Response<Product> => {
        const productFound = productModel.findProduct(product.id, product.storeName)
        if (productFound) {
            return {
                message: `Product with id: ${product.id} already is in the processing queue. Skipping...`,
                products: productModel.getProducts()
            }
        } else {
            const products = productModel.addProduct(product)
            return { message, products }
        }
    }
}

export default productService;
