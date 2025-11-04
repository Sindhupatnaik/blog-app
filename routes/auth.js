import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/connection.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Signup
router.post('/signup', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const [existingEmail] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const [existingUsername] = await connection.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert new user
    await connection.query(
      'INSERT INTO users (id, username, email, password, createdAt) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, hashedPassword, createdAt]
    );

    // Verify insertion
    const [newUser] = await connection.query('SELECT id, username, email FROM users WHERE id = ?', [userId]);
    if (newUser.length === 0) {
      throw new Error('Failed to create user');
    }

    console.log(`[AUTH] Created user: ${username} (${userId})`);

    // Generate token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        username,
        email
      }
    });
  } catch (error) {
    console.error('[AUTH] Signup error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
});

// Login
router.post('/login', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email from database
    const [users] = await connection.query(
      'SELECT id, username, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    console.log(`[AUTH] User logged in: ${user.username} (${user.id})`);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
});

// Verify token endpoint
router.get('/verify', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided', valid: false });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user in database
    const [users] = await connection.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found', valid: false });
    }

    const user = users[0];
    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token', valid: false });
  } finally {
    connection.release();
  }
});

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default router;
