# 🌐 Arquitectura Global LUNA y Roadmap Técnico

Este documento complementa `NIVELES-ROLES-TENANCY.md` y deja documentados:
- Un **diagrama global** del sistema (niveles, tenants, companies, users, apps, backend, DB).
- Un **modelo de datos conceptual** (Tenant / Company / User / Plan / Subscription / Finanzas).
- Un **roadmap técnico por fases** para evolucionar el backend actual hacia la visión completa.

---

## 1. Diagrama Global del Sistema (alto nivel)

```text
                ┌───────────────────────────────────────────┐
                │            NIVEL 1 – HOLDING              │
                │        (Grupo ZENO / Superadmin)          │
                │  - Superadmin / Admin / Finance / Support │
                └───────────────▲───────────────────────────┘
                                │ controla Tenants
                                │
                ┌───────────────┴───────────────────────────┐
                │          NIVEL 2 – TENANTS                │
                │   Marcas propias + Partners + Empresas    │
                │                                           │
                │  Tenant A (marca propia: LUNA)           │
                │    - tenant_owner / tenant_admin          │
                │    - Configura planes usuarios finales    │
                │    - Opcional: Companies internas         │
                │                                           │
                │  Tenant B (partner: BUK)                  │
                │    - buk_owner / buk_admin                │
                │    - Companies: Falabella, Cencosud ...   │
                │                                           │
                │  Tenant C (influencer / estudio contable) │
                │    - Usa LUNA para sus propios clientes   │
                └───────────────▲───────────────────────────┘
                                │ contiene Companies/Users
                                │
                ┌───────────────┴───────────────────────────┐
                │         NIVEL 3 – USUARIOS FINALES        │
                │   Personas / Colaboradores / Clientes     │
                │                                           │
                │  - user, co_owner, viewer                 │
                │  - Perfiles, sistemas financieros         │
                │  - Ingresos, gastos, patrimonio, metas    │
                └───────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                    FRONTENDS (multi-tenant)                    │
│  - Web LUNA (marca propia)                                     │
│  - Web/app para Tenants/Partners (dashboards admin)            │
│  - App móvil usuario final                                     │
└───────────────────────▲────────────────────────────────────────┘
                        │ REST / JSON
                        │
┌───────────────────────┴────────────────────────────────────────┐
│                    BACKEND LUNA (multi-tenant)                 │
│  - Auth (JWT + roles + tenantId/companyId)                     │
│  - Módulo Tenants & Companies                                  │
│  - Módulo Users & Perfiles                                     │
│  - Módulo Finanzas (cuentas, transacciones, deudas, etc.)      │
│  - Módulo Analytics (N1/N2/N3, agregados por tenant/company)   │
│  - Módulo Planes & Billing (planes, suscripciones, precios)    │
│  - Integraciones IA / Blockchain / Partners financieros        │
└───────────────────────▲────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────┐
│                      DATABASE (MongoDB)                        │
│  - Multi-tenant lógico: cada doc tiene tenantId, companyId     │
│  - Colecciones:                                                │
│    Tenants, Companies, Users, Roles, Plans, Subscriptions,     │
│    Accounts, Transactions, Debts, Assets, Budgets, Metrics...  │
└────────────────────────────────────────────────────────────────┘
```

---

## 2. Modelo de Datos Conceptual (simplificado)

### 2.1 Core multi-tenant / identidad

- **Tenant**
  - `id`
  - `name`, `slug`, `type` (`own_brand`, `partner`, `creator`)
  - `branding`: logo, colores, dominios
  - `defaultCurrency`, `defaultCountry`
  - `config`: features habilitadas (OCR, IA, publicidad, etc.)

- **Company**
  - `id`
  - `tenantId` (FK → Tenant)
  - `name`, `industry`, `country`, `city`
  - `size` (nº colaboradores)
  - `config`: segmentos internos, centros de costo, etc.

- **User**
  - `id`
  - `tenantId` (FK → Tenant)
  - `companyId` (FK → Company, opcional para usuarios directos de marca propia)
  - `email`, `name`, `passwordHash`, `status`
  - `roles`: lista de roles (`superadmin`, `tenant_admin`, `user`, etc.)
  - `planLevel` (para usuario final: `free`, `premium`, `pro`)

### 2.2 Planes y monetización

- **Plan**
  - `id`
  - `scope`: `user_plan` | `tenant_plan`
  - `name`, `description`
  - `priceMonthly`, `priceYearly`, `currency`
  - `features`: flags (`maxSystems`, `ocrEnabled`, `aiInsights`, etc.)

- **Subscription**
  - `id`
  - `scope`: `user` o `tenant`/`company`
  - `targetId`: `userId` o `tenantId`/`companyId`
  - `planId`
  - `status`: `active`, `trial`, `cancelled`
  - `startedAt`, `expiresAt`, `renewalType`

### 2.3 Finanzas usuario final (ligadas a tenant/company/user)

Para cada entidad financiera se añaden `tenantId` y `companyId`:

- **Account** (`Account`)
- **Category** (`Category`)
- **Transaction** (`Transaction`)
- **Debt** (`Debt`)
- **Payment** (`Payment`)
- **Savings** (`Savings`)
- **Asset** (`Asset`)
- **Budget** (`Budget`)
- **FinancialBoard** (`FinancialBoard`)
- **Rule** (`Rule`)

