import { NextResponse } from 'next/server';
import pool from '../../../../db/connection.js';
import { verifyToken } from '../auth/verify/route.js';
import { ensureDatabaseInitialized } from '../../../../lib/db-init.js';

// Get all blogs from database
export async function GET() {
  await ensureDatabaseInitialized();
  const connection = await pool.getConnection();
  try {
    const [blogs] = await connection.query(
      'SELECT * FROM blogs ORDER BY createdAt DESC'
    );
    console.log(`[BLOGS] Retrieved ${blogs.length} blogs from database`);
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('[BLOGS] Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

// Create blog - save to database only
export async function POST(request) {
  await ensureDatabaseInitialized();
  const connection = await pool.getConnection();
  try {
    // Verify token
    const authResult = await verifyToken(request);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: 401 }
      );
    }

    const { title, content, authorId, authorName } = await request.json();

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: 'Title, content, and authorId are required' },
        { status: 400 }
      );
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title and content cannot be empty' },
        { status: 400 }
      );
    }

    // Verify that the authorId matches the logged-in user
    if (authResult.userId !== authorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const blogId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const updatedAt = createdAt;

    // Insert new blog into database
    await connection.query(
      'INSERT INTO blogs (id, title, content, authorId, authorName, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [blogId, title.trim(), content.trim(), authorId, authorName || 'Anonymous', createdAt, updatedAt]
    );

    // Verify insertion and retrieve from database
    const [newBlog] = await connection.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (newBlog.length === 0) {
      throw new Error('Failed to create blog');
    }

    console.log(`[BLOGS] Created blog in database: ${title} (${blogId}) by ${authorName}`);
    
    return NextResponse.json(newBlog[0], { status: 201 });
  } catch (error) {
    console.error('[BLOGS] Error creating blog:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return NextResponse.json(
        { error: 'Invalid author ID' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
