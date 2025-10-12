# 🔍 Diagnóstico Completo - Google OAuth No Funciona

## 🚨 Síntomas
- Google Auth no crea sesión
- No aparecen errores en el navegador
- Magic Link funciona correctamente
- Usuario no se crea en Supabase después de Google login

---

## ✅ Pasos de Diagnóstico

### **1. Verificar Variables de Entorno**

```bash
# En .env local:
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
DATABASE_URL=postgresql://...
```

**Acción**: Confirma que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` son del **mismo proyecto** donde activaste Google OAuth.

---

### **2. Verificar Configuración en Supabase Dashboard**

#### **A. Authentication → Providers → Google**

1. Ve a: https://supabase.com/dashboard/project/<tu-project>/auth/providers
2. Busca "Google"
3. Verifica:
   - ✅ **Enabled**: debe estar activado
   - ✅ **Client ID**: debe ser el de Google Cloud Console
   - ✅ **Client Secret**: debe ser el de Google Cloud Console
   - ✅ **Authorize redirect URI**: copia este valor, lo usarás en Google

Ejemplo:
```
https://cwlkmndjcnnpemijoalc.supabase.co/auth/v1/callback
```

#### **B. Authentication → URL Configuration**

1. Ve a: https://supabase.com/dashboard/project/<tu-project>/auth/url-configuration
2. Verifica:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: 
     ```
     http://localhost:3000/**
     http://localhost:3000/auth/callback
     ```

---

### **3. Verificar Configuración en Google Cloud Console**

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Selecciona tu OAuth 2.0 Client ID
3. En **Authorized redirect URIs**, debe incluir:
   ```
   https://cwlkmndjcnnpemijoalc.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
4. **IMPORTANTE**: Después de agregar URIs, espera 5-10 minutos para que Google propague los cambios.

---

### **4. Pantalla de Consentimiento OAuth**

1. Ve a: https://console.cloud.google.com/apis/credentials/consent
2. Si el estado es **"Testing"**:
   - Ve a **"Test users"**
   - Agrega el email que usas para probar
   - Solo los usuarios agregados podrán autenticarse

---

### **5. Revisar Logs del Servidor Next.js**

Después de intentar login con Google, busca en la terminal:

```bash
[auth/callback] code present, attempting session exchange
[auth/callback] session exchange ok, user id: ...
[auth/callback] checkUser completed for: ...
```

**Si NO aparecen estos logs**, significa que el callback NO está recibiendo el `code` de Google.

**Posibles causas**:
- Redirect URI incorrecto
- Google no está redirigiendo a tu callback
- El proveedor no está habilitado en Supabase

---

### **6. Revisar Logs de Supabase**

1. Ve a: https://supabase.com/dashboard/project/<tu-project>/logs/auth-logs
2. Filtra por "Google"
3. Busca errores como:
   - "provider is not enabled"
   - "invalid client"
   - "redirect_uri_mismatch"

---

### **7. Test Manual del Flujo OAuth**

Abre el navegador en modo **Incognito/Privado** y prueba:

1. Ve a: `http://localhost:3000/sign-in`
2. Abre DevTools (F12) → Network tab
3. Click en "Continuar con Google"
4. Observa:
   - Debe redirigir a `accounts.google.com`
   - Después de autorizar, debe redirigir a `https://<project-ref>.supabase.co/auth/v1/callback`
   - Finalmente debe redirigir a `http://localhost:3000/auth/callback?code=...`

**Si falla en algún paso**:
- Captura la URL donde se detiene
- Revisa el mensaje de error de Google

---

### **8. Probar con CURL (Test Directo)**

```bash
# 1. Obtener la URL de autorización de Supabase
curl -X POST 'https://<project-ref>.supabase.co/auth/v1/authorize' \
  -H "apikey: <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "redirectTo": "http://localhost:3000/auth/callback"
  }'
```

Si responde con error, verifica:
- El provider está habilitado
- Las credenciales son correctas

---

### **9. Comparar con Magic Link (Que Funciona)**

Magic Link usa el mismo callback pero con un token diferente. Compara los logs:

**Magic Link** (funciona):
```
[auth/callback] code present, attempting session exchange
[auth/callback] session exchange ok, user id: xxx
```

**Google** (no funciona):
- Si no aparecen logs → el callback no recibe el `code`
- Si aparece error → problema con `exchangeCodeForSession`

