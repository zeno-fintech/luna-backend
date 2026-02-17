require('dotenv').config();
const mongoose = require('mongoose');

// Importar modelos antiguos
const Account = require('../src/models/Account');
const Asset = require('../src/models/Asset');
const Savings = require('../src/models/Savings');
const Debt = require('../src/models/Debt');

// Importar modelos nuevos
const Activo = require('../src/models/Activo');
const Pasivo = require('../src/models/Pasivo');

/**
 * Script de migración: Account, Asset, Savings → Activo
 *                     Debt → Pasivo
 * 
 * Este script migra todos los datos de los modelos antiguos a los nuevos modelos unificados.
 * 
 * IMPORTANTE: Este script NO elimina los datos antiguos. Solo crea los nuevos registros.
 * Los datos antiguos se pueden eliminar manualmente después de validar la migración.
 */

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/luna';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Mapeo de tipos de Account a Activo
const mapAccountTipoToActivo = (tipoCuenta) => {
  const mapping = {
    'Corriente': 'Cuenta Corriente',
    'Ahorro': 'Cuenta Ahorro',
    'Tarjeta de Crédito': 'Tarjeta de Crédito',
    'Efectivo': 'Efectivo',
    'Inversión': 'Depósito a Plazo',
    'Otro': 'Otro'
  };
  return mapping[tipoCuenta] || 'Otro';
};

// Mapeo de tipos de Savings a Activo
const mapSavingsTipoToActivo = (tipo) => {
  const mapping = {
    'Fondo de Emergencia': 'Fondo de Emergencia',
    'Ahorro Objetivo': 'Ahorro Objetivo',
    'Inversión': 'Fondo Mutuo',
    'Prepago de Deudas': 'Prepago de Deudas',
    'Otro': 'Otro'
  };
  return mapping[tipo] || 'Otro';
};

const migrateAccounts = async () => {
  console.log('\n📦 Migrando Accounts → Activos...');
  
  const accounts = await Account.find({});
  console.log(`   Encontrados ${accounts.length} accounts`);
  
  let migrated = 0;
  let errors = 0;
  
  for (const account of accounts) {
    try {
      const activoData = {
        perfilID: account.perfilID,
        nombre: account.nombre || `Cuenta ${account.tipoCuenta || 'Bancaria'}`,
        tipo: mapAccountTipoToActivo(account.tipoCuenta),
        valor: account.saldoDisponible || 0,
        moneda: account.moneda || 'CLP',
        fecha: account.createdAt || new Date(),
        descripcion: `Migrado desde Account: ${account._id}`,
        
        // Campos específicos de cuenta bancaria
        banco: account.banco,
        saldoDisponible: account.saldoDisponible,
        tipoCuenta: account.tipoCuenta,
        favorito: account.favorito || false,
        
        // PresupuestoID como array (vacío por ahora, no había en Account)
        presupuestoID: []
      };
      
      await Activo.create(activoData);
      migrated++;
    } catch (error) {
      console.error(`   ❌ Error migrando account ${account._id}:`, error.message);
      errors++;
    }
  }
  
  console.log(`   ✅ Migrados: ${migrated}, ❌ Errores: ${errors}`);
  return { migrated, errors };
};

const migrateAssets = async () => {
  console.log('\n📦 Migrando Assets → Activos...');
  
  const assets = await Asset.find({});
  console.log(`   Encontrados ${assets.length} assets`);
  
  let migrated = 0;
  let errors = 0;
  
  for (const asset of assets) {
    try {
      // Mapear tipos antiguos a nuevos si es necesario
      let tipoActivo = asset.tipo;
      if (tipoActivo === 'Propiedades') {
        tipoActivo = 'Propiedad Inversión'; // Mapear a un tipo válido
      }
      
      const activoData = {
        perfilID: asset.perfilID,
        nombre: asset.descripcion || `Activo ${asset.tipo}`,
        tipo: tipoActivo,
        valor: asset.valor,
        moneda: asset.moneda || 'CLP',
        fecha: asset.fecha || asset.createdAt || new Date(),
        descripcion: asset.descripcion || `Migrado desde Asset: ${asset._id}`,
        
        // PresupuestoID como array
        presupuestoID: asset.presupuestoID ? [asset.presupuestoID] : [],
        
        // Campos específicos de propiedades
        rol: asset.rol,
        direccion: asset.direccion,
        comuna: asset.comuna,
        avaluoFiscal: asset.avaluoFiscal,
        valorComercial: asset.valorComercial,
        grupoPropiedad: asset.grupoPropiedad,
        tipoPropiedad: asset.tipoPropiedad,
        metrosTotales: asset.metrosTotales,
        metrosConstruidos: asset.metrosConstruidos,
        metrosTerreno: asset.metrosTerreno,
        numeroDormitorios: asset.numeroDormitorios,
        numeroBanos: asset.numeroBanos,
        numeroEstacionamientos: asset.numeroEstacionamientos,
        piso: asset.piso,
        
        // Campos específicos de vehículos
        marca: asset.marca,
        modelo: asset.modelo,
        año: asset.año,
        kilometraje: asset.kilometraje,
        patente: asset.patente,
        color: asset.color,
        
        // Metadata
        metadata: asset.metadata || {}
      };
      
      await Activo.create(activoData);
      migrated++;
    } catch (error) {
      console.error(`   ❌ Error migrando asset ${asset._id}:`, error.message);
      errors++;
    }
  }
  
  console.log(`   ✅ Migrados: ${migrated}, ❌ Errores: ${errors}`);
  return { migrated, errors };
};

