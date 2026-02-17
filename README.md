# FinUp Backend API

Backend API para FinUp - Plataforma de finanzas personales para Latinoamérica con arquitectura multi-tenant.

> **📚 Toda la documentación está en [`luna-docs/backend/`](../../luna-docs/backend/)**

---

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración

# Iniciar servidor de desarrollo
npm run dev
```

**Backend corriendo en:** `http://localhost:3002`

---

## 📚 Documentación Completa

**Toda la documentación del backend está centralizada en:**

**[`../../luna-docs/backend/`](../../luna-docs/backend/)**

### Documentación Principal

- **[Estado MVP Actualizado](../../luna-docs/backend/status/ESTADO-MVP-ACTUALIZADO.md)** - Estado completo del MVP
- **[MVP Usuario Final](../../luna-docs/backend/status/MVP-USUARIO-FINAL.md)** - Qué puede hacer el usuario
- **[Documentación Swagger](../../luna-docs/backend/api/SWAGGER-DOCUMENTATION.md)** - Cómo usar la API
- **[Guía de Inicio Rápido](../../luna-docs/backend/setup/GUIA-INICIO-RAPIDO.md)** - Setup paso a paso

### Por Categoría

- **Estado y Resumen:** [`status/`](../../luna-docs/backend/status/)
- **API y Endpoints:** [`api/`](../../luna-docs/backend/api/)
- **Arquitectura:** [`architecture/`](../../luna-docs/backend/architecture/)
- **Setup:** [`setup/`](../../luna-docs/backend/setup/)
- **Features:** [`features/`](../../luna-docs/backend/features/)
- **Deployment:** [`deployment/`](../../luna-docs/backend/deployment/)
- **Desarrollo:** [`development/`](../../luna-docs/backend/development/)

---

## 🏃 Comandos

```bash
# Desarrollo
npm run dev

# Producción
npm start

# Tests
npm test

# Linting
npm run lint
npm run lint:fix
```

---

## 📁 Estructura del Proyecto

```
luna-backend/
├── src/
│   ├── core/              # Configuración y middleware compartido
│   ├── level1/            # Nivel Admin (Holding)
│   ├── level2/            # Nivel Tenant/Company
│   ├── level3/            # Nivel Usuario Final
│   └── models/            # Modelos MongoDB
├── tests/                 # Tests
└── docs/                  # (Documentación técnica básica)
```

**Ver estructura completa:** [Estructura de Carpetas](../../luna-docs/backend/architecture/ESTRUCTURA-CARPETAS-BACKEND.md)

---

## 🔗 API Endpoints

### Swagger UI (Documentación Interactiva)

**Desarrollo:** `http://localhost:3002/api-docs`  
**Producción:** `https://luna-backend-production-ff08.up.railway.app/api-docs`

### Endpoints Principales

- **Auth:** `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/me`
- **Profiles:** `/api/v1/profiles`
- **Patrimonio:** `/api/v1/patrimonio/activos`, `/api/v1/patrimonio/pasivos`, `/api/v1/patrimonio/resumen`
- **Transactions:** `/api/v1/transactions`
- **Analytics:** `/api/v1/analytics/summary`, `/api/v1/app/summary`
- **Presupuestos:** `/api/v1/presupuestos`
- **⚠️ Deprecado:** `/api/v1/accounts`, `/api/v1/assets`, `/api/v1/debts` (usar `/api/v1/patrimonio` en su lugar)

**Ver documentación completa:** [Swagger Documentation](../../luna-docs/backend/api/SWAGGER-DOCUMENTATION.md)

---

## ✅ Estado del Proyecto

**🟢 MVP 90% Completo**

**Funcionalidades Implementadas:**
- ✅ Autenticación JWT completa
- ✅ CRUD de Perfiles, Transacciones
- ✅ **Sistema de Patrimonio unificado** (Activos y Pasivos)
- ✅ Presupuestos con Reglas (50/30/20)
- ✅ Analytics y Resúmenes
- ✅ Insights con IA básicos

**Ver estado completo:** [Estado MVP Actualizado](../../luna-docs/backend/status/ESTADO-MVP-ACTUALIZADO.md)

---

## 🔐 Environment Variables

Ver `.env.example` para todas las variables requeridas.

**Principales:**
- `PORT` - Puerto del servidor (default: 3000)
- `MONGODB_URI` - URI de conexión a MongoDB
- `JWT_SECRET` - Secreto para JWT tokens
- `CORS_ORIGIN` - Origen permitido para CORS

**Ver configuración completa:** [Configuración de Entorno](../../luna-docs/backend/setup/CONFIGURACION-ENV.md)

---

## 📝 Models

El backend incluye los siguientes modelos:

- **User** - Usuarios del sistema
- **Profile** - Perfiles de usuario
- **Activo** - Activos unificados (cuentas bancarias, propiedades, vehículos, inversiones, efectivo, otros)
- **Pasivo** - Pasivos unificados (todas las deudas)
- **Transaction** - Transacciones (Ingresos/Gastos)
- **Payment** - Pagos
- **Presupuesto** - Presupuestos mensuales
- **Income** - Ingresos
- **Rule** - Reglas financieras
- Y más...

**Ver documentación de modelos:** [Resumen del Proyecto](../../luna-docs/backend/status/RESUMEN-PROYECTO.md)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📄 License

MIT

---

## 👥 Team

ZENO Financial Tech SPA

---

## 📚 Más Documentación

- **Documentación completa:** [`../../luna-docs/backend/`](../../luna-docs/backend/)
- **Manifiesto del proyecto:** [`../../luna-docs/LUNA-MANIFIESTO-MAESTRO.md`](../../luna-docs/LUNA-MANIFIESTO-MAESTRO.md)
- **Documentación frontend:** [`../../luna-docs/web/`](../../luna-docs/web/)

---

**Última actualización:** Febrero 2025
