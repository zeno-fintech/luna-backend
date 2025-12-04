# 📊 Sistema Financiero - Resumen de Implementación

## ✅ Cambios Realizados

### 1. **FinancialBoard (Tablero Financiero)** - ✅ Actualizado

#### Campos Agregados:
- ✅ `moneda` (String, default: 'CLP') - Moneda del tablero (puede ser diferente a la del perfil)
- ✅ `mes` (Number, 1-12) - Número del mes (además de id_mes)
- ✅ `porcentajeIngresos` (Number, default: 100) - Porcentaje de ingresos que recibe este tablero
- ✅ `icono` (String, opcional) - Icono del tablero (sugerido automáticamente por IA)
- ✅ `imagen` (String, opcional) - Imagen del tablero
- ✅ `color` (String, default: '#3B82F6') - Color primario del tablero (hex)

#### Funcionalidades:
- ✅ Cálculo automático de `saldo` (ingresos - gastos)
- ✅ Método `recalcularTotales()` - Recalcula ingresos, gastos y saldo desde Income y Transaction
- ✅ Copia automática de gastos fijos al crear nuevo mes

#### Ejemplo:
```javascript
{
  perfilID: ObjectId,
  nombre: "Depto",
  moneda: "CLP",  // ✅ Puede ser diferente a la del perfil
  ingresos: 5000000,
  gastos: 3000000,
  saldo: 2000000,  // ✅ Calculado automáticamente
  año: 2024,
  mes: 1,
  id_mes: "enero-2024",
  porcentajeIngresos: 100,
  reglas: [ObjectId, ObjectId]
}
```

---

### 2. **Income (Ingresos)** - ✅ Nuevo Modelo

#### Campos:
- ✅ `perfilID` (ObjectId, requerido) - Referencia al Profile
- ✅ `tableroID` (ObjectId, opcional) - Si está, va directo a ese tablero
- ✅ `glosa` (String, requerido) - Descripción del ingreso
- ✅ `monto` (Number, requerido) - Monto del ingreso
- ✅ `fecha` (Date, default: ahora) - Fecha del ingreso
- ✅ `tipo` (enum: 'recurrente' | 'ocasional', default: 'ocasional')
- ✅ `porcentajeDistribucion` (Number, opcional) - Para dividir entre tableros

#### Lógica de Distribución:
1. **Si `tableroID` está definido** → Ingreso va directo a ese tablero
2. **Si no hay `tableroID`** → Ingreso se crea sin asignar (el usuario lo asigna manualmente)
   - **NO se divide automáticamente** entre tableros
   - La división es **opcional** y solo se hace si el usuario lo solicita explícitamente

---

### 3. **Transaction (Transacciones)** - ✅ Actualizado

#### Campos Agregados:
- ✅ `tableroID` (ObjectId, opcional) - Asocia el gasto a un tablero específico
- ✅ `esGastoFijo` (Boolean, default: false) - Si es true, se copia al crear nuevo mes

#### Funcionalidades:
- ✅ Al crear/actualizar/eliminar transacción con `tableroID` → Actualiza totales del tablero automáticamente
- ✅ Al crear/actualizar/eliminar gasto con `reglaID` → Actualiza monto disponible de la regla

---

### 4. **Rule (Reglas)** - ✅ Mejorado

#### Funcionalidades Agregadas:
- ✅ Cálculo automático de `presupuestoRegla` = (ingresos del tablero × porcentaje) / 100
- ✅ Cálculo automático de `montoDisponible` = presupuestoRegla - gastos realizados
- ✅ Cálculo automático de `saldo` = presupuestoRegla - gastos realizados
- ✅ Método `recalcularMontos()` - Recalcula presupuesto y montos disponibles

#### Ejemplo:
```javascript
{
  tableroID: ObjectId,
  nombre: "Gastos Fijos",
  porcentaje: 50,  // 50% del saldo del tablero
  presupuestoRegla: 2500000,  // ✅ Calculado: (5000000 × 50) / 100
  montoDisponible: 2000000,  // ✅ Calculado: 2500000 - 500000 (gastos)
  saldo: 2000000
}
```

---

## 🎯 Endpoints Creados

