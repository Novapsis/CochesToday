import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const body = await request.json();
    const { status, featured } = body || {};

    const updateData = {};
    if (typeof featured === 'boolean') updateData.featured = featured;
    if (typeof status === 'string') {
      const normalized = status.toLowerCase();
      const statusMap = {
        activo: 'activo',
        available: 'activo',
        disponible: 'activo',
        reservado: 'reservado',
        reservada: 'reservado',
        vendido: 'vendido',
        sold: 'vendido',
        unavailable: 'reservado',
      };
      if (!statusMap[normalized]) {
        return NextResponse.json({ error: 'Estado no válido' }, { status: 400 });
      }
      updateData.status = statusMap[normalized];
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Sin cambios' }, { status: 400 });
    }

    // Ensure ownership
    const car = await db.car.findUnique({ where: { id }, select: { ownerId: true } });
    if (!car) return NextResponse.json({ error: 'Coche no encontrado' }, { status: 404 });
    if (car.ownerId !== user.id) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

    await db.car.update({ where: { id }, data: updateData });

    revalidatePath('/');
    revalidatePath('/cars');

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PATCH /api/cars/[id] error', e);
    return NextResponse.json({ error: e.message || 'Error actualizando coche' }, { status: 500 });
  }
}
