# 🔐 Cómo Generar un JWT_SECRET Seguro

## 🎯 Métodos para Generar JWT_SECRET

### Método 1: Usando el Script NPM (⭐ Más Fácil)

```bash
npm run generate:jwt-secret
```

Este script genera el secreto y muestra instrucciones de uso.

### Método 2: Usando Node.js Directamente

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Ejemplo de salida:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

### Método 2: Usando OpenSSL

```bash
openssl rand -hex 64
```

**Ejemplo de salida:**
```
1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5
```

### Método 3: Usando Python

```bash
python3 -c "import secrets; print(secrets.token_hex(64))"
```

---

## ✅ Requisitos del JWT_SECRET

- **Mínimo:** 32 caracteres (recomendado: 64+)
- **Tipo:** String aleatorio hexadecimal
- **Seguridad:** Debe ser único y no predecible
- **Almacenamiento:** NUNCA lo commitees en git (usa variables de entorno)

---

## 🔧 Configuración en Railway

1. **Genera el secreto** usando uno de los métodos arriba
2. **Copia el resultado** completo
3. **En Railway Dashboard:**
   - Ve a tu proyecto → Variables
   - Agrega nueva variable:
     - **Nombre:** `JWT_SECRET`
     - **Valor:** Pega el secreto generado
   - Guarda

---

## ⚠️ Importante

- ✅ **Único por ambiente:** Usa un secreto diferente para desarrollo y producción
- ✅ **No lo compartas:** Nunca lo publiques en GitHub o documentación pública
- ✅ **Rótalo periódicamente:** Cambia el secreto cada 6-12 meses en producción
- ❌ **No uses:** Palabras comunes, fechas, nombres, etc.

---

## 🧪 Verificar que Funciona

Después de configurar el `JWT_SECRET` en Railway:

1. Haz login en tu API
2. Verifica que recibes un token JWT válido
3. Usa ese token para acceder a endpoints protegidos

Si hay errores de autenticación, verifica que el `JWT_SECRET` esté correctamente configurado.

---

## 💡 Ejemplo Completo

```bash
# 1. Generar secreto
$ node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2

# 2. Copiar el resultado

# 3. En Railway → Variables → Agregar:
#    JWT_SECRET = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2

# 4. Guardar y hacer deploy
```

---

**¡Listo!** Tu JWT_SECRET está configurado de forma segura. 🔒

