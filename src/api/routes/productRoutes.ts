import { Router } from 'express';
import { addProduct, addProducts, getProducts } from "../controllers/productsController.js";

const router = Router();

// examples:
// router.get('/', userController.getAllUsers);
// router.get('/:id', userController.getUserById);

router.get('/', getProducts);
router.post('/addOne', addProduct)
router.post('/add', addProducts)

export default router;
