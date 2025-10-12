"use server";

import { serializeCarData } from "@/lib/helpers";
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
export async function getAdmin() {
  const supabaseUser = await getCurrentUser();
  if (!supabaseUser) {
    return { authorized: false, reason: "no-user" };
  }

  const user = await db.user.findUnique({
    where: { id: supabaseUser.id },
    include: {
      adminUser: true,
    },
  });

  // Si el usuario no existe o no es admin, retornar no autorizado
  if (!user || !user.adminUser) {
    return { authorized: false, reason: "not-admin" };
  }

  return { authorized: true, user, isSuper: user.adminUser.isSuper };
}

/**
 * Get all test drives for admin with filters
 */
export async function getAdminTestDrives({ search = "", status = "" }) {
  try {
    const supabaseUser = await getCurrentUser();
    if (!supabaseUser) throw new Error("Unauthorized");

    // Verify admin status
    const adminUser = await db.adminUser.findUnique({
      where: { userId: supabaseUser.id },
    });

    if (!adminUser) {
      throw new Error("Unauthorized access");
    }

    // Build where conditions
    let where = {};

    // Add status filter
    if (status) {
      where.status = status;
    }

    // Add search filter
    if (search) {
      where.OR = [
        {
          car: {
            OR: [
              { make: { contains: search, mode: "insensitive" } },
              { model: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Get bookings
    const bookings = await db.testDriveBooking.findMany({
      where,
      include: {
        car: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            phone: true,
          },
        },
      },
      orderBy: [{ bookingDate: "desc" }, { startTime: "asc" }],
    });

    // Format the bookings
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      carId: booking.carId,
      car: serializeCarData(booking.car),
      userId: booking.userId,
      user: booking.user,
      bookingDate: booking.bookingDate.toISOString(),
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: formattedBookings,
    };
  } catch (error) {
    console.error("Error fetching test drives:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update test drive status
 */
export async function updateTestDriveStatus(bookingId, newStatus) {
  try {
    const supabaseUser = await getCurrentUser();
    if (!supabaseUser) throw new Error("Unauthorized");

    // Verify admin status
    const adminUser = await db.adminUser.findUnique({
      where: { userId: supabaseUser.id },
    });

    if (!adminUser) {
      throw new Error("Unauthorized access");
    }

    // Get the booking
    const booking = await db.testDriveBooking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Validate status
    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
      "NO_SHOW",
    ];
    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: "Invalid status",
      };
    }

    // Update status
    await db.testDriveBooking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    });

    // Revalidate paths
    revalidatePath("/admin/test-drives");
    revalidatePath("/reservations");

    return {
      success: true,
      message: "Test drive status updated successfully",
    };
  } catch (error) {
    throw new Error("Error updating test drive status:" + error.message);
  }
}

export async function getDashboardData() {
  try {
    const supabaseUser = await getCurrentUser();
    if (!supabaseUser) throw new Error("Unauthorized");

    // Verify admin status
    const adminUser = await db.adminUser.findUnique({
      where: { userId: supabaseUser.id },
    });

    if (!adminUser) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Fetch all necessary data in a single parallel operation
    const carsPromise = db.car.findMany({
      select: { id: true, status: true, featured: true },
    });
    const testDrivesPromise = db?.testDriveBooking?.findMany
      ? db.testDriveBooking.findMany({ select: { id: true, status: true, carId: true } })
      : Promise.resolve([]);

    const [cars, testDrives] = await Promise.all([carsPromise, testDrivesPromise]);

    // Calculate car statistics
    const totalCars = cars.length;
    const statusCounts = cars.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});
    const availableCars = statusCounts["activo"] || 0;
    const soldCars = statusCounts["vendido"] || 0;
    const unavailableCars = statusCounts["inactivo"] || 0;
    const featuredCars = cars.filter((car) => car.featured === true).length;

    // Calculate test drive statistics
    const totalTestDrives = testDrives.length;
    const pendingTestDrives = testDrives.filter(
      (td) => td.status === "PENDING"
    ).length;
    const confirmedTestDrives = testDrives.filter(
      (td) => td.status === "CONFIRMED"
    ).length;
    const completedTestDrives = testDrives.filter(
      (td) => td.status === "COMPLETED"
    ).length;
    const cancelledTestDrives = testDrives.filter(
      (td) => td.status === "CANCELLED"
    ).length;
    const noShowTestDrives = testDrives.filter(
      (td) => td.status === "NO_SHOW"
    ).length;

    // Calculate test drive conversion rate
    const completedTestDriveCarIds = testDrives
      .filter((td) => td.status === "COMPLETED")
      .map((td) => td.carId);

    const soldCarsAfterTestDrive = cars.filter(
      (car) =>
        car.status === "SOLD" && completedTestDriveCarIds.includes(car.id)
    ).length;

    const conversionRate =
      completedTestDrives > 0
        ? (soldCarsAfterTestDrive / completedTestDrives) * 100
        : 0;

    return {
      success: true,
      data: {
        cars: {
          total: totalCars,
          available: availableCars,
          sold: soldCars,
          unavailable: unavailableCars,
          featured: featuredCars,
        },
        testDrives: {
          total: totalTestDrives,
          pending: pendingTestDrives,
          confirmed: confirmedTestDrives,
          completed: completedTestDrives,
          cancelled: cancelledTestDrives,
          noShow: noShowTestDrives,
          conversionRate: parseFloat(conversionRate.toFixed(2)),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
