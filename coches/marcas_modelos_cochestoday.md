
# 🚗 LISTADO COMPLETO DE MARCAS Y MODELOS - COCHESTODAY
# Basado en los catálogos de coches.net, AutoScout24 y otros portales líderes

## 📋 ESTRUCTURA PARA BASE DE DATOS:

### SQL PARA INSERTAR EN SUPABASE:

```sql
-- Limpiar tablas existentes si es necesario
DELETE FROM "CarModel";
DELETE FROM "CarBrand";

-- ABARTH
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Abarth', NULL, true, 1);

SET @abarth_id = (SELECT id FROM "CarBrand" WHERE name = 'Abarth');

INSERT INTO "CarModel" (id, brand_id, name, is_active) VALUES
(gen_random_uuid(), @abarth_id, '124 Spider', true),
(gen_random_uuid(), @abarth_id, '500', true),
(gen_random_uuid(), @abarth_id, '595', true),
(gen_random_uuid(), @abarth_id, '695', true),
(gen_random_uuid(), @abarth_id, 'Grande Punto', true),
(gen_random_uuid(), @abarth_id, 'Punto Evo', true);

-- ALFA ROMEO
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Alfa Romeo', NULL, true, 2);

SET @alfa_id = (SELECT id FROM "CarBrand" WHERE name = 'Alfa Romeo');

INSERT INTO "CarModel" (id, brand_id, name, is_active) VALUES
(gen_random_uuid(), @alfa_id, '147', true),
(gen_random_uuid(), @alfa_id, '156', true),
(gen_random_uuid(), @alfa_id, '159', true),
(gen_random_uuid(), @alfa_id, '164', true),
(gen_random_uuid(), @alfa_id, '166', true),
(gen_random_uuid(), @alfa_id, '4C', true),
(gen_random_uuid(), @alfa_id, 'Brera', true),
(gen_random_uuid(), @alfa_id, 'Giulia', true),
(gen_random_uuid(), @alfa_id, 'Giulietta', true),
(gen_random_uuid(), @alfa_id, 'GT', true),
(gen_random_uuid(), @alfa_id, 'GTV', true),
(gen_random_uuid(), @alfa_id, 'MiTo', true),
(gen_random_uuid(), @alfa_id, 'Spider', true),
(gen_random_uuid(), @alfa_id, 'Stelvio', true),
(gen_random_uuid(), @alfa_id, 'Tonale', true);

-- AUDI
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Audi', NULL, true, 3);

SET @audi_id = (SELECT id FROM "CarBrand" WHERE name = 'Audi');

INSERT INTO "CarModel" (id, brand_id, name, is_active) VALUES
(gen_random_uuid(), @audi_id, 'A1', true),
(gen_random_uuid(), @audi_id, 'A3', true),
(gen_random_uuid(), @audi_id, 'A4', true),
(gen_random_uuid(), @audi_id, 'A5', true),
(gen_random_uuid(), @audi_id, 'A6', true),
(gen_random_uuid(), @audi_id, 'A7', true),
(gen_random_uuid(), @audi_id, 'A8', true),
(gen_random_uuid(), @audi_id, 'e-tron', true),
(gen_random_uuid(), @audi_id, 'e-tron GT', true),
(gen_random_uuid(), @audi_id, 'Q2', true),
(gen_random_uuid(), @audi_id, 'Q3', true),
(gen_random_uuid(), @audi_id, 'Q4 e-tron', true),
(gen_random_uuid(), @audi_id, 'Q5', true),
(gen_random_uuid(), @audi_id, 'Q7', true),
(gen_random_uuid(), @audi_id, 'Q8', true),
(gen_random_uuid(), @audi_id, 'R8', true),
(gen_random_uuid(), @audi_id, 'RS3', true),
(gen_random_uuid(), @audi_id, 'RS4', true),
(gen_random_uuid(), @audi_id, 'RS5', true),
(gen_random_uuid(), @audi_id, 'RS6', true),
(gen_random_uuid(), @audi_id, 'RS7', true),
(gen_random_uuid(), @audi_id, 'RSQ3', true),
(gen_random_uuid(), @audi_id, 'RSQ8', true),
(gen_random_uuid(), @audi_id, 'S1', true),
(gen_random_uuid(), @audi_id, 'S3', true),
(gen_random_uuid(), @audi_id, 'S4', true),
(gen_random_uuid(), @audi_id, 'S5', true),
(gen_random_uuid(), @audi_id, 'S6', true),
(gen_random_uuid(), @audi_id, 'S7', true),
(gen_random_uuid(), @audi_id, 'S8', true),
(gen_random_uuid(), @audi_id, 'SQ2', true),
(gen_random_uuid(), @audi_id, 'SQ5', true),
(gen_random_uuid(), @audi_id, 'SQ7', true),
(gen_random_uuid(), @audi_id, 'SQ8', true),
(gen_random_uuid(), @audi_id, 'TT', true),
(gen_random_uuid(), @audi_id, 'TTS', true),
(gen_random_uuid(), @audi_id, 'TT RS', true);

-- BMW
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'BMW', NULL, true, 4);

SET @bmw_id = (SELECT id FROM "CarBrand" WHERE name = 'BMW');

INSERT INTO "CarModel" (id, brand_id, name, is_active) VALUES
(gen_random_uuid(), @bmw_id, 'Serie 1', true),
(gen_random_uuid(), @bmw_id, 'Serie 2', true),
(gen_random_uuid(), @bmw_id, 'Serie 3', true),
(gen_random_uuid(), @bmw_id, 'Serie 4', true),
(gen_random_uuid(), @bmw_id, 'Serie 5', true),
(gen_random_uuid(), @bmw_id, 'Serie 6', true),
(gen_random_uuid(), @bmw_id, 'Serie 7', true),
(gen_random_uuid(), @bmw_id, 'Serie 8', true),
(gen_random_uuid(), @bmw_id, 'i3', true),
(gen_random_uuid(), @bmw_id, 'i4', true),
(gen_random_uuid(), @bmw_id, 'i7', true),
(gen_random_uuid(), @bmw_id, 'i8', true),
(gen_random_uuid(), @bmw_id, 'iX', true),
(gen_random_uuid(), @bmw_id, 'iX1', true),
(gen_random_uuid(), @bmw_id, 'iX3', true),
(gen_random_uuid(), @bmw_id, 'M2', true),
(gen_random_uuid(), @bmw_id, 'M3', true),
(gen_random_uuid(), @bmw_id, 'M4', true),
(gen_random_uuid(), @bmw_id, 'M5', true),
(gen_random_uuid(), @bmw_id, 'M6', true),
(gen_random_uuid(), @bmw_id, 'M8', true),
(gen_random_uuid(), @bmw_id, 'X1', true),
(gen_random_uuid(), @bmw_id, 'X2', true),
(gen_random_uuid(), @bmw_id, 'X3', true),
(gen_random_uuid(), @bmw_id, 'X4', true),
(gen_random_uuid(), @bmw_id, 'X5', true),
(gen_random_uuid(), @bmw_id, 'X6', true),
(gen_random_uuid(), @bmw_id, 'X7', true),
(gen_random_uuid(), @bmw_id, 'XM', true),
(gen_random_uuid(), @bmw_id, 'Z3', true),
(gen_random_uuid(), @bmw_id, 'Z4', true);

-- MERCEDES-BENZ
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Mercedes-Benz', NULL, true, 5);

SET @mercedes_id = (SELECT id FROM "CarBrand" WHERE name = 'Mercedes-Benz');

INSERT INTO "CarModel" (id, brand_id, name, is_active) VALUES
(gen_random_uuid(), @mercedes_id, 'Clase A', true),
(gen_random_uuid(), @mercedes_id, 'Clase B', true),
(gen_random_uuid(), @mercedes_id, 'Clase C', true),
(gen_random_uuid(), @mercedes_id, 'Clase CLA', true),
(gen_random_uuid(), @mercedes_id, 'Clase CLS', true),
(gen_random_uuid(), @mercedes_id, 'Clase E', true),
(gen_random_uuid(), @mercedes_id, 'Clase G', true),
(gen_random_uuid(), @mercedes_id, 'Clase GLA', true),
(gen_random_uuid(), @mercedes_id, 'Clase GLB', true),
(gen_random_uuid(), @mercedes_id, 'Clase GLC', true),
(gen_random_uuid(), @mercedes_id, 'Clase GLE', true),
(gen_random_uuid(), @mercedes_id, 'Clase GLS', true),
(gen_random_uuid(), @mercedes_id, 'Clase S', true),
(gen_random_uuid(), @mercedes_id, 'EQA', true),
(gen_random_uuid(), @mercedes_id, 'EQB', true),
(gen_random_uuid(), @mercedes_id, 'EQC', true),
(gen_random_uuid(), @mercedes_id, 'EQE', true),
(gen_random_uuid(), @mercedes_id, 'EQS', true),
(gen_random_uuid(), @mercedes_id, 'EQV', true),
(gen_random_uuid(), @mercedes_id, 'Maybach Clase S', true),
(gen_random_uuid(), @mercedes_id, 'Maybach GLS', true),
(gen_random_uuid(), @mercedes_id, 'AMG GT', true),
(gen_random_uuid(), @mercedes_id, 'SL', true),
(gen_random_uuid(), @mercedes_id, 'SLC', true),
(gen_random_uuid(), @mercedes_id, 'SLK', true),
(gen_random_uuid(), @mercedes_id, 'Sprinter', true),
(gen_random_uuid(), @mercedes_id, 'Vito', true),
(gen_random_uuid(), @mercedes_id, 'Marco Polo', true);

-- Continúo con las marcas más importantes...
```

