# 🔄 Cambios de Arquitectura - Sistema Basado en Perfiles

## 📋 Resumen de Cambios

Se ha actualizado la arquitectura para que **TODAS las operaciones funcionen bajo un perfil financiero**, no directamente bajo el usuario.

### 🎯 Estructura Nueva

```
Usuario (francocastro204@gmail.com)
  │
  ├── Perfil "Franco" (tipo: persona)
  │   ├── Cuentas
  │   ├── Transacciones
  │   ├── Deudas
  │   ├── Activos
  │   ├── Pasivos
  │   ├── Ahorros
  │   ├── Tableros Financieros
  │   ├── Reglas
  │   ├── Presupuestos
  │   └── Configuraciones (país, moneda)
  │
  └── Perfil "Empresa Florería Violeta" (tipo: empresa)
      ├── Cuentas
      ├── Transacciones
      ├── Deudas
      ├── Activos
      ├── Pasivos
      └── ...
```

---

## ✅ Cambios Realizados en Modelos

### 1. **Profile** - ✅ Actualizado
**Cambios:**
- ✅ Agregado campo `tipo` (enum: 'persona', 'empresa')
- ✅ Agregado objeto `configuracion` con:
  - `pais` (default: 'CL')
  - `moneda` (default: 'CLP')
  - `zonaHoraria` (default: 'America/Santiago')
- ✅ Agregados índices para mejor performance

**Antes:**
```javascript
{
  usuarioID: ObjectId,
  nombrePerfil: String,
  isDefault: Boolean
}
```

**Ahora:**
```javascript
{
  usuarioID: ObjectId,
  nombrePerfil: String,
  tipo: 'persona' | 'empresa',  // ✅ NUEVO
  isDefault: Boolean,
  configuracion: {              // ✅ NUEVO
    pais: String,
    moneda: String,
    zonaHoraria: String
  }
}
```

### 2. **Account** - ✅ Actualizado
**Cambio:**
- ❌ **ANTES:** `usuarioID: ObjectId` (referencia a User)
- ✅ **AHORA:** `perfilID: ObjectId` (referencia a Profile)

**Razón:** Las cuentas ahora pertenecen a un perfil, no directamente al usuario.

### 3. **FinancialBoard** - ✅ Actualizado
**Cambio:**
- ❌ **ANTES:** `usuarioID: ObjectId` (referencia a User)
- ✅ **AHORA:** `perfilID: ObjectId` (referencia a Profile)

**Razón:** Los tableros financieros ahora pertenecen a un perfil.

### 4. **Debt** - ✅ Mejorado
**Cambios:**
- ✅ Agregado campo `montoCuota` (calculado automáticamente)
- ✅ Expandido enum `tipo` para incluir:
  - 'Personal' (deuda a persona común)
  - 'Institucional' (deuda a institución)
  - 'Bancaria' (deuda bancaria)
  - 'Comercial' (deuda comercial)

**Antes:**
```javascript
{
  perfilID: ObjectId,
  tipo: 'Personal' | 'Institucional',
  montoTotal: Number,
  numeroCuotas: Number,
  // ... sin montoCuota
}
```

**Ahora:**
```javascript
{
  perfilID: ObjectId,
  tipo: 'Personal' | 'Institucional' | 'Bancaria' | 'Comercial',  // ✅ EXPANDIDO
  montoTotal: Number,
  numeroCuotas: Number,
  montoCuota: Number,  // ✅ NUEVO (calculado: montoTotal / numeroCuotas)
  // ...
}
```

### 5. **Payment** - ✅ Mejorado
**Cambios:**
- ✅ Agregado campo `transaccionID` (referencia a Transaction)
- ✅ Agregado campo `fechaVencimiento`
- ✅ Campo `numeroCuota` ahora es requerido

**Razón:** Permite asociar pagos con transacciones y rastrear cuotas vencidas.

---

## 📝 Modelos que Ya Estaban Correctos

Estos modelos **ya tenían `perfilID`** y no necesitaron cambios:

- ✅ **Transaction** - Ya tiene `perfilID`
- ✅ **Asset** - Ya tiene `perfilID`
- ✅ **Savings** - Ya tiene `perfilID`
- ✅ **Budget** - Ya tiene `perfilID`
- ✅ **Rule** - Ya tiene `tableroID` (correcto, las reglas pertenecen a tableros)

---

## 🔧 Cambios Pendientes en Controladores

### 1. **accountController** - ⚠️ Parcialmente Actualizado
**Estado:** `getAccounts` actualizado, faltan los demás métodos.

**Cambios necesarios:**
- ✅ `getAccounts` - Ahora requiere `perfilID` en query
- ⏳ `getAccount` - Validar que la cuenta pertenece a un perfil del usuario
- ⏳ `createAccount` - Requiere `perfilID` en body, validar propiedad
- ⏳ `updateAccount` - Validar que la cuenta pertenece a un perfil del usuario
- ⏳ `deleteAccount` - Validar que la cuenta pertenece a un perfil del usuario

### 2. **Nuevos Controladores Necesarios**

#### **debtController** - ❌ No Existe
**Endpoints necesarios:**
- `GET /api/v1/debts?perfilID=xxx` - Listar deudas de un perfil
- `GET /api/v1/debts/:id` - Ver una deuda específica
- `POST /api/v1/debts` - Crear deuda (calcula `montoCuota` automáticamente)
- `PUT /api/v1/debts/:id` - Actualizar deuda
- `DELETE /api/v1/debts/:id` - Eliminar deuda

**Lógica especial:**
- Al crear/actualizar deuda, calcular automáticamente: `montoCuota = montoTotal / numeroCuotas`
- Validar que el perfil pertenece al usuario

