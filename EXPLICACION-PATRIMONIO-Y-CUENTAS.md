# 📊 Explicación: Patrimonio y Integración Cuentas-Tableros

## 🏦 ¿Qué es el Patrimonio?

El **Patrimonio Neto** es la diferencia entre lo que tienes (Activos) y lo que debes (Pasivos).

### Fórmula:
```
Patrimonio Neto = Activos - Pasivos
```

---

## 💰 Activos (Lo que TIENES)

Los **Activos** son todo lo que posees y tiene valor económico:

### Tipos de Activos en LUNA:

1. **Efectivo** 💵
   - Dinero en efectivo
   - Ejemplo: $500,000 CLP en efectivo

2. **Inversiones** 📈
   - Acciones, bonos, fondos mutuos
   - Criptomonedas
   - Ejemplo: $2,000,000 CLP en acciones

3. **Propiedades** 🏠
   - Casas, departamentos, terrenos
   - Ejemplo: Casa valorada en $80,000,000 CLP

4. **Vehículos** 🚗
   - Autos, motos, camionetas
   - Ejemplo: Auto valorado en $12,000,000 CLP

5. **Otros** 📦
   - Joyas, arte, equipos
   - Ejemplo: Joyas valoradas en $1,500,000 CLP

### Ejemplo de Activos:
```
Efectivo:           $500,000
Inversiones:      $2,000,000
Propiedades:     $80,000,000
Vehículos:       $12,000,000
Otros:            $1,500,000
─────────────────────────────
TOTAL ACTIVOS:    $96,000,000
```

---

## 📉 Pasivos (Lo que DEBES)

Los **Pasivos** son todas tus deudas y obligaciones:

### Tipos de Pasivos en LUNA:

1. **Deudas Personales** 👤
   - Préstamos a familiares/amigos
   - Ejemplo: Debo $500,000 a mi hermano

2. **Deudas Institucionales** 🏛️
   - Préstamos a instituciones no bancarias
   - Ejemplo: Debo $2,000,000 a una financiera

3. **Deudas Bancarias** 🏦
   - Créditos de consumo, hipotecarios
   - Tarjetas de crédito
   - Ejemplo: Debo $15,000,000 en crédito hipotecario

4. **Deudas Comerciales** 🏪
   - Deudas con proveedores
   - Ejemplo: Debo $300,000 a un proveedor

### Ejemplo de Pasivos:
```
Deudas Personales:      $500,000
Deudas Institucionales: $2,000,000
Deudas Bancarias:      $15,000,000
Deudas Comerciales:      $300,000
─────────────────────────────────
TOTAL PASIVOS:         $17,800,000
```

---

## 📊 Cálculo del Patrimonio Neto

Usando los ejemplos anteriores:

```
ACTIVOS:    $96,000,000
PASIVOS:   -$17,800,000
─────────────────────────
PATRIMONIO:  $78,200,000
```

**Interpretación:** Tienes $78,200,000 CLP de patrimonio neto. Esto significa que si vendieras todos tus activos y pagaras todas tus deudas, te quedarían $78,200,000 CLP.

---

## 🏦 ¿Qué son las Cuentas?

Las **Cuentas** son tus cuentas bancarias y financieras donde guardas tu dinero:

### Tipos de Cuentas en LUNA:

1. **Corriente** 💳
   - Cuenta corriente bancaria
   - Ejemplo: Cuenta Banco de Chile - $3,000,000 CLP

2. **Ahorro** 🐷
   - Cuenta de ahorro
   - Ejemplo: Cuenta Ahorro BancoEstado - $5,000,000 CLP

3. **Tarjeta de Crédito** 💳
   - Límite disponible de tarjeta
   - Ejemplo: Tarjeta Visa - Límite: $2,000,000, Disponible: $1,500,000

4. **Efectivo** 💵
   - Dinero físico
   - Ejemplo: Efectivo en casa - $200,000 CLP

5. **Inversión** 📈
   - Cuentas de inversión
   - Ejemplo: Cuenta de inversión - $10,000,000 CLP

6. **Otro** 📦
   - Otras cuentas financieras

### Ejemplo de Cuentas:
```
Corriente Banco de Chile:     $3,000,000
Ahorro BancoEstado:          $5,000,000
Tarjeta Visa (disponible):   $1,500,000
Efectivo:                      $200,000
Inversión:                  $10,000,000
─────────────────────────────────────────
TOTAL EN CUENTAS:           $19,700,000
```

---

## 🔗 ¿Cómo se Integran las Cuentas con los Tableros Financieros?

### Relación Conceptual:

