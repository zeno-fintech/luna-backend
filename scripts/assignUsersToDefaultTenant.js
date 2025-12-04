/**
 * Script para asignar usuarios existentes a un tenant por defecto
 * 
 * Uso:
 * node scripts/assignUsersToDefaultTenant.js [tenantId]
 * 
 * Si no se proporciona tenantId, se creará un tenant por defecto llamado "LUNA Default"
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Tenant = require('../src/models/Tenant');
const Role = require('../src/models/Role');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luna', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const assignUsersToTenant = async (tenantId) => {
  try {
    let tenant;

    // Si no se proporciona tenantId, crear uno por defecto
    if (!tenantId) {
      console.log('📝 Creando tenant por defecto...');
      tenant = await Tenant.findOne({ slug: 'luna-default' });
      
      if (!tenant) {
        tenant = await Tenant.create({
          name: 'LUNA Default',
          slug: 'luna-default',
          type: 'own_brand',
          defaultCurrency: 'CLP',
          isActive: true
        });
        console.log(`✅ Tenant creado: ${tenant.name} (${tenant._id})`);
      } else {
        console.log(`✅ Usando tenant existente: ${tenant.name} (${tenant._id})`);
      }
    } else {
      tenant = await Tenant.findById(tenantId);
      if (!tenant) {
        console.error(`❌ Tenant no encontrado: ${tenantId}`);
        process.exit(1);
      }
      console.log(`✅ Usando tenant: ${tenant.name} (${tenant._id})`);
    }

    // Buscar rol USER si existe, si no, crear uno básico
    let userRole = await Role.findOne({ name: 'USER' });
    if (!userRole) {
      console.log('📝 Creando rol USER...');
      userRole = await Role.create({
        name: 'USER',
        level: 3,
        description: 'Usuario final del sistema',
        isSystem: true
      });
      console.log(`✅ Rol USER creado`);
    }

    // Buscar usuarios sin tenantId
    const usersWithoutTenant = await User.find({
      $or: [
        { tenantId: { $exists: false } },
        { tenantId: null }
      ]
    });

    console.log(`\n📊 Usuarios sin tenant encontrados: ${usersWithoutTenant.length}`);

    if (usersWithoutTenant.length === 0) {
      console.log('✅ No hay usuarios sin tenant asignado');
      process.exit(0);
    }

    // Asignar tenant y rol a usuarios
    let updated = 0;
    for (const user of usersWithoutTenant) {
      user.tenantId = tenant._id;
      
      // Si no tiene roles, asignar rol USER
      if (!user.roles || user.roles.length === 0) {
        user.roles = [userRole._id];
      }
      
      await user.save();
      updated++;
      console.log(`  ✓ Usuario actualizado: ${user.correo}`);
    }

    console.log(`\n✅ ${updated} usuarios asignados al tenant "${tenant.name}"`);
    console.log(`✅ Rol USER asignado a usuarios sin roles`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  
  const tenantId = process.argv[2];
  await assignUsersToTenant(tenantId);
  
  await mongoose.connection.close();
  console.log('\n✅ Proceso completado');
  process.exit(0);
};

main();

