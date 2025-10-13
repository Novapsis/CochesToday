import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId') || '';
    const q = (searchParams.get('query') || searchParams.get('q') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '300', 10), 1000);

    const where = {
      ...(brandId ? { brandId } : {}),
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
    };

    const items = await db.carModel.findMany({
      where,
      orderBy: { name: 'asc' },
      take: limit,
      select: { id: true, name: true, brandId: true },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    console.error('GET /api/models', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const body = await request.json();
    const brandId = (body?.brandId || '').toString();
    const name = (body?.name || '').toString().trim();
    if (!brandId) return NextResponse.json({ error: 'brandId requerido' }, { status: 400 });
    if (!name) return NextResponse.json({ error: 'name requerido' }, { status: 400 });

    const model = await db.carModel.upsert({
      where: { brandId_name: { brandId, name } },
      update: {},
      create: { brandId, name, createdByUserId: user.id },
      select: { id: true, name: true, brandId: true },
    });

    return NextResponse.json({ success: true, data: model }, { status: 201 });
  } catch (e) {
    console.error('POST /api/models', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
