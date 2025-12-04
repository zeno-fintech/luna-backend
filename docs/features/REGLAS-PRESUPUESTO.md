# 📊 Sistema de Reglas de Presupuesto

## 🎯 Reglas de Negocio

### Cantidad de Reglas
- ✅ **Mínimo:** 2 reglas por tablero
- ✅ **Máximo:** 4 reglas por tablero
- ✅ **Total:** Las reglas deben sumar exactamente 100%

### Reglas por Defecto
Al crear un nuevo tablero financiero, se crean automáticamente **3 reglas por defecto**:

1. **Gastos Fijos** - 50%
   - Color: Rojo (#EF4444)
   - Icono: home
   - Para: Dividendo, colegio, servicios básicos, etc.

2. **Gastos Variables** - 30%
   - Color: Naranja (#F59E0B)
   - Icono: shopping-cart
   - Para: Compras, entretenimiento, imprevistos, etc.

3. **Ahorro** - 20%
   - Color: Verde (#10B981)
   - Icono: piggy-bank
   - Para: Ahorro e inversiones

**Total: 50% + 30% + 20% = 100%** ✅

---

## 🔧 Personalización

El usuario puede personalizar las reglas por defecto:

### Campos Personalizables:
- ✅ **Porcentaje** (debe mantener el total en 100%)
- ✅ **Nombre** (ej: "Gastos Fijos" → "Casa y Servicios")
- ✅ **Icono** (ej: "home" → "building")
- ✅ **Color** (ej: "#EF4444" → "#FF5733")
- ✅ **Imagen** (opcional)

### Restricciones:
- ❌ No se puede eliminar una regla si quedarían menos de 2
- ❌ No se puede crear más de 4 reglas
- ❌ El total de porcentajes debe ser exactamente 100%

---

## 📝 Ejemplos de Uso

### Ejemplo 1: Reglas por Defecto (50-30-20)
```
Tablero: "Casa Principal"
├── Gastos Fijos: 50% ($2,500,000)
├── Gastos Variables: 30% ($1,500,000)
└── Ahorro: 20% ($1,000,000)
Total: 100% ($5,000,000 de ingresos)
```

### Ejemplo 2: Reglas Personalizadas (40-30-20-10)
```
Tablero: "Depto Miami"
├── Vivienda: 40% ($600 USD)
├── Gastos: 30% ($450 USD)
├── Ahorro: 20% ($300 USD)
└── Emergencias: 10% ($150 USD)
Total: 100% ($1,500 USD de ingresos)
```

### Ejemplo 3: Reglas Mínimas (60-40)
```
Tablero: "Negocio"
├── Operaciones: 60% ($3,000,000)
└── Ahorro: 40% ($2,000,000)
Total: 100% ($5,000,000 de ingresos)
```

---

## 🔄 Flujo de Creación

### 1. Crear Tablero
```
POST /api/v1/financial-boards
{
  "perfilID": "xxx",
  "nombre": "Casa",
  "año": 2024,
  "mes": 1
}
```

**Resultado:** Se crean automáticamente 3 reglas (50-30-20)

### 2. Personalizar Reglas
```
PUT /api/v1/rules/:id
{
  "nombre": "Casa y Servicios",
  "porcentaje": 45,
  "color": "#FF5733",
  "icono": "building"
}
```

**Validación:** El sistema verifica que el total siga siendo 100%

### 3. Agregar Nueva Regla (Opcional)
```
POST /api/v1/rules
{
  "tableroID": "xxx",
  "nombre": "Emergencias",
  "porcentaje": 10,
  "color": "#8B5CF6",
  "icono": "shield"
}
```

**Validación:** 
- ✅ Verifica que no haya más de 4 reglas
- ✅ Verifica que el total no exceda 100%

### 4. Eliminar Regla
```
DELETE /api/v1/rules/:id
```

**Validación:** 
- ✅ Verifica que queden al menos 2 reglas
- ⚠️ Advertencia si el total no suma 100% después de eliminar

---

## 📊 Validaciones Implementadas

### Al Crear Regla:
1. ✅ Verifica que no haya más de 4 reglas
2. ✅ Verifica que el total no exceda 100%
3. ✅ Crea la regla y recalcula montos

### Al Actualizar Regla:
1. ✅ Verifica que el nuevo total no exceda 100%
2. ✅ Actualiza la regla y recalcula montos
3. ✅ Retorna advertencia si el total no es 100%

### Al Eliminar Regla:
1. ✅ Verifica que queden al menos 2 reglas
2. ✅ Elimina la regla del tablero
3. ✅ Retorna advertencia si el total no es 100%

### Al Listar Reglas:
1. ✅ Calcula el total de porcentajes
2. ✅ Valida si el total es 100% y cantidad es 2-4
3. ✅ Indica si se pueden agregar más reglas
4. ✅ Indica si se pueden eliminar reglas

---

## 🎨 Reglas por Defecto - Detalles

| Regla | Porcentaje | Color | Icono | Propósito |
|-------|-----------|-------|-------|-----------|
| Gastos Fijos | 50% | #EF4444 (Rojo) | home | Servicios básicos, deudas fijas |
| Gastos Variables | 30% | #F59E0B (Naranja) | shopping-cart | Compras, entretenimiento |
| Ahorro | 20% | #10B981 (Verde) | piggy-bank | Ahorro e inversiones |

---

## ✅ Estado: Implementado

- ✅ Validación de mínimo 2 reglas
- ✅ Validación de máximo 4 reglas
- ✅ Validación de suma 100%
- ✅ Reglas por defecto (50-30-20)
- ✅ Personalización completa
- ✅ Cálculo automático de montos
- ✅ Validaciones en todos los endpoints

