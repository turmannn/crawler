import { Request, Response } from 'express';
import {Product, StoreEnum} from "../types.js";
import productService from "../../services/productService.js";


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

const validateProductRequest = (product: Product, res: Response, validateStoreName = false): string => {
    let errorMessage = '';
    const { storeName, id } = product;
    console.log('debug: ', id, storeName, product)
    if (!id) {
        errorMessage = 'param id has to be provided';
    } else if (!storeName) {
        errorMessage = 'param storeName has to be provided';
    } else if (validateStoreName && !Object.values(StoreEnum).includes(storeName.toLowerCase() as StoreEnum)) {
        errorMessage = 'store name provided is not supported';
    }
    return errorMessage;
}

export const addProduct = async (req: Request<{}, {}, Product>, res: Response) => {
    try {
        const { storeName, id  } = req.body;
        const successFlag = validateProductRequest(req.body, res, true);
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

export const addProducts = async (req: Request<{}, {}, Product[]>, res: Response) => {
    try {
        const productsIn = req.body;

        if (!Array.isArray(productsIn)) {
            res.status(400).send('"products" type has to be array');
        }

        for (const product of productsIn) {
            const errorMessage = validateProductRequest(product, res);
            if (errorMessage) return res.status(400).send(errorMessage);
        }

        const productsInDb = productService.processProducts(productsIn);
        res.status(200).json(productsInDb);
    } catch (e) {
        console.error(e)
        res.status(500).send('unable to process request')
    }
}