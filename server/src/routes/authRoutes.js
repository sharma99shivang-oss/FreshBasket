import { Router } from 'express';
import { body } from 'express-validator';
import { forgotPassword, getCurrentUser, login, logout, refresh, register, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();
const email = body('email').isEmail().withMessage('Enter a valid email address').normalizeEmail();
const password = body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters');
router.post('/register', [body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'), email, body('phone').trim().isLength({ min: 7, max: 20 }).withMessage('Enter a valid phone number'), password, body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'), body('address').optional().trim().isLength({ max: 300 }).withMessage('Address is too long')], validateRequest, register);
router.post('/login', [email, password], validateRequest, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', [email], validateRequest, forgotPassword);
router.post('/reset-password/:token', [password, body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')], validateRequest, resetPassword);
router.get('/me', protect, getCurrentUser);
export default router;
