import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Redirect back to home page, cart remains intact
    return NextResponse.redirect(new URL('/home/build', request.nextUrl.origin));
}
