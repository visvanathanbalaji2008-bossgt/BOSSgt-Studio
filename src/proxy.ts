import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  
  // Only /dashboard is protected; /editor allows both local anonymous and cloud workspaces
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // If Supabase is not configured or is a placeholder, do not block local/demo development
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('dummy') || supabaseKey === 'dummy') {
    return NextResponse.next();
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user }
    } = await supabase.auth.getUser();

    const hasDemoCookie = request.cookies.has('bossgt_session') || request.cookies.has('bossgt_demo_user');

    if (!user && !hasDemoCookie && isProtectedRoute) {
      const redirectUrl = new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    const hasDemoCookie = request.cookies.has('bossgt_session') || request.cookies.has('bossgt_demo_user');
    if (!hasDemoCookie && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/editor/:path*'],
};
