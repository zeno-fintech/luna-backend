# 🏛️ Niveles, Roles y Modelo Multi-Tenant de LUNA

Este documento define claramente:
- Los **3 niveles** del sistema.
- Los **roles** disponibles en cada nivel.
- Qué son **Tenant**, **Company** y **User** y cómo se relacionan.
- Cómo se conectan estos conceptos con las **marcas propias**, **partners** y **empresas/clientes**.

---

## 1. Niveles del Sistema

Tenemos **3 niveles** jerárquicos:

1. **Nivel 1 – Holding / Grupo ZENO (Superadmin)**
2. **Nivel 2 – Tenants / Partners / Empresas (White Label)**
3. **Nivel 3 – Usuarios Finales (Personas / Colaboradores)**

Cada nivel tiene sus propios roles y alcance.

---

## 2. Definiciones Clave

### 2.1 Tenant

- **Qué es**: 
  - Un **Tenant** representa una "instancia lógica" del producto LUNA. 
  - Puede ser una **marca propia** del grupo ZENO (ej: `lunafinance.com`, `finanzasfacil.cl`) o un **partner** (ej: `buk.com` usando LUNA para sus clientes).

- **Para qué sirve**:
  - Define el **espacio lógico y comercial** donde viven usuarios, empresas y configuraciones.
  - Permite **white label**: branding, dominio, idioma, moneda, planes y precios propios.
  - Es la unidad principal para **analytics de negocio** (MRR por tenant, usuarios, países, etc.).

- **Qué hace / qué configura**:
  - Branding: logo, colores, nombre, dominios (`app.finanzasfacil.cl`, `app.lunafinance.com`).
  - Planes y precios ofrecidos a sus usuarios finales.
  - Políticas: límites, features habilitadas (OCR, voz, IA, etc.).

- **De quién depende**:
  - Cada `Tenant` depende del **Nivel 1 (Holding / Grupo ZENO)**.
  - El holding puede crear, pausar o eliminar tenants y definir condiciones globales.

> Ejemplos de Tenants:
> - `finanzasfacil.cl` (marca propia en Chile).
> - `lunafinance.com` (marca global propia).
> - `buk.com` (partner B2B2C que ofrece LUNA a sus clientes empresa).

---

### 2.2 Company

- **Qué es**:
  - Una **Company** es una **empresa cliente** dentro de un Tenant.
  - Vive **dentro** de un Tenant y representa organizaciones como `Falabella`, `Banco X`, `Estudio Contable Y`, etc.

- **Para qué sirve**:
  - Agrupa a los **usuarios finales (colaboradores/personas)** que pertenecen a esa empresa.
  - Permite dashboards, reportes e insights **a nivel empresa** (ej: salud financiera de colaboradores de Falabella).

- **Qué hace / qué puede configurar**:
  - Crea y gestiona usuarios internos (colaboradores, administradores RRHH, analistas).
  - Ve métricas **solo de su empresa**: ingresos/gastos medios, deudas, score financiero, metas, beneficios, etc.
  - Puede configurar algunos aspectos locales: segmentos internos, centros de costo, etiquetas, etc.

- **De quién depende**:
  - Depende de un **Tenant**:
    - Una Company siempre tiene un `tenantId`.
    - Ej: `Falabella` es Company de `Tenant: buk.com` o de `Tenant: finanzasfacil.cl`.

> Ejemplos de Company:
> - Para Tenant `buk.com`: `Falabella`, `Cencosud`, `Empresa Minera Norte`.
> - Para Tenant `finanzasfacil.cl`: `Cliente Pyme A`, `Empresa de Arriendos B`, etc.

---

### 2.3 User

- **Qué es**:
  - Un **User** es la **persona real** que usa el sistema.
  - Puede ser:
    - Un **colaborador/empleado** de una Company.
    - Un **usuario individual** que se registró directamente en una marca propia (ej: LUNA app).

- **Nivel jerárquico**:
  - Es el **nivel 3 (final)** en la jerarquía.
  - Siempre está asociado, como mínimo, a un `Tenant`.
  - Opcionalmente, también a una `Company` (si viene por una empresa o partner B2B2C).

- **Qué hace / para qué sirve**:
  - Administra sus **finanzas personales**: ingresos, gastos, deudas, ahorros, activos, pasivos.
  - Crea **perfiles** y **sistemas financieros** (individuales o compartidos).
  - Define metas, objetivos de vida, preferencias, etc.

- **De quién depende**:
  - Siempre depende de un **Tenant**.
  - Puede depender también de una **Company** (si fue creado/invitado por una empresa).

---

## 3. Niveles y Roles

### 3.1 Nivel 1 – Dueño Principal / Grupo ZENO

**Quién es**: 
- El holding propietario del sistema (ej: `ZENO FinTech SPA`).
- "El dueño de la matrix" que ve todo el ecosistema.

**Objetivo del nivel**:
- Tener control total del **ecosistema de tenants, partners, empresas y usuarios**.
- Monitorear **unit economics**, métricas globales, rentabilidad, expansión geográfica.

**Roles en Nivel 1**:

- `superadmin`
  - Control absoluto del sistema.
  - Crea/edita/elimina **Tenants** (marcas propias, partners).
  - Define planes globales, políticas de seguridad y configuración técnica.
  - Acceso completo a dashboards globales (sin PII de usuarios finales).

