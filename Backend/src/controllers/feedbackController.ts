import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Feedback from '../models/Feedback';
import { body, validationResult } from 'express-validator';
import { processFeedbackWithAI } from '../services/gemini.service';

export const submitFeedback = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Invalid input', errors: errors.array() });
  }

  try {
    const feedback = new Feedback(req.body);
    await feedback.save();

    // Trigger AI processing (non-blocking)
    processFeedbackWithAI(feedback).catch(err => console.error('AI processing failed:', err));

    res.status(201).json({ success: true, data: feedback });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getAllFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const feedback = await Feedback.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Feedback.countDocuments(filter);

    res.json({
      success: true,
      data: {
        feedback,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateFeedbackStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    try {
        const feedback = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
        if (!feedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found.' });
        }

        res.json({ success: true, data: feedback });
    } catch (error: any) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const reAnalyzeFeedback = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found.' });
    }
    
    feedback.ai_processed = false; // Reset to trigger re-analysis
    const updatedFeedback = await processFeedbackWithAI(feedback);

    res.json({ success: true, data: updatedFeedback });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};