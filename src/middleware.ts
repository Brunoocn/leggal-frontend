import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { fetchWrapper } from './utils/fetchWrapper';


export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('LEGGAL::TOKEN');
  const signInURL = new URL('/auth/signin', request.url);
  const managerURL = new URL('/', request.url);

  if (request.nextUrl.pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  if (!token) {
    if (request.nextUrl.pathname === '/auth/signin' ||
      request.nextUrl.pathname === "/auth/signup") {
      return NextResponse.next();
    }

    return NextResponse.redirect(signInURL);
  }

  if (request.nextUrl.pathname === '/auth/signin') {
    return NextResponse.redirect(managerURL);
  }



  //Validate token
  try {
    await fetchWrapper('authentication/token-valid', {
      headers: { Authorization: `Bearer ${token.value}` },
    });
  } catch (error) {
    console.error('Error: ', error);
    const response = NextResponse.redirect(signInURL);
    response.cookies.delete('LEGGAL::TOKEN');
    return response;
  }
}
