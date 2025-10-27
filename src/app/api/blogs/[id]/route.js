import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

function getUserIdFromRequest(request) {
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

// GET single blog
export async function GET(request, { params }) {
  try {
    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(params.id)
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

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Error fetching blog' },
      { status: 500 }
    );
  }
}

// PUT update blog
export async function PUT(request, { params }) {
  try {
    const { title, content } = await request.json();
    const userId = getUserIdFromRequest(request);

    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(params.id)
      }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.authorId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id: parseInt(params.id)
      },
      data: {
        title,
        content
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

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Error updating blog' },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(request, { params }) {
  try {
    const userId = getUserIdFromRequest(request);

    const blog = await prisma.blog.findUnique({
      where: {
        id: parseInt(params.id)
      }
    });

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    if (blog.authorId !== parseInt(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.blog.delete({
      where: {
        id: parseInt(params.id)
      }
    });

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Error deleting blog' },
      { status: 500 }
    );
  }
}