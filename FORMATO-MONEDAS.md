# 💰 Formato de Monedas - Backend vs Frontend

## 🎯 Respuesta Rápida

**El formato se maneja en el FRONTEND**, pero el **BACKEND proporciona la configuración** de cómo formatear cada moneda.

---

## 📊 Cómo Funciona

### Backend (Configuración)
El backend almacena **cómo debe formatearse** cada moneda:

```javascript
// Modelo Currency con formato
{
  codigo: "CLP",
  simbolo: "$",
  formato: {
    separadorMiles: ".",      // Punto para miles
    separadorDecimales: ",",   // Coma para decimales
    decimales: 0,              // Sin decimales
    posicionSimbolo: "before"  // $ antes del número
  }
}
```

### Frontend (Aplicación)
El frontend **usa esta configuración** para formatear los números:

```javascript
// Ejemplo en React/Next.js
function formatCurrency(amount, currency) {
  const { formato, simbolo } = currency;
  
  // Formatear número
  let formatted = amount.toFixed(formato.decimales);
  
  // Agregar separador de miles
  if (formato.separadorMiles) {
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, formato.separadorMiles);
  }
  
  // Agregar símbolo
  if (formato.posicionSimbolo === 'before') {
    return `${simbolo}${formatted}`;
  } else {
    return `${formatted}${simbolo}`;
  }
}

// Uso
formatCurrency(2800000, { 
  simbolo: "$", 
  formato: { separadorMiles: ".", decimales: 0, posicionSimbolo: "before" } 
});
// Resultado: "$2.800.000"
```

---

## 🌍 Formatos por País (Configurados)

### Chile (CLP)
```javascript
{
  codigo: "CLP",
  simbolo: "$",
  formato: {
    separadorMiles: ".",      // $1.000.000
    separadorDecimales: ",",   // No aplica (0 decimales)
    decimales: 0,
    posicionSimbolo: "before"
  }
}
```
**Ejemplo:** `$2.800.000`

### Estados Unidos / Ecuador / Panamá (USD)
```javascript
{
  codigo: "USD",
  simbolo: "$",
  formato: {
    separadorMiles: ".",      // $1.500.00
    separadorDecimales: ",",   // $1.500,00
    decimales: 2,
    posicionSimbolo: "before"
  }
}
```
**Ejemplo:** `$1.500,00`

### Colombia (COP)
```javascript
{
  codigo: "COP",
  simbolo: "$",
  formato: {
    separadorMiles: ".",
    separadorDecimales: ",",
    decimales: 0,
    posicionSimbolo: "before"
  }
}
```
**Ejemplo:** `$1.000.000`

### Perú (PEN)
```javascript
{
  codigo: "PEN",
  simbolo: "S/",
  formato: {
    separadorMiles: ",",      // S/1,500.00
    separadorDecimales: ".",   // Diferente a Chile
    decimales: 2,
    posicionSimbolo: "before"
  }
}
```
**Ejemplo:** `S/1,500.00`

### Argentina (ARS)
```javascript
{
  codigo: "ARS",
  simbolo: "$",
  formato: {
    separadorMiles: ".",
    separadorDecimales: ",",
    decimales: 2,
    posicionSimbolo: "before"
  }
}
```
**Ejemplo:** `$1.500,00`

### Brasil (BRL)
```javascript
{
  codigo: "BRL",
  simbolo: "R$",
  formato: {
    separadorMiles: ".",
    separadorDecimales: ",",
    decimales: 2,
    posicionSimbolo: "before"
  }
}
```
**Ejemplo:** `R$1.500,00`

### Uruguay (UYU)
```javascript
{
  codigo: "UYU",
  simbolo: "$",
  formato: {
    separadorMiles: ".",
    separadorDecimales: ",",
    decimales: 2,
    posicionSimbolo: "before"
  }
}
```
**Ejemplo:** `$1.500,00`

### Paraguay (PYG)
```javascript
{
  codigo: "PYG",
  simbolo: "₲",
  formato: {
    separadorMiles: ".",
    separadorDecimales: ",",
    decimales: 0,
    posicionSimbolo: "before"
  }
}
```
**Ejemplo:** `₲1.000.000`

---

## 🔧 Endpoint para Obtener Formatos

### GET /api/v1/currencies

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "codigo": "CLP",
      "nombre": "Peso Chileno",
      "simbolo": "$",
      "formato": {
        "separadorMiles": ".",
        "separadorDecimales": ",",
        "decimales": 0,
        "posicionSimbolo": "before"
      },
      "isActive": true
    },
    {
      "codigo": "USD",
      "nombre": "Dólar Estadounidense",
      "simbolo": "$",
      "formato": {
        "separadorMiles": ".",
        "separadorDecimales": ",",
        "decimales": 2,
        "posicionSimbolo": "before"
      }
    }
  ]
}
```

---

## 💡 Flujo Completo

```
1. Usuario selecciona moneda en frontend
   ↓
2. Frontend consulta: GET /api/v1/currencies
   ↓
3. Backend retorna configuración de formato
   ↓
4. Frontend formatea números usando la configuración
   ↓
5. Usuario ve: "$2.800.000" (CLP) o "$1.500,00" (USD)
```

---

## ✅ Ventajas de Este Enfoque

1. **Backend almacena configuración** - Un solo lugar de verdad
2. **Frontend aplica formato** - Más flexible y rápido
3. **Fácil agregar nuevas monedas** - Solo actualizar backend
4. **Consistencia** - Todos los clientes usan el mismo formato
5. **Internacionalización** - Fácil soportar más países

---

## 🚀 Inicializar Monedas

Ejecuta el script para cargar todas las monedas:

```bash
node scripts/initializeCurrencies.js
```

Esto crea/actualiza todas las monedas con sus formatos correctos.

---

## 📝 Resumen

- ✅ **Backend:** Almacena configuración de formato
- ✅ **Frontend:** Aplica el formato a los números
- ✅ **Ventaja:** Separación de responsabilidades, fácil de mantener
- ✅ **Monedas:** CLP, USD, COP, PEN, ARS, BRL, UYU, PYG configuradas

**¿Tiene sentido este enfoque?** 🎯

