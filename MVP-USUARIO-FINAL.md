# 📋 MVP - Capacidades del Usuario Final (Nivel 3)

## 🎯 Resumen Ejecutivo

Este documento detalla **qué puede y no puede hacer** el usuario final (rol `USER`, Nivel 3) en el MVP de LUNA Backend.

---

## ✅ LO QUE PUEDE HACER (Funcionalidades Implementadas)

### 🔐 1. Autenticación y Perfil
- ✅ **Registrarse** (`POST /api/v1/auth/register`)
  - Crear cuenta nueva
  - Se crea automáticamente un perfil por defecto
  - Recibe token JWT al registrarse
  
- ✅ **Iniciar sesión** (`POST /api/v1/auth/login`)
  - Autenticarse con correo y contraseña
  - Recibe token JWT para requests posteriores
  
- ✅ **Ver su información** (`GET /api/v1/auth/me`)
  - Obtener sus datos personales
  - Ver sus perfiles asociados

### 👤 2. Gestión de Perfiles
- ✅ **Listar perfiles** (`GET /api/v1/profiles`)
  - Ver todos sus perfiles financieros
  
- ✅ **Ver un perfil específico** (`GET /api/v1/profiles/:id`)
  - Obtener detalles de un perfil
  
- ✅ **Crear perfil** (`POST /api/v1/profiles`)
  - Crear nuevos perfiles (ej: personal, familiar, negocio)
  
- ✅ **Actualizar perfil** (`PUT /api/v1/profiles/:id`)
  - Modificar nombre y configuración del perfil
  
- ✅ **Eliminar perfil** (`DELETE /api/v1/profiles/:id`)
  - Eliminar un perfil (si no tiene datos asociados)

### 💳 3. Gestión de Cuentas
- ✅ **Listar cuentas** (`GET /api/v1/accounts`)
  - Ver todas sus cuentas bancarias/financieras
  
- ✅ **Ver cuenta específica** (`GET /api/v1/accounts/:id`)
  - Obtener detalles de una cuenta
  
- ✅ **Crear cuenta** (`POST /api/v1/accounts`)
  - Agregar nueva cuenta (corriente, ahorro, tarjeta, efectivo, inversión)
  
- ✅ **Actualizar cuenta** (`PUT /api/v1/accounts/:id`)
  - Modificar datos de la cuenta (nombre, banco, saldo, etc.)
  
- ✅ **Eliminar cuenta** (`DELETE /api/v1/accounts/:id`)
  - Eliminar una cuenta

### 💰 4. Gestión de Transacciones
- ✅ **Listar transacciones** (`GET /api/v1/transactions`)
  - Ver transacciones de un perfil
  - Filtros disponibles:
    - Por tipo (Ingreso/Gasto)
    - Por rango de fechas
    - Paginación (limit, page)
  
- ✅ **Ver transacción específica** (`GET /api/v1/transactions/:id`)
  - Obtener detalles de una transacción
  
- ✅ **Crear transacción** (`POST /api/v1/transactions`)
  - Registrar nueva transacción (Ingreso/Gasto/Transferencia)
  - Asociar a perfil, cuenta, categoría, regla
  
- ✅ **Actualizar transacción** (`PUT /api/v1/transactions/:id`)
  - Modificar datos de una transacción
  
- ✅ **Eliminar transacción** (`DELETE /api/v1/transactions/:id`)
  - Eliminar una transacción

### 📊 5. Analytics y Resúmenes
- ✅ **Resumen financiero mensual** (`GET /api/v1/analytics/summary`)
  - Ver ingresos, gastos, balance de un mes específico
  - Desglose por categorías
  - Comparación con meses anteriores
  
- ✅ **Tendencias mensuales** (`GET /api/v1/analytics/trends`)
  - Ver evolución de ingresos/gastos en últimos N meses
  - Proyecciones y tendencias

### 📈 6. Resúmenes Financieros Completos
- ✅ **Resumen completo** (`GET /api/v1/app/summary`)
  - Patrimonio neto
  - Cash flow (ingresos, gastos, neto)
  - Deudas (total, cantidad, próximos pagos)
  - Activos (total, cantidad)
  - Score financiero (0-100, grado A-F)
  - Ahorros
  
- ✅ **Patrimonio neto** (`GET /api/v1/app/net-worth`)
  - Solo el cálculo de patrimonio neto (activos - pasivos)
  - Desglose detallado
  
- ✅ **Score financiero** (`GET /api/v1/app/financial-score`)
  - Score de 0-100
  - Grado (A-F)
  - Factores que influyen

### 🤖 7. Insights con IA
- ✅ **Insights generales** (`GET /api/v1/app/insights`)
  - Insights básicos (siempre disponibles):
    - Patrimonio neto
    - Tasa de ahorro
    - Salud de deudas
    - Score financiero
  - Insights avanzados con IA (si está habilitado)
  - Recomendaciones personalizadas
  
