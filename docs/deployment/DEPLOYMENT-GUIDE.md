# 🚀 Guía de Deployment - LUNA Backend

## 📊 Estado del MVP

**✅ MVP 100% Completo**

Todos los CRUDs están implementados:
- ✅ Perfiles, Cuentas, Transacciones
- ✅ Deudas, Pagos
- ✅ Tableros Financieros, Ingresos
- ✅ Reglas, Categorías, Activos, Ahorros, Presupuestos
- ✅ Analytics, Insights, Resúmenes

**El backend está listo para conectar con frontend** 🎉

---

## 🌐 Opciones de Deployment

### ⚠️ Vercel - No Recomendado para Backend Completo

**Vercel** es excelente para:
- ✅ Frontend (React, Next.js, Vue, etc.)
- ✅ Serverless Functions (funciones pequeñas)
- ❌ **NO es ideal para un backend Express completo**

**Problemas con Vercel:**
- Las funciones serverless tienen timeout limitado (10s en plan gratuito)
- No mantiene estado persistente
- No es ideal para conexiones WebSocket
- Configuración compleja para Express completo

**Si aún quieres usar Vercel:**
- Tendrías que convertir cada endpoint en una función serverless
- Mucho trabajo de refactorización
- No recomendado para este proyecto

---

## ✅ Opciones Recomendadas

### 1. **Railway** ⭐ (Más Recomendado)

**Ventajas:**
- ✅ Gratis para empezar ($5/mes después)
- ✅ Muy fácil de usar (conecta GitHub y listo)
- ✅ Soporta Node.js/Express nativo
- ✅ MongoDB incluido o puedes usar Atlas
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático
- ✅ Logs integrados

**Pasos:**
1. Crear cuenta en [railway.app](https://railway.app)
2. Conectar repositorio de GitHub
3. Seleccionar el proyecto
4. Railway detecta Node.js automáticamente
5. Agregar variables de entorno (.env)
6. ¡Listo! Auto-deploy

**Costo:** Gratis al inicio, luego $5/mes

---

### 2. **Render** ⭐ (Muy Bueno)

**Ventajas:**
- ✅ Plan gratuito disponible
- ✅ Fácil de usar
- ✅ Auto-deploy desde GitHub
- ✅ HTTPS automático
- ✅ Soporta Node.js/Express

**Pasos:**
1. Crear cuenta en [render.com](https://render.com)
2. New → Web Service
3. Conectar GitHub
4. Seleccionar repositorio
5. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Agregar variables de entorno
7. Deploy

**Costo:** Gratis (con limitaciones), $7/mes para plan básico

---

### 3. **DigitalOcean App Platform**

**Ventajas:**
- ✅ Muy confiable
- ✅ Escalable
- ✅ Buena documentación

**Desventajas:**
- ⚠️ Más caro ($5/mes mínimo)
- ⚠️ Configuración un poco más compleja

---

### 4. **Heroku** (Clásico)

**Ventajas:**
- ✅ Muy conocido
- ✅ Buena documentación
- ✅ Add-ons disponibles

**Desventajas:**
- ⚠️ Ya no tiene plan gratuito
- ⚠️ Más caro ($7/mes mínimo)

---

## 🎯 Recomendación Final

**Para MVP y desarrollo:**
1. **Railway** - Más fácil y rápido
2. **Render** - Alternativa excelente

**Para producción:**
- **Railway** o **Render** siguen siendo buenas opciones
- O migrar a **AWS** / **Google Cloud** si necesitas más control

---

## 📝 Preparación para Deployment

### 1. Variables de Entorno Necesarias

```env
# Servidor
PORT=3001
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lunaDB?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=30d

# CORS (URL de tu frontend)
CORS_ORIGIN=https://tu-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

### 2. Scripts en package.json

Ya están configurados:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

### 3. Puerto Dinámico

El código ya usa `process.env.PORT || 3001`, así que funcionará en cualquier plataforma.

---

## 🚀 Pasos para Deploy en Railway (Recomendado)

### Paso 1: Preparar el Código

1. Asegúrate de que todo esté en GitHub
2. Verifica que `.env` esté en `.gitignore` (ya está)
3. Crea un archivo `Procfile` (opcional, Railway lo detecta automático)

### Paso 2: Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Sign up con GitHub
3. Autoriza acceso a repositorios

### Paso 3: Crear Proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Selecciona tu repositorio `luna-backend`
4. Railway detecta automáticamente que es Node.js

### Paso 4: Configurar Variables de Entorno

1. Ve a "Variables" en tu proyecto
2. Agrega todas las variables de `.env`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `CORS_ORIGIN`
   - etc.

### Paso 5: Deploy

1. Railway hace deploy automático
2. Espera a que termine (2-3 minutos)
3. Obtén la URL: `https://tu-proyecto.railway.app`

### Paso 6: Probar

```bash
curl https://tu-proyecto.railway.app/health
```

Deberías recibir:
```json
{
  "status": "OK",
  "message": "LUNA Backend API is running"
}
```

---

## 🔗 Conectar Frontend

Una vez deployado, actualiza tu frontend:

```javascript
// En tu frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-backend.railway.app';

// O si usas variables de entorno
const API_URL = 'https://tu-backend.railway.app';
```

**Importante:** Actualiza `CORS_ORIGIN` en el backend con la URL de tu frontend.

---

## 📊 Monitoreo

### Railway
- Logs en tiempo real en el dashboard
- Métricas de uso
- Alertas por email

### Render
- Logs en tiempo real
- Métricas básicas
- Health checks

---

## ✅ Checklist Pre-Deploy

- [ ] Código en GitHub
- [ ] `.env` en `.gitignore`
- [ ] Variables de entorno listas
- [ ] `NODE_ENV=production` configurado
- [ ] MongoDB Atlas configurado
- [ ] CORS configurado con URL de frontend
- [ ] JWT_SECRET seguro (no el de desarrollo)
- [ ] Probar endpoints localmente
- [ ] Documentación actualizada

---

## 🎯 Siguiente Paso

**Recomendación:**
1. Deploy en **Railway** (más fácil)
2. Obtener URL del backend
3. Actualizar frontend con la URL
4. Probar conexión
5. ¡Listo para desarrollo frontend! 🚀

---

¿Necesitas ayuda con algún paso específico del deployment?

