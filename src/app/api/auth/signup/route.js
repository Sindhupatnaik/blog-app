import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../../../../db/connection.js';
import { ensureDatabaseInitialized } from '../../../../../lib/db-init.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request) {
  await ensureDatabaseInitialized();
  const connection = await pool.getConnection();
  try {
    const { username, email, password } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingEmail] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const [existingUsername] = await connection.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
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

    return NextResponse.json({
      token,
      user: {
        id: userId,
        username,
        email
      }
    }, { status: 201 });
  } catch (error) {
    console.error('[AUTH] Signup error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
