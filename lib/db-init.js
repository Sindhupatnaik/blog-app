import { initializeDatabase, testConnection } from '../db/connection.js';

let initialized = false;
let initPromise = null;

export async function ensureDatabaseInitialized() {
  if (initialized) {
    return;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      console.log('[DB-INIT] Initializing database connection...');
      await testConnection();
      await initializeDatabase();
      console.log('[DB-INIT] Database ready - all data stored in database only');
      initialized = true;
    } catch (error) {
      console.error('[DB-INIT] Database initialization failed:', error);
      throw error;
    }
  })();

  return initPromise;
}
