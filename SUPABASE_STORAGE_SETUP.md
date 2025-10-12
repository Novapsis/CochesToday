# 📦 Configuración de Supabase Storage para Imágenes

## 🎯 Objetivo
Configurar un bucket de almacenamiento en Supabase para imágenes de coches, avatares de usuarios y otros archivos multimedia.

---

## 🛠️ Paso 1: Crear Bucket en Supabase Dashboard

### **A. Crear Bucket Público para Imágenes de Coches**

1. Ve a: https://supabase.com/dashboard/project/<tu-project>/storage/buckets
2. Click en **"New bucket"**
3. Configura:
   - **Name**: `car-images`
   - **Public bucket**: ✅ (marcado)
   - **Allowed MIME types**: `image/*`
   - **File size limit**: `10 MB`
4. Click en **"Create bucket"**

### **B. Crear Bucket Público para Avatares**

1. Click en **"New bucket"**
2. Configura:
   - **Name**: `avatars`
   - **Public bucket**: ✅ (marcado)
   - **Allowed MIME types**: `image/*`
   - **File size limit**: `5 MB`
3. Click en **"Create bucket"**

---

## 🔒 Paso 2: Configurar Políticas de Seguridad (RLS)

### **A. Políticas para `car-images`**

```sql
-- Permitir a cualquiera VER imágenes (ya que es público)
CREATE POLICY "Public can view car images"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- Permitir a usuarios autenticados SUBIR imágenes
CREATE POLICY "Authenticated users can upload car images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'car-images' AND
  auth.role() = 'authenticated'
);

-- Permitir a usuarios ELIMINAR solo sus propias imágenes
CREATE POLICY "Users can delete their own car images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'car-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir a usuarios ACTUALIZAR solo sus propias imágenes
CREATE POLICY "Users can update their own car images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'car-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### **B. Políticas para `avatars`**

```sql
-- Permitir a cualquiera VER avatares
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Permitir a usuarios autenticados SUBIR avatares
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir a usuarios ELIMINAR solo su propio avatar
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir a usuarios ACTUALIZAR solo su propio avatar
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 📁 Paso 3: Estructura de Carpetas

### **Organización Recomendada**

```
car-images/
  └── {userId}/
      └── {carId}/
          ├── image-1.jpg
          ├── image-2.jpg
          └── ...

avatars/
  └── {userId}/
      └── avatar.jpg
```

**Ventajas**:
- Fácil de gestionar por usuario
- Las políticas RLS funcionan por carpeta
- Fácil de limpiar al eliminar usuario/coche

---

## 💻 Paso 4: Implementación en el Código

### **A. Helper para Subir Imágenes**

Archivo: `/lib/storage.js`

```javascript
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
```

### **B. Server Action para Subir Avatar**

Archivo: `/actions/upload.js`

```javascript
'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/prisma';

export async function uploadAvatar(formData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const file = formData.get('avatar');
    if (!file) throw new Error('No file provided');

    // Generar nombre único
    const ext = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${ext}`;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Sobrescribir si existe
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

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { success: false, error: error.message };
  }
}
```

### **C. Componente de Subida de Avatar**

Archivo: `/components/profile/AvatarUpload.jsx`

```javascript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { uploadAvatar } from '@/actions/upload';

export default function AvatarUpload({ currentAvatar, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Subir a Supabase
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    const result = await uploadAvatar(formData);
    setUploading(false);

    if (result.success) {
      onUploadSuccess?.(result.url);
    } else {
      alert('Error al subir imagen: ' + result.error);
    }
  };

  return (
    <div className="relative group">
      <div className="relative h-32 w-32 rounded-full overflow-hidden ring-2 ring-blue-100">
        <Image
          src={preview || '/avatar-placeholder.png'}
          alt="Avatar"
          fill
          className="object-cover"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm">Subiendo...</span>
          </div>
        )}
      </div>
      
      <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition">
        <Camera size={20} />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
