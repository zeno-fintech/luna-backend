/**
 * Script para verificar la conexión a MongoDB
 * Ejecutar: node scripts/verifyConnection.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function verifyConnection() {
  try {
    console.log('🔍 Verificando configuración...\n');
    
    // Verificar que existe MONGODB_URI
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI no está definida en .env');
      process.exit(1);
    }
    
    console.log('✅ MONGODB_URI encontrada');
    console.log(`📍 URI: ${process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@')}\n`); // Ocultar contraseña
    
    // Verificar que la URI incluye el nombre de la base de datos
    const uri = process.env.MONGODB_URI;
    if (!uri.includes('/lunaDB') && !uri.includes('/luna')) {
      console.warn('⚠️  Advertencia: La URI no parece incluir el nombre de la base de datos');
      console.warn('   Debería ser: ...mongodb.net/lunaDB?...\n');
    }
    
    console.log('🔌 Intentando conectar a MongoDB...\n');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ ¡Conexión exitosa!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🔗 Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}\n`);
    
    // Listar colecciones existentes
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length > 0) {
      console.log('📚 Colecciones existentes:');
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    } else {
      console.log('📚 No hay colecciones aún (base de datos nueva)');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Verificación completada exitosamente');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error al conectar:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('authentication failed')) {
      console.error('💡 Verifica que:');
      console.error('   1. El usuario y contraseña son correctos');
      console.error('   2. El usuario tiene permisos en la base de datos');
    } else if (error.message.includes('IP')) {
      console.error('💡 Verifica que:');
      console.error('   1. Tu IP está en la whitelist de MongoDB Atlas');
      console.error('   2. Ve a Network Access en MongoDB Atlas y agrega tu IP');
    } else if (error.message.includes('timeout')) {
      console.error('💡 Verifica que:');
      console.error('   1. Tienes conexión a internet');
      console.error('   2. La URI es correcta');
    }
    
    process.exit(1);
  }
}

verifyConnection();