### FinancialBoards
- ✅ `GET /api/v1/financial-boards?perfilID=xxx&año=2024&mes=1` - Listar tableros
- ✅ `GET /api/v1/financial-boards/:id` - Detalle de tablero (con ingresos y gastos)
- ✅ `POST /api/v1/financial-boards` - Crear tablero (copia gastos fijos automáticamente)
- ✅ `PUT /api/v1/financial-boards/:id` - Actualizar tablero
- ✅ `DELETE /api/v1/financial-boards/:id` - Eliminar tablero

### Incomes
- ✅ `GET /api/v1/incomes?perfilID=xxx&tableroID=xxx&tipo=recurrente` - Listar ingresos
- ✅ `GET /api/v1/incomes/:id` - Detalle de ingreso
- ✅ `POST /api/v1/incomes` - Crear ingreso (sin asignación automática)
- ✅ `PUT /api/v1/incomes/:id` - Actualizar ingreso
- ✅ `DELETE /api/v1/incomes/:id` - Eliminar ingreso

### AI Suggestions
- ✅ `GET /api/v1/ai/suggest-board-icon?nombre=Casa` - Sugerir icono para tablero
- ✅ `GET /api/v1/ai/suggest-fixed-expenses?perfilID=xxx&tableroID=xxx` - Sugerir gastos fijos

---

## 🔄 Flujos Implementados

### 1. Crear Tablero Nuevo
1. Usuario crea tablero para un mes/año
2. Sistema busca tablero del mes anterior
3. Si existe, copia todos los gastos marcados como `esGastoFijo: true`
4. Recalcula totales automáticamente

### 2. Crear Ingreso
1. Si `tableroID` está definido → Va directo a ese tablero
2. Si no hay `tableroID` → Se crea sin asignar (el usuario lo asigna manualmente)
   - **NO se divide automáticamente** entre tableros
   - La división es opcional y solo se hace si el usuario lo solicita
3. Actualiza totales del tablero automáticamente

### 3. Crear Gasto
1. Si `tableroID` está definido → Se asocia al tablero
2. Si `reglaID` está definido → Se asocia a la regla
3. Actualiza totales del tablero y monto disponible de la regla

### 4. Reglas de Presupuesto
1. Usuario crea regla con porcentaje (ej: 50%)
2. Sistema calcula `presupuestoRegla` = (ingresos × porcentaje) / 100
3. Cada gasto asociado a la regla reduce `montoDisponible`
4. `saldo` = `presupuestoRegla` - gastos realizados

---

## 📝 Notas Importantes

### Moneda por Tablero
- Cada tablero puede tener su propia moneda
- Si no se especifica, usa la moneda del perfil
- Permite tener "Depto CLP" y "Depto Miami USD" en el mismo perfil

### Gastos Fijos
- Se marcan con `esGastoFijo: true` en Transaction
- Se copian automáticamente al crear nuevo mes
- Ejemplos: dividendo, colegio, tag, deuda auto, internet, teléfono, luz, agua, netflix, cursor

### División de Ingresos
- Los ingresos pueden estar a nivel perfil (sin tableroID)
- Se pueden dividir porcentualmente entre tableros
- Si hay 1 tablero, 100% va automáticamente a ese tablero

---

## 🤖 Funcionalidades IA

### 1. Sugerencia de Icono para Tablero
- ✅ Analiza el nombre del tablero y sugiere un icono apropiado
- ✅ Ejemplos: "Casa" → "home", "Depto" → "building", "Auto" → "car"
- ✅ Se aplica automáticamente al crear un tablero si no se especifica icono
- ✅ Endpoint: `GET /api/v1/ai/suggest-board-icon?nombre=Casa`

### 2. Sugerencia de Gastos Fijos
- ✅ Analiza gastos de los últimos 3 meses
- ✅ Identifica gastos que se repiten en 2-3 meses consecutivos
- ✅ Sugiere marcarlos como fijos para copiarlos automáticamente al nuevo mes
- ✅ Endpoint: `GET /api/v1/ai/suggest-fixed-expenses?perfilID=xxx&tableroID=xxx`

---

## ✅ Estado: COMPLETO

Todo el sistema financiero está implementado y funcionando:
- ✅ Modelos actualizados
- ✅ Controladores creados
- ✅ Rutas registradas
- ✅ Lógica de cálculos automáticos
- ✅ Copia de gastos fijos
- ✅ Actualización de totales en tiempo real
- ✅ Personalización de tableros (icono, imagen, color)
- ✅ Sugerencias IA para iconos y gastos fijos

