# 🧠 Mapa Mental Visual - LUNA Backend (Versión Texto)

```
                                    ╔══════════════════════════════════════════════════════════════╗
                                    ║                    LUNA BACKEND                              ║
                                    ║              Plataforma Financiera Multi-Tenant             ║
                                    ╚══════════════════════════════════════════════════════════════╝
                                                              │
                    ┌─────────────────────────────────────────┼─────────────────────────────────────────┐
                    │                                         │                                         │
            ┌───────▼────────┐                        ┌───────▼────────┐                        ┌───────▼────────┐
            │  AUTENTICACIÓN │                        │    USUARIOS    │                        │   FINANZAS     │
            └───────┬────────┘                        └───────┬────────┘                        └───────┬────────┘
                    │                                         │                                         │
        ┌───────────┼───────────┐                 ┌───────────┼───────────┐                 ┌───────────┼───────────┐
        │           │           │                 │           │           │                 │           │           │
    ┌───▼───┐  ┌───▼───┐  ┌───▼───┐         ┌───▼───┐  ┌───▼───┐  ┌───▼───┐         ┌───▼───┐  ┌───▼───┐  ┌───▼───┐
    │  JWT  │  │ ROLES │  │TENANT │         │ USER  │  │PROFILE│  │CONFIG │         │ACTIVOS│  │PASIVOS│  │MOVIM. │
    │TOKENS │  │       │  │       │         │       │  │       │  │       │         │       │  │       │  │       │
    └───────┘  └───────┘  └───────┘         └───────┘  └───────┘  └───────┘         └───┬───┘  └───┬───┘  └───┬───┘
                                                                                          │          │          │
                    ┌─────────────────────────────────────────────────────────────────────┼──────────┼──────────┼─────────────────────┐
                    │                                                                     │          │          │                     │
            ┌───────▼────────┐                                                    ┌───────▼────────┐  │  ┌───────▼────────┐  ┌───────▼────────┐
            │   ACTIVOS      │                                                    │   PASIVOS      │  │  │  MOVIMIENTOS   │  │  PRESUPUESTOS │
            └───────┬────────┘                                                    └───────┬────────┘  │  └───────┬────────┘  └───────┬────────┘
                    │                                                                   │          │          │                     │
        ┌───────────┼───────────┐                                           ┌───────────┼───────────┼───────────┼───────────┐  ┌───▼───┐
        │           │           │                                           │           │           │           │           │  │TABLERO│
    ┌───▼───┐  ┌───▼───┐  ┌───▼───┐                                   ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  │FINANCI│
    │PROPIED│  │VEHÍCUL│  │INVERS.│                                   │DEUDAS │  │PAGOS  │  │CUENTAS│  │TRANSAC│  │INGRESO│  │ERO    │
    │ADES   │  │OS     │  │       │                                   │       │  │       │  │       │  │CIONES │  │S      │  └───┬───┘
    └───┬───┘  └───┬───┘  └───┬───┘                                   └───┬───┘  └───┬───┘  └───┬───┘  └───┬───┘  └───┬───┘      │
        │          │          │                                         │          │          │          │          │          │
    ┌───▼───┐  ┌───▼───┐  ┌───▼───┐                               ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───┐
    │TASACI │  │MARCA  │  │TIPO   │                               │HIPOTE │  │HISTOR │  │CORR.  │  │INGRESO│  │RECURR │  │REGLAS │
    │ONES   │  │MODELO │  │MONTO  │                               │CARIOS │  │IAL    │  │AHORRO │  │GASTO  │  │OCASIO │  │50-30- │
    │       │  │AÑO    │  │       │                               │CONSUM │  │       │  │TC     │  │       │  │NAL    │  │20     │
    │UF/CLP │  │KM     │  │       │                               │TC     │  │       │  │EFECT. │  │       │  │       │  │       │
    │EVOLUC.│  │PATENTE│  │       │                               │PERSON │  │       │  │INVERS.│  │       │  │       │  │       │
    └───────┘  └───────┘  └───────┘                               │AL     │  └───────┘  └───────┘  └───────┘  └───────┘  └───────┘
                                                                   └───────┘
                                                                        │
                                                            ┌───────────┼───────────┐
                                                            │           │           │
                                                        ┌───▼───┐  ┌───▼───┐  ┌───▼───┐
                                                        │NIVEL  │  │RATIO  │  │ESTADO │
                                                        │DEUDA  │  │DEUDA/ │  │PAGO   │
                                                        │       │  │INGRES │  │       │
                                                        │1-4    │  │OS     │  │       │
                                                        └───────┘  └───────┘  └───────┘

                    ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
                    │                                                                                               │
            ┌───────▼────────┐                                                                              ┌───────▼────────┐
            │   ANÁLISIS     │                                                                              │ CONFIGURACIÓN  │
            └───────┬────────┘                                                                              └───────┬────────┘
                    │                                                                                               │
        ┌───────────┼───────────┐                                                               ┌───────────────────┼───────────────────┐
        │           │           │                                                               │                   │                   │
    ┌───▼───┐  ┌───▼───┐  ┌───▼───┐                                                       ┌───▼───┐         ┌───▼───┐         ┌───▼───┐
    │ANALYT │  │INSIGHT│  │MÉTRIC │                                                       │PAÍSES │         │MONEDAS│         │CATEGO │
    │ICS    │  │S      │  │AS     │                                                       │       │         │       │         │RÍAS   │
    └───┬───┘  └───┬───┘  └───┬───┘                                                       └───────┘         └───────┘         └───┬───┘
        │          │          │                                                                                                   │
    ┌───▼───┐  ┌───▼───┐  ┌───▼───┐                                                               ┌───────────────────────────┼───────────┐
    │RESUMEN│  │RECOM. │  │PATRIM │                                                               │                           │           │
    │       │  │IA     │  │ONIO   │                                                           ┌───▼───┐                 ┌───▼───┐  ┌───▼───┐
    │TREND  │  │PATRON │  │NETO   │                                                           │REGION│                 │FORMAT│  │ICONO  │
    │S      │  │ES     │  │       │                                                           │ES    │                 │O      │  │COLOR  │
    │       │  │       │  │SCORE  │                                                           └───────┘                 └───────┘  └───────┘
    │       │  │       │  │0-100  │
    └───────┘  └───────┘  └───────┘

                    ┌───────────────────────────────────────────────────────────────────────────────────────────────┐
                    │                                                                                               │
            ┌───────▼────────┐                                                                              ┌───────▼────────┐
            │   SERVICIOS    │                                                                              │   SEGURIDAD    │
            └───────┬────────┘                                                                              └───────┬────────┘
                    │                                                                                               │
        ┌───────────┼───────────┐                                                               ┌───────────────────┼───────────────────┐
        │           │           │                                                               │                   │                   │
    ┌───▼───┐  ┌───▼───┐  ┌───▼───┐                                                       ┌───▼───┐         ┌───▼───┐         ┌───▼───┐
    │  IA   │  │BLOCKCH│  │PARTNER│                                                       │AUTH   │         │CIFRAD│         │MONITOR│
    │       │  │AIN    │  │S      │                                                       │JWT    │         │O      │         │EO     │
    └───┬───┘  └───────┘  └───────┘                                                       └───────┘         └───────┘         └───────┘
        │
    ┌───▼───┐
    │SUGEREN│
    │CIAS   │
    │       │
    │ICONOS │
    │GASTOS │
    │FIJOS  │
    └───────┘
```