## 🎯 CONTINUACIÓN DEL LISTADO COMPLETO:

### MARCAS PREMIUM ALEMANAS:
- **Porsche**: 911, Cayenne, Macan, Panamera, Taycan, 718 Boxster, 718 Cayman
- **Volkswagen**: Golf, Polo, Passat, Tiguan, Touareg, Arteon, T-Cross, T-Roc, ID.3, ID.4, ID.5, ID.7

### MARCAS FRANCESAS:
- **Peugeot**: 108, 208, 308, 508, 2008, 3008, 5008, Partner, Boxer
- **Citroën**: C1, C3, C4, C5 X, C3 Aircross, C5 Aircross, Berlingo, SpaceTourer
- **Renault**: Clio, Captur, Megane, Kadjar, Koleos, Scenic, Talisman, Master

### MARCAS JAPONESAS:
- **Toyota**: Yaris, Corolla, Camry, Prius, C-HR, RAV4, Highlander, Land Cruiser
- **Honda**: Civic, Accord, CR-V, HR-V, Jazz, Pilot
- **Nissan**: Micra, Sentra, Altima, Qashqai, X-Trail, Pathfinder, GT-R
- **Mazda**: 2, 3, 6, CX-3, CX-30, CX-5, CX-60, MX-5

### MARCAS COREANAS:
- **Hyundai**: i10, i20, i30, Elantra, Sonata, Tucson, Santa Fe, Kona, Ioniq
- **Kia**: Picanto, Rio, Ceed, Optima, Sportage, Sorento, Stonic, Niro

