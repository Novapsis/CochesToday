import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { checkUser } from '@/lib/checkUser';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get('redirect') || '/';

  // Prepare redirect response we can attach cookies to
  const finalUrl = `${origin}${redirectTo.startsWith('/') ? redirectTo : '/'}`;
  let response = NextResponse.redirect(finalUrl);

  if (code) {
    // Bind Supabase cookies to both request and response so session persists
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name, options) {
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    console.log('[auth/callback] code present, attempting session exchange');
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] Error exchanging code for session:', error?.message || error);
      return NextResponse.redirect(`${origin}/sign-in?error=auth_failed`);
    }

    if (data.user) {
      try {
        console.log('[auth/callback] session exchange ok, user id:', data.user.id);
        await checkUser(data.user);
        console.log('[auth/callback] checkUser completed for:', data.user.email);
      } catch (error) {
        console.error('[auth/callback] Error creating user in database:', error?.message || error);
      }
    }
  }

  // Return the redirect response with cookies attached
  return response;
}
