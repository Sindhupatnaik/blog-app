import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export default function proxy(request) {
  // Check if token exists in cookies
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', decoded.userId);

    // Return response with userId in headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }
}

// Configure proxy to run on specific paths
export const config = {
  matcher: [
    '/api/blogs/:path*',  // Protect all blog routes
    '/create',           // Protect create page
    '/edit/:path*',      // Protect edit pages
  ]
};