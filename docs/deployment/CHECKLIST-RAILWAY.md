# ✅ Checklist para Deploy en Railway

## 📋 Antes de Deployar

### 1. Archivos de Configuración ✅
- [x] `package.json` con script `start`
- [x] `railway.json` (configuración opcional)
- [x] `.env.example` (template)
- [x] `.gitignore` (excluye `.env`)

### 2. Código Verificado ✅
- [x] Servidor usa `process.env.PORT` (Railway asigna puerto automáticamente)
- [x] MongoDB connection string configurado
- [x] Variables de entorno documentadas

### 3. Base de Datos ✅
- [ ] MongoDB Atlas creado y configurado
- [ ] Connection string obtenido
- [ ] IP de Railway agregada a whitelist (o `0.0.0.0/0` para desarrollo)

---

## 🚀 Pasos de Deploy

### Paso 1: Conectar GitHub a Railway
1. [ ] Ir a [Railway Dashboard](https://railway.app)
2. [ ] Click en "New Project"
3. [ ] Seleccionar "Deploy from GitHub repo"
4. [ ] Autorizar Railway
5. [ ] Seleccionar repositorio `luna-backend`

### Paso 2: Configurar Variables de Entorno
En Railway Dashboard → Variables, agregar:

- [ ] `MONGODB_URI` - Connection string de MongoDB Atlas
- [ ] `JWT_SECRET` - Secreto largo y seguro (genera con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] `JWT_EXPIRE` - `30d`
- [ ] `NODE_ENV` - `production`
- [ ] ~~`PORT`~~ - **NO configures PORT, Railway lo asigna automáticamente**
- [ ] `CORS_ORIGIN` - URL de tu frontend (ej: `https://tu-app.vercel.app`)
- [ ] `RATE_LIMIT_WINDOW_MS` - `900000` (15 minutos)
- [ ] `RATE_LIMIT_MAX_REQUESTS` - `100`
- [ ] `BCRYPT_ROUNDS` - `12`

**NOTA:** Railway asigna `PORT` automáticamente, no necesitas configurarlo.

### Paso 3: Verificar Build
- [ ] Railway detecta Node.js automáticamente
- [ ] Build ejecuta `npm install`
- [ ] Start command es `npm start`

### Paso 4: Primer Deploy
- [ ] Railway inicia el build automáticamente
- [ ] Esperar 2-5 minutos para el primer build
- [ ] Verificar logs en Railway Dashboard

---

## ✅ Verificación Post-Deploy

### 1. Health Check
```bash
curl https://tu-proyecto.railway.app/health
```
- [ ] Responde con `{"status":"OK",...}`

### 2. Endpoints Públicos
```bash
curl https://tu-proyecto.railway.app/api/v1/countries
curl https://tu-proyecto.railway.app/api/v1/currencies
```
- [ ] Endpoints responden correctamente

### 3. Logs
- [ ] Revisar logs en Railway Dashboard
- [ ] No hay errores de conexión a MongoDB
- [ ] Servidor inicia correctamente

---

## 🔧 Configuración Adicional

### MongoDB Atlas Whitelist
1. [ ] Ir a MongoDB Atlas → Network Access
2. [ ] Agregar IP: `0.0.0.0/0` (para desarrollo) o IP específica de Railway
3. [ ] Verificar que la conexión funcione

### Dominio Personalizado (Opcional)
1. [ ] Railway → Settings → Domains
2. [ ] Agregar dominio personalizado
3. [ ] Configurar DNS según instrucciones de Railway

### Auto-Deploy
- [ ] Verificar que auto-deploy esté activado
- [ ] Cada push a `main` hace deploy automático

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- [ ] Verificar `MONGODB_URI` en Railway Variables
- [ ] Verificar whitelist en MongoDB Atlas
- [ ] Verificar que la base de datos existe

### Error: "Port already in use"
- [ ] Railway asigna puerto automáticamente
- [ ] No configurar `PORT` manualmente

### Build Falla
- [ ] Revisar logs en Railway Dashboard
- [ ] Verificar que Node.js 18+ esté en `package.json`
- [ ] Verificar que todas las dependencias estén en `package.json`

---

## 📝 Notas

- **Primer Deploy:** Puede tardar 2-5 minutos
- **Cold Starts:** Primer request después de inactividad puede ser lento
- **Free Tier:** Generoso pero con límites
- **Logs:** Disponibles en tiempo real en Railway Dashboard

---

## 🎉 ¡Listo!

Una vez completado el checklist, tu backend estará funcionando en Railway.

**URL de tu API:** `https://tu-proyecto.railway.app`

**Próximos pasos:**
1. Configurar frontend para usar esta URL
2. Actualizar `CORS_ORIGIN` con dominio de frontend
3. Probar todos los endpoints desde Postman

