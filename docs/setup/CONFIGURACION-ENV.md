# 🔧 Configuración del archivo .env

## ✅ Tu configuración actual

Basado en la información que proporcionaste, tu archivo `.env` debe tener esta configuración:

```env
# ============================================
# Servidor
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# MongoDB - Base de Datos
# ============================================
# IMPORTANTE: Reemplaza <dbUserTiendaBackend> con la contraseña real
# La URI correcta debe incluir el nombre de la base de datos: lunaDB
MONGODB_URI=mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority

# ============================================
# JWT - Autenticación
# ============================================
# Genera un secreto seguro (puedes usar: openssl rand -base64 32)
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui_cambiar_en_produccion
JWT_EXPIRE=30d

# ============================================
# CORS - Configuración de Orígenes
# ============================================
CORS_ORIGIN=http://localhost:3001

# ============================================
# Rate Limiting
# ============================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================
# Bcrypt - Encriptación de Contraseñas
# ============================================
BCRYPT_ROUNDS=12
```

## ⚠️ Importante

1. **Reemplaza el placeholder**: Si en tu `.env` tienes `<dbUserTiendaBackend>`, reemplázalo con la contraseña real: `tiendaBackend2025`

2. **Incluye el nombre de la base de datos**: La URI debe terminar con `/lunaDB` antes de los parámetros de query

3. **URI completa correcta**:
   ```
   mongodb+srv://dbUserTiendaBackend:tiendaBackend2025@cluster0.hj7oowi.mongodb.net/lunaDB?appName=Cluster0&retryWrites=true&w=majority
   ```

## 🧪 Verificar la conexión

Una vez que tengas el `.env` configurado correctamente:

1. Inicia el servidor:
   ```bash
   npm run dev
   ```

2. Deberías ver:
   ```
   ✅ MongoDB connected: cluster0.hj7oowi.mongodb.net
   📊 Database: lunaDB
   🚀 LUNA Backend running on port 3000
   ```

3. Si hay errores, verifica:
   - Que la contraseña en la URI es correcta (sin los `<>`)
   - Que el nombre de la base de datos está en la URI (`/lunaDB`)
   - Que las credenciales son correctas

