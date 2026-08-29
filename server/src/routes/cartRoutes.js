import { Router } from 'express';
import { body, param } from 'express-validator';
import { addCartItem, clearUserCart, getUserCart, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router(); const id = param('productId').isMongoId().withMessage('Invalid product ID'); const quantity = body('quantity').isInt({ min: 1, max: 99 }).toInt().withMessage('Quantity must be between 1 and 99');
router.use(protect); router.get('/', getUserCart); router.post('/items', [body('productId').isMongoId().withMessage('Invalid product ID'), quantity], validateRequest, addCartItem); router.patch('/items/:productId', [id, quantity], validateRequest, updateCartItem); router.delete('/items/:productId', id, validateRequest, removeCartItem); router.delete('/', clearUserCart);
export default router;
