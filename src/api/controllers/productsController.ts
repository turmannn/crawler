import { Request, Response } from 'express';
import {Product, Store, StoreEnum} from "../types.js";
import productService from "../../services/productService.js";

// export const processProducts = async (req: Request, res: Response) => {
//    throw new Error('not implemented')
// }

// export const getProducts = async (req: Request, res: Response) => {
//     console.log('debug get products endpoint')
//     try {
//         const products = await productModel.getProcessedProducts();
//         res.status(200).json(products);
//     } catch (error) {
//
//     }
// }

interface ProductForProcessing {
    id: string,
    storeName: Store,
}

export const addProduct = async (req: Request<{}, {}, Product>, res: Response) => {
    // try {
    //     const products = await productModel.getAllProducts();
    //     res.status(200).json(products);
    // } catch (error) {
    //
    // }
    const { storeName, id } = req.body;

    if (!id) {
        res.status(400).send('param id has to be provided')
    } else if (!storeName) {
        res.status(400).send('param storeName has to be provided')
    } else if (!Object.values(StoreEnum).includes(storeName.toLowerCase() as StoreEnum)) {
        res.status(400).send('store name provided is not supported')
    } else {
        const serviceRes =
            await productService.processProduct({ id, storeName: storeName.toLowerCase() as StoreEnum });
        res.status(200).json(serviceRes);
    }


}