# 🏦 Integración de Cuentas Bancarias - Manual vs Automática

## 📊 Estado Actual del Sistema

### ✅ Lo que Tenemos Ahora (Modo Manual)

Actualmente, el sistema funciona de forma **100% manual**:

1. **Usuario crea cuentas manualmente:**
   ```json
   POST /api/v1/accounts
   {
     "perfilID": "xxx",
     "nombre": "Cuenta Corriente Banco de Chile",
     "banco": "Banco de Chile",
     "tipoCuenta": "Corriente",
     "saldoDisponible": 3000000,
     "moneda": "CLP"
   }
   ```

2. **Usuario registra transacciones manualmente:**
   ```json
   POST /api/v1/transactions
   {
     "perfilID": "xxx",
     "tipo": "Gasto",
     "monto": 50000,
     "cuentaID": "cuenta-id",  // ← Asocia la transacción a una cuenta
     "tableroID": "tablero-id", // ← Asocia al presupuesto mensual
     "detalle": "Compra en supermercado"
   }
   ```

3. **El sistema actualiza automáticamente:**
   - ✅ Resta el monto del `saldoDisponible` de la cuenta
   - ✅ Suma el gasto al tablero financiero
   - ✅ Actualiza las reglas de presupuesto

---

## 🔄 Cómo Funciona la Integración Actual

### Flujo Manual Completo:

```
┌─────────────────────────────────────────────────────────┐
│ 1. USUARIO CREA CUENTAS (Manual)                        │
│    - Cuenta Corriente: $3,000,000                       │
│    - Cuenta Ahorro: $5,000,000                          │
│    - Tarjeta Crédito: Límite $2,000,000                 │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. USUARIO REGISTRA TRANSACCIONES (Manual)              │
│    - Gasto: $50,000 (Supermercado)                      │
│    - Ingreso: $100,000 (Sueldo)                         │
│    - Transferencia: $200,000 (Entre cuentas)             │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. SISTEMA ACTUALIZA AUTOMÁTICAMENTE                    │
│    ✅ Saldo de cuenta: $3,000,000 → $2,950,000          │
│    ✅ Total gastos tablero: +$50,000                     │
│    ✅ Regla "Gastos Variables": -$50,000 disponible      │
└─────────────────────────────────────────────────────────┘
```

### Relación Cuentas ↔ Transacciones ↔ Tableros:

```
CUENTA (Dónde está el dinero)
    │
    ├─── TRANSACCIÓN (Movimiento de dinero)
    │        │
    │        ├─── TABLERO (Presupuesto mensual)
    │        │        │
    │        │        └─── REGLA (50-30-20)
    │        │
    │        └─── CATEGORÍA (Tipo de gasto)
    │
    └─── SALDO DISPONIBLE (Se actualiza con cada transacción)
```

---

## 🚀 Preparación para Integración Bancaria Futura

### Opción 1: Integración con APIs Bancarias (Open Banking)

#### ¿Qué es Open Banking?
Es un sistema que permite que aplicaciones externas accedan a información bancaria del usuario **con su consentimiento**.

#### Ejemplos de Proveedores:
- **Plaid** (EE.UU., Canadá, Europa)
- **Yodlee** (Global)
- **TrueLayer** (Europa, UK)
- **Belvo** (Latinoamérica)
- **Bancos locales** (APIs propias)

#### Cómo Funcionaría:

```
┌─────────────────────────────────────────────────────────┐
│ 1. USUARIO CONECTA SU CUENTA BANCARIA                  │
│    - Autoriza acceso a través de OAuth                 │
│    - Selecciona qué cuentas conectar                    │
│    - Sistema guarda token de acceso                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. SISTEMA SINCRONIZA AUTOMÁTICAMENTE                   │
│    - Cada X horas/días consulta movimientos             │
│    - Crea transacciones automáticamente                 │
│    - Actualiza saldos de cuentas                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. USUARIO REVISA Y CATEGORIZA                          │
│    - Ve transacciones importadas                        │
│    - Asigna categorías y reglas                          │
│    - Asocia a tableros financieros                      │
└─────────────────────────────────────────────────────────┘
```

#### Campos Necesarios en el Modelo Account:

