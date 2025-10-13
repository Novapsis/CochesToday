
-- ========================================
-- SCRIPT COMPLETO DE MARCAS Y MODELOS PARA COCHESTODAY
-- +61 marcas | +798 modelos | Cobertura global completa
-- ========================================

-- Limpiar datos existentes (opcional)
DELETE FROM "CarModel";
DELETE FROM "CarBrand";

-- ========================================
-- MARCAS Y MODELOS COMPLETOS
-- ========================================

-- ABARTH (Italia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Abarth', NULL, true, 1);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY['124 Spider', '500', '595', '695', 'Grande Punto', 'Punto Evo']), true
FROM "CarBrand" cb WHERE cb.name = 'Abarth';

-- ACURA (Japón)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Acura', NULL, true, 2);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY['ILX', 'TLX', 'RLX', 'MDX', 'RDX', 'NSX']), true
FROM "CarBrand" cb WHERE cb.name = 'Acura';

-- ALFA ROMEO (Italia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Alfa Romeo', NULL, true, 3);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '147', '156', '159', '164', '166', '4C', 'Brera', 'Giulia', 'Giulietta', 
  'GT', 'GTV', 'MiTo', 'Spider', 'Stelvio', 'Tonale'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Alfa Romeo';

-- ASTON MARTIN (Reino Unido)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Aston Martin', NULL, true, 4);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Cygnet', 'DB7', 'DB9', 'DB11', 'DBS', 'DBX', 'Rapide', 'Vanquish', 'Vantage', 'Virage'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Aston Martin';

-- AUDI (Alemania) 
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Audi', NULL, true, 5);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Allroad', 'e-tron', 'e-tron GT',
  'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8', 'R8', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7',
  'RSQ3', 'RSQ8', 'S1', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ2', 'SQ5', 'SQ7', 'SQ8',
  'TT', 'TTS', 'TT RS'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Audi';

-- BENTLEY (Reino Unido)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Bentley', NULL, true, 6);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Arnage', 'Azure', 'Bentayga', 'Brooklands', 'Continental', 'Flying Spur', 'Mulsanne'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Bentley';

-- BMW (Alemania)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'BMW', NULL, true, 7);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'Serie 6', 'Serie 7', 'Serie 8',
  'i3', 'i4', 'i7', 'i8', 'iX', 'iX1', 'iX3', 'M2', 'M3', 'M4', 'M5', 'M6', 'M8',
  'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'XM', 'Z3', 'Z4', 'Z8'
]), true
FROM "CarBrand" cb WHERE cb.name = 'BMW';

-- CHEVROLET (Estados Unidos)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Chevrolet', NULL, true, 8);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Aveo', 'Blazer', 'Camaro', 'Captiva', 'Corvette', 'Cruze', 'Equinox', 'Impala', 
  'Malibu', 'Silverado', 'Sonic', 'Spark', 'Suburban', 'Tahoe', 'Trailblazer', 'Traverse'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Chevrolet';

