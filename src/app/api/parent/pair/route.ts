import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { parentId, childProfileId } = body;

    const parent = parentId ? db.findParentById(parentId) : db.findParentByEmail('parent@kidotube.com');
    if (!parent) {
      return NextResponse.json({ error: 'Parent account not found.' }, { status: 404 });
    }

    const session = db.createPairingSession(parent.id, childProfileId);

    // QR data format: kidotube://pair?code=KIDO-XXXX
    const qrData = `kidotube://pair?code=${session.code}`;

    return NextResponse.json({
      success: true,
      pairingCode: session.code,
      expiresAt: session.expiresAt,
      session: {
        code: session.code,
        expiresAt: session.expiresAt,
      },
      qrData,
      instructions: 'Enter this 6-digit code on the child device or scan the QR code to link.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate pairing code';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
