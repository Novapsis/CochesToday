-- Script para crear el primer super administrador
-- 
-- INSTRUCCIONES:
-- 1. Regístrate en la aplicación usando el formulario de registro
-- 2. Copia tu User ID desde la tabla User en Supabase Dashboard
-- 3. Reemplaza '<TU-USER-ID>' con tu ID real
-- 4. Ejecuta este script en el SQL Editor de Supabase

-- Insertar el primer super administrador
INSERT INTO "AdminUser" (id, "userId", "isSuper")
VALUES (
  gen_random_uuid(),
  '<TU-USER-ID>', -- Reemplaza esto con tu User ID
  true
)
ON CONFLICT ("userId") DO UPDATE
SET "isSuper" = true;

-- Verificar que se creó correctamente
SELECT 
  au.id,
  au."userId",
  au."isSuper",
  u.email,
  up.name
FROM "AdminUser" au
JOIN "User" u ON au."userId" = u.id
LEFT JOIN "UserProfile" up ON u.id = up."userId"
WHERE au."isSuper" = true;
