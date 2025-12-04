# 🗄️ Guía de Configuración de MongoDB

Esta guía te ayudará a configurar MongoDB para el proyecto LUNA Backend.

## 📋 Opciones de MongoDB

Tienes dos opciones principales:

### Opción 1: MongoDB Atlas (Recomendado - En la Nube) ☁️

MongoDB Atlas es la solución en la nube de MongoDB. Es gratis para empezar y muy fácil de configurar.

#### Pasos para configurar MongoDB Atlas:

1. **Crear cuenta en MongoDB Atlas**
   - Ve a https://www.mongodb.com/cloud/atlas
   - Crea una cuenta gratuita (si no tienes una)

2. **Crear un Cluster**
   - Una vez dentro, haz clic en "Build a Database"
   - Selecciona el plan **FREE (M0)** - es suficiente para desarrollo
   - Elige una región cercana (ej: `us-east-1` o `south-america-east-1`)
   - Dale un nombre a tu cluster (ej: `luna-cluster`)
   - Haz clic en "Create"

3. **Configurar Acceso a la Base de Datos**
   - En la sección "Security" → "Database Access"
   - Haz clic en "Add New Database User"
   - Elige "Password" como método de autenticación
   - Crea un usuario (ej: `luna-user`) y una contraseña segura
   - **Guarda la contraseña** - la necesitarás después
   - En "Database User Privileges", selecciona "Atlas admin" o "Read and write to any database"
   - Haz clic en "Add User"

4. **Configurar Acceso de Red**
   - En la sección "Security" → "Network Access"
   - Haz clic en "Add IP Address"
   - Para desarrollo, puedes usar "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ En producción, solo permite IPs específicas
   - Haz clic en "Confirm"

5. **Obtener la Connection String**
   - En la sección "Deployment" → "Database"
   - Haz clic en "Connect" en tu cluster
   - Selecciona "Connect your application"
   - Copia la connection string que aparece
   - Se verá algo como:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Configurar en el proyecto**
   - Reemplaza `<username>` con el usuario que creaste (ej: `luna-user`)
   - Reemplaza `<password>` con la contraseña que creaste
   - Agrega el nombre de la base de datos al final: `...mongodb.net/luna?retryWrites=true&w=majority`
   - El resultado final debería ser:
     ```
     mongodb+srv://luna-user:tu_password@cluster0.xxxxx.mongodb.net/luna?retryWrites=true&w=majority
     ```

7. **Agregar al archivo .env**
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega la línea:
     ```env
     MONGODB_URI=mongodb+srv://luna-user:tu_password@cluster0.xxxxx.mongodb.net/luna?retryWrites=true&w=majority
     ```

### Opción 2: MongoDB Local 🖥️

Si prefieres usar MongoDB localmente:

1. **Instalar MongoDB**
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Sigue las instrucciones en https://docs.mongodb.com/manual/installation/
   - **Windows**: Descarga el instalador desde https://www.mongodb.com/try/download/community

2. **Iniciar MongoDB**
   - **macOS/Linux**: `brew services start mongodb-community` o `mongod`
   - **Windows**: MongoDB se inicia como servicio automáticamente

3. **Configurar en el proyecto**
   - En tu archivo `.env`:
     ```env
     MONGODB_URI=mongodb://localhost:27017/luna
     ```

## ✅ Verificar la Conexión

Una vez configurado, puedes verificar que todo funciona:

1. **Iniciar el servidor**
   ```bash
   npm run dev
   ```

2. **Verificar los logs**
   Deberías ver algo como:
   ```
   ✅ MongoDB connected: cluster0.xxxxx.mongodb.net
   📊 Database: luna
   🚀 LUNA Backend running on port 3000
   ```

3. **Si hay errores**
   - Verifica que la URI es correcta
   - Verifica que las credenciales son correctas
   - Verifica que el acceso de red está configurado (en Atlas)
   - Verifica que MongoDB está corriendo (si es local)

## 🔧 Variables de Entorno Necesarias

Asegúrate de tener estas variables en tu archivo `.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/luna?retryWrites=true&w=majority

# O para local:
# MONGODB_URI=mongodb://localhost:27017/luna
```

## 📝 Notas Importantes

1. **Seguridad**
   - Nunca subas el archivo `.env` al repositorio
   - Usa contraseñas seguras para MongoDB
   - En producción, restringe el acceso de red a IPs específicas

2. **Base de Datos**
   - La base de datos se creará automáticamente cuando se conecte por primera vez
   - El nombre de la base de datos es `luna` (o el que especifiques en la URI)

3. **MongoDB Atlas Free Tier**
   - 512 MB de almacenamiento
   - Compartido con otros usuarios (pero tus datos están aislados)
   - Suficiente para desarrollo y pruebas

4. **Próximos Pasos**
   - Una vez conectado, necesitarás crear un Tenant por defecto
   - Necesitarás crear Roles iniciales (SUPERADMIN, USER, etc.)
   - Puedes usar los scripts en `/scripts` para esto

## 🆘 Solución de Problemas

### Error: "MongoServerError: bad auth"
- Verifica que el usuario y contraseña son correctos
- Asegúrate de que el usuario tiene permisos en la base de datos

### Error: "MongoServerError: IP not whitelisted"
- Ve a MongoDB Atlas → Network Access
- Agrega tu IP actual o usa 0.0.0.0/0 para desarrollo

### Error: "Connection timeout"
- Verifica que MongoDB está corriendo (si es local)
- Verifica que la URI es correcta
- Verifica tu conexión a internet (si es Atlas)

### Error: "Database name not specified"
- Asegúrate de incluir el nombre de la base de datos en la URI
- Ejemplo: `...mongodb.net/luna?retryWrites=true&w=majority`

