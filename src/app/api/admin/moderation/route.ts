import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { postId, action } = body;

    if (!postId || !action) {
      return NextResponse.json(
        { success: false, error: 'postId and action are required.' },
        { status: 400 }
      );
    }

    if (!['approve', 'feature', 'delete'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid moderation action. Allowed: approve, feature, delete' },
        { status: 400 }
      );
    }

    const success = db.moderatePost(postId, action);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Post not found or could not be moderated.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Post ${postId} successfully updated with action: ${action}`,
      posts: db.getAllCornerPosts(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Moderation action failed.' },
      { status: 500 }
    );
  }
}
