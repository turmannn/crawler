import { Router } from 'express';
import productRoutes from './productRoutes.js'

const router = Router();

router.use('/products', productRoutes);

router.use('/*', (req, res) => {
    res.send('unsupported endpoint')
})

export default router