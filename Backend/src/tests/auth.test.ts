// backend/src/tests/auth.test.ts
import request from 'supertest';
import app from '../index';
import User from '../models/User';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

describe('Auth API', () => {
  let mongoServer: MongoMemoryServer;

  jest.setTimeout(30000);

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());

      // Create a test admin user
      const admin = new User({
        email: 'admin@test.com',
        password: 'password',
        role: 'admin'
      });
      await admin.save();
    });
    
    afterAll(async () => {
      // Clean up test data
      await User.deleteMany({});
      await mongoose.disconnect();
      await mongoServer.stop();
    });
    
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('admin@test.com');
      expect(response.body.data.user.role).toBe('admin');
    });
    
    it('should reject login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrongpassword'
        })
        .expect(401);
      
      expect(response.body.success).toBe(false);
    });
    
    it('should reject login for non-admin user', async () => {
      // Create a regular user
      const user = new User({
        email: 'user@test.com',
        password: 'password',
        role: 'user'
      });
      await user.save();
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@test.com',
          password: 'password'
        })
        .expect(403);
      
      expect(response.body.success).toBe(false);
    });
  });
});