- ✅ **Insights de gastos** (`GET /api/v1/app/insights/spending`)
  - Análisis de patrones de gastos
  - Categorías principales
  - Tendencias y anomalías

---

## ❌ LO QUE NO PUEDE HACER (Restricciones)

### 🚫 1. Acceso a Niveles Superiores
- ❌ **NO puede acceder a endpoints de Nivel 1 (Admin)**
  - `/api/v1/admin/*` → 403 Forbidden
  - Gestión de tenants
  - Métricas globales
  - Overview administrativo
  
- ❌ **NO puede acceder a endpoints de Nivel 2 (Tenant/Company)**
  - `/api/v1/tenant/*` → 403 Forbidden
  - Gestión de empresas
  - Dashboards de tenant

### 🚫 2. Funcionalidades No Implementadas (Futuras)
- ❌ **Gestión de Categorías**
  - No puede crear/editar/eliminar categorías
  - Solo puede usar las categorías existentes
  
- ❌ **Gestión de Deudas**
  - No hay endpoints para crear/editar deudas
  - No puede gestionar pagos de deudas
  
- ❌ **Gestión de Activos**
  - No hay endpoints para crear/editar activos
  - No puede registrar propiedades, vehículos, inversiones
  
- ❌ **Gestión de Ahorros**
  - No hay endpoints para crear/editar ahorros
  - No puede gestionar metas de ahorro
  
- ❌ **Presupuestos**
  - No hay endpoints para crear/editar presupuestos
  - No puede establecer límites de gasto por categoría
  
- ❌ **Reglas Financieras**
  - No hay endpoints para crear/editar reglas
  - No puede configurar porcentajes de distribución
  
- ❌ **Tableros Financieros (FinancialBoard)**
  - No hay endpoints para crear/editar tableros
  - No puede gestionar presupuestos mensuales
  
- ❌ **Configuraciones**
  - No hay endpoints para configuraciones personalizadas
  - No puede cambiar preferencias de moneda, país, etc.
  
- ❌ **OCR de Recibos**
  - No hay endpoints para subir/procesar imágenes de recibos
  - No puede automatizar registro de transacciones desde fotos
  
- ❌ **Exportación de Datos**
  - No hay endpoints para exportar datos (CSV, PDF, Excel)
  - No puede descargar reportes
  
- ❌ **Notificaciones**
  - No hay endpoints para gestionar notificaciones
  - No puede configurar alertas
  
- ❌ **Suscripciones/Planes**
  - No hay endpoints para gestionar suscripciones
  - No puede cambiar de plan

### 🚫 3. Limitaciones de Seguridad
- ❌ **NO puede ver datos de otros usuarios**
  - Todos los endpoints están scoped por `usuarioID`
  - Solo ve sus propios datos
  
- ❌ **NO puede modificar datos de otros usuarios**
  - Validación en todos los endpoints
  - No puede acceder a perfiles/cuentas/transacciones de otros

---

## 📊 Matriz de Capacidades

| Funcionalidad | Estado | Endpoint | Notas |
|--------------|--------|----------|-------|
| **Autenticación** |
| Registro | ✅ | `POST /api/v1/auth/register` | Crea perfil por defecto |
| Login | ✅ | `POST /api/v1/auth/login` | Retorna JWT token |
| Ver mi perfil | ✅ | `GET /api/v1/auth/me` | Datos del usuario |
| **Perfiles** |
| Listar | ✅ | `GET /api/v1/profiles` | Solo del usuario |
| Ver uno | ✅ | `GET /api/v1/profiles/:id` | Validación de propiedad |
| Crear | ✅ | `POST /api/v1/profiles` | Múltiples perfiles |
| Actualizar | ✅ | `PUT /api/v1/profiles/:id` | Validación de propiedad |
| Eliminar | ✅ | `DELETE /api/v1/profiles/:id` | Validación de propiedad |
| **Cuentas** |
| Listar | ✅ | `GET /api/v1/accounts` | Solo del usuario |
| Ver una | ✅ | `GET /api/v1/accounts/:id` | Validación de propiedad |
| Crear | ✅ | `POST /api/v1/accounts` | Tipos: Corriente, Ahorro, etc. |
| Actualizar | ✅ | `PUT /api/v1/accounts/:id` | Validación de propiedad |
| Eliminar | ✅ | `DELETE /api/v1/accounts/:id` | Validación de propiedad |
| **Transacciones** |
| Listar | ✅ | `GET /api/v1/transactions` | Con filtros y paginación |
| Ver una | ✅ | `GET /api/v1/transactions/:id` | Validación de propiedad |
| Crear | ✅ | `POST /api/v1/transactions` | Ingreso/Gasto/Transferencia |
| Actualizar | ✅ | `PUT /api/v1/transactions/:id` | Validación de propiedad |
| Eliminar | ✅ | `DELETE /api/v1/transactions/:id` | Validación de propiedad |
| **Analytics** |
| Resumen mensual | ✅ | `GET /api/v1/analytics/summary` | Requiere perfilID |
| Tendencias | ✅ | `GET /api/v1/analytics/trends` | Últimos N meses |
| **Resúmenes** |
| Resumen completo | ✅ | `GET /api/v1/app/summary` | Todo en uno |
| Patrimonio neto | ✅ | `GET /api/v1/app/net-worth` | Activos - Pasivos |
| Score financiero | ✅ | `GET /api/v1/app/financial-score` | 0-100, grado A-F |
| **Insights** |
| Insights generales | ✅ | `GET /api/v1/app/insights` | Básicos + IA (si habilitado) |
| Insights de gastos | ✅ | `GET /api/v1/app/insights/spending` | Patrones y tendencias |
| **Categorías** |
| Listar | ❌ | - | No implementado |
| Crear/Editar | ❌ | - | No implementado |
| **Deudas** |
| Gestión | ❌ | - | No implementado |
| **Activos** |
| Gestión | ❌ | - | No implementado |
| **Ahorros** |
| Gestión | ❌ | - | No implementado |
| **Presupuestos** |
| Gestión | ❌ | - | No implementado |
| **Reglas** |
| Gestión | ❌ | - | No implementado |
| **Tableros** |
| Gestión | ❌ | - | No implementado |
| **OCR** |
| Procesar recibos | ❌ | - | No implementado |
| **Exportación** |
| Exportar datos | ❌ | - | No implementado |
| **Suscripciones** |
| Gestionar plan | ❌ | - | No implementado |