```javascript
{
  // Campos actuales
  perfilID: ObjectId,
  nombre: String,
  banco: String,
  tipoCuenta: String,
  saldoDisponible: Number,
  moneda: String,
  
  // ✅ NUEVOS CAMPOS para integración
  integracion: {
    proveedor: String,        // 'plaid', 'belvo', 'manual', etc.
    estado: String,            // 'conectada', 'desconectada', 'error'
    cuentaExternaID: String,  // ID de la cuenta en el proveedor
    tokenAcceso: String,      // Token encriptado para API
    ultimaSincronizacion: Date,
    proximaSincronizacion: Date,
    frecuencia: String        // 'diaria', 'semanal', 'manual'
  },
  
  // Metadatos de sincronización
  sincronizacion: {
    automatica: Boolean,      // true = auto, false = manual
    ultimaTransaccionID: String, // Para evitar duplicados
    configuracion: {
      importarDesde: Date,    // Desde qué fecha importar
      categoriasAuto: Boolean // Categorizar automáticamente con AI
    }
  }
}
```

---

### Opción 2: Integración con Archivos (CSV, OFX, QIF)

#### ¿Qué es?
El usuario descarga extractos bancarios y los sube al sistema.

#### Cómo Funcionaría:

```
┌─────────────────────────────────────────────────────────┐
│ 1. USUARIO DESCARGA EXTRACTOS BANCARIOS                 │
│    - CSV del banco                                       │
│    - OFX (formato estándar)                             │
│    - PDF (con OCR)                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 2. USUARIO SUBE ARCHIVO                                  │
│    POST /api/v1/accounts/:id/import                     │
│    - Archivo CSV/OFX                                     │
│    - Sistema parsea y valida                              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ 3. SISTEMA PROCESA Y CREA TRANSACCIONES                 │
│    - Detecta duplicados                                  │
│    - Categoriza automáticamente (AI)                     │
│    - Asocia a tableros                                    │
└─────────────────────────────────────────────────────────┘
```

#### Campos Necesarios:

```javascript
{
  integracion: {
    tipo: 'archivo',          // 'archivo' o 'api'
    formatoSoportado: ['CSV', 'OFX', 'QIF'],
    ultimaImportacion: Date
  }
}
```

---

## 🎯 Comparación de Enfoques

| Característica | Manual (Actual) | Open Banking | Archivos |
|----------------|------------------|--------------|----------|
| **Facilidad de uso** | ⭐⭐⭐ Media | ⭐⭐⭐⭐⭐ Muy fácil | ⭐⭐⭐⭐ Fácil |
| **Automatización** | ❌ Ninguna | ✅✅✅ Total | ✅✅ Parcial |
| **Seguridad** | ✅✅✅ Alta | ✅✅ Media | ✅✅✅ Alta |
| **Disponibilidad** | ✅✅✅ Global | ⚠️ Por país | ✅✅✅ Global |
| **Costo** | ✅ Gratis | ⚠️ Puede tener costo | ✅ Gratis |
| **Actualización** | Manual | Automática | Manual (pero rápida) |
| **Duplicados** | Usuario controla | Sistema detecta | Sistema detecta |

---

## 🏗️ Arquitectura Propuesta para Integración Futura

### 1. Modelo Account Mejorado

```javascript
const accountSchema = new mongoose.Schema({
  // Campos actuales
  perfilID: { type: ObjectId, ref: 'Profile', required: true },
  nombre: { type: String, required: true },
  banco: { type: String },
  tipoCuenta: { type: String, enum: [...], default: 'Corriente' },
  saldoDisponible: { type: Number, default: 0 },
  moneda: { type: String, default: 'CLP' },
  favorito: { type: Boolean, default: false },
  
  // ✅ NUEVO: Integración bancaria
  integracion: {
    tipo: {
      type: String,
      enum: ['manual', 'api', 'archivo'],
      default: 'manual'
    },
    proveedor: {
      type: String,
      enum: ['plaid', 'belvo', 'yodlee', 'truelayer', 'banco_local', 'otro'],
      default: null
    },
    estado: {
      type: String,
      enum: ['conectada', 'desconectada', 'error', 'pendiente'],
      default: 'desconectada'
    },
    cuentaExternaID: String,      // ID en el sistema del proveedor
    tokenAcceso: String,           // Encriptado
    ultimaSincronizacion: Date,
    proximaSincronizacion: Date,
    frecuencia: {
      type: String,
      enum: ['manual', 'diaria', 'semanal', 'mensual'],
      default: 'manual'
    },
    configuracion: {
      importarDesde: Date,         // Desde qué fecha importar
      categoriasAuto: Boolean,     // Categorizar con AI
      asociarTableroAuto: Boolean,  // Asociar a tablero automáticamente
      reglaDefaultID: ObjectId      // Regla por defecto
    }
  },
  
  // Metadatos de sincronización
  sincronizacion: {
    automatica: { type: Boolean, default: false },
    ultimaTransaccionID: String,   // Para evitar duplicados
    totalTransaccionesImportadas: { type: Number, default: 0 },
    ultimaImportacion: Date
  }
}, { timestamps: true });
```

