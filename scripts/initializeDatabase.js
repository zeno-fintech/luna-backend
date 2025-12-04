/**
 * Script de inicialización de la base de datos
 * Crea roles, tenant, y usuarios iniciales
 * Ejecutar: node scripts/initializeDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Importar modelos
const Role = require('../src/models/Role');
const Tenant = require('../src/models/Tenant');
const User = require('../src/models/User');
const Company = require('../src/models/Company');

// Importar otros modelos para asegurar que se creen las colecciones
require('../src/models/Transaction');
require('../src/models/Profile');
require('../src/models/Account');
require('../src/models/Category');
require('../src/models/Plan');
require('../src/models/Subscription');
require('../src/models/Debt');
require('../src/models/Payment');
require('../src/models/Savings');
require('../src/models/Asset');
require('../src/models/Budget');
require('../src/models/FinancialBoard');
require('../src/models/Rule');
require('../src/models/Configuration');
require('../src/models/Currency');
require('../src/models/MetricsSnapshot');

const PASSWORD = '#Luna2025';

async function initializeDatabase() {
  try {
    console.log('🔌 Conectando a MongoDB...\n');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 1. Crear Roles
    console.log('📋 Creando roles...');
    
    const superAdminRole = await Role.findOneAndUpdate(
      { name: 'SUPERADMIN' },
      {
        name: 'SUPERADMIN',
        level: 1,
        description: 'Super administrador del sistema - Nivel 1 (Holding)',
        permissions: [{
          resource: '*',
          actions: ['create', 'read', 'update', 'delete', 'manage']
        }],
        isSystem: true
      },
      { upsert: true, new: true }
    );
    console.log(`   ✅ Rol SUPERADMIN creado/actualizado (ID: ${superAdminRole._id})`);

    const userRole = await Role.findOneAndUpdate(
      { name: 'USER' },
      {
        name: 'USER',
        level: 3,
        description: 'Usuario final - Nivel 3',
        permissions: [{
          resource: 'transactions',
          actions: ['create', 'read', 'update', 'delete']
        }, {
          resource: 'profiles',
          actions: ['create', 'read', 'update', 'delete']
        }, {
          resource: 'accounts',
          actions: ['create', 'read', 'update', 'delete']
        }],
        isSystem: true
      },
      { upsert: true, new: true }
    );
    console.log(`   ✅ Rol USER creado/actualizado (ID: ${userRole._id})`);

    // Crear otros roles comunes
    const tenantOwnerRole = await Role.findOneAndUpdate(
      { name: 'TENANT_OWNER' },
      {
        name: 'TENANT_OWNER',
        level: 2,
        description: 'Dueño de Tenant - Nivel 2',
        permissions: [{
          resource: 'tenant',
          actions: ['read', 'update', 'manage']
        }, {
          resource: 'companies',
          actions: ['create', 'read', 'update', 'delete', 'manage']
        }],
        isSystem: true
      },
      { upsert: true, new: true }
    );
    console.log(`   ✅ Rol TENANT_OWNER creado/actualizado (ID: ${tenantOwnerRole._id})`);

    const tenantAdminRole = await Role.findOneAndUpdate(
      { name: 'TENANT_ADMIN' },
      {
        name: 'TENANT_ADMIN',
        level: 2,
        description: 'Administrador de Tenant - Nivel 2',
        permissions: [{
          resource: 'tenant',
          actions: ['read', 'update']
        }, {
          resource: 'companies',
          actions: ['create', 'read', 'update', 'delete']
        }],
        isSystem: true
      },
      { upsert: true, new: true }
    );
    console.log(`   ✅ Rol TENANT_ADMIN creado/actualizado (ID: ${tenantAdminRole._id})`);

    console.log('');

    // 2. Crear Tenant "Luna"
    console.log('🏢 Creando Tenant "Luna"...');
    
    const lunaTenant = await Tenant.findOneAndUpdate(
      { slug: 'luna' },
      {
        name: 'Luna',
        slug: 'luna',
        type: 'own_brand',
        branding: {
          primaryColor: '#0066CC',
          secondaryColor: '#00A8E8',
          domain: 'app.luna.com'
        },
        defaultCurrency: 'CLP',
        defaultCountry: 'CL',
        config: {
          features: {
            ocrEnabled: true,
            voiceEnabled: false,
            aiInsightsEnabled: true,
            adsEnabled: false
          }
        },
        isActive: true
      },
      { upsert: true, new: true }
    );
    console.log(`   ✅ Tenant "Luna" creado/actualizado (ID: ${lunaTenant._id})\n`);

    // 3. Crear Usuario SUPERADMIN
    console.log('👤 Creando usuario SUPERADMIN...');
    
    // Verificar si el usuario ya existe
    let superAdminUser = await User.findOne({ correo: 'dev.francoscm@gmail.com' });
    
    if (superAdminUser) {
      console.log('   ⚠️  Usuario SUPERADMIN ya existe, actualizando...');
      superAdminUser.tenantId = lunaTenant._id;
      superAdminUser.roles = [superAdminRole._id];
      superAdminUser.password = PASSWORD; // Se hasheará automáticamente
      superAdminUser.isActive = true;
      superAdminUser.markModified('password'); // Forzar que se detecte el cambio
      await superAdminUser.save();
    } else {
      // Hash de la contraseña manualmente para el nuevo usuario
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
      const hashedPassword = await bcrypt.hash(PASSWORD, salt);
      
      superAdminUser = await User.create({
        nombres: 'Super',
        apellidos: 'Admin',
        correo: 'dev.francoscm@gmail.com',
        password: hashedPassword,
        tenantId: lunaTenant._id,
        roles: [superAdminRole._id],
        planLevel: 'pro',
        isActive: true,
        isEmailVerified: true
      });
    }
    
    console.log(`   ✅ Usuario SUPERADMIN creado/actualizado`);
    console.log(`      Email: dev.francoscm@gmail.com`);
    console.log(`      Password: ${PASSWORD}`);
    console.log(`      Rol: SUPERADMIN (Nivel 1)`);
    console.log(`      Tenant: Luna\n`);

    // 4. Crear Usuario Final
    console.log('👤 Creando usuario final...');
    
    let finalUser = await User.findOne({ correo: 'francocastro204@gmail.com' });
    
    if (finalUser) {
      console.log('   ⚠️  Usuario final ya existe, actualizando...');
      finalUser.tenantId = lunaTenant._id;
      finalUser.roles = [userRole._id];
      finalUser.password = PASSWORD; // Se hasheará automáticamente
      finalUser.isActive = true;
      finalUser.markModified('password'); // Forzar que se detecte el cambio
      await finalUser.save();
    } else {
      // Hash de la contraseña manualmente
      const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
      const hashedPassword = await bcrypt.hash(PASSWORD, salt);
      
      finalUser = await User.create({
        nombres: 'Franco',
        apellidos: 'Castro',
        correo: 'francocastro204@gmail.com',
        password: hashedPassword,
        tenantId: lunaTenant._id,
        roles: [userRole._id],
        planLevel: 'free',
        isActive: true,
        isEmailVerified: true
      });
    }
    
    console.log(`   ✅ Usuario final creado/actualizado`);
    console.log(`      Email: francocastro204@gmail.com`);
    console.log(`      Password: ${PASSWORD}`);
    console.log(`      Rol: USER (Nivel 3)`);
    console.log(`      Tenant: Luna\n`);

    // 5. Verificar colecciones creadas
    console.log('📚 Verificando colecciones...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   ✅ ${collections.length} colecciones encontradas:`);
    collections.forEach(col => {
      console.log(`      - ${col.name}`);
    });

    console.log('\n✅ ¡Inicialización completada exitosamente!\n');
    console.log('📝 Resumen:');
    console.log('   - Roles: SUPERADMIN, USER, TENANT_OWNER, TENANT_ADMIN');
    console.log('   - Tenant: Luna (marca propia)');
    console.log('   - Usuario SUPERADMIN: dev.francoscm@gmail.com');
    console.log('   - Usuario Final: francocastro204@gmail.com');
    console.log('   - Password para ambos: #Luna2025\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante la inicialización:');
    console.error(`   ${error.message}\n`);
    console.error(error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Ejecutar
initializeDatabase();

