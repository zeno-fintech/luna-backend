# 🚂 Configuración de Railway para LUNA Backend

## ✅ Checklist Pre-Deployment

### 1. **Archivos Necesarios** ✅
- ✅ `package.json` con script `start`
- ✅ `railway.json` (configuración opcional)
- ✅ `.env.example` (template de variables de entorno)
- ✅ `.gitignore` (excluye `.env`)

### 2. **Variables de Entorno Requeridas**

Configura estas variables en Railway Dashboard → Variables:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lunaDB?retryWrites=true&w=majority

# JWT
# Genera un secreto seguro con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# O usa: openssl rand -hex 64
JWT_SECRET=tu_secreto_jwt_muy_seguro_y_largo_aqui_minimo_32_caracteres
JWT_EXPIRE=30d

# Server
# NOTA: PORT es asignado automáticamente por Railway, NO configures este valor
NODE_ENV=production

# CORS (ajusta con tu dominio de frontend)
CORS_ORIGIN=https://tu-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

---

## 🚀 Pasos para Deploy en Railway

### Paso 1: Conectar GitHub
1. Ve a [Railway Dashboard](https://railway.app)
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Autoriza Railway y selecciona tu repositorio `luna-backend`

### Paso 2: Configurar Variables de Entorno
1. En el proyecto, ve a la pestaña **Variables**
2. Agrega todas las variables de entorno listadas arriba
3. **IMPORTANTE:** Usa tu `MONGODB_URI` real (MongoDB Atlas)

### Paso 3: Configurar Build Settings (Opcional)
Railway detecta automáticamente Node.js, pero puedes verificar:
- **Build Command:** `npm install` (automático)
- **Start Command:** `npm start` (automático)
- **Node Version:** 18+ (verificado en `package.json`)

### Paso 4: Deploy
1. Railway automáticamente detecta cambios en `main` branch
2. Cada push a `main` hace un nuevo deploy
3. Puedes ver los logs en tiempo real en Railway Dashboard

---

## 🔧 Configuración Adicional

### MongoDB Atlas (Recomendado)
1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster (gratis disponible)
3. Obtén la connection string
4. Agrega la IP de Railway a la whitelist (o usa `0.0.0.0/0` para desarrollo)

### Dominio Personalizado (Opcional)
1. En Railway → Settings → Domains
2. Agrega tu dominio personalizado
3. Railway proporciona HTTPS automático

### Health Check
Railway verifica automáticamente que el servicio responda en el puerto configurado.

Tu endpoint de health check está en: `GET /health`

---

## 📊 Monitoreo

### Logs
- Ve a Railway Dashboard → Deployments → Click en el deployment
- Verás logs en tiempo real

### Métricas
- Railway muestra CPU, RAM, y Network usage
- Plan gratuito incluye métricas básicas

---

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica que `MONGODB_URI` esté correctamente configurada
- Verifica que la IP de Railway esté en la whitelist de MongoDB Atlas
- Verifica que la base de datos existe

### Error: "Port already in use"
- Railway asigna el puerto automáticamente
- Usa `process.env.PORT || 3000` en tu código (ya está configurado)

### Error: "Module not found"
- Verifica que `package.json` tenga todas las dependencias
- Railway ejecuta `npm install` automáticamente

### Build Falla
- Revisa los logs en Railway Dashboard
- Verifica que Node.js 18+ esté especificado en `package.json`

---

## 🔐 Seguridad

### Variables Sensibles
- ✅ **NUNCA** commitees `.env` (está en `.gitignore`)
- ✅ Usa Railway Variables para secretos
- ✅ Rota `JWT_SECRET` regularmente en producción

### CORS
- Configura `CORS_ORIGIN` con tu dominio de frontend
- No uses `*` en producción

---

## 📝 Notas Importantes

1. **Primer Deploy:** Railway puede tardar 2-5 minutos en el primer build
2. **Cold Starts:** El primer request después de inactividad puede ser lento
3. **Free Tier:** Railway free tier es generoso pero tiene límites
4. **Auto-Deploy:** Cada push a `main` hace deploy automático

---

## ✅ Verificación Post-Deploy

1. Verifica que el servicio esté "Active" en Railway
2. Prueba el endpoint de health: `https://tu-app.railway.app/health`
3. Prueba un endpoint de API: `https://tu-app.railway.app/api/v1/countries`
4. Verifica los logs para errores

---

## 🎉 ¡Listo!

Tu backend debería estar funcionando en Railway. 

**URL de tu API:** `https://tu-proyecto.railway.app`

**Próximos pasos:**
1. Configura tu frontend para usar esta URL
2. Actualiza `CORS_ORIGIN` con el dominio de tu frontend
3. Prueba todos los endpoints desde Postman

