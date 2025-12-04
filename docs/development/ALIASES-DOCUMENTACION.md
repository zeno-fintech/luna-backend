# 📁 Sistema de Alias de Rutas

## ✅ Implementado

Se ha implementado un sistema de alias de rutas usando `module-alias` para simplificar todas las importaciones en el proyecto.

## 🎯 Alias Disponibles

| Alias | Ruta Real | Ejemplo de Uso |
|-------|-----------|----------------|
| `@` | `src/` | `require('@/index.js')` |
| `@core` | `src/core/` | `require('@core/utils/asyncHandler')` |
| `@level1` | `src/level1/` | `require('@level1/routes/admin')` |
| `@level2` | `src/level2/` | `require('@level2/controllers/company')` |
| `@level3` | `src/level3/` | `require('@level3/routes/auth')` |
| `@models` | `src/models/` | `require('@models/User')` |

## 📝 Ejemplos de Uso

### Antes (rutas relativas complicadas):
```javascript
// Desde src/level3/controllers/authController.js
const asyncHandler = require('../../core/utils/asyncHandler');
const User = require('../../models/User');
const authService = require('../services/auth/authService');
```

### Ahora (con alias):
```javascript
// Desde cualquier archivo
const asyncHandler = require('@core/utils/asyncHandler');
const User = require('@models/User');
const authService = require('@level3/services/auth/authService');
```

## 🔧 Configuración

### 1. Archivo de Configuración
Los alias se configuran en `src/config/aliases.js` y se cargan automáticamente al inicio de `src/index.js`.

### 2. Package.json
Los alias también están definidos en `package.json` bajo `_moduleAliases` para referencia.

## ✅ Archivos Actualizados

Se actualizaron automáticamente **27 archivos** para usar los nuevos alias:

- ✅ Todos los controladores (level1, level2, level3)
- ✅ Todas las rutas (level1, level2, level3)
- ✅ Todos los servicios (level1, level2, level3)
- ✅ Middleware (auth, errorHandler)

## 🚀 Ventajas

1. **Rutas más limpias**: No más `../../../` complicadas
2. **Más legible**: Fácil de entender de dónde viene cada módulo
3. **Menos errores**: No hay que contar niveles de directorios
4. **Refactoring fácil**: Si mueves un archivo, solo cambias el alias, no todas las rutas relativas
5. **Consistencia**: Todas las importaciones siguen el mismo patrón

## 📋 Guía de Migración

Si necesitas actualizar un archivo manualmente:

### Para importar desde `core/`:
```javascript
// ❌ Antes
const asyncHandler = require('../../core/utils/asyncHandler');

// ✅ Ahora
const asyncHandler = require('@core/utils/asyncHandler');
```

### Para importar modelos:
```javascript
// ❌ Antes
const User = require('../../../models/User');

// ✅ Ahora
const User = require('@models/User');
```

### Para importar desde otros niveles:
```javascript
// ❌ Antes
const adminController = require('../../level1/controllers/adminController');

// ✅ Ahora
const adminController = require('@level1/controllers/adminController');
```

## 🔄 Script de Actualización

Si necesitas actualizar más archivos en el futuro, puedes ejecutar:

```bash
node scripts/updateImports.js
```

Este script busca y actualiza automáticamente todas las importaciones relativas a usar los alias.

## ⚠️ Notas Importantes

1. **Orden de carga**: Los alias se configuran **al inicio** de `src/index.js`, antes de cualquier otra importación.

2. **No funciona en tests directamente**: Si usas Jest, necesitarás configurar los alias también en `jest.config.js` (ver sección siguiente).

3. **module-alias**: El paquete `module-alias` está instalado y configurado automáticamente.

## 🧪 Configuración para Tests (Opcional)

Si quieres usar los alias en tests, agrega esto a `jest.config.js`:

```javascript
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@level1/(.*)$': '<rootDir>/src/level1/$1',
    '^@level2/(.*)$': '<rootDir>/src/level2/$1',
    '^@level3/(.*)$': '<rootDir>/src/level3/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
  },
};
```

## ✅ Estado Actual

- ✅ Sistema de alias implementado
- ✅ 27 archivos actualizados automáticamente
- ✅ Servidor funcionando correctamente
- ✅ Todas las importaciones usando alias

## 🎉 Resultado

Ahora todas las importaciones son más limpias y fáciles de mantener. El servidor está funcionando correctamente con el nuevo sistema de alias.

