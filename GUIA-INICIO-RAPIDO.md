# 🚀 Guía de Inicio Rápido - LUNA Backend

Esta guía te ayudará a poner en marcha el proyecto rápidamente.

## ⚡ Inicio Rápido (5 minutos)

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura:

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB (ver CONFIGURACION-MONGODB.md para más detalles)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/luna?retryWrites=true&w=majority

# JWT (genera uno seguro: openssl rand -base64 32)
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3001
```

### 3. Configurar MongoDB

**Opción A: MongoDB Atlas (Recomendado)**
- Ve a https://www.mongodb.com/cloud/atlas
- Crea un cluster gratuito
- Obtén la connection string
- Agrega la URI a tu `.env`

**Ver guía completa:** [CONFIGURACION-MONGODB.md](./CONFIGURACION-MONGODB.md)

**Opción B: MongoDB Local**
```env
MONGODB_URI=mongodb://localhost:27017/luna
```

### 4. Iniciar el Servidor

```bash
npm run dev
```

Deberías ver:
```
✅ MongoDB connected: cluster0.xxxxx.mongodb.net
📊 Database: luna
🚀 LUNA Backend running on port 3000
```

### 5. Probar el Health Check

```bash
curl http://localhost:3000/health
```

O abre en tu navegador: http://localhost:3000/health

## 📮 Probar Endpoints con Postman

### 1. Importar Colección

1. Abre Postman
2. File → Import
3. Selecciona el archivo `LUNA-Backend.postman_collection.json`
4. La colección se importará con todos los endpoints

### 2. Configurar Variables

En Postman, configura las variables de entorno:

1. Clic en el ícono de "Environments" (arriba a la izquierda)
2. Crea un nuevo environment llamado "LUNA Local"
3. Agrega estas variables:
   - `base_url`: `http://localhost:3000`
   - `auth_token`: (se llenará automáticamente al hacer login)
   - `default_tenant_id`: (lo necesitarás para registrar usuarios)

### 3. Probar Endpoints

**Paso 1: Health Check**
- Ejecuta `GET /health` para verificar que el servidor está corriendo

**Paso 2: Crear Tenant (Admin)**
- Primero necesitas crear un usuario SUPERADMIN (ver sección siguiente)
- O crear un Tenant directamente desde MongoDB

**Paso 3: Registrar Usuario**
- Ejecuta `POST /api/v1/auth/register`
- El token se guardará automáticamente en la variable `auth_token`

**Paso 4: Probar otros endpoints**
- Ahora puedes probar todos los demás endpoints
- El token se usará automáticamente en las requests que lo requieran

## 🔐 Crear Usuario SUPERADMIN (Primera vez)

Para poder usar los endpoints de admin, necesitas crear un usuario con rol SUPERADMIN.

### Opción 1: Desde MongoDB (Recomendado)

1. Conecta a tu base de datos MongoDB (Atlas o local)
2. Crea un Tenant primero:
   ```javascript
   db.tenants.insertOne({
     name: "Default Tenant",
     slug: "default",
     type: "own_brand",
     branding: {
       primaryColor: "#0066CC"
     },
     defaultCurrency: "CLP",
     isActive: true,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

3. Crea un Role SUPERADMIN:
   ```javascript
   db.roles.insertOne({
     name: "SUPERADMIN",
     level: 1,
     permissions: ["*"],
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

4. Obtén los IDs del Tenant y Role que acabas de crear

5. Crea el usuario (la contraseña se hasheará automáticamente):
   ```javascript
   // Nota: La contraseña será "admin123" (se hasheará al guardar)
   // Usa bcrypt para hashear, o mejor aún, usa el endpoint de registro
   ```

### Opción 2: Usar el Endpoint de Registro

1. Primero crea el Tenant y Role desde MongoDB (pasos 1-3 arriba)
2. Usa el endpoint `POST /api/v1/auth/register` con:
   ```json
   {
     "nombres": "Admin",
     "apellidos": "Sistema",
     "correo": "admin@luna.com",
     "password": "admin123",
     "tenantId": "ID_DEL_TENANT",
     "roles": ["ID_DEL_ROLE_SUPERADMIN"]
   }
   ```

## 📋 Checklist de Configuración

- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` creado y configurado
- [ ] MongoDB configurado (Atlas o local)
- [ ] Servidor inicia correctamente
- [ ] Health check funciona
- [ ] Colección de Postman importada
- [ ] Tenant creado en la base de datos
- [ ] Roles creados (SUPERADMIN, USER, etc.)
- [ ] Usuario de prueba creado

## 🎯 Próximos Pasos

1. **Explorar la API**
   - Usa Postman para probar todos los endpoints
   - Revisa la documentación en `RESUMEN-PROYECTO.md`

2. **Crear Datos de Prueba**
   - Crea usuarios de prueba
   - Crea transacciones, cuentas, perfiles
   - Prueba los endpoints de analytics

3. **Desarrollar Features**
   - Revisa la estructura del proyecto
   - Agrega nuevos endpoints según necesites
   - Implementa servicios de AI/Blockchain cuando esté listo

## 🆘 Problemas Comunes

### "MongoDB connection error"
- Verifica que la URI en `.env` es correcta
- Verifica que MongoDB está corriendo (si es local)
- Verifica que el acceso de red está configurado (si es Atlas)

### "No autorizado para acceder a esta ruta"
- Verifica que estás enviando el token JWT en el header
- Verifica que el token no ha expirado
- Verifica que el usuario tiene el rol necesario

### "Usuario no encontrado"
- Verifica que el usuario existe en la base de datos
- Verifica que el token contiene el ID correcto del usuario

## 📚 Documentación Adicional

- [Resumen del Proyecto](./RESUMEN-PROYECTO.md)
- [Configuración de MongoDB](./CONFIGURACION-MONGODB.md)
- [Niveles, Roles y Tenancy](./docs/architecture/NIVELES-ROLES-TENANCY.md)
- [Arquitectura Global](./docs/architecture/ARQUITECTURA-GLOBAL-Y-ROADMAP.md)

## 💡 Tips

- Usa `npm run dev` para desarrollo (con nodemon para auto-reload)
- Usa `npm start` para producción
- Revisa los logs en la consola para debugging
- Usa Postman para probar endpoints antes de integrar con el frontend
- Guarda tus tokens en variables de entorno de Postman para no tener que copiarlos cada vez

