import { Request, Response } from 'express';
import User from '../models/user';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export const getHealth = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'OK' });
  } catch (err: any) {
    res.status(500).json({ message: 'Sever Error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, rol } = req.body;

    if (!username || !email || !password || !rol || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at lest 8 characters' });
    }

    const existringUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existringUser) {
      const conflictParam = existringUser.username === username ? 'Username' : 'Field';
      return res.status(409).json({ message: `${conflictParam} is already in use` });
    }

    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      rol
    });

    await newUser.save();

    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt
    }

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((val: any) => val.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        message: `${field} is already in use`
      });
    }
    res.status(500).json({ message: 'Server Error' })
  }
};

export const getByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username parameter is required'
      });
    }

    const user = await User.findOne({ username })
      .select('-password -__v -__id')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Username not found'
      })
    }

    const userData = {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`
    };

    return res.status(200).json({
      success: true,
      data: userData
    });
  } catch (err: any) {
    console.error(`Error fetching user ${req.params.username}:`, err);

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid username format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching user',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
