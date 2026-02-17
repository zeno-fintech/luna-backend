# 🌐 Ambientes y URLs - FinUp Backend

**Fecha:** 16 Enero 2025  
**Estado:** ✅ Desarrollo funcionando | ⚠️ Producción caída

---

## 📍 URLs de los Ambientes

### 🟢 AMBIENTE DE DESARROLLO (Local)
- **URL Base:** `http://localhost:3002`
- **Health Check:** `http://localhost:3002/health`
- **API Info:** `http://localhost:3002/api/v1`
- **Swagger UI:** `http://localhost:3002/api-docs`
- **Swagger JSON:** `http://localhost:3002/api-docs.json`
- **Estado:** ✅ **FUNCIONANDO**

### 🔴 AMBIENTE DE PRODUCCIÓN (Railway)
- **URL Base:** `https://luna-backend-production-ff08.up.railway.app`
- **Health Check:** `https://luna-backend-production-ff08.up.railway.app/health`
- **API Info:** `https://luna-backend-production-ff08.up.railway.app/api/v1`
- **Swagger UI:** `https://luna-backend-production-ff08.up.railway.app/api-docs`
- **Estado:** ⚠️ **CAÍDO** (investigando el problema)

---

## 🗄️ Base de Datos

### ✅ CONFIRMADO: UNA SOLA BASE DE DATOS

**Ambos ambientes (dev y prod) usan la MISMA base de datos:**

- **Base de Datos:** `lunaDB`
- **Cluster:** MongoDB Atlas (Cluster0)
- **URI:** `mongodb+srv://***@cluster0.hj7oowi.mongodb.net/lunaDB`
- **Host:** `cluster0.hj7oowi.mongodb.net`

**Esto significa:**
- ✅ Solo hay **una URL de MongoDB** para ambos ambientes
- ✅ Los datos de desarrollo y producción están en la misma base de datos
- ✅ No hay separación de datos entre ambientes
- ⚠️ **Cuidado:** Los cambios en desarrollo afectan los mismos datos que producción

---

## 📁 Archivos .env

### ✅ SOLO NECESITAS UN ARCHIVO `.env` (Para Desarrollo)

**Para desarrollo local:**
- ✅ **Archivo:** `.env` (en la raíz del proyecto)
- ✅ **Uso:** Solo cuando ejecutas `npm run dev` en tu computadora
- ✅ **NO se commitea** en git (está en `.gitignore`)

**Para producción (Railway):**
- ✅ **NO usa archivos `.env`**
- ✅ **Usa Variables de Entorno** configuradas en Railway Dashboard
- ✅ Se configuran manualmente en Railway → Variables

---

## 🔧 Configuración Actual

### Desarrollo Local (`.env`)
```env
# Servidor
PORT=3002
NODE_ENV=development

# MongoDB (MISMA que producción)
MONGODB_URI=mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

### Producción (Railway Variables)
```env
# Servidor (Railway asigna PORT automáticamente)
NODE_ENV=production

# MongoDB (MISMA que desarrollo)
MONGODB_URI=mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority

# JWT (debe ser diferente al de desarrollo)
JWT_SECRET=secreto_diferente_para_produccion_456...

# CORS
CORS_ORIGIN=https://tu-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

---

## 📊 Resumen

| Aspecto | Desarrollo | Producción |
|---------|-----------|------------|
| **URL** | `http://localhost:3002` | `https://luna-backend-production-ff08.up.railway.app` |
| **Estado** | ✅ Funcionando | ⚠️ Caído |
| **Base de Datos** | `lunaDB` (MISMA) | `lunaDB` (MISMA) |
| **Configuración** | Archivo `.env` | Railway Variables |
| **Puerto** | 3002 (fijo) | Asignado por Railway |
| **NODE_ENV** | `development` | `production` |

---

## ✅ Respuestas a tus Preguntas

### 1. ¿Cuáles son las URLs de los 2 ambientes?
- **Dev:** `http://localhost:3002`
- **Prod:** `https://luna-backend-production-ff08.up.railway.app` (caído)

### 2. ¿Es una sola base de datos?
- ✅ **SÍ, es UNA SOLA base de datos** (`lunaDB`)
- ✅ Ambos ambientes (dev y prod) se conectan a la misma MongoDB
- ✅ Una sola URL de conexión para ambos

### 3. ¿Necesito 2 archivos .env?
- ✅ **NO, solo necesitas UN archivo `.env`** (para desarrollo)
- ✅ Producción NO usa archivos `.env`, usa Variables de Entorno en Railway Dashboard
- ✅ El archivo `.env` es solo para desarrollo local

---

## 🚨 Nota Importante

**Como ambos ambientes usan la misma base de datos:**
- ⚠️ Los datos de desarrollo y producción están mezclados
- ⚠️ Los cambios en desarrollo afectan los mismos datos que producción
- ⚠️ Ten cuidado al hacer pruebas o migraciones

**Recomendación para el futuro:**
- Cuando el proyecto crezca, considera separar las bases de datos
- Crear `lunaDB-dev` y `lunaDB-prod` en MongoDB Atlas
- Esto es más seguro pero requiere más mantenimiento

---

## 🔗 Endpoints Comunes

### Desarrollo
```
GET  http://localhost:3002/health
GET  http://localhost:3002/api/v1
GET  http://localhost:3002/api-docs
POST http://localhost:3002/api/v1/auth/login
GET  http://localhost:3002/api/v1/patrimonio/activos?perfilID=xxx
```

### Producción (cuando esté funcionando)
```
GET  https://luna-backend-production-ff08.up.railway.app/health
GET  https://luna-backend-production-ff08.up.railway.app/api/v1
GET  https://luna-backend-production-ff08.up.railway.app/api-docs
POST https://luna-backend-production-ff08.up.railway.app/api/v1/auth/login
GET  https://luna-backend-production-ff08.up.railway.app/api/v1/patrimonio/activos?perfilID=xxx
```

---

**Última actualización:** 16 Enero 2025
