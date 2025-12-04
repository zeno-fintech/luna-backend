# ⚙️ Configuraciones Locales e Individuales

## 📊 Resumen de Configuraciones Implementadas

### 1. **Países (Countries)** ✅
- Modelo: `Country`
- Endpoint: `GET /api/v1/countries`
- Estado: Activo/Inactivo por país
- **Por defecto:** Solo Chile activo (MVP)

**Campos:**
- `nombre`, `codigo`, `codigoISO`
- `monedaDefault` (CLP para Chile, USD para US, etc.)
- `region` (Norteamérica, Centroamérica, Sudamérica, Caribe)
- `isActive` (true/false)
- `configuracion` (formatoFecha, formatoTelefono, zonaHoraria)

**Uso:**
```bash
# Inicializar países
node scripts/initializeCountries.js

# Solo Chile estará activo por defecto
# Para activar otros países, actualizar isActive: true en la BD
```

---

### 2. **Monedas (Currencies)** ✅
- Modelo: `Currency`
- Endpoint: `GET /api/v1/currencies`
- Estado: Activo/Inactivo por moneda
- **Por defecto:** Solo CLP y USD activos (MVP)

**Campos:**
- `codigo`, `nombre`, `simbolo`
- `formato` (separadorMiles, separadorDecimales, decimales, posicionSimbolo)
- `isActive` (true/false)

**Uso:**
```bash
# Inicializar monedas
node scripts/initializeCurrencies.js

# Solo CLP y USD estarán activos por defecto
# Para activar otras monedas, actualizar isActive: true en la BD
```

---

## 🎯 Otras Configuraciones Recomendadas

### 3. **Categorías del Sistema** (Ya existe)
- Modelo: `Category`
- Campo: `isSystem` (true/false)
- **Uso:** Categorías predefinidas vs categorías personalizadas del usuario

**Ejemplo:**
- `isSystem: true` → "Alimentación", "Transporte", "Vivienda" (no se pueden eliminar)
- `isSystem: false` → Categorías creadas por el usuario (se pueden eliminar)

---

### 4. **Configuración de Perfil** (Ya existe)
- Modelo: `Profile.configuracion`
- **Campos actuales:**
  - `moneda` (moneda por defecto del perfil)
  - `pais` (país del perfil)

**Podríamos agregar:**
```javascript
configuracion: {
  moneda: String,
  pais: String,
  idioma: String,        // 'es', 'en', 'pt'
  formatoFecha: String,  // 'DD/MM/YYYY', 'MM/DD/YYYY'
  notificaciones: {
    email: Boolean,
    push: Boolean,
    recordatorios: Boolean
  },
  preferencias: {
    tema: String,        // 'light', 'dark', 'auto'
    mostrarDecimales: Boolean
  }
}
```

---

### 5. **Configuración de Tenant** (Ya existe parcialmente)
- Modelo: `Tenant.config`
- **Campos actuales:**
  - `features` (ocrEnabled, voiceEnabled, aiInsightsEnabled, adsEnabled)

**Podríamos agregar:**
```javascript
config: {
  features: {...},
  paisesDisponibles: [String],  // ['CL', 'US'] - países habilitados para este tenant
  monedasDisponibles: [String], // ['CLP', 'USD'] - monedas habilitadas
  limites: {
    maxUsuarios: Number,
    maxPerfilesPorUsuario: Number,
    maxTablerosPorPerfil: Number
  }
}
```

---

### 6. **Configuración Global del Sistema**
- Nuevo modelo: `SystemConfig`
- **Uso:** Configuraciones que afectan a todo el sistema

**Ejemplo:**
```javascript
{
  nombre: 'maintenance_mode',
  valor: false,
  descripcion: 'Modo mantenimiento'
},
{
  nombre: 'registration_enabled',
  valor: true,
  descripcion: 'Registro de nuevos usuarios habilitado'
},
{
  nombre: 'max_file_size_mb',
  valor: 10,
  descripcion: 'Tamaño máximo de archivos en MB'
}
```

---

## 🚀 Implementación Recomendada

### Prioridad ALTA (Para MVP)
1. ✅ **Países** - Ya implementado
2. ✅ **Monedas** - Ya implementado (con isActive)
3. ⚠️ **Categorías del Sistema** - Ya existe, solo documentar uso

### Prioridad MEDIA (Post-MVP)
4. **Configuración de Perfil extendida** - Agregar más campos
5. **Configuración de Tenant extendida** - Agregar países/monedas disponibles

### Prioridad BAJA (Futuro)
6. **Configuración Global del Sistema** - Para administración avanzada

---

## 📝 Scripts de Inicialización

### Inicializar Países
```bash
node scripts/initializeCountries.js
```
**Resultado:**
- ✅ Chile: ACTIVO
- ⏸️ Otros países: INACTIVOS

### Inicializar Monedas
```bash
node scripts/initializeCurrencies.js
```
**Resultado:**
- ✅ CLP: ACTIVA
- ✅ USD: ACTIVA
- ⏸️ Otras monedas: INACTIVAS

---

## 🔧 Activar/Desactivar Países y Monedas

### Opción 1: Desde MongoDB
```javascript
// Activar Colombia
db.countries.updateOne(
  { codigo: "CO" },
  { $set: { isActive: true } }
);

// Activar COP
db.currencies.updateOne(
  { codigo: "COP" },
  { $set: { isActive: true } }
);
```

### Opción 2: Crear Endpoint Admin (Futuro)
```javascript
// PUT /api/v1/admin/countries/:codigo/activate
// PUT /api/v1/admin/currencies/:codigo/activate
```

---

## 💡 Ventajas de Este Enfoque

1. **Control Granular:** Activar/desactivar países y monedas individualmente
2. **Pruebas Seguras:** Solo Chile activo para MVP, expandir después
3. **Flexibilidad:** Fácil agregar nuevos países/monedas sin código
4. **Configuración Centralizada:** Todo en la base de datos
5. **Escalabilidad:** Fácil expandir a nuevos países

---

## 📊 Estado Actual

- ✅ **Países:** Modelo creado, script de inicialización listo
- ✅ **Monedas:** Modelo actualizado con isActive, script actualizado
- ✅ **Endpoints:** `/api/v1/countries` y `/api/v1/currencies` públicos
- ✅ **Documentación:** Completa

**¿Listo para usar!** 🎉