---

## 📊 Resumen de Modelos por Categoría

### 🔐 **AUTENTICACIÓN Y USUARIOS** (5 modelos)
- `User` - Usuarios del sistema
- `Profile` - Perfiles financieros
- `Role` - Roles y permisos
- `Tenant` - Inquilinos/Marcas
- `Company` - Empresas

### 💰 **ACTIVOS** (2 modelos)
- `Asset` - Activos (propiedades, vehículos, inversiones)
- `AssetValuation` - Historial de tasaciones

### 💳 **PASIVOS** (2 modelos)
- `Debt` - Deudas
- `Payment` - Pagos de deudas

### 💵 **MOVIMIENTOS** (3 modelos)
- `Account` - Cuentas bancarias
- `Transaction` - Transacciones (ingresos/gastos)
- `Income` - Ingresos específicos

### 📊 **PRESUPUESTOS** (3 modelos)
- `FinancialBoard` - Tableros financieros mensuales
- `Rule` - Reglas de presupuesto (50-30-20)
- `Budget` - Presupuestos por categoría

### 🐷 **AHORROS** (1 modelo)
- `Savings` - Ahorros e inversiones

### 📁 **CONFIGURACIÓN** (4 modelos)
- `Category` - Categorías de transacciones
- `Country` - Países
- `Currency` - Monedas
- `Configuration` - Configuración global

### 💼 **PLANES** (2 modelos)
- `Plan` - Planes de suscripción
- `Subscription` - Suscripciones activas

### 📈 **MÉTRICAS** (1 modelo)
- `MetricsSnapshot` - Snapshots de métricas

---

## 🔢 Estadísticas Totales

- **23 Modelos** de base de datos
- **19 Módulos** de endpoints (Level 3)
- **3 Niveles** de acceso
- **100+ Endpoints** disponibles
- **Multi-tenant** completo
- **Multi-moneda** (CLP, UF, USD, COP, EUR)
- **Multi-perfil** (persona, empresa)

---

## 🎯 Características Destacadas

### ✨ **Cálculos Automáticos**
- ✅ Patrimonio Neto (Activos - Pasivos)
- ✅ Score Financiero (0-100)
- ✅ Nivel de Deuda (1-4)
- ✅ Evolución de Tasaciones (UF/CLP)
- ✅ Presupuestos de Reglas (50-30-20)
- ✅ Saldos de Cuentas
- ✅ Saldos de Deudas

### 🔄 **Integraciones Automáticas**
- ✅ Transacciones → Actualiza Cuentas
- ✅ Transacciones → Actualiza Tableros
- ✅ Transacciones → Actualiza Reglas
- ✅ Transacciones → Crea Pagos (si tiene deudaID)
- ✅ Pagos → Actualiza Saldos de Deudas
- ✅ Ingresos → Actualiza Tableros
- ✅ Tasaciones → Calcula Evolución

---

**📄 Ver versión completa con diagramas Mermaid:** [MAPA-MENTAL-LUNA-BACKEND.md](./MAPA-MENTAL-LUNA-BACKEND.md)
