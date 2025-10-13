import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const items = await db.carSearchRequest.findMany({
      where: { userId: user.id },
      include: { matches: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    console.error('GET /api/search-requests', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const body = await request.json();
    const { filters, description, tier = 'Básico', status } = body || {};
    if (!filters || typeof filters !== 'object') {
      return NextResponse.json({ error: 'filters es requerido (JSON)' }, { status: 400 });
    }

    const item = await db.carSearchRequest.create({
      data: {
        userId: user.id,
        filters,
        description: description || null,
        tier,
        status: status || 'pendiente',
      },
    });

    return NextResponse.json({ success: true, data: { id: item.id } }, { status: 201 });
  } catch (e) {
    console.error('POST /api/search-requests', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