---

## 🛠️ Soluciones Comunes

### **Problema 1: "provider is not enabled"**

**Solución**:
```sql
-- Ejecutar en Supabase SQL Editor:
SELECT * FROM auth.config WHERE key = 'external_google_enabled';
-- Debe retornar true
```

Si no existe o es false:
1. Ve a Dashboard → Authentication → Providers
2. Activa Google
3. Guarda

---

### **Problema 2: Cookies no persisten después de login**

**Solución**: Ya implementado en `app/auth/callback/route.js` con:
```javascript
const supabase = createServerClient(..., {
  cookies: {
    get(name) { return request.cookies.get(name)?.value; },
    set(name, value, options) { response.cookies.set({ name, value, ...options }); },
  }
});
```

---

### **Problema 3: redirect_uri_mismatch**

**Error típico de Google**:
```
Error: redirect_uri_mismatch
```

**Solución**:
1. Copia EXACTAMENTE la URL de Supabase:
   ```
   https://cwlkmndjcnnpemijoalc.supabase.co/auth/v1/callback
   ```
2. Pégala en Google Cloud → Authorized redirect URIs
3. **Guarda y espera 5-10 minutos**

---

### **Problema 4: Usuario se crea en auth.users pero no en User/UserProfile**

**Solución**: Ya implementado con:
- **Trigger** en Supabase (crea automáticamente)
- **checkUser()** en callback (backup manual)

Verifica:
```sql
-- En Supabase SQL Editor:
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
-- Debe existir y estar enabled
```

---

## 🔬 Test Definitivo

### **Script de Prueba Completo**

```bash
#!/bin/bash

echo "🔍 Diagnóstico de Google OAuth"
echo "================================"

# 1. Verificar variables
echo "1. Variables de entorno:"
echo "   NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
echo "   ANON_KEY presente: $([ -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] && echo "✅" || echo "❌")"

# 2. Test de conectividad
echo ""
echo "2. Test de Supabase:"
curl -s -o /dev/null -w "   Status: %{http_code}\n" \
  "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/health"

# 3. Verificar Google provider
echo ""
echo "3. Test de Google provider:"
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/authorize" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"provider":"google","redirectTo":"http://localhost:3000/auth/callback"}' \
  | jq '.error' || echo "   ✅ Google provider activo"

echo ""
echo "================================"
echo "🎯 Siguiente paso:"
echo "   1. Revisa los resultados arriba"
echo "   2. Prueba login con Google en http://localhost:3000/sign-in"
echo "   3. Revisa logs del servidor Next.js"
echo "   4. Revisa Supabase Dashboard → Logs"
```

Guarda como `test-google-oauth.sh` y ejecuta:
```bash
chmod +x test-google-oauth.sh
./test-google-oauth.sh
```

---

## 📋 Checklist Final

Antes de probar de nuevo, confirma:

- [ ] Variables .env son correctas y del mismo proyecto
- [ ] Google provider está ENABLED en Supabase
- [ ] Client ID/Secret son correctos
- [ ] Redirect URIs incluyen la URL de Supabase
- [ ] Site URL es `http://localhost:3000`
- [ ] Redirect URLs incluyen `http://localhost:3000/**`
- [ ] Si está en Testing, tu email está en Test users
- [ ] Esperaste 5-10 min después de cambios en Google
- [ ] Probaste en modo incógnito
- [ ] Revisaste logs de servidor Next.js
- [ ] Revisaste logs de Supabase Dashboard

---

## 🆘 Si Aún No Funciona

**Contacto con Supabase Support**:
1. Ve a: https://supabase.com/dashboard/support/new
2. Adjunta:
   - Project ID
   - Logs de Supabase Auth
   - Captura de pantalla de configuración Google
   - URL donde falla el flujo

**Alternativa Temporal**:
- Usa Magic Link (que ya funciona)
- Implementa Email/Password
- Prueba con otro proveedor (GitHub, etc.)

---

## 📝 Notas Importantes

1. **Magic Link funciona** → Supabase Auth está bien configurado
2. **Solo Google falla** → Problema específico con proveedor Google
3. **No hay errores en navegador** → Problema en servidor/Supabase
4. **Callback recibe code** → `exchangeCodeForSession` falla
5. **Callback NO recibe code** → Redirect de Google no llega

---

**Última actualización**: 2025-10-12 00:32 UTC+02
