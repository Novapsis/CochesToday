import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function ensureBrand(name) {
  const existing = await db.carBrand.findUnique({ where: { name } });
  if (existing) return existing;
  return db.carBrand.create({ data: { name } });
}

async function ensureModel(brandId, name) {
  const existing = await db.carModel.findFirst({ where: { brandId, name } });
  if (existing) return existing;
  return db.carModel.create({ data: { brandId, name } });
}

async function main() {
  const email = "novapsiscorp@gmail.com";

  let user = await db.user.findUnique({ where: { email }, include: { adminUser: true } });
  if (!user) {
    user = await db.user.create({
      data: {
        email,
        profile: { create: { name: "CochesToday Team", type: "admin" } },
      },
      include: { adminUser: true },
    });
  }

  if (!user.adminUser) {
    await db.adminUser.create({ data: { userId: user.id, isSuper: true } });
  } else if (!user.adminUser.isSuper) {
    await db.adminUser.update({ where: { userId: user.id }, data: { isSuper: true } });
  }

  const brandAudi = await ensureBrand("Audi");
  const brandBMW = await ensureBrand("BMW");
  const brandMercedes = await ensureBrand("Mercedes-Benz");
  const brandVW = await ensureBrand("Volkswagen");
  const brandSeat = await ensureBrand("SEAT");
  const brandToyota = await ensureBrand("Toyota");
  const brandTesla = await ensureBrand("Tesla");
  const brandFord = await ensureBrand("Ford");
  const brandPeugeot = await ensureBrand("Peugeot");

  const modelA3 = await ensureModel(brandAudi.id, "A3");
  const modelA4 = await ensureModel(brandAudi.id, "A4");
  const model320 = await ensureModel(brandBMW.id, "320d");
  const modelX1 = await ensureModel(brandBMW.id, "X1");
  const modelCClass = await ensureModel(brandMercedes.id, "Clase C");
  const modelGolf = await ensureModel(brandVW.id, "Golf");
  const modelLeon = await ensureModel(brandSeat.id, "León");
  const modelCorolla = await ensureModel(brandToyota.id, "Corolla");
  const modelModel3 = await ensureModel(brandTesla.id, "Model 3");
  const modelFocus = await ensureModel(brandFord.id, "Focus");
  const model3008 = await ensureModel(brandPeugeot.id, "3008");

  const existingCount = await db.car.count({ where: { ownerId: user.id } });
  if (existingCount === 0) {
    const samples = [
      { brand: brandAudi, model: modelA3, title: "Audi A3 Sportback 35 TFSI", year: 2021, price: 23990, mileage: 32000, location: "Madrid", bodyType: "Hatchback", transmission: "Automática", fuelType: "Gasolina", color: "Blanco", featured: true, image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1b" },
      { brand: brandAudi, model: modelA4, title: "Audi A4 2.0 TDI S line", year: 2019, price: 21900, mileage: 54000, location: "Barcelona", bodyType: "Sedán", transmission: "Manual", fuelType: "Diésel", color: "Negro", featured: true, image: "https://images.unsplash.com/photo-1549924231-f129b911e442" },
      { brand: brandBMW, model: model320, title: "BMW 320d EfficientDynamics", year: 2018, price: 19950, mileage: 78000, location: "Valencia", bodyType: "Sedán", transmission: "Automática", fuelType: "Diésel", color: "Azul", image: "https://images.unsplash.com/photo-1614200187524-8b4573a9bfa7" },
      { brand: brandBMW, model: modelX1, title: "BMW X1 sDrive18d", year: 2020, price: 27990, mileage: 41000, location: "Sevilla", bodyType: "SUV", transmission: "Automática", fuelType: "Diésel", color: "Gris", image: "https://images.unsplash.com/photo-1617817546272-80aba64b61a3" },
      { brand: brandMercedes, model: modelCClass, title: "Mercedes-Benz Clase C 220d", year: 2019, price: 25990, mileage: 62000, location: "Bilbao", bodyType: "Sedán", transmission: "Automática", fuelType: "Diésel", color: "Plata", image: "https://images.unsplash.com/photo-1616789914310-1d674561b93e" },
      { brand: brandVW, model: modelGolf, title: "Volkswagen Golf 1.5 TSI", year: 2022, price: 22990, mileage: 18000, location: "Zaragoza", bodyType: "Hatchback", transmission: "Manual", fuelType: "Gasolina", color: "Rojo", image: "https://images.unsplash.com/photo-1627672132141-4df8d74c262e" },
      { brand: brandSeat, model: modelLeon, title: "SEAT León FR 1.5 TSI", year: 2021, price: 19990, mileage: 25000, location: "Madrid", bodyType: "Hatchback", transmission: "Manual", fuelType: "Gasolina", color: "Gris", image: "https://images.unsplash.com/photo-1621518510245-42eac8ed7e60" },
      { brand: brandToyota, model: modelCorolla, title: "Toyota Corolla Hybrid", year: 2020, price: 20990, mileage: 36000, location: "Valencia", bodyType: "Sedán", transmission: "Automática", fuelType: "Híbrido", color: "Blanco", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e" },
      { brand: brandTesla, model: modelModel3, title: "Tesla Model 3 Standard Range Plus", year: 2021, price: 31990, mileage: 28000, location: "Barcelona", bodyType: "Sedán", transmission: "Automática", fuelType: "Eléctrico", color: "Rojo", image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea" },
      { brand: brandFord, model: modelFocus, title: "Ford Focus 1.0 EcoBoost", year: 2019, price: 14990, mileage: 52000, location: "Sevilla", bodyType: "Hatchback", transmission: "Manual", fuelType: "Gasolina", color: "Azul", image: "https://images.unsplash.com/photo-1519584206461-9f8c4f0c0baf" },
      { brand: brandPeugeot, model: model3008, title: "Peugeot 3008 BlueHDi", year: 2018, price: 17990, mileage: 71000, location: "Bilbao", bodyType: "SUV", transmission: "Automática", fuelType: "Diésel", color: "Negro", image: "https://images.unsplash.com/photo-1593941707874-ef25b8b2b9b1" },
    ];

    for (const s of samples) {
      const created = await db.car.create({
        data: {
          ownerId: user.id,
          brandId: s.brand.id,
          modelId: s.model.id,
          title: s.title,
          description: `${s.title} en excelente estado, único dueño, historial completo.`,
          price: s.price,
          year: s.year,
          mileage: s.mileage,
          location: s.location,
          color: s.color,
          fuelType: s.fuelType,
          transmission: s.transmission,
          bodyType: s.bodyType,
          status: "activo",
          featured: !!s.featured,
        },
      });
      if (s.image) {
        await db.carImage.create({ data: { carId: created.id, url: s.image } });
      }
    }
  }
}

main()
  .then(async () => { await db.$disconnect(); })
  .catch(async (e) => { console.error(e); await db.$disconnect(); process.exit(1); });
