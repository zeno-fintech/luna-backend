# 🔧 Correcciones Necesarias en Railway

## ❌ Problemas Detectados

### 1. **MONGODB_URI tiene placeholders**
```
❌ mongodb+srv://user:password@cluster.mongodb.net/lunaDB?retryWrites=true&w=majority
```

**Problema:** Tiene `user:password` que son placeholders, no credenciales reales.

**Solución:** Reemplaza con tus credenciales reales de MongoDB Atlas.

### 2. **CORS_ORIGIN apunta a localhost**
```
❌ CORS_ORIGIN="http://localhost:3001"
```

**Problema:** En producción debe apuntar a tu dominio de Railway o frontend.

**Solución:** Cambia a la URL de Railway o tu frontend.

### 3. **NODE_ENV está en development**
```
❌ NODE_ENV="development"
```

**Problema:** En Railway debe ser `production`.

**Solución:** Cambia a `production`.

---

## ✅ Variables Correctas para Railway

### 1. **MONGODB_URI** (CRÍTICO - Esto está causando el CRASH)

**Formato correcto:**
```
MONGODB_URI="mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority"
```

**Pasos:**
1. Ve a MongoDB Atlas → Database → Connect
2. Selecciona "Connect your application"
3. Copia la connection string
4. Reemplaza `<password>` con tu contraseña real: `tiendaBackend2025`
5. Asegúrate de que incluya `/lunaDB` antes de los parámetros

**Ejemplo completo:**
```
mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority
```

### 2. **CORS_ORIGIN**

**Opción A - Si tienes frontend en Vercel/Netlify:**
```
CORS_ORIGIN="https://tu-frontend.vercel.app"
```

**Opción B - Si quieres permitir tu dominio de Railway:**
```
CORS_ORIGIN="https://luna-backend-production-ff08.up.railway.app"
```

⚠️ **IMPORTANTE:** Debe incluir `https://` al inicio de la URL.

**Opción C - Si quieres permitir múltiples orígenes (temporal para desarrollo):**
```
CORS_ORIGIN="http://localhost:3001,https://tu-proyecto.railway.app,https://tu-frontend.vercel.app"
```

**⚠️ Nota:** El código actual solo acepta un origen. Si necesitas múltiples, hay que modificar el código.

### 3. **NODE_ENV**

```
NODE_ENV="production"
```

---

## 📋 Checklist de Variables en Railway

Copia y pega estas variables en Railway (reemplaza los valores):

```env
BCRYPT_ROUNDS="12"
CORS_ORIGIN="https://tu-proyecto.railway.app"
JWT_EXPIRE="30d"
JWT_SECRET="f6e171547540d3d266f458641241dc6a869661fb5701b35415e734b25184ebeb80884049ffa81fbe5dfaa075644436bd8b3000cba8e2f36486e4f96f215400f5"
MONGODB_URI="mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority"
NODE_ENV="production"
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="900000"
```

**⚠️ IMPORTANTE:**
- Reemplaza `tu-proyecto.railway.app` con la URL real de tu proyecto en Railway
- Verifica que `MONGODB_URI` tenga las credenciales correctas
- Asegúrate de que MongoDB Atlas permita conexiones desde Railway (whitelist IP)

---

## 🔍 Verificar MongoDB Atlas

### 1. **Network Access (Whitelist)**
1. Ve a MongoDB Atlas → Security → Network Access
2. Agrega `0.0.0.0/0` (permite desde cualquier IP) o la IP específica de Railway
3. Click en "Add IP Address"

### 2. **Database User**
1. Ve a Security → Database Access
2. Verifica que el usuario `dbUserTiendaBackend` existe
3. Verifica que la contraseña es `tiendaBackend2025`

---

## 🚀 Después de Corregir

1. **Actualiza las variables en Railway**
2. **Haz click en "Restart"** en el deployment crashed
3. **Espera 1-2 minutos** para que Railway reinicie
4. **Verifica los logs** en Railway Dashboard
5. **Prueba el health check:** `https://tu-proyecto.railway.app/health`

---

## 🐛 Si Sigue Fallando

### Verifica los Logs en Railway:
1. Ve a Railway Dashboard → Deployments
2. Click en el deployment más reciente
3. Revisa los logs para ver el error exacto

### Errores Comunes:

**Error: "MongoServerError: Authentication failed"**
- Las credenciales en `MONGODB_URI` son incorrectas
- Verifica usuario y contraseña en MongoDB Atlas

**Error: "MongoServerError: IP not whitelisted"**
- La IP de Railway no está en la whitelist de MongoDB Atlas
- Agrega `0.0.0.0/0` temporalmente para probar

**Error: "Connection timeout"**
- Verifica que la URI esté correcta
- Verifica que el cluster esté activo en MongoDB Atlas

---

## ✅ Resumen de Cambios Necesarios

1. ✅ **MONGODB_URI:** Reemplazar `user:password` con credenciales reales
2. ✅ **CORS_ORIGIN:** Cambiar de `localhost:3001` a URL de Railway
3. ✅ **NODE_ENV:** Cambiar de `development` a `production`
4. ✅ **Verificar MongoDB Atlas:** Whitelist y credenciales

