import { Request, Response } from "express";
import User from "../models/user";
import validator from "validator";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

export const getHealth = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "OK" });
  } catch (err: any) {
    res.status(500).json({ message: "Sever Error" });
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate a user with username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *                 example: johndoe123
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     username:
 *                       type: string
 *                       example: johndoe123
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     rol:
 *                       type: string
 *                       example: user
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Username and password are required
 *       401:
 *         description: Authentication failed - Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Incorrect password
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Username not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error while fetching user
 *                 error:
 *                   type: string
 *                   example: Error details (only in development mode)
 */
export const getByUsername = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({ username }).select('+password');
    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      rol: user.rol,
      fullName: `${user.firstName} ${user.lastName}`,
    };

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        rol: user.rol,
        firstName: user.firstName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      data: userData,
      token,
    });
  } catch (err: any) {
    console.error(`Error fetching user ${req.params.username}:`, err);

    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid username format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user with the provided information
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - rol
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *                 example: johndoe123
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Unique email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User password (minimum 8 characters)
 *                 example: securePassword123
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *                 example: Doe
 *               rol:
 *                 type: string
 *                 description: User role (e.g., admin, user)
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     username:
 *                       type: string
 *                       example: johndoe123
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-06-22T10:30:40.000Z
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - Password must be at least 8 characters
 *                     - Invalid email format
 *       409:
 *         description: Conflict - Username or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username is already in use
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server Error
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, rol } = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at lest 8 characters" });
    }

    const existringUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existringUser) {
      const conflictParam =
        existringUser.username === username ? "Username" : "Field";
      return res
        .status(409)
        .json({ message: `${conflictParam} is already in use` });
    }

    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      rol,
    });
    await newUser.save();

    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      firstName: newUser.firstName,
    };

    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        rol: newUser.rol,
        firstName: newUser.firstName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    console.log(`User created: ${username}`);
    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
      token,
    });
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((val: any) => val.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        message: `${field} is already in use`,
      });
    }
    res.status(500).json({ message: `Server Error ${err}` });
  }
};
