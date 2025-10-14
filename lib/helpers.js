export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

// Helper function to serialize car data
export const serializeCarData = (car, wishlisted = false) => {
  const serialized = {
    ...car,
    price: car.price ? parseFloat(car.price.toString()) : 0,
    createdAt: car.createdAt?.toISOString(),
    updatedAt: car.updatedAt?.toISOString(),
    wishlisted: wishlisted,
  };

  if (serialized.owner) {
    serialized.owner = {
      ...serialized.owner,
      createdAt: serialized.owner.createdAt?.toISOString(),
      updatedAt: serialized.owner.updatedAt?.toISOString(),
    };
  }

  // Ensure nested profile dates are serialized if they exist
  if (serialized.owner?.profile) {
    serialized.owner.profile = {
      ...serialized.owner.profile,
      createdAt: serialized.owner.profile.createdAt?.toISOString(),
      updatedAt: serialized.owner.profile.updatedAt?.toISOString(),
    };
  }

  return serialized;
};
