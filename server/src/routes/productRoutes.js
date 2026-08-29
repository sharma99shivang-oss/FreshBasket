import { Router } from 'express';
import { body, query } from 'express-validator';
import { createProduct, deleteProduct, getProduct, getProductSuggestions, getProducts, updateProduct, uploadProductImages } from '../controllers/productController.js';
import { authorize, optionalProtect, protect } from '../middleware/authMiddleware.js';
import { productImagesUpload } from '../middleware/uploadMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
const catalogueQueryRules = [
  query('page').optional().isInt({ min: 1, max: 100000 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().trim().isLength({ max: 100 }),
  query('category').optional().trim().isLength({ min: 1, max: 160 }),
  query('minPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('maxPrice').optional().isFloat({ min: 0 }).toFloat(),
  query('sort').optional().isIn(['price_asc', 'price_desc', 'rating', 'newest']),
  query('featured').optional().isBoolean().toBoolean(),
  query('available').optional().isBoolean().toBoolean(),
  query('includeUnavailable').optional().isBoolean().toBoolean(),
  query('maxPrice').custom((maxPrice, { req }) => !req.query.minPrice || Number(maxPrice) >= Number(req.query.minPrice)).withMessage('Maximum price must be at least the minimum price'),
];
const suggestionQueryRules = [query('q').optional().trim().isLength({ max: 100 })];
const fieldRules = (required) => [
  body('title')[required ? 'notEmpty' : 'optional']().trim().isLength({ min: 2, max: 140 }),
  body('slug')[required ? 'notEmpty' : 'optional']().trim().matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('category')[required ? 'notEmpty' : 'optional']().isMongoId(),
  body('brand').optional().trim().isLength({ max: 80 }),
  body('price')[required ? 'notEmpty' : 'optional']().isFloat({ min: 0 }).toFloat(),
  body('discountPrice').optional({ values: 'falsy' }).isFloat({ min: 0 }).toFloat(),
  body('stock')[required ? 'notEmpty' : 'optional']().isInt({ min: 0 }).toInt(),
  body('unit')[required ? 'notEmpty' : 'optional']().isIn(['kg', 'g', 'litre', 'ml', 'pcs']),
  body('rating').optional().isFloat({ min: 0, max: 5 }).toFloat(),
  body('reviewsCount').optional().isInt({ min: 0 }).toInt(),
  body('featured').optional().isBoolean().toBoolean(),
  body('isAvailable').optional().isBoolean().toBoolean(),
  body('discountPrice').custom((discountPrice, { req }) => !discountPrice || !req.body.price || Number(discountPrice) <= Number(req.body.price)).withMessage('Discount price cannot exceed price'),
];
router.get('/', catalogueQueryRules, validateRequest, optionalProtect, getProducts);
router.get('/suggestions', suggestionQueryRules, validateRequest, getProductSuggestions);
router.get('/:id', getProduct);
router.post('/upload-images', protect, authorize('admin'), productImagesUpload, uploadProductImages);
router.post('/', protect, authorize('admin'), productImagesUpload, fieldRules(true), validateRequest, createProduct);
router.put('/:id', protect, authorize('admin'), productImagesUpload, fieldRules(false), validateRequest, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
export default router;
