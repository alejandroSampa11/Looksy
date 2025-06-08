// tests/users.test.ts
import request from 'supertest';
import app from '../app'; 
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

jest.mock('../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('GET /api/health', () => {
  it('should return 200 OK with message "OK"', async () => {
    const res = await request(app).get('/api/users/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'OK' });
  });
});

describe("POST /api/users/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if user not found", async () => {
    // Mock User.findOne().select() to return null
    (User.findOne as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    const res = await request(app).post("/api/users/login").send({
      username: "nonexistentuser",
      password: "password123",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: "Username not found"
    });
  });

  it("should return 400 if username or password is missing", async () => {
    const testCases = [
      { username: "", password: "password123" },
      { username: "testuser", password: "" },
      { username: "", password: "" }
    ];

    for (const body of testCases) {
      const res = await request(app).post("/api/users/login").send(body);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: "Username and password are required"
      });
    }
  });

  it("should return 401 if password is incorrect", async () => {
    const mockUser = {
      _id: "123",
      username: "testuser",
      password: "hashedpassword",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      rol: "user"
    };

    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser)
    }));

    // Mock bcrypt.compare to return false
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await request(app).post("/api/users/login").send({
      username: "testuser",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      success: false,
      message: "Incorrect password"
    });
  });

  it("should return 200 with user data and token if login is successful", async () => {
    const mockUser = {
      _id: "123",
      username: "testuser",
      password: "hashedpassword",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      rol: "user"
    };

    // Mock User.findOne to return a user
    (User.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser)
    }));

    // Mock bcrypt.compare to return true
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Mock jwt.sign to return a token
    (jwt.sign as jest.Mock).mockReturnValue("mocktoken");

    const res = await request(app).post("/api/users/login").send({
      username: "testuser",
      password: "correctpassword",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: {
        id: "123",
        username: "testuser",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        rol: "user",
        fullName: "Test User"
      },
      token: "mocktoken"
    });
  });
});

import validator from 'validator';
// CREATE
// Mock the dependencies
jest.mock('validator');

describe('POST /api/users', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    rol: 'user',
    createdAt: new Date(),
    save: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for validator.isEmail
    (validator.isEmail as jest.Mock).mockReturnValue(true);
  });

  it('should create a new user and return 201 with user data', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User as unknown as jest.Mock).mockImplementation(() => mockUser);
    (jwt.sign as jest.Mock).mockReturnValue('mocktoken');

    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      rol: 'user'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      message: 'User created successfully',
      user: {
        id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        firstName: mockUser.firstName,
        createdAt: mockUser.createdAt.toISOString()
      },
      token: 'mocktoken'
    });
    expect(User).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      rol: 'user'
    });
    expect(mockUser.save).toHaveBeenCalled();
  });

  it('should return 400 if required fields are missing', async () => {
    const testCases = [
      { email: 'test@example.com', password: 'pass', firstName: 'Test', lastName: 'User' }, // missing username
      { username: 'test', password: 'pass', firstName: 'Test', lastName: 'User' }, // missing email
      { username: 'test', email: 'test@example.com', firstName: 'Test', lastName: 'User' }, // missing password
      { username: 'test', email: 'test@example.com', password: 'pass', lastName: 'User' }, // missing firstName
      { username: 'test', email: 'test@example.com', password: 'pass', firstName: 'Test' } // missing lastName
    ];

    for (const body of testCases) {
      const res = await request(app).post('/api/users').send(body);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('All fields are required');
    }
  });

  it('should return 400 for invalid email format', async () => {
    (validator.isEmail as jest.Mock).mockReturnValue(false);

    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      rol: 'user'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid email format');
  });

  it('should return 400 for password too short', async () => {
    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'short',
      firstName: 'Test',
      lastName: 'User',
      rol: 'user'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Password must be at lest 8 characters');
  });

  it('should return 409 if username is already in use', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      username: 'testuser',
      email: 'other@example.com'
    });

    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      rol: 'user'
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Username is already in use');
  });

  it('should return 409 if email is already in use', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      username: 'otheruser',
      email: 'test@example.com'
    });

    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      rol: 'user'
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Field is already in use');
  });

  it('should return 500 for server errors', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

    const res = await request(app).post('/api/users').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      rol: 'user'
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toContain('Server Error');
  });
});