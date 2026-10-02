import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const parent = db.findParentByEmail(email);
    if (!parent || parent.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Mock session token
    const token = `tok_${parent.id}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      token,
      parent: {
        id: parent.id,
        email: parent.email,
        pin: parent.pin,
        children: parent.children,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
