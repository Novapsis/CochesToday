/*
Usage:
  node scripts/import-brands-models.js [path-to-json]
Default JSON: coches/marcas_modelos_completo.json
*/

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function main() {
  const jsonPath = process.argv[2] || path.join(process.cwd(), 'coches', 'marcas_modelos_completo.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('JSON not found at:', jsonPath);
    process.exit(1);
  }
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const parsed = JSON.parse(raw);
  const brands = parsed.brands || [];

  let brandCount = 0;
  let modelCount = 0;

  for (const b of brands) {
    const name = String(b.name).trim();
    if (!name) continue;

    const brand = await db.carBrand.upsert({
      where: { name },
      update: {},
      create: { name, createdByUserId: null },
      select: { id: true, name: true },
    });
    brandCount++;

    const models = Array.isArray(b.models) ? b.models : [];
    for (const mNameRaw of models) {
      const mname = String(mNameRaw).trim();
      if (!mname) continue;
      await db.carModel.upsert({
        where: { brandId_name: { brandId: brand.id, name: mname } },
        update: {},
        create: { brandId: brand.id, name: mname, createdByUserId: null },
        select: { id: true },
      });
      modelCount++;
    }
  }

  console.log('Import completed:', { brands: brandCount, models: modelCount });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
