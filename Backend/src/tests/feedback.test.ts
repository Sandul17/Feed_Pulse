// backend/src/tests/feedback.test.ts
import request from 'supertest';
import app from '../index';
import Feedback from '../models/Feedback';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

// Mock the Gemini service
jest.mock('../services/gemini.service', () => ({
  processFeedbackWithAI: jest.fn().mockImplementation((feedback: any) => {
    feedback.ai_category = 'Feature Request';
    feedback.ai_sentiment = 'Positive';
    feedback.ai_priority = 8;
    feedback.ai_summary = 'User wants a new feature';
    feedback.ai_tags = ['Feature', 'UI'];
    feedback.ai_processed = true;
    return Promise.resolve(feedback.save());
  })
}));

describe('Feedback API', () => {
  let adminToken: string;
  let mongoServer: MongoMemoryServer;

  jest.setTimeout(30000);
  
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create a test admin user
    const admin = new User({
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    await admin.save();
    
    // Generate JWT token for the admin
    adminToken = jwt.sign(
      { userId: admin._id },
      process.env.JWT_SECRET || 'testsecret',
      { expiresIn: '24h' }
    );
  });
  
  afterAll(async () => {
    // Clean up test data
    await Feedback.deleteMany({});
    await User.deleteMany({});

    await mongoose.disconnect();
    await mongoServer.stop();
  });
  
  describe('POST /api/feedback', () => {
    it('should create a new feedback with valid data', async () => {
      const feedbackData = {
        title: 'Test Feedback',
        description: 'This is a test feedback with enough characters to meet the minimum requirement.',
        category: 'Feature Request',
        submitterName: 'Test User',
        submitterEmail: 'test@example.com'
      };
      
      const response = await request(app)
        .post('/api/feedback')
        .send(feedbackData)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(feedbackData.title);
      expect(response.body.data.description).toBe(feedbackData.description);
      expect(response.body.data.category).toBe(feedbackData.category);
    });
    
    it('should reject feedback with empty title', async () => {
      const feedbackData = {
        title: '',
        description: 'This is a test feedback with enough characters to meet the minimum requirement.',
        category: 'Feature Request'
      };
      
      const response = await request(app)
        .post('/api/feedback')
        .send(feedbackData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should reject feedback with short description', async () => {
      const feedbackData = {
        title: 'Test Feedback',
        description: 'Too short',
        category: 'Feature Request'
      };
      
      const response = await request(app)
        .post('/api/feedback')
        .send(feedbackData)
        .expect(400);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /api/feedback', () => {
    it('should return all feedback for authenticated admin', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.feedback)).toBe(true);
    });
    
    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/feedback')
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('PATCH /api/feedback/:id', () => {
    let feedbackId: string;
    
    beforeAll(async () => {
      // Create a test feedback
      const feedback = new Feedback({
        title: 'Test Feedback for Status Update',
        description: 'This is a test feedback with enough characters to meet the minimum requirement.',
        category: 'Bug'
      });
      await feedback.save();
      feedbackId = feedback._id.toString();
    });
    
    it('should update feedback status for authenticated admin', async () => {
      const response = await request(app)
        .patch(`/api/feedback/${feedbackId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'In Review' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('In Review');
    });
    
    it('should reject status update without authentication', async () => {
      const response = await request(app)
        .patch(`/api/feedback/${feedbackId}`)
        .send({ status: 'Resolved' })
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
  });
});