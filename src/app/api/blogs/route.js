import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function getUserIdFromRequest(request) {
  // support user-id header (from middleware) or Authorization: Bearer <token>
  const userIdHeader = request.headers.get('user-id');
  if (userIdHeader) return parseInt(userIdHeader);

  const auth = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!auth) return null;
  const parts = auth.split(' ');
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : parts[0];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

// GET all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Error fetching blogs' },
      { status: 500 }
    );
  }
}

// POST new blog
export async function POST(request) {
  try {
    const { title, content } = await request.json();
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        authorId: parseInt(userId)
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Error creating blog' },
      { status: 500 }
    );
  }
}