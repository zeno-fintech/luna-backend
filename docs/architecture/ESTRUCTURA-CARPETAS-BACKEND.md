# 📂 Estructura de Carpetas Backend LUNA

Objetivo: separar claramente **lo global/compartido** de lo específico de cada **nivel (1, 2, 3)** para facilitar escalabilidad, modularización futura y reutilización.

---

## 1. Visión General

```text
src/
  core/          # Global y compartido (toda la plataforma)
  level1/        # Nivel 1 – Holding / Grupo ZENO (superadmin)
  level2/        # Nivel 2 – Tenants / Partners / Empresas
  level3/        # Nivel 3 – Usuarios finales
  models/        # Modelos de dominio (compartidos entre niveles)
```

- `core/`: cosas que **no pertenecen a un solo nivel**, sino a toda la plataforma.
- `level1/`: lógica y endpoints que solo usan `superadmin` / equipo interno ZENO.
- `level2/`: lógica y endpoints de Tenants/Partners/Empresas (white label).
- `level3/`: lógica y endpoints de usuario final (app LUNA, colaboradores, clientes).
- `models/`: esquemas de MongoDB reutilizables por todos los niveles.

---

## 2. Detalle de `src/core/`

```text
src/core/
  config/        # Configuración global (DB, env, logger, etc.)
  middleware/    # Middleware global (auth base, error handler, analytics, etc.)
  utils/         # Utilidades compartidas (asyncHandler, generateToken, helpers)
  services/      # Servicios globales o integraciones (ej: AI, Blockchain)
```

Ejemplos:
- `core/config/database.js`: conexión única a MongoDB.
- `core/middleware/auth.js`: auth JWT + multi-tenant (usada en varios niveles).
- `core/middleware/errorHandler.js`: manejo global de errores.
- `core/utils/asyncHandler.js`: wrapper para controladores async.
- `core/utils/generateToken.js`: generación de tokens JWT.
- `core/services/ai/aiService.js`: integración IA (compartida cuando se use).
- `core/services/blockchain/blockchainService.js`: integración blockchain.

---

## 3. Detalle de `src/level1/` (Holding / Grupo ZENO)

```text
src/level1/
  controllers/
  services/
  routes/
```

Uso previsto:
- Dashboards y APIs para **superadmin / admin** del grupo ZENO.
- Ejemplos futuros:
  - `routes/adminTenants.js` → `/api/v1/admin/tenants`.
  - `routes/adminOverview.js` → `/api/v1/admin/overview`.
  - `services/adminMetricsService.js` → métricas globales.

---

## 4. Detalle de `src/level2/` (Tenants / Partners / Empresas)

```text
src/level2/
  controllers/
  services/
  routes/
```

Uso previsto:
- APIs para **owners/admins** de Tenants/Partners/Empresas.
- Ejemplos futuros:
  - `routes/tenantDashboard.js` → `/api/v1/tenant/dashboard`.
  - `routes/companies.js` → `/api/v1/tenant/companies`.
  - `services/tenantMetricsService.js` → métricas por tenant/company.

---

## 5. Detalle de `src/level3/` (Usuarios finales)

```text
src/level3/
  controllers/
  services/
  routes/
```

Uso actual (lo que ya tenemos):
- Endpoints de autenticación usuario final.
- Cuentas, perfiles, transacciones, analytics personales.

Ejemplos:
- `level3/routes/auth.js` → `/api/v1/auth/...`.
- `level3/routes/accounts.js` → `/api/v1/accounts/...`.
- `level3/routes/transactions.js` → `/api/v1/transactions/...`.
- `level3/routes/analytics.js` → `/api/v1/analytics/...`.

Con sus respectivos controladores y servicios dentro de `level3/controllers` y `level3/services`.

---

## 6. `src/models/` (Modelos compartidos)

```text
src/models/
  Tenant.js       # Tenant (marca propia, partner, creador)
  Company.js      # Empresa cliente dentro de un Tenant
  Role.js         # Roles del sistema
  User.js         # Personas / cuentas internas
  Account.js, Transaction.js, Debt.js, ... (dominio financiero)
```

- No se duplican modelos por nivel.
- Cada documento clave incluye `tenantId` y, si aplica, `companyId`.
- Los niveles se diferencian por **roles** + **scoping** (filtros por tenant/company).

---

## 7. Convenciones de Rutas por Nivel

- **Nivel 1 (Holding / Superadmin)**
  - Prefijo sugerido: `/api/v1/admin/...`

- **Nivel 2 (Tenants / Partners / Empresas)**
  - Prefijos sugeridos: `/api/v1/tenant/...`, `/api/v1/company/...`

- **Nivel 3 (Usuarios finales)**
  - Prefijo actual (ya en uso): `/api/v1/...` (auth, accounts, transactions, analytics).
  - En el futuro se puede unificar bajo `/api/v1/app/...` si se quiere aún más claridad.

---

## 8. Beneficios de esta estructura

- **Modularización futura**: fácil extraer `level1/` o `level2/` a otro repo si se desea separar admin de app.
- **Reutilización**: `core/` y `models/` pueden ser la base de otros productos/proyectos.
- **Claridad para el equipo**: cualquier persona nueva entiende rápido dónde vive cada cosa.
- **Soporte a multi-tenant**: el scoping por `tenantId`/`companyId` se aplica en servicios/controladores según el nivel.

