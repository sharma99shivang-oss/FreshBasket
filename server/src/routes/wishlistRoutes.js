import { Router } from 'express';
import { body, param } from 'express-validator';
import { addWishlistProduct, getUserWishlist, removeWishlistProduct } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router(); router.use(protect); router.get('/', getUserWishlist); router.post('/items', body('productId').isMongoId().withMessage('Invalid product ID'), validateRequest, addWishlistProduct); router.delete('/items/:productId', param('productId').isMongoId().withMessage('Invalid product ID'), validateRequest, removeWishlistProduct);
export default router;
