# 📝 Script de Commit Automático

## 🚀 Uso

```bash
yarn commit
# o
npm run commit
```

## ✨ Características

El script automáticamente:

1. **Detecta cambios** en el repositorio git
2. **Categoriza archivos** por tipo (feat, fix, docs, etc.)
3. **Genera mensaje de commit** inteligente basado en los cambios
4. **Agrega todos los archivos** al staging (`git add .`)
5. **Realiza el commit** con el mensaje generado

## 📋 Tipos de Commit

El script detecta automáticamente el tipo de cambio:

- **✨ feat**: Nuevas funcionalidades (controllers, services, models)
- **🐛 fix**: Correcciones de bugs
- **📚 docs**: Documentación (README, .md files)
- **♻️ refactor**: Refactorización (middleware, utils)
- **💄 style**: Cambios de estilo
- **🧪 test**: Tests
- **🔧 chore**: Mantenimiento (scripts)
- **⚙️ config**: Configuración (package.json, .env, config files)

## 📝 Ejemplo de Uso

```bash
# Hacer cambios en el código
# ...

# Ejecutar el script
yarn commit

# El script mostrará:
# 🚀 Script de Commit Automático
# ================================
# 
# 📝 Archivos modificados: 5
#    M src/models/Country.js
#    M scripts/initializeCountries.js
#    A scripts/commit.js
# 
# 📦 Agregando archivos al staging...
# ✅ Archivos agregados correctamente
# 
# 💬 Mensaje de commit generado:
#    ✨ Nueva funcionalidad: Agregadas 2 funcionalidad(es), Actualizada documentación (1 archivo(s))
# 
# 🔄 Realizando commit...
# ✅ Commit realizado exitosamente!
```

## ⚙️ Configuración

El script no requiere configuración adicional. Solo asegúrate de tener:

- Git configurado (`git config user.name` y `git config user.email`)
- Archivos modificados en el repositorio

## 🔍 Detección Inteligente

El script analiza los nombres de archivos para determinar el tipo de cambio:

- `*Controller.js` → `feat`
- `*Service.js` → `feat`
- `*Model.js` → `feat`
- `*test.js` → `test`
- `*.md` → `docs`
- `package.json` → `config`
- `scripts/*` → `chore`

## 💡 Notas

- El script agrega **todos** los archivos modificados (`git add .`)
- Si no hay cambios, el script termina sin hacer nada
- Si hay un error, el script mostrará un mensaje descriptivo

