
//export { default } from 'next-auth/middleware';
import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        if (
            req.nextUrl.pathname.startsWith("/admin") &&
            req.nextauth.token?.role !== 'admin'
        ) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ req, token }) => token?.role !== undefined && ['admin', 'client'].includes(token.role)
        },
    }
)

export const config = { matcher: ["/checkout/address", "/admin/:path*"] }