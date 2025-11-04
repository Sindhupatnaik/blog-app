import { NextResponse } from 'next/server';
import pool from '../../../../db/connection.js';
import { ensureDatabaseInitialized } from '../../../../lib/db-init.js';

export async function GET() {
  await ensureDatabaseInitialized();
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT 1 as test');
    connection.release();
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Server is running',
      database: 'connected',
      storage: 'database only'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Server is running but database connection failed',
      error: error.message
    }, { status: 500 });
  }
}
