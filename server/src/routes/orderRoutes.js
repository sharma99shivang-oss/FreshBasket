import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { cancelMyOrder, getAllOrders, getMyOrder, getMyOrders, placeOrder, updateOrderStatus } from '../controllers/orderController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router(); const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
router.use(protect);
router.post('/checkout', [body('addressId').isMongoId(), body('paymentMethod').isIn(['COD', 'RAZORPAY']), body('couponCode').optional().trim().isLength({ min: 3, max: 40 })], validateRequest, placeOrder);
router.get('/my-orders', getMyOrders); router.get('/my-orders/:id', param('id').isMongoId(), validateRequest, getMyOrder); router.patch('/my-orders/:id/cancel', param('id').isMongoId(), validateRequest, cancelMyOrder);
router.get('/', authorize('admin'), [query('status').optional().isIn(statuses), query('search').optional().trim().isLength({ max: 100 })], validateRequest, getAllOrders);
router.patch('/:id/status', authorize('admin'), [param('id').isMongoId(), body('orderStatus').isIn(statuses)], validateRequest, updateOrderStatus);
export default router;
