# 🔐 Configuración de Autenticación - CochesToday

## ✅ **Correcciones Realizadas**

### **1. Ruta de Callback Creada**
- ✅ Creado `/app/auth/callback/route.js`
- ✅ Maneja el código de autenticación de Google y Magic Link
- ✅ Redirige correctamente después de autenticación

### **2. Páginas de Auth Actualizadas**
- ✅ Sign-in y Sign-up ahora usan `window.location.origin` para callback
- ✅ Magic Link habilitado con `magicLink={true}`
- ✅ Textos completamente en español
- ✅ Logo actualizado a `/logo.png`

### **3. Header Actualizado**
- ✅ Textos en español ("Iniciar Sesión", "Cerrar Sesión")
- ✅ Logo correcto (`/logo.png`)
- ✅ Navegación mejorada

### **4. Footer Profesional**
- ✅ Footer moderno creado con enlaces
- ✅ Redes sociales
- ✅ Información de contacto
- ✅ Completamente en español

---

## 🔧 **Configuración de Google OAuth en Supabase**

### **Paso 1: Obtener Credenciales de Google Cloud**

Ya tienes tu proyecto en Google Cloud Console. Ahora:

1. Ve a https://console.cloud.google.com/
2. Selecciona tu proyecto
3. **APIs & Services** → **Credentials**
4. Busca tu **OAuth 2.0 Client ID**
5. Copia:
   - **Client ID** (algo como: `123456789-abc.apps.googleusercontent.com`)
   - **Client Secret** (algo como: `GOCSPX-abc123...`)

### **Paso 2: Configurar en Supabase Dashboard**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto **CochesToday**
3. **Authentication** → **Providers**
4. Busca **Google** y haz clic
5. Activa **Enable Google provider**
6. Pega:
   - **Client ID** (de Google Cloud)
   - **Client Secret** (de Google Cloud)
7. **Copia la Callback URL** que Supabase te muestra (algo como):
   ```
   https://[tu-project-ref].supabase.co/auth/v1/callback
   ```

### **Paso 3: Agregar Callback URL en Google Cloud**

1. Vuelve a Google Cloud Console
2. **APIs & Services** → **Credentials**
3. Click en tu **OAuth 2.0 Client ID**
4. En **Authorized redirect URIs**, agrega:
   ```
   https://[tu-project-ref].supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
5. **Save**

### **Paso 4: Configurar URLs en Supabase**

1. En Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL:**
   ```
   http://localhost:3000
   ```
   (En producción: `https://tu-dominio.com`)

3. **Redirect URLs** (agregar estas líneas):
   ```
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   https://tu-dominio.com/**
   https://tu-dominio.com/auth/callback
   ```

---

## 📧 **Configuración de Magic Link**

Magic Link ya está habilitado por defecto. Solo verifica:

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
2. Asegúrate de que:
   - ✅ **Enable Email provider** esté activado
   - ✅ **Confirm email** esté activado (para seguridad)
   - ✅ **Secure email change** esté activado

### **Personalizar Email de Magic Link (Opcional)**

1. **Authentication** → **Email Templates** → **Magic Link**
2. Personaliza el template:
   ```html
   <h2>¡Bienvenido a CochesToday!</h2>
   <p>Haz clic en el siguiente enlace para iniciar sesión:</p>
   <a href="{{ .ConfirmationURL }}">Iniciar Sesión</a>
   <p>Este enlace expira en 1 hora.</p>
   ```

---

## 🧪 **Probar la Autenticación**

### **1. Probar Email/Password**
```bash
1. Ve a http://localhost:3000/sign-up
2. Ingresa email y contraseña (mínimo 6 caracteres)
3. Click en "Crear cuenta"
4. Revisa tu email para confirmar
5. Click en el enlace de confirmación
6. Serás redirigido y autenticado
```

### **2. Probar Magic Link**
```bash
1. Ve a http://localhost:3000/sign-in
2. Ingresa tu email
3. Click en "Enviar enlace mágico"
4. Revisa tu email
5. Click en el enlace mágico
6. Serás autenticado automáticamente
```

### **3. Probar Google OAuth**
```bash
1. Ve a http://localhost:3000/sign-in
2. Click en "Continuar con Google"
3. Selecciona tu cuenta de Google
4. Autoriza la aplicación
5. Serás redirigido a /auth/callback
6. Luego a la página principal autenticado
```

---

## 🔍 **Verificar que Funciona**

### **Después de autenticarte:**

1. **Verifica en Supabase Dashboard:**
   - **Authentication** → **Users**
   - Deberías ver tu usuario creado

2. **Verifica en la Base de Datos:**
   ```sql
   SELECT * FROM "User" WHERE email = 'tu@email.com';
   SELECT * FROM "UserProfile" WHERE "userId" = 'tu-user-id';
   ```

3. **Verifica en la App:**
   - El header debe mostrar "Cerrar Sesión"
   - Debes poder acceder a `/saved-cars`
   - Debes poder acceder a `/publish`

---

## ❌ **Solución de Problemas**

### **Error: "Page Not Found" después de Google Auth**
✅ **SOLUCIONADO** - Creada ruta `/app/auth/callback/route.js`

### **Error: "No se crea usuario en Supabase"**
**Posibles causas:**
1. **Email confirmation no configurado:**
   - Ve a Supabase → Authentication → Providers → Email
   - Desactiva temporalmente "Confirm email" para testing

2. **Callback URL incorrecto:**
   - Verifica que en Google Cloud Console tengas:
     ```
     http://localhost:3000/auth/callback
     https://[project-ref].supabase.co/auth/v1/callback
     ```

3. **Variables de entorno:**
   - Verifica que `.env` tenga:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
     ```

### **Magic Link no llega**
1. Revisa tu carpeta de spam
2. Verifica que el email provider esté habilitado
3. Comprueba los logs en Supabase Dashboard → Logs

### **Google OAuth no funciona**
1. Verifica que las credenciales estén correctas en Supabase
2. Asegúrate de que el proyecto de Google esté en modo "Testing" o "Production"
3. Verifica que tu email esté en la lista de "Test users" (si está en Testing)

---

## 📝 **Variables de Entorno Necesarias**

Tu archivo `.env` debe tener:

```bash
# Supabase (REQUERIDO)
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://...

# Site URL (REQUERIDO para auth)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Otras (opcionales)
GEMINI_API_KEY=tu-key
ARCJET_KEY=tu-key
```

---

## ✅ **Checklist de Configuración**

- [ ] Google OAuth configurado en Google Cloud Console
- [ ] Credenciales agregadas en Supabase Dashboard
- [ ] Callback URLs configuradas en ambos lados
- [ ] Site URL configurado en Supabase
- [ ] Redirect URLs configuradas en Supabase
- [ ] Email provider habilitado
- [ ] Variables de entorno correctas en `.env`
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Probado registro con email/password
- [ ] Probado Magic Link
- [ ] Probado Google OAuth
- [ ] Usuario creado en Supabase
- [ ] UserProfile creado automáticamente

---

## 🎉 **¡Listo!**

Una vez completados todos los pasos, tu autenticación estará 100% funcional con:
- ✅ Email/Password
- ✅ Magic Link
- ✅ Google OAuth

**¿Necesitas ayuda con algún paso específico?** Revisa la sección de "Solución de Problemas" o contacta al equipo de desarrollo.
