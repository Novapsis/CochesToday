'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { uploadAvatar } from '@/actions/upload';

export default function AvatarUpload({ currentAvatar, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe pesar menos de 5MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Subir a Supabase
    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const result = await uploadAvatar(formData);

      if (result.success) {
        onUploadSuccess?.(result.url);
      } else {
        setError(result.error || 'Error al subir imagen');
        setPreview(currentAvatar); // Revertir preview
      }
    } catch (err) {
      setError('Error al subir imagen');
      setPreview(currentAvatar); // Revertir preview
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-blue-100">
          <Image
            src={preview || '/avatar-placeholder.png'}
            alt="Avatar"
            fill
            className="object-cover"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          )}
        </div>
        
        <label
          className={`absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-3 cursor-pointer hover:bg-blue-700 transition shadow-lg ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
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

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-500 text-center">
        Haz clic en el icono para cambiar tu foto de perfil
        <br />
        (Máximo 5MB, formatos: JPG, PNG, GIF)
      </p>
    </div>
  );
}
