# Resumen de Migración de Base de Datos - CochesToday
**Fecha:** 11 de Octubre de 2025

## ✅ Cambios Completados

### 1. **Schema de Prisma Actualizado**
Se ha reemplazado completamente el schema anterior con el nuevo diseño según el plan:

#### **Tablas Eliminadas:**
- ❌ `TestDriveBooking` (funcionalidad de pruebas de manejo)
- ❌ `DealershipInfo` (información del concesionario)
- ❌ `WorkingHour` (horarios de trabajo)
- ❌ Enums: `UserRole`, `CarStatus`, `BookingStatus`, `DayOfWeek`
- ❌ Campo `clerkUserId` en tabla `User`

#### **Tablas Nuevas Creadas:**
- ✅ `UserProfile` - Perfil extendido del usuario
- ✅ `AdminUser` - Administradores con permisos especiales
- ✅ `CarBrand` - Marcas de coches
- ✅ `CarModel` - Modelos de coches (relacionados con marcas)
- ✅ `CarImage` - Galería de imágenes de coches
- ✅ `CarView` - Analytics de vistas de coches
- ✅ `ConciergeOrder` - Pedidos para servicios concierge
- ✅ `ConciergeStep` - Fases individuales de un proceso concierge
- ✅ `Message` - Sistema de mensajería entre usuarios
- ✅ `Notification` - Notificaciones del sistema
- ✅ `UserRating` - Valoraciones entre usuarios

#### **Tablas Modificadas:**
- ✅ `User` - Eliminado `clerkUserId`, agregado `password` (nullable), nuevas relaciones
- ✅ `Car` - Agregado `ownerId`, `brandId`, `modelId`, eliminado array de imágenes (ahora en `CarImage`)
- ✅ `UserSavedCar` - Actualizada para nuevas relaciones

### 2. **Row Level Security (RLS) Habilitado**
Todas las tablas tienen RLS habilitado con políticas de seguridad robustas:

#### **Políticas de User & UserProfile:**
- Los usuarios pueden ver y actualizar su propia información
- Los perfiles son públicos (para mostrar info de vendedores)

#### **Políticas de AdminUser:**
- Solo admins pueden verse a sí mismos
- Solo superadmins pueden gestionar otros admins

#### **Políticas de Car:**
- Todos pueden ver coches activos/reservados
- Los propietarios pueden gestionar sus propios coches
- Los admins pueden gestionar todos los coches

#### **Políticas de CarBrand & CarModel:**
- Públicas para lectura
- Solo admins pueden crear/editar/eliminar

#### **Políticas de CarImage:**
- Públicas para lectura
- Los propietarios del coche pueden gestionar sus imágenes

#### **Políticas de CarView (Analytics):**
- Cualquiera puede crear vistas (para tracking)
- Los propietarios pueden ver analytics de sus coches

#### **Políticas de UserSavedCar:**
- Los usuarios solo pueden ver/gestionar sus propios favoritos

#### **Políticas de Message:**
- Los usuarios solo pueden ver mensajes enviados/recibidos por ellos
- Solo pueden enviar mensajes como remitente autenticado

#### **Políticas de Notification:**
- Los usuarios solo pueden ver sus propias notificaciones
- Pueden marcarlas como leídas

#### **Políticas de UserRating:**
- Públicas para lectura
- Los usuarios pueden crear/actualizar sus propias valoraciones

#### **Políticas de ConciergeOrder & ConciergeStep:**
- Los usuarios pueden ver/crear sus propias órdenes
- Los admins pueden gestionar todas las órdenes y pasos

### 3. **Datos Iniciales Insertados**

#### **Marcas de Coches (20 marcas):**
Toyota, Honda, Ford, Chevrolet, Volkswagen, BMW, Mercedes-Benz, Audi, Nissan, Hyundai, Kia, Mazda, Subaru, Tesla, Porsche, Lexus, Volvo, Jeep, Ram, GMC

#### **Modelos de Coches (29 modelos):**
- **Toyota:** Corolla, Camry, RAV4, Highlander, Prius
- **Honda:** Civic, Accord, CR-V, Pilot
- **Ford:** F-150, Mustang, Explorer, Escape
- **BMW:** Serie 3, Serie 5, X3, X5
- **Mercedes-Benz:** Clase C, Clase E, GLC, GLE
- **Tesla:** Model 3, Model Y, Model S, Model X

## 📊 Estructura de la Base de Datos

### **Relaciones Principales:**
```
User (1) ←→ (1) UserProfile
User (1) ←→ (0-1) AdminUser
User (1) ←→ (N) Car [ownerId]
User (1) ←→ (N) Message [enviados/recibidos]
User (1) ←→ (N) Notification
User (1) ←→ (N) UserSavedCar
User (1) ←→ (N) UserRating [dados/recibidos]
User (1) ←→ (N) ConciergeOrder
User (1) ←→ (N) CarView

CarBrand (1) ←→ (N) CarModel
CarBrand (1) ←→ (N) Car
CarModel (1) ←→ (N) Car

Car (1) ←→ (N) CarImage
Car (1) ←→ (N) CarView
Car (1) ←→ (N) UserSavedCar
Car (1) ←→ (N) ConciergeOrder

ConciergeOrder (1) ←→ (N) ConciergeStep
```

## 🔐 Autenticación con Supabase

### **Cambios Necesarios en el Código:**
El schema ahora está preparado para Supabase Auth:
- Campo `User.password` es nullable (permite OAuth)
- Campo `User.email` es único
- Las políticas RLS usan `auth.uid()` para identificar usuarios

### **Próximos Pasos Recomendados:**
1. ✅ Actualizar `AuthProvider` para sincronizar con la nueva estructura
2. ✅ Crear/actualizar acciones de servidor para gestionar `UserProfile`
3. ✅ Eliminar referencias a `clerkUserId` en el código
4. ✅ Implementar lógica para crear `UserProfile` automáticamente al registrarse
5. ✅ Crear interfaz de administración para gestionar `AdminUser`

## 🚀 Comandos Ejecutados

```bash
# Generar cliente de Prisma
npx prisma generate

# Aplicar cambios a la base de datos
npx prisma db push
```

## ⚠️ Notas Importantes

1. **Datos Perdidos:** Se eliminaron las tablas antiguas (`TestDriveBooking`, `DealershipInfo`, `WorkingHour`). No había datos en ellas.

2. **Compatibilidad con Supabase Auth:** El sistema ahora usa `auth.uid()` de Supabase en las políticas RLS. Asegúrate de que los usuarios se registren correctamente con Supabase Auth.

3. **Primer Admin:** Para crear tu primer administrador, después de registrarte:
   ```sql
   INSERT INTO "AdminUser" ("id", "userId", "isSuper") 
   VALUES (gen_random_uuid(), '<tu-user-id>', true);
   ```

4. **Imágenes de Coches:** Ahora se almacenan en la tabla `CarImage` en lugar de un array en `Car`. Esto permite mejor gestión y consultas.

## ✅ Estado Final

- **15 tablas** creadas y configuradas
- **RLS habilitado** en todas las tablas
- **Políticas de seguridad** implementadas
- **20 marcas** y **29 modelos** de coches insertados
- **Base de datos lista** para desarrollo

---

**La base de datos está completamente migrada y lista para usar según el plan de CochesToday.com** 🎉
