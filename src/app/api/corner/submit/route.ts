import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { childNickname, childAvatar, artworkUrl, title, category } = body;

    if (!childNickname || typeof childNickname !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Nickname is required.' },
        { status: 400 }
      );
    }

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Title is required.' },
        { status: 400 }
      );
    }

    // Safety checks against PII (emails, phone numbers, external URLs)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const fullText = `${childNickname} ${title}`;
    if (emailRegex.test(fullText) || phoneRegex.test(fullText) || urlRegex.test(title)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Safety violation: Content cannot contain emails, phone numbers, or links.',
        },
        { status: 400 }
      );
    }

    // Submit for pre-moderation
    const newPost = db.submitCornerPost({
      childNickname: childNickname.slice(0, 24),
      childAvatar: childAvatar || '🎨',
      artworkUrl: artworkUrl || '',
      title: title.slice(0, 80),
      category: category || 'Artwork',
    });

    return NextResponse.json({
      success: true,
      message: 'Your artwork has been submitted for review! It will appear once approved by parents and moderators. 🎨🌟',
      post: newPost,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Submission failed.' },
      { status: 500 }
    );
  }
}
