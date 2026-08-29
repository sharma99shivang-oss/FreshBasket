import { Router } from 'express';
import { body, param } from 'express-validator';
import { createAddress, deleteAddress, getAddresses, updateAddress } from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
const fields = [body('fullName').trim().isLength({ min: 2, max: 100 }), body('phone').trim().isLength({ min: 7, max: 20 }), body('house').trim().isLength({ min: 1, max: 150 }), body('street').trim().isLength({ min: 1, max: 180 }), body('landmark').optional().trim().isLength({ max: 150 }), body('city').trim().isLength({ min: 2, max: 80 }), body('state').trim().isLength({ min: 2, max: 80 }), body('pincode').trim().matches(/^\d{6}$/).withMessage('Enter a valid 6 digit pincode'), body('addressType').optional().isIn(['Home', 'Office', 'Other']), body('isDefault').optional().isBoolean().toBoolean()];
router.use(protect); router.get('/', getAddresses); router.post('/', fields, validateRequest, createAddress); router.put('/:id', [param('id').isMongoId(), ...fields.map((field) => field.optional())], validateRequest, updateAddress); router.delete('/:id', param('id').isMongoId(), validateRequest, deleteAddress);
export default router;
