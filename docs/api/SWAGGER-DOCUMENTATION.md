# 📚 Documentación Swagger/OpenAPI - LUNA Backend

## 🎯 ¿Qué es Swagger?

Swagger (ahora OpenAPI) es una herramienta que genera **documentación automática e interactiva** de tu API REST.

**Ventajas:**
- ✅ **Documentación automática** - Se genera desde el código
- ✅ **Interfaz interactiva** - Puedes probar endpoints directamente
- ✅ **Siempre actualizada** - Si cambias el código, la documentación se actualiza
- ✅ **Estándar de la industria** - Usado por millones de APIs

---

## 🚀 Acceso a la Documentación

### Desarrollo Local:
```
http://localhost:3001/api-docs
```

### Producción (Railway):
```
https://tu-proyecto.railway.app/api-docs
```

### JSON Raw (para herramientas externas):
```
http://localhost:3001/api-docs.json
```

---

## 📋 Endpoints Documentados

### ✅ Públicos (Sin Autenticación)
- `GET /health` - Health check
- `GET /api/v1` - Información de la API
- `POST /api/v1/auth/register` - Registro
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/countries` - Lista de países
- `GET /api/v1/countries/:codigo` - País específico
- `GET /api/v1/currencies` - Lista de monedas
- `GET /api/v1/currencies/:codigo` - Moneda específica

### 🔒 Privados (Requieren JWT Token)
- `GET /api/v1/auth/me` - Usuario actual
- Todos los endpoints de Level 3 (Profiles, Accounts, Transactions, etc.)

---

## 🔐 Autenticación en Swagger

### Cómo usar el botón "Authorize":

1. **Haz login** primero:
   - Ve a `POST /api/v1/auth/login`
   - Click en "Try it out"
   - Ingresa tus credenciales
   - Click en "Execute"
   - Copia el `token` de la respuesta

2. **Autoriza en Swagger**:
   - Click en el botón **"Authorize"** (arriba a la derecha)
   - Pega el token en el campo
   - Click en "Authorize"
   - Click en "Close"

3. **Prueba endpoints protegidos**:
   - Ahora puedes probar cualquier endpoint que requiera autenticación
   - El token se enviará automáticamente en el header `Authorization: Bearer <token>`

---

## 🛠️ Cómo Agregar Documentación a Nuevos Endpoints

### Ejemplo Básico:

```javascript
/**
 * @swagger
 * /api/v1/endpoint:
 *   get:
 *     summary: Descripción breve del endpoint
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []  # Si requiere autenticación
 *     parameters:
 *       - in: query
 *         name: param
 *         schema:
 *           type: string
 *         description: Descripción del parámetro
 *     responses:
 *       200:
 *         description: Descripción de la respuesta exitosa
 *       400:
 *         description: Error de validación
 */
router.get('/endpoint', controller);
```

### Ejemplo Completo con Request Body:

```javascript
/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Crea una nueva transacción
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - monto
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [Ingreso, Gasto, Transferencia]
 *               monto:
 *                 type: number
 *                 example: 50000
 *     responses:
 *       201:
 *         description: Transacción creada exitosamente
 *       400:
 *         description: Error de validación
 */
router.post('/', protect, authorize('USER'), createTransaction);
```

---

## 📊 Estructura de la Documentación

### Tags (Categorías):
- **Health** - Endpoints de salud
- **Auth** - Autenticación
- **Profiles** - Perfiles financieros
- **Accounts** - Cuentas bancarias
- **Transactions** - Transacciones
- **Debts** - Deudas
- **Payments** - Pagos
- **Financial Boards** - Tableros financieros
- **Countries** - Países (público)
- **Currencies** - Monedas (público)
- Y más...

### Schemas (Modelos):
- **Error** - Respuesta de error estándar
- **Success** - Respuesta de éxito estándar
- (Se pueden agregar más schemas según necesidad)

---

## 🔧 Configuración

### Archivo de Configuración:
`src/config/swagger.js`

### Servidores Configurados:
- `http://localhost:3001` - Desarrollo local
- `https://tu-proyecto.railway.app` - Producción (actualizar con tu URL)

### Archivos Escaneados:
- `./src/index.js`
- `./src/level3/routes/*.js`
- `./src/level2/routes/*.js`
- `./src/level1/routes/*.js`

---

## 💡 Uso Práctico

### Para Desarrolladores Frontend:
1. Abre `http://localhost:3001/api-docs`
2. Explora los endpoints disponibles
3. Prueba endpoints directamente desde Swagger
4. Copia los ejemplos de request/response
5. Usa el JSON schema para validar en frontend

### Para Testing:
1. Usa Swagger para probar endpoints rápidamente
2. Verifica que las respuestas sean correctas
3. Prueba casos de error (400, 401, 404, etc.)

### Para Documentación:
1. Comparte el link de Swagger con tu equipo
2. La documentación siempre está actualizada
3. No necesitas mantener documentación manual

---

## 🎨 Personalización

### Cambiar Título/Descripción:
Edita `src/config/swagger.js`:
```javascript
info: {
  title: 'LUNA Backend API',
  version: '1.0.0',
  description: 'Tu descripción aquí'
}
```

### Agregar Más Servidores:
```javascript
servers: [
  {
    url: 'http://localhost:3001',
    description: 'Desarrollo'
  },
  {
    url: 'https://staging.railway.app',
    description: 'Staging'
  },
  {
    url: 'https://produccion.railway.app',
    description: 'Producción'
  }
]
```

---

## ✅ Estado Actual

- ✅ Swagger instalado y configurado
- ✅ Endpoints básicos documentados (Health, Auth, Countries, Currencies)
- ✅ Autenticación JWT configurada
- ✅ Interfaz interactiva funcionando

### Pendiente (Opcional):
- Agregar documentación detallada a todos los endpoints
- Agregar schemas completos de los modelos
- Agregar ejemplos de respuestas

---

## 🚀 Próximos Pasos

1. **Probar Swagger:**
   ```bash
   npm run dev
   # Abre: http://localhost:3001/api-docs
   ```

2. **Agregar más documentación:**
   - Agrega comentarios `@swagger` a los endpoints que faltan
   - La documentación se actualiza automáticamente

3. **Compartir con el equipo:**
   - Comparte el link de Swagger
   - Todos pueden ver y probar la API

---

## 📝 Notas

- Swagger se genera **automáticamente** desde los comentarios JSDoc
- No necesitas mantener archivos YAML/JSON separados
- La documentación está **siempre sincronizada** con el código
- Puedes exportar el JSON para usar en otras herramientas

---

**¡Swagger está listo para usar!** 🎉

Abre `http://localhost:3001/api-docs` y explora tu API.

