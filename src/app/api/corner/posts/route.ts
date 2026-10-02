import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnapproved = searchParams.get('all') === 'true';

    const posts = includeUnapproved 
      ? db.getAllCornerPosts() 
      : db.getApprovedCornerPosts();

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch posts.' },
      { status: 500 }
    );
  }
}
