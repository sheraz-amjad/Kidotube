import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'KidoTube API',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    version: '2.2.0',
    childSafety: {
      strictMode: true,
      openSearchAllowed: false,
      externalUploadsAllowed: false,
      preModerationRequired: true,
    },
  });
}
