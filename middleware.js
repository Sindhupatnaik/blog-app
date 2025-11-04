import { ensureDatabaseInitialized } from './lib/db-init.js';

// Initialize database on server startup
ensureDatabaseInitialized().catch(err => {
  console.error('[MIDDLEWARE] Failed to initialize database:', err);
});

export function middleware(request) {
  // Middleware runs on every request - database initialization happens once on startup
  return;
}

export const config = {
  matcher: '/api/:path*',
};
