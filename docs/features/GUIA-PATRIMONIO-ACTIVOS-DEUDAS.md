# 📊 Guía: Cómo Registrar Patrimonio, Activos y Deudas

## 🎯 Respuestas a Dudas Frecuentes

### 1. ¿Un activo con deuda pendiente sigue siendo un activo?

**✅ SÍ, definitivamente es un activo.**

En contabilidad financiera, un activo es algo que **posees** y tiene valor, independientemente de si lo has terminado de pagar o no.

#### Ejemplo Real: Tu Departamento

**Situación:**
- Compraste un depto en 2021 por $100,000,000 CLP
- Se entregó en 2022
- Tienes un crédito hipotecario de $80,000,000 CLP
- Te faltan 21 años por pagar

**Cómo registrarlo:**

1. **Registra el ACTIVO (Propiedad):**
   ```json
   POST /api/v1/assets
   {
     "perfilID": "xxx",
     "tipo": "Propiedades",
     "valor": 100000000,  // Valor total del depto
     "descripcion": "Depto comprado en 2021, entregado 2022",
     "fecha": "2022-01-01"
   }
   ```

2. **Registra el PASIVO (Deuda):**
   ```json
   POST /api/v1/debts
   {
     "perfilID": "xxx",
     "nombre": "Crédito Hipotecario - Depto",
     "tipo": "Bancaria",
     "prestador": "Santander Chile",
     "montoTotal": 80000000,
     "numeroCuotas": 252,  // 21 años × 12 meses
     "saldoPendiente": 80000000,
     "moneda": "CLP",
     "tasaInteres": 2.5,
     "fechaInicio": "2022-01-01"
   }
   ```

3. **El sistema calcula automáticamente:**
   ```
   ACTIVOS:    $100,000,000 (Depto)
   PASIVOS:    -$80,000,000  (Hipoteca)
   ────────────────────────────────
   PATRIMONIO:  $20,000,000  (Lo que realmente posees)
   ```

**Lo mismo aplica para:**
- ✅ Auto con crédito de consumo → Activo (auto) + Pasivo (crédito)
- ✅ Inversión con préstamo → Activo (inversión) + Pasivo (préstamo)

---

### 2. ¿Cómo registrar propiedades múltiples del SII?

**Situación:**
En el SII tienes 3 propiedades relacionadas:
- Depto (ROL: 02524-00179)
- Estacionamiento (ROL: 02524-00293)
- Bodega (ROL: 02524-00409)

Cada una tiene:
- Avalúo fiscal (ej: $65,656,813 CLP)
- Valor comercial (puede ser diferente)
- Algunos valores en CLP, otros en UF

**Solución: Registrar cada una como Asset separado**

```json
// 1. Depto Principal
POST /api/v1/assets
{
  "perfilID": "xxx",
  "tipo": "Propiedades",
  "valor": 65656813,  // Avalúo fiscal o valor comercial (tú decides)
  "descripcion": "Depto - AV AMERICA 755 DP 706",
  "fecha": "2022-01-01",
  "metadata": {
    "rol": "02524-00179",
    "direccion": "AV AMERICA 755 DP 706",
    "comuna": "SAN BERNARDO",
    "avaluoFiscal": 65656813,
    "valorComercial": 80000000,  // Si conoces el valor comercial
    "monedaAvaluo": "CLP",
    "grupoPropiedad": "depto-america-755"  // Para agruparlas
  }
}

// 2. Estacionamiento
POST /api/v1/assets
{
  "perfilID": "xxx",
  "tipo": "Propiedades",
  "valor": 1759035,
  "descripcion": "Estacionamiento - AV AMERICA 755 BD 30",
  "fecha": "2022-01-01",
  "metadata": {
    "rol": "02524-00293",
    "direccion": "AV AMERICA 755 BD 30",
    "comuna": "SAN BERNARDO",
    "avaluoFiscal": 1759035,
    "monedaAvaluo": "CLP",
    "grupoPropiedad": "depto-america-755"  // Mismo grupo
  }
}

// 3. Bodega
POST /api/v1/assets
{
  "perfilID": "xxx",
  "tipo": "Propiedades",
  "valor": 9953378,
  "descripcion": "Bodega - AV AMERICA 755 EST 85",
  "fecha": "2022-01-01",
  "metadata": {
    "rol": "02524-00409",
    "direccion": "AV AMERICA 755 EST 85",
    "comuna": "SAN BERNARDO",
    "avaluoFiscal": 9953378,
    "monedaAvaluo": "CLP",
    "grupoPropiedad": "depto-america-755"  // Mismo grupo
  }
}
```

**Nota:** Actualmente el modelo `Asset` no tiene campos para `metadata`, `rol`, `avaluoFiscal`, etc. **Necesitamos mejorar el modelo** (ver sección de mejoras).

