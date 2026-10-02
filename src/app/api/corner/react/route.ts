import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { postId, sticker } = body;

    if (!postId || !sticker) {
      return NextResponse.json(
        { success: false, error: 'postId and sticker are required.' },
        { status: 400 }
      );
    }

    const allowedStickers = ['🎨', '🌟', '👏', '💖'];
    if (!allowedStickers.includes(sticker)) {
      return NextResponse.json(
        { success: false, error: `Invalid sticker reaction. Allowed: ${allowedStickers.join(', ')}` },
        { status: 400 }
      );
    }

    const success = db.reactToPost(postId, sticker);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Post not found or reaction failed.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reaction added!',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add reaction.' },
      { status: 500 }
    );
  }
}
