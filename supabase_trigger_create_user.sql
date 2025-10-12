-- ============================================
-- TRIGGER: Crear usuario automáticamente en la tabla User
-- cuando se registra en Supabase Auth
-- ============================================

-- Función que se ejecuta cuando se crea un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en la tabla User
  INSERT INTO public."User" (id, email, "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  );

  -- Crear perfil de usuario
  INSERT INTO public."UserProfile" (id, "userId", name, "avatarUrl", type)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'comprador'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- NOTA: Ejecuta este script en Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Pegar y ejecutar
-- ============================================
