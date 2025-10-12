import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { db } from '@/lib/prisma';

export async function PATCH(request) {
  // Bind response to allow Supabase cookie writes if needed
  let response = NextResponse.json({ ok: true });

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

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, avatarUrl, phone } = body || {};

  try {
    const updated = await db.userProfile.update({
      where: { userId: user.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
        ...(phone !== undefined ? { phone } : {}),
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (err) {
    // If profile doesn't exist, create it
    if (err?.code === 'P2025') {
      const created = await db.userProfile.create({
        data: {
          userId: user.id,
          name: name || null,
          avatarUrl: avatarUrl || null,
          phone: phone || null,
        },
      });
      return NextResponse.json({ profile: created });
    }

    return NextResponse.json({ error: err.message || 'Error updating profile' }, { status: 500 });
  }
}
