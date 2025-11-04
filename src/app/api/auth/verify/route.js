import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '../../../../../db/connection.js';
import { ensureDatabaseInitialized } from '../../../../../lib/db-init.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request) {
  await ensureDatabaseInitialized();
  const connection = await pool.getConnection();
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided', valid: false },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user in database
    const [users] = await connection.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found', valid: false },
        { status: 401 }
      );
    }

    const user = users[0];
    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token', valid: false },
      { status: 401 }
    );
  } finally {
    connection.release();
  }
}

// Export verifyToken function for use in blog routes
export async function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return { error: 'No token provided', userId: null };
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.userId, userEmail: decoded.email, error: null };
  } catch (error) {
    return { error: 'Invalid or expired token', userId: null };
  }
}