---

### 2. Servicio de Integración Bancaria

```javascript
// src/core/services/banking/bankingService.js

class BankingService {
  /**
   * Conecta una cuenta bancaria usando un proveedor
   */
  async conectarCuenta(accountId, proveedor, credenciales) {
    // 1. Autenticar con el proveedor
    // 2. Obtener token de acceso
    // 3. Listar cuentas disponibles
    // 4. Guardar token encriptado
    // 5. Actualizar estado de cuenta
  }

  /**
   * Sincroniza transacciones de una cuenta
   */
  async sincronizarCuenta(accountId) {
    // 1. Obtener token de acceso
    // 2. Consultar API del proveedor
    // 3. Obtener nuevas transacciones
    // 4. Detectar duplicados
    // 5. Crear transacciones en LUNA
    // 6. Categorizar automáticamente (AI)
    // 7. Actualizar saldo de cuenta
  }

  /**
   * Procesa archivo CSV/OFX
   */
  async importarArchivo(accountId, archivo) {
    // 1. Parsear archivo
    // 2. Validar formato
    // 3. Detectar duplicados
    // 4. Crear transacciones
    // 5. Categorizar automáticamente
  }
}
```

---

### 3. Jobs de Sincronización Automática

```javascript
// src/core/jobs/syncBankingAccounts.js

/**
 * Job que corre cada X horas para sincronizar cuentas conectadas
 */
async function sincronizarCuentasBancarias() {
  // 1. Buscar cuentas con integracion.automatica = true
  // 2. Verificar si es hora de sincronizar
  // 3. Llamar a bankingService.sincronizarCuenta()
  // 4. Registrar logs de sincronización
  // 5. Enviar notificaciones si hay errores
}
```

---

## 🔐 Consideraciones de Seguridad

### 1. Encriptación de Tokens
- Los tokens de acceso deben estar encriptados en la base de datos
- Usar librerías como `crypto` de Node.js

### 2. Permisos Granulares
- El usuario debe poder revocar acceso en cualquier momento
- Solo leer transacciones, nunca modificar cuentas

### 3. Validación de Duplicados
- Comparar `fecha`, `monto`, `descripcion` para detectar duplicados
- Usar hash de transacción para comparación rápida

---

## 📋 Plan de Implementación Sugerido

### Fase 1: Preparación (Ahora - Sin Cambios)
- ✅ Mantener sistema manual actual
- ✅ Documentar estructura de datos
- ✅ Diseñar modelo de integración

### Fase 2: Importación de Archivos (MVP+)
- ✅ Endpoint para subir CSV/OFX
- ✅ Parser de archivos
- ✅ Detección de duplicados
- ✅ Categorización automática básica

### Fase 3: Open Banking (Futuro)
- ✅ Integración con proveedor (ej: Belvo para Latam)
- ✅ OAuth flow para conectar cuentas
- ✅ Sincronización automática
- ✅ Jobs programados

---

## 💡 Recomendaciones

### Para el MVP:
1. **Mantener sistema manual** - Es suficiente para validar el producto
2. **Preparar estructura** - Agregar campos de integración (opcionales)
3. **Documentar bien** - Para facilitar integración futura

### Para el Futuro:
1. **Empezar con archivos** - Más fácil de implementar que Open Banking
2. **Evaluar proveedores** - Belvo para Latam, Plaid para US
3. **Implementar gradualmente** - No todo de una vez

---

## ❓ Preguntas para Decidir

1. **¿Qué países priorizas?**
   - Latam → Belvo, APIs locales
   - US/Canadá → Plaid
   - Europa → TrueLayer

2. **¿Presupuesto para integración?**
   - Open Banking puede tener costos por transacción
   - Archivos es gratis

3. **¿Nivel de automatización deseado?**
   - Manual: Usuario controla todo
   - Semi-automático: Importa archivos
   - Automático: Sincronización en tiempo real

---

## 🎯 Conclusión

**Estado Actual:**
- ✅ Sistema manual funciona perfectamente
- ✅ Usuario registra transacciones manualmente
- ✅ Sistema actualiza saldos y tableros automáticamente

**Preparación Futura:**
- ✅ Agregar campos de integración al modelo Account
- ✅ Crear servicio de integración bancaria
- ✅ Implementar detección de duplicados
- ✅ Preparar estructura para Open Banking

**Recomendación:**
- 🎯 **MVP:** Mantener manual, agregar campos opcionales de integración
- 🚀 **Futuro:** Empezar con importación de archivos, luego Open Banking

---

¿Qué te parece este enfoque? ¿Tienes alguna duda específica sobre cómo implementar alguna parte?

