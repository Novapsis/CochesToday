import { db } from "./prisma";
import { createClient } from "./supabase";

/**
 * Verifica y crea usuario en la base de datos si no existe
 * Se ejecuta después de que Supabase Auth crea el usuario
 */
export const checkUser = async (supabaseUser) => {
  if (!supabaseUser) {
    return null;
  }

  try {
    // Buscar usuario existente por ID de Supabase
    const loggedInUser = await db.user.findUnique({
      where: {
        id: supabaseUser.id,
      },
      include: {
        profile: true,
        adminUser: true,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Crear nuevo usuario si no existe
    const newUser = await db.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email,
        profile: {
          create: {
            name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
            avatarUrl: supabaseUser.user_metadata?.avatar_url,
            type: 'comprador', // Por defecto
          },
        },
      },
      include: {
        profile: true,
        adminUser: true,
      },
    });

    return newUser;
  } catch (error) {
    console.error('Error in checkUser:', error.message);
    return null;
  }
};
