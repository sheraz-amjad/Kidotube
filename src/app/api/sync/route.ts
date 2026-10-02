import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceToken = searchParams.get('deviceToken');
    const parentId = searchParams.get('parentId');
    const childId = searchParams.get('childId');

    let resolvedParentId = parentId;
    let resolvedChildId = childId;

    if (deviceToken) {
      const session = db.getDeviceSession(deviceToken);
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired device token.' },
          { status: 401 }
        );
      }
      resolvedParentId = session.parentId;
      resolvedChildId = session.childProfileId;
    }

    if (!resolvedParentId) {
      return NextResponse.json(
        { success: false, error: 'parentId or deviceToken required for sync.' },
        { status: 400 }
      );
    }

    const settings = db.getChildSettings(resolvedParentId, resolvedChildId || '');
    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Settings not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      child: settings.child,
      parentPin: settings.parentPin,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Sync failed.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { deviceToken, parentId, childId, updates } = body;

    let targetParentId = parentId;
    let targetChildId = childId;

    if (deviceToken) {
      const session = db.getDeviceSession(deviceToken);
      if (!session) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired device token.' },
          { status: 401 }
        );
      }
      targetParentId = session.parentId;
      targetChildId = session.childProfileId;
    }

    if (!targetParentId || !targetChildId) {
      return NextResponse.json(
        { success: false, error: 'Target parentId and childId or deviceToken required.' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Updates object is required.' },
        { status: 400 }
      );
    }

    const updatedChild = db.updateChildSettings(targetParentId, targetChildId, updates);
    if (!updatedChild) {
      return NextResponse.json(
        { success: false, error: 'Failed to update child profile.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      child: updatedChild,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Sync update failed.' },
      { status: 500 }
    );
  }
}
