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
 * Verifica si el usuario actual es administrador
 */
async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;

  const adminUser = await db.adminUser.findUnique({
    where: { userId: user.id },
  });

  return !!adminUser;
}

/**
 * Obtiene todas las marcas con sus modelos
 */
export async function getAllBrands() {
  try {
    const brands = await db.carBrand.findMany({
      include: {
        models: {
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return { success: true, brands };
  } catch (error) {
    console.error("Error getting brands:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene una marca específica con sus modelos
 */
export async function getBrandById(brandId) {
  try {
    const brand = await db.carBrand.findUnique({
      where: { id: brandId },
      include: {
        models: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    if (!brand) {
      return { success: false, error: "Marca no encontrada" };
    }

    return { success: true, brand };
  } catch (error) {
    console.error("Error getting brand:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene modelos de una marca específica
 */
export async function getModelsByBrand(brandId) {
  try {
    const models = await db.carModel.findMany({
      where: { brandId },
      orderBy: {
        name: 'asc',
      },
    });

    return { success: true, models };
  } catch (error) {
    console.error("Error getting models:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Crea una nueva marca (solo admins)
 */
export async function createBrand(name) {
  try {
    if (!await isAdmin()) {
      return { success: false, error: "No autorizado" };
    }

    // Verificar que no exista ya
    const existing = await db.carBrand.findUnique({
      where: { name },
    });

    if (existing) {
      return { success: false, error: "La marca ya existe" };
    }

    const brand = await db.carBrand.create({
      data: { name },
    });

    revalidatePath('/admin/brands');
    return { success: true, brand };
  } catch (error) {
    console.error("Error creating brand:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza una marca (solo admins)
 */
export async function updateBrand(brandId, name) {
  try {
    if (!await isAdmin()) {
      return { success: false, error: "No autorizado" };
    }

    const brand = await db.carBrand.update({
      where: { id: brandId },
      data: { name },
    });

    revalidatePath('/admin/brands');
    return { success: true, brand };
  } catch (error) {
    console.error("Error updating brand:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Elimina una marca (solo admins)
 * Nota: Esto también eliminará todos los modelos asociados por CASCADE
 */
export async function deleteBrand(brandId) {
  try {
    if (!await isAdmin()) {
      return { success: false, error: "No autorizado" };
    }

    // Verificar que no haya coches usando esta marca
    const carsCount = await db.car.count({
      where: { brandId },
    });

    if (carsCount > 0) {
      return { 
        success: false, 
        error: `No se puede eliminar la marca porque hay ${carsCount} coche(s) asociado(s)` 
      };
    }

    await db.carBrand.delete({
      where: { id: brandId },
    });

    revalidatePath('/admin/brands');
    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Crea un nuevo modelo (solo admins)
 */
export async function createModel(brandId, name) {
  try {
    if (!await isAdmin()) {
      return { success: false, error: "No autorizado" };
    }

    // Verificar que la marca existe
    const brand = await db.carBrand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return { success: false, error: "Marca no encontrada" };
    }

    // Verificar que no exista ya este modelo para esta marca
    const existing = await db.carModel.findFirst({
      where: {
        brandId,
        name,
      },
    });

    if (existing) {
      return { success: false, error: "El modelo ya existe para esta marca" };
    }

    const model = await db.carModel.create({
      data: {
        brandId,
        name,
      },
    });

    revalidatePath('/admin/brands');
    return { success: true, model };
  } catch (error) {
    console.error("Error creating model:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza un modelo (solo admins)
 */
export async function updateModel(modelId, name) {
  try {
    if (!await isAdmin()) {
      return { success: false, error: "No autorizado" };
    }

    const model = await db.carModel.update({
      where: { id: modelId },
      data: { name },
    });

    revalidatePath('/admin/brands');
    return { success: true, model };
  } catch (error) {
    console.error("Error updating model:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Elimina un modelo (solo admins)
 */
export async function deleteModel(modelId) {
  try {
    if (!await isAdmin()) {
      return { success: false, error: "No autorizado" };
    }

    // Verificar que no haya coches usando este modelo
    const carsCount = await db.car.count({
      where: { modelId },
    });

    if (carsCount > 0) {
      return { 
        success: false, 
        error: `No se puede eliminar el modelo porque hay ${carsCount} coche(s) asociado(s)` 
      };
    }

    await db.carModel.delete({
      where: { id: modelId },
    });

    revalidatePath('/admin/brands');
    return { success: true };
  } catch (error) {
    console.error("Error deleting model:", error);
    return { success: false, error: error.message };
  }
}
