# 🏗️ Entorno de Desarrollo vs Producción

## 📊 Resumen Rápido

**Para MVP (un solo ambiente):**
- ✅ **Desarrollo Local:** Usa `.env` (en tu computadora)
- ✅ **Producción (Railway):** Usa Variables de Entorno en Railway Dashboard
- ✅ **Misma Base de Datos:** Puedes usar la misma MongoDB para ambos (o separadas)

---

## 🔧 Desarrollo Local (`.env`)

### ¿Qué es `.env`?
- Archivo **local** en tu computadora
- **Solo para desarrollo** (cuando ejecutas `npm run dev`)
- **NO se commitea** en git (está en `.gitignore`)
- Contiene tus credenciales locales

### ¿Qué va en `.env`?
```env
# MongoDB (puede ser la misma que producción o una local)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lunaDB?retryWrites=true&w=majority

# JWT (genera uno con: npm run generate:jwt-secret)
JWT_SECRET=tu_secreto_para_desarrollo_aqui
JWT_EXPIRE=30d

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Bcrypt
BCRYPT_ROUNDS=12
```

### ¿Cómo crear `.env`?
```bash
# Copia el template
cp .env.example .env

# Edita .env y completa los valores
# (especialmente MONGODB_URI y JWT_SECRET)
```

---

## 🚀 Producción (Railway)

### ¿Qué son las Variables de Entorno en Railway?
- Se configuran en **Railway Dashboard → Variables**
- **Solo para producción** (cuando Railway ejecuta tu app)
- **Encriptadas** y seguras
- **Separadas** del código

### ¿Qué va en Railway Variables?
```env
# Las mismas variables que en .env, pero con valores de producción
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lunaDB?retryWrites=true&w=majority
JWT_SECRET=secreto_diferente_para_produccion
JWT_EXPIRE=30d
NODE_ENV=production
CORS_ORIGIN=https://tu-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

**NOTA:** `PORT` NO se configura, Railway lo asigna automáticamente.

---

## 🗄️ Base de Datos: ¿Una o Dos?

### Opción 1: Una Sola Base de Datos (Recomendado para MVP)
**Ventajas:**
- ✅ Más simple
- ✅ No necesitas mantener dos bases de datos
- ✅ Puedes probar con datos reales
- ✅ Menor costo

**Desventajas:**
- ⚠️ Desarrollo puede afectar datos de producción
- ⚠️ Necesitas ser cuidadoso con los datos de prueba

**Recomendación para MVP:** ✅ **Usa una sola base de datos**

### Opción 2: Dos Bases de Datos (Para Producción Real)
**Ventajas:**
- ✅ Desarrollo no afecta producción
- ✅ Más seguro
- ✅ Puedes probar sin miedo

**Desventajas:**
- ❌ Más complejo
- ❌ Mayor costo (dos clusters o dos bases de datos)

**Recomendación para Producción Real:** ✅ **Separa las bases de datos**

---

## 🔐 JWT_SECRET: ¿Mismo o Diferente?

### Recomendación: **Diferentes Secretos**

**Desarrollo:**
```env
# .env
JWT_SECRET=secreto_para_desarrollo_123...
```

**Producción:**
```
# Railway Variables
JWT_SECRET=secreto_para_produccion_456...
```

**Razones:**
- ✅ Si alguien accede a tu `.env` local, no compromete producción
- ✅ Mejor seguridad
- ✅ Buenas prácticas

**Para MVP (si quieres simplificar):**
- Puedes usar el mismo secreto temporalmente
- Pero es mejor usar diferentes desde el inicio

---

## 📁 Archivos Relacionados

### `.env` (Desarrollo Local)
- ✅ **SÍ existe** en tu computadora
- ❌ **NO se commitea** en git
- ✅ **SÍ necesitas crearlo** para desarrollo

### `.env.example` (Template)
- ✅ **SÍ se commitea** en git
- ✅ **Template** para crear `.env`
- ✅ **NO contiene secretos** reales

### `.env.bak` (Backup)
- ⚠️ **Archivo de backup** (probablemente antiguo)
- ❌ **NO es necesario** mantenerlo
- ✅ **Puedes borrarlo** si ya tienes `.env` configurado

### Railway Variables (Producción)
- ✅ **Solo en Railway Dashboard**
- ✅ **NO están en archivos**
- ✅ **Se configuran manualmente** en Railway

---

## 🎯 Flujo Completo

### Desarrollo Local:
```
1. Tienes .env en tu computadora
2. Ejecutas: npm run dev
3. El código lee variables de .env
4. Se conecta a MongoDB (puede ser la misma que producción)
```

### Producción (Railway):
```
1. Configuras variables en Railway Dashboard
2. Haces push a GitHub
3. Railway detecta cambios
4. Railway ejecuta: npm start
5. El código lee variables de Railway (no de .env)
6. Se conecta a MongoDB (puede ser la misma o diferente)
```

---

## ✅ Checklist

### Desarrollo Local:
- [ ] Crear `.env` desde `.env.example`
- [ ] Generar `JWT_SECRET` con `npm run generate:jwt-secret`
- [ ] Pegar `JWT_SECRET` en `.env`
- [ ] Configurar `MONGODB_URI` en `.env`
- [ ] Configurar otras variables en `.env`

### Producción (Railway):
- [ ] Generar `JWT_SECRET` nuevo (diferente al de desarrollo)
- [ ] Configurar todas las variables en Railway Dashboard
- [ ] Verificar que `MONGODB_URI` esté correcta
- [ ] Verificar que `CORS_ORIGIN` apunte a tu frontend

---

## 💡 Resumen

**Para MVP (un solo ambiente):**
- ✅ `.env` = Desarrollo local (tu computadora)
- ✅ Railway Variables = Producción (Railway)
- ✅ Puedes usar la misma MongoDB para ambos
- ✅ Usa JWT_SECRET diferentes (mejor práctica)
- ✅ `.env.bak` puedes borrarlo (no es necesario)

**¿Necesitas el JWT_SECRET en `.env`?**
- ✅ **SÍ**, para desarrollo local
- ✅ **SÍ**, en Railway Variables para producción
- ✅ **Diferentes secretos** (recomendado)

---

## 🗑️ ¿Borrar `.env.bak`?

**Sí, puedes borrarlo** si:
- ✅ Ya tienes `.env` configurado
- ✅ Ya no necesitas ese backup
- ✅ Es un archivo antiguo

**No lo borres si:**
- ⚠️ Contiene información importante que no tienes en otro lugar
- ⚠️ Lo estás usando como referencia

**Recomendación:** Si ya tienes `.env` funcionando, puedes borrarlo.

