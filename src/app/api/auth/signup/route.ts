import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, pin } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }
    const cleanPin = pin && pin.length === 4 ? pin : '1234';

    const parent = db.createParent(email, password, cleanPin);
    return NextResponse.json({
      success: true,
      message: 'Parent account created successfully.',
      parent: {
        id: parent.id,
        email: parent.email,
        pin: parent.pin,
        children: parent.children,
      },
    }, { status: 201 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Signup failed';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