#### **paymentController** - ❌ No Existe
**Endpoints necesarios:**
- `GET /api/v1/payments?perfilID=xxx&deudaID=xxx` - Listar pagos
- `GET /api/v1/payments/:id` - Ver un pago específico
- `POST /api/v1/payments` - Crear pago (asociar con transacción opcional)
- `PUT /api/v1/payments/:id` - Actualizar pago (marcar como pagado)
- `DELETE /api/v1/payments/:id` - Eliminar pago

**Lógica especial:**
- Al crear pago, actualizar `saldoPagado` y `saldoPendiente` de la deuda
- Si se asocia con transacción, vincular `transaccionID`
- Al marcar como "pagado", actualizar estado de la deuda si todas las cuotas están pagadas

---

## 🔄 Flujo de Trabajo con Perfiles

### 1. Usuario se Registra/Login
```
POST /api/v1/auth/register
POST /api/v1/auth/login
→ Recibe token JWT
```

### 2. Usuario Crea o Selecciona un Perfil
```
GET /api/v1/profiles → Ver sus perfiles
POST /api/v1/profiles → Crear nuevo perfil
  {
    "nombrePerfil": "Franco",
    "tipo": "persona",
    "configuracion": {
      "pais": "CL",
      "moneda": "CLP"
    }
  }
```

### 3. Todas las Operaciones Requieren `perfilID`
```
GET /api/v1/accounts?perfilID=xxx
POST /api/v1/accounts
  {
    "perfilID": "xxx",
    "nombre": "Cuenta Corriente",
    ...
  }

GET /api/v1/transactions?perfilID=xxx
POST /api/v1/transactions
  {
    "perfilID": "xxx",
    ...
  }

GET /api/v1/debts?perfilID=xxx
POST /api/v1/debts
  {
    "perfilID": "xxx",
    "tipo": "Bancaria",
    "montoTotal": 1000000,
    "numeroCuotas": 12,
    // montoCuota se calcula automáticamente: 83333.33
    ...
  }
```

---

## 🎯 Validación de Propiedad

**IMPORTANTE:** Todos los endpoints deben validar que:
1. El `perfilID` proporcionado pertenece al usuario autenticado
2. El recurso (cuenta, transacción, deuda, etc.) pertenece al perfil

**Función helper sugerida:**
```javascript
// src/core/utils/validateProfileOwnership.js
const validateProfileOwnership = async (userId, profileId) => {
  const Profile = require('@models/Profile');
  const profile = await Profile.findOne({ _id: profileId, usuarioID: userId });
  return profile !== null;
};
```

---

## 📊 Ejemplo: Gestión de Deudas y Pagos

### Crear Deuda
```javascript
POST /api/v1/debts
{
  "perfilID": "507f1f77bcf86cd799439011",
  "tipo": "Bancaria",
  "prestador": "Banco de Chile",
  "montoTotal": 1200000,
  "numeroCuotas": 12,
  "tasaInteres": 1.5,
  "fechaInicio": "2024-01-01"
}

// El sistema calcula automáticamente:
// montoCuota = 1200000 / 12 = 100000
// saldoPendiente = 1200000
// saldoPagado = 0
```

### Crear Pago de Cuota
```javascript
POST /api/v1/payments
{
  "perfilID": "507f1f77bcf86cd799439011",
  "deudaID": "507f1f77bcf86cd799439012",
  "numeroCuota": 1,
  "monto": 100000,
  "fecha": "2024-02-01",
  "transaccionID": "507f1f77bcf86cd799439013" // Opcional: si se pagó con una transacción
}

// El sistema actualiza automáticamente:
// - Payment.estado = "pagado"
// - Debt.saldoPagado += 100000
// - Debt.saldoPendiente -= 100000
// - Si todas las cuotas están pagadas: Debt.estado = "Pagada"
```

### Asociar Pago con Transacción
Cuando el usuario registra una transacción de pago de deuda:
```javascript
POST /api/v1/transactions
{
  "perfilID": "507f1f77bcf86cd799439011",
  "tipo": "Gasto",
  "monto": 100000,
  "categoriaID": "...",
  "detalle": "Pago cuota 1 - Banco de Chile"
}

// Luego, al crear el pago, se asocia:
POST /api/v1/payments
{
  "perfilID": "507f1f77bcf86cd799439011",
  "deudaID": "507f1f77bcf86cd799439012",
  "numeroCuota": 1,
  "monto": 100000,
  "transaccionID": "507f1f77bcf86cd799439013" // ← ID de la transacción creada
}
```

---

## ✅ Checklist de Implementación

### Modelos
- [x] Profile - Agregado tipo y configuraciones
- [x] Account - Cambiado usuarioID → perfilID
- [x] FinancialBoard - Cambiado usuarioID → perfilID
- [x] Debt - Agregado montoCuota y tipos expandidos
- [x] Payment - Agregado transaccionID y fechaVencimiento

### Controladores
- [ ] accountController - Actualizar todos los métodos
- [ ] debtController - Crear completo (CRUD)
- [ ] paymentController - Crear completo (CRUD)
- [ ] transactionController - Verificar que usa perfilID correctamente
- [ ] profileController - Verificar que maneja tipo y configuraciones

### Rutas
- [ ] `/api/v1/debts` - Crear rutas
- [ ] `/api/v1/payments` - Crear rutas

### Utilidades
- [ ] `validateProfileOwnership` - Función helper
- [ ] `calculateDebtCuota` - Función para calcular monto de cuota

---

**Última actualización:** 2025-01-01
**Estado:** En progreso

