import express from 'express';
import { body } from 'express-validator';
import { createAdmin, login } from '../controllers/authController';

const router = express.Router();

router.post('/create-admin', [
  body('email').isEmail().withMessage('Please provide a valid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
], createAdmin);

router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email.'),
  body('password').notEmpty().withMessage('Password is required.')
], login);

export default router;