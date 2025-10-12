# Configuración de Autenticación - CochesToday

## 🔐 Métodos de Autenticación Disponibles

La aplicación ahora soporta **3 métodos de autenticación**:

1. ✅ **Email/Password** - Autenticación tradicional
2. ✅ **Magic Link** - Enlace mágico por email (sin contraseña)
3. ✅ **Google OAuth** - Inicio de sesión con Google

---

## 📋 Configuración Requerida en Supabase

### **1. Habilitar Magic Link (Ya configurado por defecto)**

Magic Link ya está habilitado en Supabase por defecto. Solo necesitas:

1. Ve a **Supabase Dashboard** → Tu proyecto
2. **Authentication** → **Providers** → **Email**
3. Asegúrate de que **Enable Email provider** esté activado
4. **Confirm email** debe estar activado para seguridad

✅ **Ya está listo para usar**

---

### **2. Configurar Google OAuth**

#### **Paso 1: Crear credenciales en Google Cloud Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** → **Credentials**
4. Click en **Create Credentials** → **OAuth 2.0 Client ID**
5. Si es la primera vez, configura la **OAuth consent screen**:
   - User Type: **External**
   - App name: **CochesToday**
   - User support email: Tu email
   - Developer contact: Tu email
   - Scopes: Agrega `email` y `profile`
   - Test users: Agrega tu email para testing

6. Vuelve a **Credentials** → **Create OAuth Client ID**:
   - Application type: **Web application**
   - Name: **CochesToday**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://tu-dominio.com
     ```
   - Authorized redirect URIs:
     ```
     https://[TU-PROJECT-REF].supabase.co/auth/v1/callback
     ```
     (Reemplaza `[TU-PROJECT-REF]` con tu Project Reference de Supabase)

7. Copia el **Client ID** y **Client Secret**

#### **Paso 2: Configurar en Supabase**

1. Ve a **Supabase Dashboard** → Tu proyecto
2. **Authentication** → **Providers** → **Google**
3. Activa **Enable Google provider**
4. Pega:
   - **Client ID** (de Google Cloud Console)
   - **Client Secret** (de Google Cloud Console)
5. Copia la **Callback URL** que Supabase te muestra
6. Vuelve a Google Cloud Console y asegúrate de que esta URL esté en **Authorized redirect URIs**
7. Click **Save** en Supabase

✅ **Google Auth configurado**

---

### **3. Configurar URLs de Redirección**

En **Supabase Dashboard** → **Authentication** → **URL Configuration**:

#### **Site URL:**
```
http://localhost:3000
```
(En producción: `https://tu-dominio.com`)

#### **Redirect URLs:**
```
http://localhost:3000/auth/callback
http://localhost:3000/**
https://tu-dominio.com/auth/callback
https://tu-dominio.com/**
```

---

## 🔧 Variables de Entorno

Asegúrate de tener estas variables en tu archivo `.env`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[TU-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Site URL (para redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# En producción: NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

---

## 🎨 Características de la UI de Autenticación

### **Página de Login (`/sign-in`)**
- ✅ Email/Password tradicional
- ✅ Botón "Continuar con Google"
- ✅ Opción de Magic Link
- ✅ Link a página de registro
- ✅ Diseño moderno con gradientes
- ✅ Totalmente en español

### **Página de Registro (`/sign-up`)**
- ✅ Formulario de registro con email/password
- ✅ Botón "Continuar con Google"
- ✅ Opción de Magic Link
- ✅ Link a página de login
- ✅ Validación de contraseña (mínimo 6 caracteres)
- ✅ Confirmación por email automática

### **Flujo de Autenticación**
1. Usuario se registra o inicia sesión
2. Supabase Auth maneja la autenticación
3. `AuthProvider` detecta el cambio de sesión
4. Se llama a `getOrCreateUser()` que:
   - Busca el usuario en la BD
   - Si no existe, lo crea con su perfil automáticamente
   - Retorna el usuario completo con `profile` y `adminUser`
5. Usuario es redirigido a la página solicitada

---

## 🧪 Probar la Autenticación

### **1. Email/Password**
```bash
1. Ve a http://localhost:3000/sign-up
2. Ingresa email y contraseña
3. Revisa tu email para confirmar
4. Click en el enlace de confirmación
5. Serás redirigido y autenticado automáticamente
```

### **2. Magic Link**
```bash
1. Ve a http://localhost:3000/sign-in
2. Click en "¿Prefieres usar enlace mágico?"
3. Ingresa tu email
4. Revisa tu email
5. Click en el enlace mágico
6. Serás autenticado automáticamente
```

### **3. Google OAuth**
```bash
1. Ve a http://localhost:3000/sign-in
2. Click en "Continuar con Google"
3. Selecciona tu cuenta de Google
4. Autoriza la aplicación
5. Serás redirigido y autenticado automáticamente
```

---

## 🔒 Seguridad

### **Row Level Security (RLS)**
Todas las tablas tienen RLS habilitado. Las políticas usan `auth.uid()` para identificar usuarios.

### **Políticas Implementadas**
- ✅ Los usuarios solo pueden ver/editar su propia información
- ✅ Los perfiles son públicos (para mostrar info de vendedores)
- ✅ Solo admins pueden acceder a rutas `/admin`
- ✅ Los propietarios pueden gestionar sus propios coches
- ✅ Mensajes privados entre usuarios

### **Middleware de Protección**
El middleware protege estas rutas:
- `/admin` - Solo administradores
- `/saved-cars` - Solo usuarios autenticados
- `/profile` - Solo usuarios autenticados
- `/publish` - Solo usuarios autenticados

---

## 📧 Configuración de Emails

### **Templates de Email**
Puedes personalizar los emails en **Supabase Dashboard** → **Authentication** → **Email Templates**:

1. **Confirm signup** - Email de confirmación de registro
2. **Magic Link** - Email con enlace mágico
3. **Change Email Address** - Confirmación de cambio de email
4. **Reset Password** - Email para resetear contraseña

### **Personalización Recomendada**
```html
<!-- Ejemplo de template personalizado -->
<h2>¡Bienvenido a CochesToday!</h2>
<p>Haz click en el siguiente enlace para confirmar tu cuenta:</p>
<a href="{{ .ConfirmationURL }}">Confirmar mi cuenta</a>
```

---

## 🚀 Próximos Pasos

1. ✅ Configurar Google OAuth (seguir pasos arriba)
2. ✅ Personalizar templates de email
3. ✅ Probar todos los flujos de autenticación
4. ✅ Crear tu primer super admin (ver `scripts/create-first-admin.sql`)
5. ✅ Configurar dominio personalizado en producción

---

## 🐛 Troubleshooting

### **Error: "Invalid redirect URL"**
- Verifica que la URL esté en **Redirect URLs** en Supabase
- Asegúrate de que `NEXT_PUBLIC_SITE_URL` esté configurado

### **Error: "Email not confirmed"**
- Revisa tu bandeja de spam
- Verifica que el email provider esté habilitado en Supabase
- En desarrollo, puedes desactivar email confirmation temporalmente

### **Google OAuth no funciona**
- Verifica que las credenciales de Google estén correctas
- Asegúrate de que la Callback URL esté en Google Cloud Console
- Verifica que el proyecto de Google esté en modo "Testing" o "Production"

### **Magic Link no llega**
- Revisa spam
- Verifica que el email provider esté habilitado
- Comprueba los logs en Supabase Dashboard → Logs

---

**¡La autenticación está lista para usar!** 🎉