```

---

## 🧪 Paso 5: Probar la Configuración

### **Test Manual**

1. **Subir imagen desde código**:
```javascript
import { uploadImage, generateUniqueFileName } from '@/lib/storage';

const file = /* File object from input */;
const fileName = generateUniqueFileName(file.name);
const path = `${userId}/${fileName}`;

const result = await uploadImage(file, 'avatars', path);
console.log('URL pública:', result.url);
```

2. **Verificar en Dashboard**:
   - Ve a Storage → Buckets → avatars
   - Deberías ver el archivo subido
   - Click derecho → "Copy URL" para probar la URL pública

---

## 📊 Gestión de Storage

### **Ver Uso de Almacenamiento**

```sql
-- Ver tamaño total por bucket
SELECT 
  bucket_id,
  COUNT(*) as files,
  SUM(LENGTH(COALESCE(metadata->>'size', '0'))::bigint) as total_bytes,
  ROUND(SUM(LENGTH(COALESCE(metadata->>'size', '0'))::bigint) / 1024.0 / 1024.0, 2) as total_mb
FROM storage.objects
GROUP BY bucket_id;
```

### **Limpiar Archivos Huérfanos**

```sql
-- Encontrar imágenes de coches eliminados
SELECT o.name, o.created_at
FROM storage.objects o
WHERE o.bucket_id = 'car-images'
AND NOT EXISTS (
  SELECT 1 FROM "CarImage" ci
  WHERE ci.url LIKE '%' || o.name
);

-- Eliminar (ejecutar con cuidado)
DELETE FROM storage.objects
WHERE id IN (
  SELECT o.id
  FROM storage.objects o
  WHERE o.bucket_id = 'car-images'
  AND NOT EXISTS (
    SELECT 1 FROM "CarImage" ci
    WHERE ci.url LIKE '%' || o.name
  )
);
```

---

## 🔧 Configuración Avanzada

### **Límites y Cuotas**

- **Free Plan**: 1 GB storage
- **Pro Plan**: 100 GB storage
- **Tamaño máximo por archivo**: 50 MB (configurable)

### **Optimización de Imágenes**

Instalar librería para redimensionar:
```bash
npm install sharp
```

Ejemplo de uso:
```javascript
import sharp from 'sharp';

// Redimensionar antes de subir
const buffer = await file.arrayBuffer();
const resized = await sharp(Buffer.from(buffer))
  .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 80 })
  .toBuffer();

// Subir buffer redimensionado
await supabase.storage
  .from('car-images')
  .upload(path, resized, { contentType: 'image/jpeg' });
```

---

## ✅ Checklist de Implementación

- [ ] Buckets creados en Supabase Dashboard
- [ ] Políticas RLS configuradas
- [ ] Helper functions creadas (`/lib/storage.js`)
- [ ] Server actions para upload (`/actions/upload.js`)
- [ ] Componente de UI para subir avatar
- [ ] Pruebas de subida/eliminación funcionando
- [ ] Gestión de errores implementada
- [ ] Limpieza de archivos huérfanos configurada

---

## 🆘 Troubleshooting

### **Error: "new row violates row-level security policy"**

**Causa**: Las políticas RLS no permiten la operación

**Solución**:
1. Verifica que el usuario esté autenticado
2. Revisa las políticas con:
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects';
```
3. Asegúrate de que la ruta del archivo cumple las políticas

### **Error: "The resource already exists"**

**Causa**: Archivo con el mismo nombre ya existe

**Solución**:
- Usa `upsert: true` para sobrescribir
- O genera nombres únicos con timestamp/UUID

### **Imágenes no se ven**

**Causa**: Bucket no es público o políticas SELECT faltan

**Solución**:
1. Verifica que el bucket sea público
2. Agrega política SELECT:
```sql
CREATE POLICY "Public can view" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

---

**✅ Storage configurado y listo para usar!**
