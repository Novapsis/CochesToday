import { createClient } from '@/lib/supabase';

/**
 * Sube una imagen al bucket de Supabase Storage
 * @param {File} file - Archivo a subir
 * @param {string} bucket - Nombre del bucket ('car-images' | 'avatars')
 * @param {string} path - Ruta dentro del bucket (ej: 'userId/carId/image.jpg')
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadImage(file, bucket, path) {
  const supabase = createClient();
  
  // Subir archivo
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    url: publicUrl,
    path: data.path
  };
}

/**
 * Elimina una imagen del bucket
 * @param {string} bucket - Nombre del bucket
 * @param {string} path - Ruta del archivo a eliminar
 */
export async function deleteImage(bucket, path) {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

/**
 * Genera un nombre de archivo único
 * @param {string} originalName - Nombre original del archivo
 * @returns {string}
 */
export function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${ext}`;
}

/**
 * Valida que el archivo sea una imagen y esté dentro del límite de tamaño
 * @param {File} file - Archivo a validar
 * @param {number} maxSizeMB - Tamaño máximo en MB (default: 5)
 * @returns {{valid: boolean, error?: string}}
 */
export function validateImageFile(file, maxSizeMB = 5) {
  if (!file) {
    return { valid: false, error: 'No se proporcionó ningún archivo' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen' };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `La imagen debe pesar menos de ${maxSizeMB}MB` };
  }

  return { valid: true };
}