Cada documento incluye:
- `tenantId`
- `companyId` (si aplica)
- `userId` y/o `profileId`

### 2.4 Analytics / Métricas

- **MetricsSnapshot**
  - `id`
  - `scope`: `tenant` | `company` | `user`
  - `targetId`: `tenantId` / `companyId` / `userId`
  - `period`: día / mes / año
  - `metrics`: JSON con KPIs relevantes (usuarios activos, MRR, ingresos/gastos medios, score, etc.)

---

## 3. Roadmap Técnico Propuesto

Este roadmap toma como base el backend actual (Express + MongoDB) y lo orienta hacia la visión multi-tenant completa.

### 3.1 Fase 1 – Multi-tenant base + roles (backend)

**Objetivo**: que todo lo que ya existe funcione con contexto `tenantId` / `companyId` / `roles`.

**Tareas clave**:
- Crear modelos: `Tenant`, `Company`, `Role` (esquema Mongoose).
- Agregar `tenantId` y `companyId` a modelos financieros principales donde corresponda.
- Extender autenticación:
  - JWT con `tenantId`, `companyId`, `roles` en el payload.
  - Middleware `authorize(roles)` y filtro automático por `tenantId/companyId` en consultas.
- Endpoints mínimos Nivel 1 y 2:
  - `POST /api/v1/admin/tenants` (crear tenant).
  - `POST /api/v1/tenant/companies` (crear empresa dentro de un tenant).

### 3.2 Fase 2 – Panel Nivel 2 (Tenants / Empresas) + planes básicos

**Objetivo**: que una marca propia o partner pueda operar su negocio sobre LUNA.

**Tareas clave**:
- Implementar modelos `Plan` y `Subscription` (mínimo viable).
- Endpoints Nivel 2:
  - `GET /api/v1/tenant/dashboard` (usuarios, uso, métricas básicas del tenant).
  - CRUD de Companies: `/api/v1/tenant/companies`.
- Reglas de acceso:
  - `tenant_owner` ve todo su tenant (todas las companies y usuarios asociados).
  - `company_admin` ve solo su company.
- Asociar usuarios existentes a un `tenantId` (marca propia LUNA) como base.

### 3.3 Fase 3 – Panel Nivel 1 (Holding) + métricas globales

**Objetivo**: ver el ecosistema completo como Grupo ZENO.

**Tareas clave**:
- Endpoint agregador Nivel 1:
  - `GET /api/v1/admin/overview` con:
    - Lista de tenants, número de companies, usuarios, volumen de transacciones, MRR estimado, etc.
- Crear job/batch para `MetricsSnapshot` (cálculo diario/mensual de KPIs por tenant/company).
- Conectar con herramienta de dashboards (Metabase/Grafana) si se necesita una vista rápida.

### 3.4 Fase 4 – Experiencia completa usuario final (Nivel 3)

**Objetivo**: cerrar el loop para el usuario final con todo el modelo financiero.

**Tareas clave**:
- Exponer de forma ordenada endpoints de usuario final (prefijo sugerido `/api/v1/app/...`):
  - `/accounts`, `/transactions`, `/debts`, `/assets`, `/budgets`, etc.
- Endpoints agregados:
  - `GET /api/v1/app/summary` → balance general + flujo de caja + score financiero.
- Preparar hooks para futuras features de IA (por ahora solo logging/estructura, sin IA real).

### 3.5 Fase 5 – Monetización y Partners

**Objetivo**: encender ingresos y soportar partners B2B2C.

**Tareas clave**:
- Integración con sistema de billing (Stripe/Paddle/etc.):
  - Suscripciones usuario final → `Subscription` + webhooks.
  - Suscripciones por Tenant/Company (fees base + por usuario) al menos en modo manual al inicio.
- Endpoints para ver costos/ingresos:
  - Por Tenant (Nivel 1 y 2).
  - Por Company (para empresas grandes que pagan por colaborador).

### 3.6 Fase 6 – Publicidad / Afiliados / IA (según prioridad)

**Objetivo**: abrir fuentes de ingresos adicionales y potenciar el producto.

**Tareas clave**:
- **Publicidad ética** (especialmente en planes Free):
  - Definir zonas de anuncios en el frontend.
  - Flags en `Plan` para activar/desactivar publicidad.
- **Afiliados y productos financieros**:
  - Registrar eventos de referral/afiliado en el backend.
  - Conectar con partners financieros (inversión, seguros, bancos).
- **IA (largo plazo)**:
  - Activar `aiService` real para:
    - Resúmenes inteligentes por usuario.
    - Recomendaciones basadas en comportamiento y metas.
    - OCR/voz para captura de datos.

---

## 4. Conexión con Documentos Existentes

- `docs/architecture/NIVELES-ROLES-TENANCY.md`
  - Define niveles (1, 2, 3), roles y conceptos de Tenant/Company/User.
- `docs/business/MODELO-INGRESOS-LUNA.md`
  - Define los modelos de ingresos por nivel (usuarios finales vs tenants/partners/empresas).
- `docs/architecture/ARQUITECTURA-GLOBAL-Y-ROADMAP.md` (este archivo)
  - Une todo en una vista técnica global + plan de implementación.

