import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('query') || searchParams.get('q') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '200', 10), 500);

    const where = q
      ? { name: { contains: q, mode: 'insensitive' } }
      : {};

    const items = await db.carBrand.findMany({
      where,
      orderBy: { name: 'asc' },
      take: limit,
      select: { id: true, name: true },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    console.error('GET /api/brands', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const body = await request.json();
    const name = (body?.name || '').toString().trim();
    if (!name) return NextResponse.json({ error: 'name requerido' }, { status: 400 });

    const brand = await db.carBrand.upsert({
      where: { name },
      update: {},
      create: { name, createdByUserId: user.id },
      select: { id: true, name: true },
    });

    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (e) {
    console.error('POST /api/brands', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
