import productModel from "../api/models/productModel.js";
import {Product, ProductAmazon, ProductEbay, ProductOut, StoreEnum, UnprocessedProduct} from "../api/types.js";
import unprocessedModel from "../api/models/unprocessedModel.js";
import productOutModel from "../api/models/pricesModel.js";
import pricesModel from "../api/models/pricesModel.js";
import {inputsQueueAmazon, inputsQueueEbay} from "../app.js";
import {ProductsLists, splitProductsByStore} from "./scoutsService.js";

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
    },
    processProducts: (products: Product[]): Response<Product> => {
        //TODO: implement avoiding duplicates in destination db object
        // const productFound = productModel.findProduct(product.id, product.storeName)
        // if (productFound) {
        //     return {
        //         message: `Product with id: ${product.id} already is in the processing queue. Skipping...`,
        //         products: productModel.getProducts()
        //     }
        // } else {
        //     const products = productModel.addProduct(product)
        //     return { message, products }
        // }

        let productsAdjustedCollector: Product[] = [];

        // const {productsAmazon, productsEbay} = splitProductsByStore(products);

        // productLists.productsAmazon
        Object.entries(splitProductsByStore(products)).forEach(([productListName, products]) => {
            // const b = productListName as ProductsLists.
            const productsAdjusted = products.list.map((product: Product ) => {
                const productAdjusted: Product = {
                    id: product.id.toString(),
                    storeName: product.storeName.toString().toLowerCase() as StoreEnum
                }

                console.log('debug storename: ', productListName, StoreEnum.Amazon, StoreEnum.Ebay)
                if (productListName === StoreEnum.Amazon) {
                    inputsQueueAmazon.add(product as ProductAmazon);
                } else if (productListName === StoreEnum.Ebay) {
                    inputsQueueEbay.add(product as ProductEbay);
                }
                return productAdjusted;
            })
            console.log('debug products adjusted: ', productsAdjusted)
            productsAdjustedCollector.push(...productsAdjusted)
        })

        // [productsAmazon, productsEbay].forEach(products => {
        //     const productsAdjusted = products.map((product: Product ) => {
        //         const productAdjusted = {
        //             id: product.id.toString(),
        //             storeName: product.storeName.toString().toLowerCase() as StoreEnum
        //         }
        //         const {productsAmazon, productsEbay} = splitProductsByStore(productAdjusted)
        //         inputsQueueAmazon.add(productsAmazon);
        //         inputsQueueEbay.add(productsEbay);
        //         return productAdjusted;
        //     })
        // })



        return {
            message,
            products: productModel.addProducts(productsAdjustedCollector)
        }
    },
}

export default productService;
