'use server';

import { serializeCarData } from "@/lib/helpers";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase";

// Helper function to get authenticated user from Supabase session
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();

  if (!supabaseUser) {
    return null;
  }

  const dbUser = await db.user.findUnique({
    where: { id: supabaseUser.id },
    include: {
      profile: true,
      adminUser: true,
    },
  });

  return dbUser;
}


/**
 * Get simplified filters for the car marketplace
 */
export async function getCarFilters() {
  try {
    // Get all brands that have available cars
    const brands = await db.carBrand.findMany({
      where: {
        cars: {
          some: { status: "activo" }
        }
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true }
    });

    // Get distinct values for other filters
    const cars = await db.car.findMany({
      where: { status: "activo" },
      select: { bodyType: true, fuelType: true, transmission: true },
    });

    const bodyTypes = [...new Set(cars.map(c => c.bodyType).filter(Boolean))].sort();
    const fuelTypes = [...new Set(cars.map(c => c.fuelType).filter(Boolean))].sort();
    const transmissions = [...new Set(cars.map(c => c.transmission).filter(Boolean))].sort();

    const priceAggregations = await db.car.aggregate({
      where: { status: "activo" },
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: brands.map((b) => ({ id: b.id, name: b.name })),
        bodyTypes,
        fuelTypes,
        transmissions,
        priceRange: {
          min: priceAggregations._min.price
            ? parseFloat(priceAggregations._min.price.toString())
            : 0,
          max: priceAggregations._max.price
            ? parseFloat(priceAggregations._max.price.toString())
            : 100000,
        },
      },
    };
  } catch (error) {
    console.error('Error in getCarFilters:', error);
    throw new Error("Error fetching car filters:" + error.message);
  }
}

/**
 * Get cars with simplified filters
 */
export async function getCars({
  search = "",
  make = "",
  bodyType = "",
  fuelType = "",
  transmission = "",
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest",
  page = 1,
  limit = 6,
}) {
  try {
    const dbUser = await getAuthenticatedUser();

    // Build Prisma where using actual schema fields
    const where = { status: "activo" };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    // 'make' carries brandId from UI
    if (make) where.brandId = make;
    if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
    if (fuelType) where.fuelType = { equals: fuelType, mode: "insensitive" };
    if (transmission) where.transmission = { equals: transmission, mode: "insensitive" };
    where.price = { gte: parseFloat(minPrice) || 0 };
    if (maxPrice && maxPrice < Number.MAX_SAFE_INTEGER) {
      where.price.lte = parseFloat(maxPrice);
    }

    const skip = (page - 1) * limit;
    let orderBy = {};
    switch (sortBy) {
      case "priceAsc": orderBy = { price: "asc" }; break;
      case "priceDesc": orderBy = { price: "desc" }; break;
      default: orderBy = { createdAt: "desc" }; break;
    }

    const totalCars = await db.car.count({ where });
    const cars = await db.car.findMany({
      where,
      take: limit,
      skip,
      orderBy,
      include: {
        images: true,
        brand: true,
        model: true,
      },
    });

    let wishlisted = new Set();
    if (dbUser) {
      const savedCars = await db.userSavedCar.findMany({
        where: { userId: dbUser.id },
        select: { carId: true },
      });
      wishlisted = new Set(savedCars.map((saved) => saved.carId));
    }

    const serializedCars = cars.map((car) => serializeCarData(car, wishlisted.has(car.id)));

    return {
      success: true,
      data: serializedCars,
      pagination: {
        total: totalCars,
        page,
        limit,
        pages: Math.ceil(totalCars / limit),
      },
    };
  } catch (error) {
    throw new Error("Error fetching cars:" + error.message);
  }
}

/**
 * Toggle car in user's wishlist
 */
export async function toggleSavedCar(carId) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) throw new Error("Unauthorized");

    const car = await db.car.findUnique({ where: { id: carId } });
    if (!car) return { success: false, error: "Car not found" };

    const existingSave = await db.userSavedCar.findUnique({
      where: { userId_carId: { userId: user.id, carId } },
    });

    if (existingSave) {
      await db.userSavedCar.delete({ where: { userId_carId: { userId: user.id, carId } } });
      revalidatePath(`/saved-cars`);
      return { success: true, saved: false, message: "Car removed from favorites" };
    } else {
      await db.userSavedCar.create({ data: { userId: user.id, carId } });
      revalidatePath(`/saved-cars`);
      return { success: true, saved: true, message: "Car added to favorites" };
    }
  } catch (error) {
    throw new Error("Error toggling saved car:" + error.message);
  }
}

/**
 * Get car details by ID
 */
export async function getCarById(carId) {
  try {
    const dbUser = await getAuthenticatedUser();

    const car = await db.car.findUnique({
      where: { id: carId },
      include: {
        images: true,
        brand: true,
        model: true,
      },
    });
    if (!car) return { success: false, error: "Car not found" };

    let isWishlisted = false;
    if (dbUser) {
      const savedCar = await db.userSavedCar.findUnique({
        where: { userId_carId: { userId: dbUser.id, carId } },
      });
      isWishlisted = !!savedCar;
    }

    return {
      success: true,
      data: serializeCarData(car, isWishlisted),
    };
  } catch (error) {
    throw new Error("Error fetching car details:" + error.message);
  }
}

/**
 * Get user's saved cars
 */
export async function getSavedCars(userId = null) {
  try {
    let currentUserId = userId;

    // If no userId provided, get from authentication
    if (!currentUserId) {
      const user = await getAuthenticatedUser();
      if (!user) return { success: false, error: "Unauthorized" };
      currentUserId = user.id;
    }

    const savedCars = await db.userSavedCar.findMany({
      where: { userId: currentUserId },
      include: {
        car: {
          include: {
            images: true,
            brand: true,
            model: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const cars = savedCars.map((saved) => ({
      ...serializeCarData(saved.car, true),
      savedAt: saved.createdAt.toISOString(),
    }));

    return { success: true, data: cars };
  } catch (error) {
    console.error("Error fetching saved cars:", error);
    return { success: false, error: error.message };
  }
}
