# ✅ Inicialización Completada

## 🎉 Resumen de lo realizado

### 1. ✅ Base de Datos Configurada
- MongoDB Atlas conectado a la base de datos `lunaDB`
- 20 colecciones creadas automáticamente

### 2. ✅ Roles Creados
- **SUPERADMIN** (Nivel 1) - Super administrador del sistema
- **USER** (Nivel 3) - Usuario final
- **TENANT_OWNER** (Nivel 2) - Dueño de Tenant
- **TENANT_ADMIN** (Nivel 2) - Administrador de Tenant

### 3. ✅ Tenant "Luna" Creado
- Nombre: Luna
- Slug: luna
- Tipo: own_brand (marca propia)
- Color primario: #0066CC
- Moneda por defecto: CLP
- País: CL (Chile)
- Features habilitadas: OCR, AI Insights

### 4. ✅ Usuarios Creados

#### Usuario SUPERADMIN
- **Email**: dev.francoscm@gmail.com
- **Password**: #Luna2025
- **Rol**: SUPERADMIN (Nivel 1)
- **Tenant**: Luna
- **Plan**: Pro

#### Usuario Final
- **Email**: francocastro204@gmail.com
- **Password**: #Luna2025
- **Rol**: USER (Nivel 3)
- **Tenant**: Luna
- **Plan**: Free

## 🚀 Iniciar el Servidor

Para iniciar el servidor, ejecuta:

```bash
npm run dev
```

O en producción:

```bash
npm start
```

El servidor debería iniciar en `http://localhost:3000`

## 🧪 Probar la Conexión

Una vez que el servidor esté corriendo, puedes probar:

```bash
# Health check
curl http://localhost:3000/health

# O abrir en el navegador
open http://localhost:3000/health
```

## 🔐 Probar Login

Puedes probar el login con cualquiera de los dos usuarios:

### Login SUPERADMIN
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "dev.francoscm@gmail.com",
    "password": "#Luna2025"
  }'
```

### Login Usuario Final
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "francocastro204@gmail.com",
    "password": "#Luna2025"
  }'
```

## 📮 Usar Postman

1. Importa la colección `LUNA-Backend.postman_collection.json`
2. Configura la variable `base_url` como `http://localhost:3000`
3. Prueba el endpoint de login
4. El token se guardará automáticamente en la variable `auth_token`
5. Usa ese token para probar los demás endpoints

## 📊 Estado de las Colecciones

Las siguientes colecciones están creadas y listas para usar:

- ✅ users
- ✅ tenants
- ✅ roles
- ✅ companies
- ✅ transactions
- ✅ profiles
- ✅ accounts
- ✅ categories
- ✅ plans
- ✅ subscriptions
- ✅ debts
- ✅ payments
- ✅ savings
- ✅ assets
- ✅ budgets
- ✅ financialboards
- ✅ rules
- ✅ configurations
- ✅ currencies
- ✅ metricssnapshots

## 🔄 Re-ejecutar Inicialización

Si necesitas re-ejecutar el script de inicialización:

```bash
node scripts/initializeDatabase.js
```

El script es idempotente, así que puedes ejecutarlo múltiples veces sin problemas. Actualizará los datos existentes si ya existen.

## 📝 Notas

- Ambos usuarios tienen la misma contraseña: `#Luna2025`
- El usuario SUPERADMIN puede acceder a todos los endpoints de nivel 1 (admin)
- El usuario final puede acceder a todos los endpoints de nivel 3 (usuario)
- Todos los usuarios están asociados al Tenant "Luna"
- Las contraseñas están hasheadas con bcrypt

## 🆘 Si hay problemas

1. Verifica que MongoDB está conectado:
   ```bash
   node scripts/verifyConnection.js
   ```

2. Verifica que el archivo `.env` tiene la configuración correcta

3. Revisa los logs del servidor para ver errores

4. Asegúrate de que el puerto 3000 no está en uso:
   ```bash
   lsof -ti:3000
   ```