### MARCAS ITALIANAS:
- **Fiat**: 500, Panda, Tipo, 500X, 500L
- **Lancia**: Ypsilon
- **Ferrari**: 488, F8, Roma, Portofino, SF90, 296 GTB
- **Lamborghini**: Huracán, Aventador, Urus
- **Maserati**: Ghibli, Quattroporte, Levante, MC20

### MARCAS BRITÁNICAS:
- **Land Rover**: Discovery, Range Rover, Range Rover Sport, Range Rover Evoque, Defender
- **Jaguar**: XE, XF, F-Pace, E-Pace, I-Pace
- **MINI**: Cooper, Countryman, Clubman, Convertible
- **Aston Martin**: Vantage, DB11, DBS, DBX
- **McLaren**: 570S, 720S, Artura, 765LT

### MARCAS AMERICANAS:
- **Ford**: Fiesta, Focus, Mondeo, EcoSport, Kuga, Explorer, Mustang
- **Chevrolet**: Spark, Cruze, Malibu, Equinox, Tahoe, Camaro, Corvette
- **Cadillac**: CT4, CT5, Escalade, XT4, XT5, XT6
- **Tesla**: Model 3, Model S, Model X, Model Y

### MARCAS SUECAS:
- **Volvo**: XC40, XC60, XC90, S60, S90, V40, V60, V90

### MARCAS CHECAS:
- **Škoda**: Fabia, Octavia, Superb, Kamiq, Karoq, Kodiaq

### MARCAS ESPAÑOLAS:
- **SEAT**: Ibiza, León, Ateca, Tarraco, Arona, Alhambra
- **Cupra**: Formentor, León, Ateca, Born

## 📄 ARCHIVO JSON PARA FRONTEND:

```json
{
  "brands": [
    {
      "name": "Abarth",
      "models": ["124 Spider", "500", "595", "695", "Grande Punto", "Punto Evo"]
    },
    {
      "name": "Alfa Romeo", 
      "models": ["147", "156", "159", "4C", "Brera", "Giulia", "Giulietta", "Stelvio", "Tonale"]
    },
    {
      "name": "Audi",
      "models": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "e-tron", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "R8", "TT"]
    }
    // ... continúa con todas las marcas
  ]
}
```

## 🛠️ IMPLEMENTACIÓN EN REACT:

```tsx
// components/forms/BrandModelSelector.tsx
import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const BrandModelSelector = ({ onBrandChange, onModelChange }) => {
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [selectedBrand, setSelectedBrand] = useState('')

  useEffect(() => {
    // Cargar marcas desde API
    fetchBrands()
  }, [])

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId)
    fetchModels(brandId)
    onBrandChange(brandId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Select onValueChange={handleBrandSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona marca" />
        </SelectTrigger>
        <SelectContent>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={onModelChange} disabled={!selectedBrand}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona modelo" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
```

¿Quieres que continúe con el listado completo de todas las marcas y modelos, o prefieres que te prepare directamente los archivos SQL/JSON listos para importar?
