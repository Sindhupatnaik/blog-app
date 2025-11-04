import express from 'express';
import { verifyToken } from './auth.js';
import pool from '../db/connection.js';

const router = express.Router();

// Get all blogs from database
router.get('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [blogs] = await connection.query(
      'SELECT * FROM blogs ORDER BY createdAt DESC'
    );
    console.log(`[BLOGS] Retrieved ${blogs.length} blogs from database`);
    res.json(blogs);
  } catch (error) {
    console.error('[BLOGS] Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  } finally {
    connection.release();
  }
});

// Get single blog from database
router.get('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [blogs] = await connection.query(
      'SELECT * FROM blogs WHERE id = ?',
      [req.params.id]
    );

    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    console.log(`[BLOGS] Retrieved blog: ${req.params.id}`);
    res.json(blogs[0]);
  } catch (error) {
    console.error('[BLOGS] Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  } finally {
    connection.release();
  }
});

// Create blog - save to database only
router.post('/', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { title, content, authorId, authorName } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({ error: 'Title, content, and authorId are required' });
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return res.status(400).json({ error: 'Title and content cannot be empty' });
    }

    // Verify that the authorId matches the logged-in user
    if (req.userId !== authorId) {
      return res.status(403).json({ error: 'Unauthorized' });
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
    
    res.status(201).json(newBlog[0]);
  } catch (error) {
    console.error('[BLOGS] Error creating blog:', error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid author ID' });
    }
    res.status(500).json({ error: 'Failed to create blog' });
  } finally {
    connection.release();
  }
});

// Update blog - update in database only
router.put('/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { title, content } = req.body;

    // First, get the blog from database to check ownership
    const [blogs] = await connection.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    
    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const blog = blogs[0];

    // Check if user owns this blog
    if (blog.authorId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized - you can only edit your own blogs' });
    }

    // Prepare update fields
    const updates = [];
    const values = [];

    if (title !== undefined) {
      if (title.trim().length === 0) {
        return res.status(400).json({ error: 'Title cannot be empty' });
      }
      updates.push('title = ?');
      values.push(title.trim());
    }

    if (content !== undefined) {
      if (content.trim().length === 0) {
        return res.status(400).json({ error: 'Content cannot be empty' });
      }
      updates.push('content = ?');
      values.push(content.trim());
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updatedAt = ?');
    values.push(new Date().toISOString().slice(0, 19).replace('T', ' '));
    values.push(req.params.id);

    // Update blog in database
    await connection.query(
      `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Retrieve updated blog from database
    const [updatedBlog] = await connection.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    
    console.log(`[BLOGS] Updated blog in database: ${req.params.id}`);
    res.json(updatedBlog[0]);
  } catch (error) {
    console.error('[BLOGS] Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  } finally {
    connection.release();
  }
});

// Delete blog - delete from database only
router.delete('/:id', verifyToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // First, get the blog from database to check ownership
    const [blogs] = await connection.query('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
    
    if (blogs.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const blog = blogs[0];

    // Check if user owns this blog
    if (blog.authorId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized - you can only delete your own blogs' });
    }

    // Delete blog from database
    await connection.query('DELETE FROM blogs WHERE id = ?', [req.params.id]);

    console.log(`[BLOGS] Deleted blog from database: ${req.params.id}`);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('[BLOGS] Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  } finally {
    connection.release();
  }
});

export default router;
