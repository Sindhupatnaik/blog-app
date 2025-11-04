import { NextResponse } from 'next/server';
import pool from '../../../../../db/connection.js';
import { verifyToken } from '../../auth/verify/route.js';
import { ensureDatabaseInitialized } from '../../../../../lib/db-init.js';

// Get single blog from database
export async function GET(request, { params }) {
  await ensureDatabaseInitialized();
  const connection = await pool.getConnection();
  try {
    const { id } = await params;
    const [blogs] = await connection.query(
      'SELECT * FROM blogs WHERE id = ?',
      [id]
    );

    if (blogs.length === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    console.log(`[BLOGS] Retrieved blog: ${id}`);
    return NextResponse.json(blogs[0]);
  } catch (error) {
    console.error('[BLOGS] Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

// Update blog - update in database only
export async function PUT(request, { params }) {
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

    const { id } = await params;
    const { title, content } = await request.json();

    // First, get the blog from database to check ownership
    const [blogs] = await connection.query('SELECT * FROM blogs WHERE id = ?', [id]);
    
    if (blogs.length === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const blog = blogs[0];

    // Check if user owns this blog
    if (blog.authorId !== authResult.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only edit your own blogs' },
        { status: 403 }
      );
    }

    // Prepare update fields
    const updates = [];
    const values = [];

    if (title !== undefined) {
      if (title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        );
      }
      updates.push('title = ?');
      values.push(title.trim());
    }

    if (content !== undefined) {
      if (content.trim().length === 0) {
        return NextResponse.json(
          { error: 'Content cannot be empty' },
          { status: 400 }
        );
      }
      updates.push('content = ?');
      values.push(content.trim());
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString().slice(0, 19).replace('T', ' '));
    values.push(id);

    // Update blog in database
    await connection.query(
      `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Retrieve updated blog from database
    const [updatedBlog] = await connection.query('SELECT * FROM blogs WHERE id = ?', [id]);
    
    console.log(`[BLOGS] Updated blog in database: ${id}`);
    return NextResponse.json(updatedBlog[0]);
  } catch (error) {
    console.error('[BLOGS] Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

// Delete blog - delete from database only
export async function DELETE(request, { params }) {
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

    const { id } = await params;

    // First, get the blog from database to check ownership
    const [blogs] = await connection.query('SELECT * FROM blogs WHERE id = ?', [id]);
    
    if (blogs.length === 0) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const blog = blogs[0];

    // Check if user owns this blog
    if (blog.authorId !== authResult.userId) {
      return NextResponse.json(
        { error: 'Unauthorized - you can only delete your own blogs' },
        { status: 403 }
      );
    }

    // Delete blog from database
    await connection.query('DELETE FROM blogs WHERE id = ?', [id]);

    console.log(`[BLOGS] Deleted blog from database: ${id}`);
    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('[BLOGS] Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