---

## 🎯 Flujo Típico del Usuario Final

### 1. Registro/Login
```
POST /api/v1/auth/register → Recibe token
POST /api/v1/auth/login → Recibe token
```

### 2. Configuración Inicial
```
GET /api/v1/auth/me → Ver su información
POST /api/v1/profiles → Crear perfil (si no tiene)
POST /api/v1/accounts → Agregar cuentas bancarias
```

### 3. Uso Diario
```
POST /api/v1/transactions → Registrar ingresos/gastos
GET /api/v1/transactions?perfilID=xxx → Ver transacciones
GET /api/v1/app/summary → Ver resumen financiero
GET /api/v1/app/insights → Ver recomendaciones
```

### 4. Análisis
```
GET /api/v1/analytics/summary?perfilID=xxx&mes=1&año=2024
GET /api/v1/analytics/trends?perfilID=xxx&meses=6
GET /api/v1/app/net-worth
GET /api/v1/app/financial-score
```

---

## 🔍 Endpoints Disponibles (Resumen)

### Públicos (sin autenticación)
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Privados (requieren token JWT + rol USER)
- `GET /api/v1/auth/me`
- `GET|POST|PUT|DELETE /api/v1/profiles`
- `GET|POST|PUT|DELETE /api/v1/accounts`
- `GET|POST|PUT|DELETE /api/v1/transactions`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/analytics/trends`
- `GET /api/v1/app/summary`
- `GET /api/v1/app/net-worth`
- `GET /api/v1/app/financial-score`
- `GET /api/v1/app/insights`
- `GET /api/v1/app/insights/spending`

---

## 📝 Notas Importantes

1. **Todos los endpoints están scoped por usuario**: El usuario solo puede ver/modificar sus propios datos.

2. **Validación de propiedad**: En endpoints que requieren ID (GET/PUT/DELETE), se valida que el recurso pertenezca al usuario.

3. **Perfiles son requeridos**: Muchos endpoints requieren un `perfilID` para funcionar correctamente.

4. **IA está preparada pero no activa**: Los endpoints de insights tienen hooks para IA, pero actualmente retornan análisis básicos.

5. **Filtros y paginación**: Los endpoints de listado soportan filtros y paginación para mejor rendimiento.

---

## 🚀 Próximos Pasos para Completar MVP

### Prioridad Alta
1. ✅ **Gestión de Categorías** - CRUD de categorías personalizadas
2. ✅ **Gestión de Deudas** - Registrar y gestionar deudas
3. ✅ **Gestión de Activos** - Registrar activos (propiedades, vehículos, etc.)

### Prioridad Media
4. ✅ **Gestión de Ahorros** - Metas y seguimiento de ahorros
5. ✅ **Presupuestos** - Establecer y monitorear presupuestos
6. ✅ **Reglas Financieras** - Configurar distribución porcentual

### Prioridad Baja
7. ✅ **Tableros Financieros** - Gestión de presupuestos mensuales
8. ✅ **OCR de Recibos** - Procesamiento de imágenes
9. ✅ **Exportación de Datos** - CSV, PDF, Excel

---

**Última actualización**: 2025-01-01
**Versión MVP**: 1.0.0

