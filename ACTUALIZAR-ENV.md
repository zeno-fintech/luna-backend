# ⚠️ IMPORTANTE: Actualizar tu archivo .env

## 🔧 Cambio necesario

Tu URI actual en `.env` es:
```
MONGODB_URI=mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/?appName=Cluster0
```

**Necesitas agregar el nombre de la base de datos `/lunaDB` antes de los parámetros de query.**

## ✅ URI correcta

Actualiza tu archivo `.env` con esta línea:

```env
MONGODB_URI=mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority
```

### Cambios realizados:
1. ✅ Agregado `/lunaDB` después de `.mongodb.net`
2. ✅ Agregado `&retryWrites=true&w=majority` para mejor manejo de conexiones

## 📝 Archivo .env completo recomendado

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB - Base de Datos
MONGODB_URI=mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority

# JWT - Autenticación
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

## 🧪 Verificar la conexión

Después de actualizar el `.env`, puedes verificar la conexión ejecutando:

```bash
node scripts/verifyConnection.js
```

O simplemente inicia el servidor:

```bash
npm run dev
```

Deberías ver:
```
✅ MongoDB connected: cluster0.hj7oowi.mongodb.net
📊 Database: lunaDB
🚀 LUNA Backend running on port 3000
```

