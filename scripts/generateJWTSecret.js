#!/usr/bin/env node

/**
 * Script para generar un JWT_SECRET seguro
 * 
 * Uso: npm run generate:jwt-secret
 * o: node scripts/generateJWTSecret.js
 * 
 * Este script genera un secreto aleatorio de 64 bytes (128 caracteres hexadecimales)
 * que puede ser usado como JWT_SECRET en las variables de entorno.
 */

const crypto = require('crypto');

// Generar secreto de 64 bytes (128 caracteres en hexadecimal)
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 JWT_SECRET Generado\n');
console.log('═'.repeat(80));
console.log(secret);
console.log('═'.repeat(80));
console.log('\n📋 Instrucciones:');
console.log('1. Copia el secreto de arriba (línea completa)');
console.log('2. En Railway Dashboard → Variables → Agregar:');
console.log('   - Nombre: JWT_SECRET');
console.log('   - Valor: (pega el secreto copiado)');
console.log('3. Guarda y haz deploy\n');
console.log('⚠️  IMPORTANTE:');
console.log('   - NO commitees este secreto en git');
console.log('   - Usa un secreto diferente para desarrollo y producción');
console.log('   - Guarda este secreto de forma segura\n');