const migrateSavings = async () => {
  console.log('\n📦 Migrando Savings → Activos...');
  
  const savings = await Savings.find({});
  console.log(`   Encontrados ${savings.length} savings`);
  
  let migrated = 0;
  let errors = 0;
  
  for (const saving of savings) {
    try {
      const activoData = {
        perfilID: saving.perfilID,
        nombre: saving.descripcion || `Ahorro ${saving.tipo}`,
        tipo: mapSavingsTipoToActivo(saving.tipo),
        valor: saving.monto || 0,
        moneda: 'CLP', // Savings no tenía moneda, usar CLP por defecto
        fecha: saving.fecha || saving.createdAt || new Date(),
        descripcion: saving.descripcion || `Migrado desde Savings: ${saving._id}`,
        
        // Campos específicos de ahorros/inversiones
        fechaObjetivo: saving.fechaObjetivo,
        tasaRendimiento: saving.tasaRendimiento || 0,
        categoriaID: saving.categoriaID,
        reglaID: saving.reglaID,
        
        // PresupuestoID como array (vacío por ahora)
        presupuestoID: []
      };
      
      await Activo.create(activoData);
      migrated++;
    } catch (error) {
      console.error(`   ❌ Error migrando saving ${saving._id}:`, error.message);
      errors++;
    }
  }
  
  console.log(`   ✅ Migrados: ${migrated}, ❌ Errores: ${errors}`);
  return { migrated, errors };
};

const migrateDebts = async () => {
  console.log('\n📦 Migrando Debts → Pasivos...');
  
  const debts = await Debt.find({});
  console.log(`   Encontrados ${debts.length} debts`);
  
  let migrated = 0;
  let errors = 0;
  
  for (const debt of debts) {
    try {
      // Mapear categorías antiguas a nuevas si es necesario
      let categoriaPasivo = debt.categoria;
      if (categoriaPasivo === 'TC') {
        categoriaPasivo = 'Tarjeta de Crédito';
      } else if (categoriaPasivo === 'Personal' && debt.tipo === 'Personal') {
        categoriaPasivo = 'Préstamo Personal';
      }
      
      const pasivoData = {
        perfilID: debt.perfilID,
        nombre: debt.nombre,
        tipo: debt.tipo,
        categoria: categoriaPasivo,
        prestador: debt.prestador,
        montoTotal: debt.montoTotal || 0,
        saldoPendiente: debt.saldoPendiente || 0,
        saldoPagado: debt.saldoPagado || 0,
        numeroCuotas: debt.numeroCuotas,
        abonoMensual: debt.abonoMensual,
        montoCuota: debt.montoCuota,
        tasaInteres: debt.tasaInteres || 0,
        moneda: debt.moneda || 'CLP',
        fechaInicio: debt.fechaInicio || debt.createdAt || new Date(),
        fechaVencimiento: debt.fechaVencimiento,
        estado: debt.estado || 'Activa',
        descripcion: debt.descripcion || `Migrado desde Debt: ${debt._id}`,
        
        // PresupuestoID como array
        presupuestoID: debt.presupuestoID ? [debt.presupuestoID] : []
      };
      
      await Pasivo.create(pasivoData);
      migrated++;
    } catch (error) {
      console.error(`   ❌ Error migrando debt ${debt._id}:`, error.message);
      errors++;
    }
  }
  
  console.log(`   ✅ Migrados: ${migrated}, ❌ Errores: ${errors}`);
  return { migrated, errors };
};

const main = async () => {
  console.log('🚀 Iniciando migración a modelos unificados de Patrimonio...\n');
  
  await connectDB();
  
  try {
    // Verificar si ya hay datos migrados
    const activosCount = await Activo.countDocuments();
    const pasivosCount = await Pasivo.countDocuments();
    
    if (activosCount > 0 || pasivosCount > 0) {
      console.log(`⚠️  ADVERTENCIA: Ya existen ${activosCount} activos y ${pasivosCount} pasivos en la base de datos.`);
      console.log('   Este script puede crear duplicados. ¿Deseas continuar? (Ctrl+C para cancelar)');
      console.log('   Esperando 5 segundos...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Migrar datos
    const accountsResult = await migrateAccounts();
    const assetsResult = await migrateAssets();
    const savingsResult = await migrateSavings();
    const debtsResult = await migrateDebts();
    
    // Resumen
    const totalMigrated = 
      accountsResult.migrated + 
      assetsResult.migrated + 
      savingsResult.migrated + 
      debtsResult.migrated;
    
    const totalErrors = 
      accountsResult.errors + 
      assetsResult.errors + 
      savingsResult.errors + 
      debtsResult.errors;
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN DE MIGRACIÓN');
    console.log('='.repeat(50));
    console.log(`✅ Total migrado: ${totalMigrated}`);
    console.log(`❌ Total errores: ${totalErrors}`);
    console.log('\n📝 NOTA: Los datos antiguos NO fueron eliminados.');
    console.log('   Puedes eliminarlos manualmente después de validar la migración.');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    process.exit(0);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { main };
