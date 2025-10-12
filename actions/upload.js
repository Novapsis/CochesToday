'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Sube el avatar del usuario a Supabase Storage
 */
export async function uploadAvatar(formData) {
  // Create Supabase client with cookie handling
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'No autorizado' };
  }

  try {
    const file = formData.get('avatar');
    if (!file || !file.size) {
      return { success: false, error: 'No se proporcionó ningún archivo' };
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'La imagen debe pesar menos de 5MB' };
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen' };
    }

    // Generar nombre único
    const ext = file.name.split('.').pop();
    const fileName = `${user.id}/avatar-${Date.now()}.${ext}`;

    // Eliminar avatar anterior si existe
    const profile = await db.userProfile.findUnique({
      where: { userId: user.id },
      select: { avatarUrl: true }
    });

    if (profile?.avatarUrl) {
      // Extraer path del URL anterior
      const oldPath = profile.avatarUrl.split('/avatars/').pop();
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath]);
      }
    }

    // Subir nuevo avatar
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    // Actualizar perfil en base de datos
    await db.userProfile.update({
      where: { userId: user.id },
      data: { avatarUrl: publicUrl }
    });

    revalidatePath('/profile');

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { success: false, error: error.message || 'Error al subir la imagen' };
  }
}

/**
 * Sube imágenes de un coche a Supabase Storage
 */
export async function uploadCarImages(carId, formData) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'No autorizado' };
  }

  try {
    // Verificar que el coche pertenece al usuario
    const car = await db.car.findUnique({
      where: { id: carId },
      select: { ownerId: true }
    });

    if (!car || car.ownerId !== user.id) {
      return { success: false, error: 'No autorizado para subir imágenes a este coche' };
    }

    const files = formData.getAll('images');
    if (!files || files.length === 0) {
      return { success: false, error: 'No se proporcionaron imágenes' };
    }

    const uploadedUrls = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validaciones
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`Imagen ${i + 1}: debe pesar menos de 10MB`);
        continue;
      }

      if (!file.type.startsWith('image/')) {
        errors.push(`Archivo ${i + 1}: debe ser una imagen`);
        continue;
      }

      // Generar nombre único
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}/${carId}/image-${Date.now()}-${i}.${ext}`;

      // Subir
      const { data, error } = await supabase.storage
        .from('car-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        errors.push(`Error subiendo imagen ${i + 1}: ${error.message}`);
        continue;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);

      // Guardar en base de datos
      await db.carImage.create({
        data: {
          carId,
          url: publicUrl
        }
      });
    }

    revalidatePath(`/cars/${carId}`);
    revalidatePath('/profile');

    return {
      success: true,
      uploaded: uploadedUrls.length,
      urls: uploadedUrls,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Error uploading car images:', error);
    return { success: false, error: error.message || 'Error al subir las imágenes' };
  }
}

/**
 * Elimina una imagen de un coche
 */
export async function deleteCarImage(imageId) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'No autorizado' };
  }

  try {
    // Obtener imagen y verificar permisos
    const image = await db.carImage.findUnique({
      where: { id: imageId },
      include: {
        car: {
          select: { ownerId: true }
        }
      }
    });

    if (!image || image.car.ownerId !== user.id) {
      return { success: false, error: 'No autorizado para eliminar esta imagen' };
    }

    // Extraer path del URL
    const path = image.url.split('/car-images/').pop();
    
    if (path) {
      // Eliminar de Storage
      await supabase.storage.from('car-images').remove([path]);
    }

    // Eliminar de base de datos
    await db.carImage.delete({
      where: { id: imageId }
    });

    revalidatePath(`/cars/${image.carId}`);
    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('Error deleting car image:', error);
    return { success: false, error: error.message || 'Error al eliminar la imagen' };
  }
}
