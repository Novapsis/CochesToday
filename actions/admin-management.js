'use server';

import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Obtiene el usuario actual de Supabase desde el servidor
 */
async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Crea un nuevo administrador
 * Solo los super administradores pueden crear otros administradores
 */
export async function createAdmin(userId, isSuper = false) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autenticado" };
    }

    // Verificar que el usuario actual es super admin
    const currentAdmin = await db.adminUser.findUnique({
      where: { userId: currentUser.id },
    });

    if (!currentAdmin || !currentAdmin.isSuper) {
      return { success: false, error: "No tienes permisos para crear administradores" };
    }

    // Verificar que el usuario a promover existe
    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // Verificar que no sea ya admin
    const existingAdmin = await db.adminUser.findUnique({
      where: { userId: userId },
    });

    if (existingAdmin) {
      return { success: false, error: "El usuario ya es administrador" };
    }

    // Crear el registro de admin
    const newAdmin = await db.adminUser.create({
      data: {
        userId: userId,
        isSuper: isSuper,
      },
    });

    revalidatePath('/admin');
    return { success: true, admin: newAdmin };
  } catch (error) {
    console.error("Error creating admin:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Elimina un administrador
 * Solo los super administradores pueden eliminar administradores
 */
export async function removeAdmin(userId) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autenticado" };
    }

    // Verificar que el usuario actual es super admin
    const currentAdmin = await db.adminUser.findUnique({
      where: { userId: currentUser.id },
    });

    if (!currentAdmin || !currentAdmin.isSuper) {
      return { success: false, error: "No tienes permisos para eliminar administradores" };
    }

    // No permitir que un admin se elimine a sí mismo
    if (currentUser.id === userId) {
      return { success: false, error: "No puedes eliminarte a ti mismo como administrador" };
    }

    // Eliminar el registro de admin
    await db.adminUser.delete({
      where: { userId: userId },
    });

    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error removing admin:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza el estado de super admin
 * Solo los super administradores pueden cambiar este estado
 */
export async function updateAdminSuperStatus(userId, isSuper) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autenticado" };
    }

    // Verificar que el usuario actual es super admin
    const currentAdmin = await db.adminUser.findUnique({
      where: { userId: currentUser.id },
    });

    if (!currentAdmin || !currentAdmin.isSuper) {
      return { success: false, error: "No tienes permisos para modificar super admins" };
    }

    // No permitir que un admin se quite a sí mismo el super admin
    if (currentUser.id === userId && !isSuper) {
      return { success: false, error: "No puedes quitarte a ti mismo el estado de super admin" };
    }

    // Actualizar el estado
    const updatedAdmin = await db.adminUser.update({
      where: { userId: userId },
      data: { isSuper: isSuper },
    });

    revalidatePath('/admin');
    return { success: true, admin: updatedAdmin };
  } catch (error) {
    console.error("Error updating admin super status:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Lista todos los administradores
 */
export async function listAdmins() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autenticado" };
    }

    // Verificar que el usuario actual es admin
    const currentAdmin = await db.adminUser.findUnique({
      where: { userId: currentUser.id },
    });

    if (!currentAdmin) {
      return { success: false, error: "No tienes permisos para ver la lista de administradores" };
    }

    const admins = await db.adminUser.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    });

    return { success: true, admins };
  } catch (error) {
    console.error("Error listing admins:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene estadísticas de administración
 */
export async function getAdminStats() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autenticado" };
    }

    // Verificar que el usuario actual es admin
    const currentAdmin = await db.adminUser.findUnique({
      where: { userId: currentUser.id },
    });

    if (!currentAdmin) {
      return { success: false, error: "No autorizado" };
    }

    const [
      totalUsers,
      totalCars,
      activeCars,
      totalOrders,
      pendingOrders,
      totalMessages,
    ] = await Promise.all([
      db.user.count(),
      db.car.count(),
      db.car.count({ where: { status: 'activo' } }),
      db.conciergeOrder.count(),
      db.conciergeOrder.count({ where: { status: 'pendiente' } }),
      db.message.count(),
    ]);

    return {
      success: true,
      stats: {
        totalUsers,
        totalCars,
        activeCars,
        totalOrders,
        pendingOrders,
        totalMessages,
      },
    };
  } catch (error) {
    console.error("Error getting admin stats:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Envía un mensaje directo a un usuario desde el panel de administración
 */
export async function sendMessageToUser({ userId, content }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No autenticado" };
    }

    const admin = await db.adminUser.findUnique({
      where: { userId: currentUser.id },
    });

    if (!admin) {
      return { success: false, error: "No autorizado" };
    }

    if (!userId) {
      return { success: false, error: "Usuario objetivo inválido" };
    }

    const trimmedContent = content?.trim();
    if (!trimmedContent) {
      return { success: false, error: "El mensaje no puede estar vacío" };
    }

    // Verificar que el usuario destino existe
    const targetUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, error: "El usuario seleccionado no existe" };
    }

    await db.message.create({
      data: {
        fromId: currentUser.id,
        toId: userId,
        content: trimmedContent,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending admin message:", error);
    return { success: false, error: error.message };
  }
}
