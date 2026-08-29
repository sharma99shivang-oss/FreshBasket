import { Router } from 'express';
import { body } from 'express-validator';
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from '../controllers/categoryController.js';
import { authorize, optionalProtect, protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
const rules = (required) => [
  body('name')[required ? 'notEmpty' : 'optional']().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('slug')[required ? 'notEmpty' : 'optional']().trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Slug must use lowercase letters, numbers, and hyphens'),
  body('image').optional({ values: 'falsy' }).isURL().withMessage('Image must be a valid URL'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description is too long'),
  body('isActive').optional().isBoolean().toBoolean(),
];

router.get('/', optionalProtect, getCategories);
router.get('/:id', getCategory);
router.post('/', protect, authorize('admin'), rules(true), validateRequest, createCategory);
router.put('/:id', protect, authorize('admin'), rules(false), validateRequest, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