- `admin`
  - Gestión operativa de alto nivel pero sin tocar credenciales críticas.
  - Puede gestionar Tenants, Companies y ver métricas avanzadas.
  - Puede gestionar equipos internos (asignar roles a otros usuarios de Nivel 1).

- `finance_analyst` / `bizops`
  - Acceso de **solo lectura** a métricas de negocio y unit economics.
  - Puede segmentar por Tenant, país, tipo de cliente, plan, etc.

- `support`
  - Soporte a Tenants y Companies (sin ver datos sensibles individuales).
  - Puede resetear accesos, revisar configuración, ver errores de integración.

---

### 3.2 Nivel 2 – Tenants / Partners / Empresas (White Label)

**Quiénes son**:
- **a) Marcas propias del grupo**
  - Ej: `lunafinance.com`, `finanzasfacil.cl`.
  - Bajo estas marcas se registran usuarios finales directamente.

- **b) Partners B2B2C**
  - Ej: `buk.com` que ofrece LUNA a sus clientes empresa (`Falabella`, etc.).

- **c) Empresas o personas que usan LUNA como servicio**
  - Ej: influencers, contadores, empresas de gestión de arriendos, asesorías financieras, etc.

**Objetivo del nivel**:
- Permitir que cada Tenant/Partner/Empresa gestione su **propio negocio** sobre LUNA:
  - Usuarios finales.
  - Empresas cliente.
  - Planes y precios locales.
  - Branding y experiencia.

**Roles en Nivel 2**:

- `tenant_owner` / `partner_owner`
  - Dueño de la instancia (marca propia o partner).
  - Crea Companies (ej: empresas clientes) dentro de su Tenant.
  - Define **planes y precios** destinados a sus usuarios finales.
  - Configura branding (logos, colores, dominio) y features habilitadas.

- `tenant_admin` / `company_admin`
  - Administra el día a día del Tenant o Company:
    - Crea/gestiona usuarios internos (RRHH, finanzas, analistas).
    - Asigna roles y permisos.
    - Gestiona acceso de empresas cliente (en el caso de partners).
  - Ve dashboards y métricas completas de **su ámbito** (Tenant o Company), nunca de otros.

- `manager` / `analyst`
  - Ve dashboards, reportes y métricas agregadas:
    - Salud financiera de colaboradores.
    - Impacto de beneficios (bonos, aguinaldos, subidas de sueldo, etc.).
    - Score financiero promedio, endeudamiento, metas.
  - No administra configuración de planes ni permisos de alto nivel.

- `support` (nivel Tenant/Company)
  - Soporte local a usuarios finales asociados a ese Tenant/Company.
  - Ve información necesaria para ayudar (pero limitada en PII según políticas).

> Importante:
> - El **Nivel 2** puede crear y gestionar **planes personalizados** para sus usuarios:
>   - Planes free/premium con features diferentes.
>   - Distintos precios por volumen de usuarios (especialmente en B2B2C).

---

### 3.3 Nivel 3 – Usuarios Finales

**Quiénes son**:
- Personas que usan el sistema para gestionar sus finanzas.
- Pueden llegar por:
  - Marca propia (ej: se registran en `lunafinance.com`).
  - Partner (ej: colaboradores de `Falabella` invitados por `buk`).
  - Empresa/influencer que usa LUNA para sus clientes.

**Objetivo del nivel**:
- Ayudar a cada persona a **entender y mejorar su vida financiera**.

**Roles en Nivel 3**:

- `user`
  - Usuario final estándar.
  - Tiene 1 o más **perfiles** financieros.
  - Registra ingresos, gastos, deudas, ahorros, activos, pasivos.
  - Crea metas, objetivos de vida, configura alertas.

- `co_owner` / `shared_member`
  - Usuario que comparte un **sistema financiero** con otra(s) persona(s):
    - Parejas, roommates, socios.
  - Puede tener porcentaje de aporte, ver y/o editar transacciones según permisos.

- `viewer` (opcional)
  - Acceso solo lectura a un sistema financiero:
    - Ej: un asesor financiero, un tutor, un mentor.

---

## 4. Relación entre Niveles y Entidades

Resumen jerárquico:

```text
[Nivel 1] Holding / Grupo ZENO
    └── Tenants (Nivel 2)
          ├── Marcas propias (LUNA, finanzasfacil.cl, etc.)
          ├── Partners B2B2C (ej: buk.com)
          └── Empresas/creadores (influencers, contadores, etc.)
                └── Companies (empresas cliente, si aplica)
                      └── Users (Nivel 3, usuarios finales)
```

- **Nivel 1** crea y controla **Tenants**.
- Cada **Tenant** puede tener:
  - Usuarios finales directos.
  - Y/o **Companies** con sus propios usuarios finales.
- Cada **User** siempre pertenece al menos a un **Tenant**, y opcionalmente a una **Company**.

---

## 5. APIs y Roles (visión general)

- Las rutas de API se pueden mantener unificadas (`/api/v1/...`).
- El **JWT** y el middleware definen el contexto:
  - `role` (superadmin, tenant_admin, user, etc.).
  - `tenantId` y `companyId`.
- Según rol y contexto, la misma ruta puede devolver:
  - Nivel 1: datos agregados globales.
  - Nivel 2: datos agregados del Tenant/Company.
  - Nivel 3: solo datos personales del usuario.

Esto permite que el mismo backend soporte:
- Marcas propias.
- Partners B2B2C.
- Empresas/influencers que quieran usar LUNA como plataforma.

