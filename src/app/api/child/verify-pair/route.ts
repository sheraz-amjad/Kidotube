import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Pairing code is required.' },
        { status: 400 }
      );
    }

    const deviceSession = db.verifyPairingCode(code);
    const settings = db.getChildSettings(deviceSession.parentId, deviceSession.childProfileId);

    return NextResponse.json({
      success: true,
      message: 'Device successfully paired to parent account!',
      deviceToken: deviceSession.deviceToken,
      parentId: deviceSession.parentId,
      childProfileId: deviceSession.childProfileId,
      settings: settings?.child,
      parentPin: settings?.parentPin,
      syncedAt: settings?.syncedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Pairing failed. Please try again.' },
      { status: 400 }
    );
  }
}
