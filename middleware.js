import { NextResponse } from 'next/server';

export function middleware(request) {
  return new NextResponse(
    '🚧 Site temporarily unavailable. Please check back later.',
    { status: 503 }
  );
}
