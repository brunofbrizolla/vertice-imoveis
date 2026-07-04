import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization');

  if (authHeader) {
    const base64 = authHeader.replace('Basic ', '');
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    const [user, pass] = decoded.split(':');

    if (
      user === process.env.ADMIN_USER &&
      pass === process.env.ADMIN_PASS
    ) {
      return NextResponse.next();
    }
  }

  return new NextResponse('Acesso não autorizado', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Vértice"',
    },
  });
}

export const config = {
  matcher: '/admin/:path*',
};
