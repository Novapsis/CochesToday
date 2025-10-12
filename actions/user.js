'use server';

import { db } from "@/lib/prisma";

/**
 * Obtiene o crea un usuario en la base de datos basado en el usuario de Supabase Auth
 * También crea automáticamente el perfil del usuario (UserProfile)
 */
export const getOrCreateUser = async (supabaseUser) => {
  if (!supabaseUser) {
    return null;
  }

  try {
    // 1. Buscar usuario por ID (que ahora coincide con el auth.uid() de Supabase)
    let user = await db.user.findUnique({
      where: {
        id: supabaseUser.id,
      },
      include: {
        profile: true,
        adminUser: true,
      },
    });

    // 2. Si existe, retornarlo
    if (user) {
      return user;
    }

    // 3. Si no existe, crearlo junto con su perfil
    user = await db.user.create({
      data: {
        id: supabaseUser.id, // Usar el mismo ID de Supabase Auth
        email: supabaseUser.email,
        password: null, // Manejado por Supabase Auth
        profile: {
          create: {
            name: supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
            avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
            phone: supabaseUser.user_metadata?.phone || null,
            type: 'comprador', // Tipo por defecto
          },
        },
      },
      include: {
        profile: true,
        adminUser: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    return null;
  }
};

/**
 * Actualiza el perfil del usuario
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const updatedProfile = await db.userProfile.update({
      where: {
        userId: userId,
      },
      data: profileData,
    });

    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene el perfil completo del usuario con todas sus relaciones
 */
export const getUserProfile = async (userId) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
        adminUser: true,
        cars: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        savedCars: {
          include: {
            car: {
              include: {
                images: true,
                brand: true,
                model: true,
              },
            },
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

/**
 * Verifica si un usuario es administrador
 */
export const isUserAdmin = async (userId) => {
  try {
    const adminUser = await db.adminUser.findUnique({
      where: {
        userId: userId,
      },
    });

    return !!adminUser;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Verifica si un usuario es super administrador
 */
export const isUserSuperAdmin = async (userId) => {
  try {
    const adminUser = await db.adminUser.findUnique({
      where: {
        userId: userId,
      },
    });

    return adminUser?.isSuper || false;
  } catch (error) {
    console.error("Error checking super admin status:", error);
    return false;
  }
};