---

### 3. Nivel de Deuda: Controlado vs Descontrolado

**Tu caso:** Tienes muchas deudas grandes ($176,760,944 CLP) pero **están controladas** (no atrasadas).

El sistema actual solo considera el **monto total** de deudas, pero no el **estado de pago**.

**Necesitamos implementar un "Nivel de Deuda" basado en:**

1. **Estado de pago** (al día, atrasado)
2. **Ratio deuda/ingresos**
3. **Historial de pagos**
4. **Tasa de interés**

#### Niveles Propuestos:

```
🟢 NIVEL 1: DEUDA SALUDABLE
- Todas las deudas al día (0-29 días de atraso)
- Ratio deuda/ingresos < 30%
- Historial de pagos perfecto

🟡 NIVEL 2: DEUDA CONTROLADA
- Algunas deudas con 30-59 días de atraso
- Ratio deuda/ingresos 30-50%
- Historial de pagos bueno

🟠 NIVEL 3: DEUDA EN RIESGO
- Deudas con 60-89 días de atraso
- Ratio deuda/ingresos 50-70%
- Historial de pagos irregular

🔴 NIVEL 4: DEUDA CRÍTICA
- Deudas con 90+ días de atraso
- Ratio deuda/ingresos > 70%
- Historial de pagos malo
```

**Tu caso:** Aunque tengas $176M en deudas, si todas están al día → **NIVEL 1: DEUDA SALUDABLE** ✅

---

### 4. Score Financiero

El sistema **ya tiene implementado** el score financiero (0-100) que considera:
- ✅ Tasa de ahorro
- ✅ Ratio deuda/ingresos
- ✅ Diversidad de cuentas
- ✅ Consistencia de transacciones
- ✅ Base de activos
- ✅ Adherencia a presupuesto

**Endpoint:** `GET /api/v1/app/financial-score`

---

## 🔧 Mejoras Necesarias al Sistema

### 1. Mejorar Modelo Asset

**Agregar campos para propiedades:**
- `rol` (número de rol del SII)
- `direccion`
- `comuna`
- `avaluoFiscal` (valor fiscal)
- `valorComercial` (valor de mercado)
- `monedaAvaluo` (CLP, UF, USD)
- `grupoPropiedad` (para agrupar depto + estacionamiento + bodega)
- `metadata` (objeto flexible para datos adicionales)

### 2. Agregar Campo "Categoría" a Deudas

Actualmente solo tiene `tipo` (Personal, Institucional, Bancaria, Comercial).

**Agregar `categoria`** para:
- TC (Tarjeta de Crédito)
- LC (Línea de Crédito)
- Hipotecario
- Consumo
- Personal
- etc.

### 3. Implementar "Nivel de Deuda"

Crear servicio que calcule el nivel de deuda basado en:
- Estado de pago (días de atraso)
- Ratio deuda/ingresos
- Historial de pagos
- Tasa de interés promedio

### 4. Mejorar Cálculo de Patrimonio Neto

Considerar conversión de UF a CLP cuando sea necesario.

---

## 📝 Ejemplo Completo: Tu Caso Real

### Activos a Registrar:

1. **Depto Principal** ($65,656,813)
2. **Estacionamiento** ($1,759,035)
3. **Bodega** ($9,953,378)
4. **Total Propiedades:** $77,369,226

### Deudas a Registrar (según CMF):

1. **Scotiabank Chile - Consumo** ($8,094,299)
2. **Santander Chile - Consumo** ($1,620,995)
3. **Santander Chile - Vivienda** ($147,308,151) ← Hipoteca del depto
4. **CMR Falabella - Consumo** ($4,098,678)
5. **Tenpo Payments - Consumo** ($5,638,821)
6. **Total Deudas:** $176,760,944

### Patrimonio Neto Calculado:

```
ACTIVOS:
  Propiedades:    $77,369,226
  Cuentas:        $X (lo que tengas)
  Efectivo:       $X
  ────────────────────────────
  TOTAL ACTIVOS:  $77,369,226 + X

PASIVOS:
  Deudas:         $176,760,944
  ────────────────────────────
  TOTAL PASIVOS:  $176,760,944

PATRIMONIO NETO:  $77,369,226 + X - $176,760,944
```

**Nota:** Si el patrimonio neto es negativo, significa que debes más de lo que posees. Esto es normal cuando recién compras una propiedad y aún estás pagando el crédito.

---

## ✅ Próximos Pasos

1. Mejorar modelo `Asset` con campos para propiedades
2. Agregar campo `categoria` a `Debt`
3. Implementar servicio de "Nivel de Deuda"
4. Crear script para poblar BD con tus datos reales

