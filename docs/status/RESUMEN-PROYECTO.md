# 📊 Resumen del Proyecto LUNA Backend

## 🎯 Descripción General

**LUNA Backend** es una API REST para una plataforma de educación financiera con arquitectura multi-tenant, diseñada para soportar:
- **Marcas propias** del grupo ZENO
- **Partners B2B2C** (empresas que ofrecen LUNA a sus clientes)
- **Usuarios finales** que gestionan sus finanzas personales

## 🏗️ Arquitectura

El sistema está organizado en **3 niveles jerárquicos**:

### Nivel 1 - Holding / Grupo ZENO (Superadmin)
- Control total del ecosistema
- Gestión de Tenants (marcas propias y partners)
- Métricas globales y unit economics
- **Roles**: `SUPERADMIN`, `ADMIN`, `FINANCE_ANALYST`, `SUPPORT`

### Nivel 2 - Tenants / Partners / Empresas (White Label)
- Gestión de su propio negocio sobre LUNA
- Creación y gestión de Companies (empresas cliente)
- Configuración de planes, precios y branding
- **Roles**: `TENANT_OWNER`, `TENANT_ADMIN`, `COMPANY_ADMIN`, `MANAGER`, `ANALYST`

### Nivel 3 - Usuarios Finales
- Gestión de finanzas personales
- Transacciones, perfiles, cuentas, analytics
- **Roles**: `USER`, `CO_OWNER`, `SHARED_MEMBER`, `VIEWER`

## 📦 Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Validación**: express-validator
- **Encriptación**: bcryptjs

## 📁 Estructura del Proyecto

```
src/
├── core/              # Configuración y middleware compartido
│   ├── config/        # Configuración de DB
│   ├── middleware/    # Auth, error handling
│   ├── services/      # Servicios compartidos (AI, Blockchain)
│   └── utils/         # Utilidades
├── level1/            # Nivel Admin (Holding)
│   ├── controllers/   # Admin, Tenant controllers
│   ├── routes/        # Rutas admin
│   └── services/      # Servicios de métricas admin
├── level2/            # Nivel Tenant/Company
│   ├── controllers/   # Company, Dashboard controllers
│   ├── routes/        # Rutas tenant/company
│   └── services/      # Servicios de métricas tenant
├── level3/            # Nivel Usuario Final
│   ├── controllers/   # Auth, Transactions, Analytics, etc.
│   ├── routes/        # Rutas usuario final
│   └── services/      # Servicios de negocio
└── models/            # Modelos MongoDB (User, Tenant, Company, etc.)
```

## ✅ Estado Actual del Proyecto

### 🟢 Funcionando

1. **Infraestructura Base**
   - ✅ Servidor Express configurado
   - ✅ Middleware de seguridad (Helmet, CORS, Rate Limiting)
   - ✅ Manejo de errores centralizado
   - ✅ Configuración de MongoDB con Mongoose

2. **Autenticación y Autorización**
   - ✅ Sistema de autenticación JWT
   - ✅ Middleware de protección de rutas (`protect`)
   - ✅ Sistema de autorización por roles (`authorize`)
   - ✅ Scoping multi-tenant (filtrado por tenant/company)

3. **Modelos de Datos**
   - ✅ User (con encriptación de contraseñas)
   - ✅ Tenant (multi-tenant)
   - ✅ Company
   - ✅ Role
   - ✅ Transaction
   - ✅ Profile
   - ✅ Account
   - ✅ Category, Debt, Payment, Savings, Asset, Budget, Plan, etc.

4. **Endpoints Nivel 3 (Usuario Final)**
   - ✅ `POST /api/v1/auth/register` - Registro de usuarios
   - ✅ `POST /api/v1/auth/login` - Login
   - ✅ `GET /api/v1/auth/me` - Obtener usuario actual
   - ✅ `GET /api/v1/transactions` - Listar transacciones
   - ✅ `GET /api/v1/transactions/:id` - Obtener transacción
   - ✅ `POST /api/v1/transactions` - Crear transacción
   - ✅ `PUT /api/v1/transactions/:id` - Actualizar transacción
   - ✅ `DELETE /api/v1/transactions/:id` - Eliminar transacción
   - ✅ `GET /api/v1/profiles` - Listar perfiles
   - ✅ `GET /api/v1/profiles/:id` - Obtener perfil
   - ✅ `POST /api/v1/profiles` - Crear perfil
   - ✅ `PUT /api/v1/profiles/:id` - Actualizar perfil
   - ✅ `DELETE /api/v1/profiles/:id` - Eliminar perfil
   - ✅ `GET /api/v1/accounts` - Listar cuentas
   - ✅ `GET /api/v1/accounts/:id` - Obtener cuenta
   - ✅ `POST /api/v1/accounts` - Crear cuenta
   - ✅ `PUT /api/v1/accounts/:id` - Actualizar cuenta
   - ✅ `DELETE /api/v1/accounts/:id` - Eliminar cuenta
   - ✅ `GET /api/v1/analytics/summary` - Resumen financiero
   - ✅ `GET /api/v1/analytics/trends` - Tendencias mensuales
   - ✅ `GET /api/v1/app/summary` - Resumen financiero general
   - ✅ `GET /api/v1/app/net-worth` - Patrimonio neto
   - ✅ `GET /api/v1/app/financial-score` - Score financiero
   - ✅ `GET /api/v1/app/insights` - Insights del usuario
   - ✅ `GET /api/v1/app/insights/spending` - Insights de gastos

