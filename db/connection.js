import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Parse DATABASE_URL or use individual env variables
let pool;

if (process.env.DATABASE_URL) {
  // Parse connection string: mysql://user:password@host:port/database
  const url = new URL(process.env.DATABASE_URL.replace('mysql://', 'http://'));
  pool = mysql.createPool({
    host: url.hostname,
    port: url.port || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.substring(1), // Remove leading '/'
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blog_app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Test connection and create database if needed
export async function testConnection() {
  try {
    // First, connect without database to create it if needed
    let dbName;
    let adminPool;
    
    if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL.replace('mysql://', 'http://'));
      dbName = url.pathname.substring(1);
      adminPool = mysql.createPool({
        host: url.hostname,
        port: url.port || 3306,
        user: url.username,
        password: url.password,
        waitForConnections: true,
        connectionLimit: 10
      });
    } else {
      dbName = process.env.DB_NAME || 'blog_app';
      adminPool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        waitForConnections: true,
        connectionLimit: 10
      });
    }
    
    // Create database if it doesn't exist
    const adminConn = await adminPool.getConnection();
    await adminConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    adminConn.release();
    await adminPool.end();
    
    // Now test the actual pool connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('[DB] Database connection successful');
    return true;
  } catch (error) {
    console.error('[DB] Database connection failed:', error.message);
    throw error;
  }
}

// Initialize database schema
export async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL,
        INDEX idx_email (email),
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create blogs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        content LONGTEXT NOT NULL,
        authorId VARCHAR(255) NOT NULL,
        authorName VARCHAR(255) NOT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        INDEX idx_authorId (authorId),
        INDEX idx_createdAt (createdAt),
        FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('[DB] Database schema initialized');
  } catch (error) {
    console.error('[DB] Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
