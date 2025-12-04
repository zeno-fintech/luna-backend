# ✅ Resumen Final - Listo para Railway

## 🔐 JWT_SECRET - Cómo Obtenerlo

### Opción 1: Usar el Script NPM (⭐ Más Fácil)
```bash
npm run generate:jwt-secret
```

Este script genera el secreto y muestra instrucciones.

### Opción 2: Generar con Node.js Directamente
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Ejemplo generado:**
```
c17870f9e39e60f270edc7149e94eacd444d9710a740faf33eebf001cd727bfe75459f3efafd22f6526e705de988d61c2b323a311e6be15270889b0d6463d5e6
```

### Opción 2: Generar con OpenSSL
```bash
openssl rand -hex 64
```

**Copia el resultado completo** y úsalo como valor de `JWT_SECRET` en Railway.

---

## ⚙️ Variables de Entorno para Railway

### ✅ Configurar en Railway Dashboard → Variables:

```env
# MongoDB (OBLIGATORIO)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lunaDB?retryWrites=true&w=majority

# JWT (OBLIGATORIO - genera uno con el comando arriba)
JWT_SECRET=c17870f9e39e60f270edc7149e94eacd444d9710a740faf33eebf001cd727bfe75459f3efafd22f6526e705de988d61c2b323a311e6be15270889b0d6463d5e6
JWT_EXPIRE=30d

# Server
NODE_ENV=production

# CORS (ajusta con tu dominio de frontend)
CORS_ORIGIN=https://tu-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

### ❌ NO Configures:
- ~~`PORT`~~ - Railway lo asigna automáticamente

---

## ✅ Verificaciones Finales

### 1. Archivos Necesarios ✅
- [x] `package.json` con script `start`
- [x] `railway.json` configurado
- [x] `.env.example` (template)
- [x] `.gitignore` (excluye `.env`)

### 2. Código ✅
- [x] Servidor usa `process.env.PORT` (línea 224 en `src/index.js`)
- [x] MongoDB connection configurado
- [x] Todas las dependencias en `package.json`

### 3. Documentación ✅
- [x] `docs/deployment/RAILWAY-SETUP.md` - Guía completa
- [x] `docs/deployment/CHECKLIST-RAILWAY.md` - Checklist paso a paso
- [x] `docs/deployment/GENERAR-JWT-SECRET.md` - Cómo generar JWT_SECRET

---

## 🚀 Pasos para Deploy

### 1. Conectar GitHub (Ya hecho) ✅
- Railway vinculado a GitHub

### 2. Configurar Variables
1. Ve a Railway Dashboard → Tu Proyecto → Variables
2. Agrega todas las variables listadas arriba
3. **IMPORTANTE:** Genera un `JWT_SECRET` nuevo (no uses el ejemplo)

### 3. MongoDB Atlas
1. Crea/verifica tu cluster en MongoDB Atlas
2. Obtén la connection string
3. Agrega IP de Railway a whitelist:
   - Opción rápida: `0.0.0.0/0` (permite todas las IPs)
   - Opción segura: Agrega la IP específica de Railway

### 4. Deploy Automático
- Railway detecta cambios en `main` branch
- Cada push hace deploy automático
- Ver logs en Railway Dashboard

---

## 🧪 Verificación Post-Deploy

### 1. Health Check
```bash
curl https://tu-proyecto.railway.app/health
```
**Esperado:** `{"status":"OK",...}`

### 2. Endpoints Públicos
```bash
curl https://tu-proyecto.railway.app/api/v1/countries
curl https://tu-proyecto.railway.app/api/v1/currencies
```
**Esperado:** JSON con datos de países/monedas

### 3. Login
```bash
curl -X POST https://tu-proyecto.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"francocastro204@gmail.com","password":"#Luna2025"}'
```
**Esperado:** Token JWT válido

---

## 📝 Notas Importantes

1. **JWT_SECRET:** Debe ser único y seguro. Genera uno nuevo para producción.
2. **PORT:** No lo configures, Railway lo asigna automáticamente.
3. **MongoDB:** Asegúrate de que la whitelist incluya Railway.
4. **CORS:** Actualiza `CORS_ORIGIN` con el dominio de tu frontend.

---

## 🎉 ¡Todo Listo!

Tu backend está **100% listo** para deploy en Railway.

**Próximos pasos:**
1. Configura las variables de entorno en Railway
2. Haz push a `main` (o Railway ya detectó el repo)
3. Espera el deploy (2-5 minutos)
4. Prueba los endpoints

**¿Falta algo?** No, todo está listo. Solo falta configurar las variables en Railway Dashboard. 🚀