5. **Endpoints Nivel 1 (Admin)**
   - ✅ `GET /api/v1/admin/tenants` - Listar tenants
   - ✅ `POST /api/v1/admin/tenants` - Crear tenant
   - ✅ `GET /api/v1/admin/tenants/:id` - Obtener tenant
   - ✅ `PUT /api/v1/admin/tenants/:id` - Actualizar tenant
   - ✅ `DELETE /api/v1/admin/tenants/:id` - Eliminar tenant
   - ✅ `GET /api/v1/admin/overview` - Vista global
   - ✅ `GET /api/v1/admin/tenants/:id/details` - Detalles de tenant
   - ✅ `POST /api/v1/admin/metrics/calculate` - Calcular métricas
   - ✅ `GET /api/v1/admin/metrics/snapshots` - Snapshots de métricas

6. **Endpoints Nivel 2 (Tenant/Company)**
   - ✅ `GET /api/v1/tenant/companies` - Listar companies
   - ✅ `POST /api/v1/tenant/companies` - Crear company
   - ✅ `GET /api/v1/tenant/companies/:id` - Obtener company
   - ✅ `PUT /api/v1/tenant/companies/:id` - Actualizar company
   - ✅ `DELETE /api/v1/tenant/companies/:id` - Eliminar company
   - ✅ `GET /api/v1/tenant/dashboard` - Dashboard del tenant
   - ✅ `GET /api/v1/tenant/dashboard/companies/:id/dashboard` - Dashboard de company

7. **Health Check**
   - ✅ `GET /health` - Estado del servidor
   - ✅ `GET /api/v1` - Información de la API

### 🟡 Pendiente / Por Verificar

1. **Base de Datos**
   - ⚠️ Necesita configuración de MongoDB en la nube
   - ⚠️ Falta archivo `.env` con variables de entorno
   - ⚠️ Necesita crear Tenant por defecto para usuarios

2. **Servicios**
   - ⚠️ Servicios de AI (estructura creada, implementación pendiente)
   - ⚠️ Servicios de Blockchain (estructura creada, implementación pendiente)

3. **Testing**
   - ⚠️ Tests unitarios básicos creados
   - ⚠️ Tests de integración pendientes

4. **Scripts**
   - ✅ Script para asignar usuarios a tenant por defecto
   - ✅ Script para calcular métricas snapshot

## 🔧 Configuración Necesaria

### Variables de Entorno Requeridas

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/luna?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

## 🚀 Próximos Pasos

1. **Configurar MongoDB en la nube** (MongoDB Atlas recomendado)
2. **Crear archivo `.env`** con las variables de entorno
3. **Crear Tenant por defecto** en la base de datos
4. **Crear Roles iniciales** (SUPERADMIN, USER, etc.)
5. **Probar endpoints** usando la colección de Postman
6. **Implementar servicios de AI** (cuando esté listo)
7. **Implementar servicios de Blockchain** (cuando esté listo)

## 📝 Notas Importantes

- Todos los endpoints de nivel 3 (excepto auth) requieren autenticación JWT
- Los endpoints de nivel 1 requieren rol `SUPERADMIN`
- Los endpoints de nivel 2 requieren roles `TENANT_OWNER`, `TENANT_ADMIN` o `COMPANY_ADMIN`
- El sistema usa multi-tenancy: cada usuario pertenece a un Tenant (y opcionalmente a una Company)
- Las consultas se filtran automáticamente por `tenantId` y `companyId` según el usuario autenticado

## 🔗 Documentación Adicional

- [Niveles, Roles y Tenancy](./docs/architecture/NIVELES-ROLES-TENANCY.md)
- [Arquitectura Global](./docs/architecture/ARQUITECTURA-GLOBAL-Y-ROADMAP.md)
- [Estructura de Carpetas](./docs/architecture/ESTRUCTURA-CARPETAS-BACKEND.md)

