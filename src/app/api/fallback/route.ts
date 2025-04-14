import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 클라이언트에게 루트 페이지로 리디렉션
  return NextResponse.redirect(new URL('/', request.url));
}

export async function POST(request: NextRequest) {
  // 클라이언트에게 루트 페이지로 리디렉션
  return NextResponse.redirect(new URL('/', request.url));
} 