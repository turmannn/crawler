import { Request, Response } from 'express';
import {Product, Store, StoreEnum} from "../types.js";
import productService from "../../services/productService.js";
import {getSoreQueues} from "../../services/scoutsService.js";
import {inputsQueueAmazon} from "../../app.js";

// export const processProducts = async (req: Request, res: Response) => {
//    throw new Error('not implemented')
// }

export const getProducts = async (req: Request, res: Response) => {
    console.log('debug get products endpoint')
    try {
        const products = await productService.showProducts();
        res.status(200).json(products);
    } catch (e) {
        console.error(e);
        res.status(500);
    }
}

interface ProductForProcessing {
    id: string,
    storeName: Store,
}

const validateProductRequest = (product: Product, res: Response): boolean => {
    let successFlag = false;
    const { storeName, id } = product;
    console.log('debug: ', product)
    console.log(id, storeName)
    if (!id) {
        res.status(400).send('param id has to be provided')
    } else if (!storeName) {
        res.status(400).send('param storeName has to be provided')
    } else if (!Object.values(StoreEnum).includes(storeName.toLowerCase() as StoreEnum)) {
        res.status(400).send('store name provided is not supported')
    } else {
        successFlag = true;
    }

    return successFlag;
}

export const addProduct = async (req: Request<{}, {}, Product>, res: Response) => {
    // try {
    //     const products = await productModel.getAllProducts();
    //     res.status(200).json(products);
    // } catch (error) {
    //
    // }
    try {
        const { storeName, id  } = req.body;
        const successFlag = validateProductRequest(req.body, res);
        if (successFlag) {
            const serviceRes =
                productService.processProduct({
                    id: id.toString(),
                    storeName: storeName.toString().toLowerCase() as StoreEnum
                });
            res.status(200).json(serviceRes);
        }
    } catch (e) {
        console.error(e)
        res.status(500).send('unable to process request')
    }
}

// interface Products {
//     products: Product[]
// }

export const addProducts = async (req: Request<{}, {}, Product[]>, res: Response) => {
    try {
        const productsIn = req.body;
        console.log(11, req.body)

        if (!Array.isArray(productsIn)) {
            res.status(400).send('"products" type has to be array')
        }

        for (const product of productsIn) {
            console.log(12, product)
            validateProductRequest(product, res);
        }

        const productsInDb = productService.processProducts(productsIn);
        res.status(200).json(productsInDb);



    } catch (e) {
        console.error(e)
        res.status(500).send('unable to process request')
    }
}