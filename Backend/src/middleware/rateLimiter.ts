import rateLimit from 'express-rate-limit';

export const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 feedback submissions per windowMs
  message: { success: false, message: 'Too many feedback submissions, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});