/**
 * Script para verificar usuarios en la base de datos
 * Verifica que los usuarios existan y que las contraseñas estén correctamente hasheadas
 * Ejecutar: node scripts/verifyUsers.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Importar modelos
const User = require('../src/models/User');

const PASSWORD = '#Luna2025';

async function verifyUsers() {
  try {
    console.log('🔌 Conectando a MongoDB...\n');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Verificar usuario SUPERADMIN
    console.log('🔍 Verificando usuario SUPERADMIN...');
    const superAdminUser = await User.findOne({ correo: 'dev.francoscm@gmail.com' }).select('+password');
    
    if (!superAdminUser) {
      console.log('   ❌ Usuario SUPERADMIN no encontrado');
    } else {
      console.log('   ✅ Usuario encontrado:');
      console.log(`      ID: ${superAdminUser._id}`);
      console.log(`      Nombre: ${superAdminUser.nombres} ${superAdminUser.apellidos}`);
      console.log(`      Correo: ${superAdminUser.correo}`);
      console.log(`      Tenant: ${superAdminUser.tenantId}`);
      console.log(`      Roles: ${superAdminUser.roles}`);
      console.log(`      Activo: ${superAdminUser.isActive}`);
      console.log(`      Password hash: ${superAdminUser.password ? superAdminUser.password.substring(0, 20) + '...' : 'NO HAY'}`);
      
      // Verificar contraseña
      if (superAdminUser.password) {
        const isMatch = await bcrypt.compare(PASSWORD, superAdminUser.password);
        console.log(`      Contraseña válida: ${isMatch ? '✅ SÍ' : '❌ NO'}`);
      } else {
        console.log('      ❌ No hay contraseña hasheada');
      }
    }

    console.log('\n');

    // Verificar usuario final
    console.log('🔍 Verificando usuario final...');
    const finalUser = await User.findOne({ correo: 'francocastro204@gmail.com' }).select('+password');
    
    if (!finalUser) {
      console.log('   ❌ Usuario final no encontrado');
    } else {
      console.log('   ✅ Usuario encontrado:');
      console.log(`      ID: ${finalUser._id}`);
      console.log(`      Nombre: ${finalUser.nombres} ${finalUser.apellidos}`);
      console.log(`      Correo: ${finalUser.correo}`);
      console.log(`      Tenant: ${finalUser.tenantId}`);
      console.log(`      Roles: ${finalUser.roles}`);
      console.log(`      Activo: ${finalUser.isActive}`);
      console.log(`      Password hash: ${finalUser.password ? finalUser.password.substring(0, 20) + '...' : 'NO HAY'}`);
      
      // Verificar contraseña
      if (finalUser.password) {
        const isMatch = await bcrypt.compare(PASSWORD, finalUser.password);
        console.log(`      Contraseña válida: ${isMatch ? '✅ SÍ' : '❌ NO'}`);
      } else {
        console.log('      ❌ No hay contraseña hasheada');
      }
    }

    console.log('\n✅ Verificación completada\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante la verificación:');
    console.error(`   ${error.message}\n`);
    console.error(error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Ejecutar
verifyUsers();