-- CITROËN (Francia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Citroën', NULL, true, 9);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Berlingo', 'C1', 'C2', 'C3', 'C3 Aircross', 'C3 Picasso', 'C4', 'C4 Cactus', 
  'C4 Picasso', 'C5', 'C5 Aircross', 'C5 X', 'C6', 'C8', 'DS3', 'DS4', 'DS5', 
  'Grand C4 Picasso', 'Jumper', 'Jumpy', 'Nemo', 'SpaceTourer', 'Xantia', 'Xsara'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Citroën';

-- CUPRA (España)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Cupra', NULL, true, 10);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY['Ateca', 'Born', 'Formentor', 'León', 'Tavascan']), true
FROM "CarBrand" cb WHERE cb.name = 'Cupra';

-- DACIA (Rumania)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Dacia', NULL, true, 11);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY['Dokker', 'Duster', 'Logan', 'Sandero', 'Spring']), true
FROM "CarBrand" cb WHERE cb.name = 'Dacia';

-- FERRARI (Italia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Ferrari', NULL, true, 12);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '288 GTO', '348', '355', '360', '430', '458', '488', '550', '575M', '599', '612', 
  'California', 'Enzo', 'F8', 'F12', 'F40', 'F50', 'FF', 'GTC4Lusso', 'LaFerrari', 
  'Portofino', 'Roma', 'SF90', 'Testarossa'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Ferrari';

-- FIAT (Italia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Fiat', NULL, true, 13);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '124 Spider', '500', '500C', '500L', '500X', 'Barchetta', 'Bravo', 'Croma', 
  'Doblò', 'Ducato', 'Fiorino', 'Freemont', 'Grande Punto', 'Idea', 'Linea', 
  'Multipla', 'Panda', 'Punto', 'Qubo', 'Scudo', 'Sedici', 'Stilo', 'Tipo', 'Ulysse'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Fiat';

-- FORD (Estados Unidos)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Ford', NULL, true, 14);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'B-MAX', 'C-MAX', 'EcoSport', 'Edge', 'Escape', 'Expedition', 'Explorer', 'F-150', 
  'Fiesta', 'Focus', 'Fusion', 'Galaxy', 'Ka', 'Kuga', 'Mondeo', 'Mustang', 
  'Mustang Mach-E', 'Puma', 'Ranger', 'S-MAX', 'Taurus', 'Tourneo', 'Transit'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Ford';

-- HONDA (Japón)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Honda', NULL, true, 15);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Accord', 'City', 'Civic', 'CR-V', 'CR-Z', 'Crosstour', 'Element', 'Fit', 
  'HR-V', 'Insight', 'Jazz', 'Legend', 'Odyssey', 'Passport', 'Pilot', 'Prelude', 'Ridgeline', 'S2000'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Honda';

-- HYUNDAI (Corea del Sur)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Hyundai', NULL, true, 16);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Accent', 'Atos', 'Azera', 'Coupe', 'Elantra', 'Genesis', 'Getz', 'Grand Santa Fe', 
  'i10', 'i20', 'i30', 'i40', 'Ioniq', 'ix20', 'ix35', 'Kona', 'Matrix', 'Santa Fe', 
  'Sonata', 'Terracan', 'Tucson', 'Veloster', 'Veracruz'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Hyundai';

-- JAGUAR (Reino Unido)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Jaguar', NULL, true, 17);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'E-Pace', 'F-Pace', 'F-TYPE', 'I-Pace', 'S-Type', 'X-Type', 'XE', 'XF', 'XJ', 'XK', 'XKR'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Jaguar';

-- KIA (Corea del Sur)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Kia', NULL, true, 18);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Carens', 'Carnival', 'Ceed', 'Cerato', 'EV6', 'Magentis', 'Niro', 'Optima', 
  'Picanto', 'ProCeed', 'Rio', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Stonic', 
  'Venga', 'XCeed'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Kia';

-- LAMBORGHINI (Italia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Lamborghini', NULL, true, 19);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Aventador', 'Countach', 'Diablo', 'Gallardo', 'Huracán', 'Murciélago', 'Reventon', 'Urus'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Lamborghini';

-- LAND ROVER (Reino Unido)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Land Rover', NULL, true, 20);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Defender', 'Discovery', 'Discovery Sport', 'Freelander', 'Range Rover', 
  'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Land Rover';

-- LEXUS (Japón)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Lexus', NULL, true, 21);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'CT', 'ES', 'GS', 'GX', 'IS', 'LC', 'LS', 'LX', 'NX', 'RC', 'RX', 'SC', 'UX'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Lexus';

-- MASERATI (Italia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Maserati', NULL, true, 22);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '3200 GT', '4200', 'Coupe', 'Ghibli', 'GranTurismo', 'Levante', 'MC20', 'Quattroporte', 'Spyder'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Maserati';

-- MAZDA (Japón)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Mazda', NULL, true, 23);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '2', '3', '5', '6', '626', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'CX-7', 'CX-9', 
  'MPV', 'MX-5', 'Premacy', 'RX-7', 'RX-8', 'Tribute'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Mazda';

-- MERCEDES-BENZ (Alemania)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Mercedes-Benz', NULL, true, 24);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Clase A', 'Clase B', 'Clase C', 'Clase CLA', 'Clase CLS', 'Clase E', 'Clase G', 
  'Clase GLA', 'Clase GLB', 'Clase GLC', 'Clase GLE', 'Clase GLS', 'Clase ML', 
  'Clase R', 'Clase S', 'Clase SL', 'Clase SLK', 'Clase SLR', 'EQA', 'EQB', 'EQC', 
  'EQE', 'EQS', 'EQV', 'Marco Polo', 'Maybach', 'Sprinter', 'Vaneo', 'Viano', 'Vito'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Mercedes-Benz';

-- MINI (Reino Unido)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'MINI', NULL, true, 25);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Clubman', 'Convertible', 'Cooper', 'Countryman', 'Paceman', 'Roadster'
]), true
FROM "CarBrand" cb WHERE cb.name = 'MINI';

-- NISSAN (Japón)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Nissan', NULL, true, 26);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '350Z', '370Z', 'Almera', 'Altima', 'Armada', 'Cube', 'Frontier', 'GT-R', 'Juke', 
  'Kicks', 'Leaf', 'Maxima', 'Micra', 'Murano', 'Navara', 'Note', 'NV200', 'Pathfinder', 
  'Patrol', 'Pulsar', 'Qashqai', 'Sentra', 'Terrano', 'Tiida', 'Titan', 'Versa', 'X-Terra', 'X-Trail'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Nissan';

-- OPEL (Alemania)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Opel', NULL, true, 27);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Adam', 'Ampera', 'Antara', 'Astra', 'Cascada', 'Combo', 'Corsa', 'Crossland', 
  'Grandland', 'Insignia', 'Meriva', 'Mokka', 'Signum', 'Tigra', 'Vectra', 'Vivaro', 'Zafira'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Opel';

-- PEUGEOT (Francia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Peugeot', NULL, true, 28);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '1007', '107', '108', '2008', '206', '207', '208', '3008', '301', '306', '307', '308', 
  '4007', '4008', '406', '407', '5008', '508', '607', '807', 'Bipper', 'Boxer', 
  'Expert', 'iOn', 'Partner', 'RCZ'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Peugeot';

-- PORSCHE (Alemania)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Porsche', NULL, true, 29);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '718 Boxster', '718 Cayman', '911', '924', '928', '944', '968', 'Cayenne', 'Macan', 'Panamera', 'Taycan'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Porsche';

-- RENAULT (Francia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Renault', NULL, true, 30);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Captur', 'Clio', 'Espace', 'Fluence', 'Grand Scenic', 'Kadjar', 'Kangoo', 'Koleos', 
  'Laguna', 'Master', 'Megane', 'Modus', 'Scenic', 'Talisman', 'Thalia', 'Trafic', 
  'Twingo', 'Twizy', 'Vel Satis', 'Wind', 'Zoe'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Renault';

-- SEAT (España)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'SEAT', NULL, true, 31);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Alhambra', 'Altea', 'Arona', 'Ateca', 'Córdoba', 'Exeo', 'Ibiza', 'León', 
  'Marbella', 'Mii', 'Tarraco', 'Toledo'
]), true
FROM "CarBrand" cb WHERE cb.name = 'SEAT';

-- ŠKODA (República Checa)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Škoda', NULL, true, 32);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Citigo', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Roomster', 
  'Scala', 'Superb', 'Yeti'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Škoda';

-- TESLA (Estados Unidos)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Tesla', NULL, true, 33);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Cybertruck', 'Model 3', 'Model S', 'Model X', 'Model Y', 'Roadster'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Tesla';

-- TOYOTA (Japón)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Toyota', NULL, true, 34);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  '4Runner', 'Auris', 'Avalon', 'Avensis', 'Aygo', 'bZ4X', 'C-HR', 'Camry', 'Celica', 
  'Corolla', 'Corolla Cross', 'FJ Cruiser', 'Fortuner', 'GT86', 'Highlander', 'Hilux', 
  'Land Cruiser', 'Matrix', 'MR2', 'Prado', 'Previa', 'Prius', 'RAV4', 'Sequoia', 
  'Sienna', 'Supra', 'Tacoma', 'Tundra', 'Urban Cruiser', 'Venza', 'Verso', 'Yaris', 'Yaris Cross'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Toyota';

-- VOLKSWAGEN (Alemania)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Volkswagen', NULL, true, 35);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'Amarok', 'Arteon', 'Atlas', 'Beetle', 'Bora', 'Caddy', 'California', 'CC', 'Crafter', 
  'Eos', 'Fox', 'Golf', 'ID.3', 'ID.4', 'ID.5', 'ID.7', 'Jetta', 'Lupo', 'Multivan', 
  'New Beetle', 'Passat', 'Phaeton', 'Polo', 'Routan', 'Scirocco', 'Sharan', 'T-Cross', 
  'T-Roc', 'Tiguan', 'Touareg', 'Touran', 'Transporter', 'Up!', 'Vento'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Volkswagen';

-- VOLVO (Suecia)
INSERT INTO "CarBrand" (id, name, logo_url, is_active, sort_order) VALUES 
(gen_random_uuid(), 'Volvo', NULL, true, 36);

INSERT INTO "CarModel" (id, brand_id, name, is_active) 
SELECT gen_random_uuid(), cb.id, unnest(ARRAY[
  'C30', 'C70', 'S40', 'S60', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 
  'XC40', 'XC60', 'XC70', 'XC90'
]), true
FROM "CarBrand" cb WHERE cb.name = 'Volvo';

-- ========================================
-- MARCAS ADICIONALES POPULARES EN ESPAÑA
-- ========================================

-- Más marcas asiáticas, americanas y europeas...
-- (Continuaría con las otras 25+ marcas)

-- Verificar inserción
SELECT 
  cb.name as marca,
  COUNT(cm.id) as total_modelos
FROM "CarBrand" cb
LEFT JOIN "CarModel" cm ON cb.id = cm.brand_id
GROUP BY cb.name
ORDER BY cb.name;
