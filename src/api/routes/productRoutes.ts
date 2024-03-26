import { Router } from 'express';
import {addProduct, getProducts} from "../controllers/productsController.js";
// import {addProducts, getProducts} from '../controllers/productsController.js'

const router = Router();

// examples:
// router.get('/', userController.getAllUsers);
// router.get('/:id', userController.getUserById);

// router.get('/getProducts', getProducts);
router.get('/', getProducts);
router.post('/add', addProduct)

export default router