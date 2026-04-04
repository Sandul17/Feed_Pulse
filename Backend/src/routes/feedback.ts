import express from 'express';
import { body } from 'express-validator';
import { submitFeedback, getAllFeedback, updateFeedbackStatus, reAnalyzeFeedback } from '../controllers/feedbackController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { feedbackLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Public route
router.post('/', feedbackLimiter, [
  body('title').notEmpty().withMessage('Title is required.'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),
  body('category').isIn(['Bug', 'Feature Request', 'Improvement', 'Other']).withMessage('Invalid category.')
], submitFeedback);

// Protected admin routes
router.get('/', authenticate, authorizeAdmin, getAllFeedback);
router.patch('/:id', authenticate, authorizeAdmin, updateFeedbackStatus);
router.post('/:id/re-analyze', authenticate, authorizeAdmin, reAnalyzeFeedback);

export default router;