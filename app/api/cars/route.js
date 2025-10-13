import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const form = await request.formData();

    const brandId = form.get('brandId');
    const modelId = form.get('modelId');
    const brandName = (form.get('brandName') || '').toString().trim();
    const modelName = (form.get('modelName') || '').toString().trim();
    const title = form.get('title');
    const price = parseFloat(form.get('price'));
    const year = parseInt(form.get('year'));
    const mileage = parseInt(form.get('mileage'));
    const location = form.get('location');
    const color = form.get('color') || null;
    const fuelType = form.get('fuelType') || null;
    const transmission = form.get('transmission') || null;
    const bodyType = form.get('bodyType') || null;
    const seats = form.get('seats') ? parseInt(form.get('seats')) : null;
    const description = form.get('description');
    const featuredRaw = form.get('featured');
    const featured = typeof featuredRaw === 'string' ? (featuredRaw === 'true' || featuredRaw === 'on' || featuredRaw === '1') : false;

    // Resolve brand/model IDs (support manual brand/model creation)
    let resolvedBrandId = brandId;
    if (!resolvedBrandId && brandName) {
      const existingBrand = await db.carBrand.findUnique({ where: { name: brandName } });
      const brand = existingBrand || await db.carBrand.create({ data: { name: brandName, createdByUserId: user.id } });
      resolvedBrandId = brand.id;
    }

    let resolvedModelId = modelId;
    if (!resolvedModelId && modelName) {
      if (!resolvedBrandId) {
        return NextResponse.json({ error: 'Debes especificar una marca para crear un modelo' }, { status: 400 });
      }
      const existingModel = await db.carModel.findFirst({ where: { brandId: resolvedBrandId, name: modelName } });
      const model = existingModel || await db.carModel.create({ data: { brandId: resolvedBrandId, name: modelName, createdByUserId: user.id } });
      resolvedModelId = model.id;
    }

    if (!resolvedBrandId || !resolvedModelId || !title || isNaN(price) || isNaN(year) || isNaN(mileage) || !location || !description) {
      return NextResponse.json({ error: 'Campos obligatorios incompletos' }, { status: 400 });
    }

    // Create Car first
    const car = await db.car.create({
      data: {
        ownerId: user.id,
        brandId: resolvedBrandId,
        modelId: resolvedModelId,
        title,
        description,
        price,
        year,
        mileage,
        location,
        color,
        fuelType,
        transmission,
        bodyType,
        seats,
        status: 'activo',
        featured,
      },
      select: { id: true },
    });

    // Upload images
    const files = form.getAll('images');
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Debes subir al menos una imagen' }, { status: 400 });
    }

    const uploadedUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (typeof file === 'string') continue;
      if (!file?.size) continue;
      if (!file.type.startsWith('image/')) continue;

      const ext = file.name?.split('.')?.pop() || 'jpg';
      const path = `${user.id}/${car.id}/image-${Date.now()}-${i}.${ext}`;

      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: pub } = supabase.storage.from('car-images').getPublicUrl(data.path);
      uploadedUrls.push(pub.publicUrl);

      await db.carImage.create({ data: { carId: car.id, url: pub.publicUrl } });
    }

    // Revalidate listings and homepage
    revalidatePath('/cars');
    revalidatePath('/');

    return NextResponse.json({ id: car.id, images: uploadedUrls }, { status: 201 });
  } catch (err) {
    console.error('Error creating car:', err);
    return NextResponse.json({ error: err.message || 'Error al crear el coche' }, { status: 500 });
  }
}