```
┌─────────────────────────────────────────┐
│         PERFIL FINANCIERO               │
│  (Franco - Perfil Personal)             │
└─────────────────────────────────────────┘
           │
           ├─── CUENTAS (Fuente de dinero)
           │    ├── Cuenta Corriente: $3M
           │    ├── Cuenta Ahorro: $5M
           │    └── Efectivo: $200K
           │
           ├─── TABLEROS FINANCIEROS (Presupuestos mensuales)
           │    ├── Tablero "Casa": CLP
           │    │   ├── Ingresos: $2,000,000
           │    │   ├── Gastos: $1,500,000
           │    │   └── Saldo: $500,000
           │    │
           │    └── Tablero "Depto Miami": USD
           │        ├── Ingresos: $1,500
           │        ├── Gastos: $1,200
           │        └── Saldo: $300
           │
           └─── TRANSACCIONES (Movimientos de dinero)
                ├── Gasto: $50,000 (de Cuenta Corriente)
                └── Ingreso: $100,000 (a Cuenta Ahorro)
```

---

## 💡 Flujo de Integración:

### 1. **Las Cuentas son el "Banco" del Usuario**
   - Las cuentas almacenan el dinero disponible
   - Cada cuenta tiene un `saldoDisponible`
   - Las cuentas pertenecen a un **Perfil**

### 2. **Los Tableros son "Presupuestos Mensuales"**
   - Los tableros planifican ingresos y gastos del mes
   - Cada tablero tiene su propia moneda
   - Los tableros pertenecen a un **Perfil**

### 3. **Las Transacciones Conectan Todo**
   - Cuando creas una transacción, puedes asociarla a:
     - ✅ Una **Cuenta** (de dónde sale o a dónde va el dinero)
     - ✅ Un **Tablero** (a qué presupuesto pertenece)
     - ✅ Una **Categoría** (tipo de gasto/ingreso)
     - ✅ Una **Regla** (regla de presupuesto 50-30-20)

### Ejemplo Práctico:

**Escenario:** Pagas el dividendo de tu casa

1. **Crear Transacción:**
   ```json
   {
     "perfilID": "xxx",
     "tipo": "Gasto",
     "monto": 500000,
     "cuentaID": "cuenta-corriente-id",  // ← De qué cuenta sale
     "tableroID": "tablero-casa-id",     // ← A qué tablero pertenece
     "categoriaID": "vivienda-id",      // ← Qué tipo de gasto
     "reglaID": "gastos-fijos-id",      // ← Qué regla de presupuesto
     "detalle": "Dividendo Enero 2024"
   }
   ```

2. **Lo que Pasa Automáticamente:**
   - ✅ Se resta $500,000 del `saldoDisponible` de la cuenta corriente
   - ✅ Se suma $500,000 a los `gastos` del tablero "Casa"
   - ✅ Se actualiza el `saldo` del tablero (ingresos - gastos)
   - ✅ Se actualiza el `montoDisponible` de la regla "Gastos Fijos"

---

## 🎯 Diferencias Clave:

| Concepto | ¿Qué es? | ¿Dónde se usa? |
|----------|----------|----------------|
| **Cuentas** | Dónde guardas tu dinero | Fuente/destino de transacciones |
| **Tableros** | Presupuesto mensual | Planificación de ingresos/gastos |
| **Activos** | Lo que posees (casa, auto, etc.) | Cálculo de patrimonio neto |
| **Pasivos** | Lo que debes (deudas) | Cálculo de patrimonio neto |
| **Transacciones** | Movimientos de dinero | Conectan cuentas, tableros, categorías |

---

## 📝 Resumen:

1. **Patrimonio = Activos - Pasivos**
   - Activos: Lo que tienes (casa, auto, inversiones, efectivo)
   - Pasivos: Lo que debes (deudas)

2. **Cuentas = Dónde está tu dinero**
   - Cuentas bancarias, efectivo, tarjetas
   - Se usan en transacciones como fuente/destino

3. **Tableros = Presupuestos mensuales**
   - Planificación de ingresos y gastos
   - Pueden tener diferentes monedas
   - Se actualizan automáticamente con transacciones

4. **Transacciones = El puente**
   - Conectan cuentas con tableros
   - Actualizan saldos automáticamente
   - Permiten categorizar y aplicar reglas

---

## 🔄 Flujo Completo:

```
1. Usuario tiene CUENTAS (dinero disponible)
   ↓
2. Usuario crea TABLEROS (presupuestos mensuales)
   ↓
3. Usuario registra TRANSACCIONES (movimientos)
   ↓
4. Sistema actualiza automáticamente:
   - Saldos de cuentas
   - Totales de tableros
   - Montos de reglas
   ↓
5. Usuario puede ver:
   - Patrimonio Neto (Activos - Pasivos)
   - Resumen financiero
   - Analytics y tendencias
```

---

**¿Tiene sentido esta estructura?** 🎯

