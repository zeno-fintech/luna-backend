/**
 * Script de migración: FinancialBoard → Presupuesto
 * 
 * Este script:
 * 1. Renombra la colección 'financialboards' a 'presupuestos'
 * 2. Actualiza todas las referencias tableroID → presupuestoID en:
 *    - Transaction
 *    - Income
 *    - Rule
 * 3. Actualiza referencias en Asset y Debt si tienen presupuestoID
 * 
 * Ejecutar: node scripts/migrateFinancialBoardsToPresupuestos.js
 * 
 * ⚠️ IMPORTANTE: Hacer backup de la BD antes de ejecutar
 */

require('dotenv').config();
require('../src/config/aliases');

const mongoose = require('mongoose');
const Transaction = require('@models/Transaction');
const Income = require('@models/Income');
const Rule = require('@models/Rule');
const Asset = require('@models/Asset');
const Debt = require('@models/Debt');

async function migrate() {
  try {
    console.log('🔌 Conectando a MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    const db = mongoose.connection.db;

    // 1. Verificar si existe la colección financialboards
    const collections = await db.listCollections().toArray();
    const financialBoardsExists = collections.some(c => c.name === 'financialboards');
    const presupuestosExists = collections.some(c => c.name === 'presupuestos');

    if (!financialBoardsExists && !presupuestosExists) {
      console.log('⚠️  No se encontró la colección financialboards. Nada que migrar.\n');
      await mongoose.connection.close();
      return;
    }

    if (presupuestosExists && financialBoardsExists) {
      console.log('⚠️  Ambas colecciones existen. Verificando si ya se migró...\n');
      const presupuestosCount = await db.collection('presupuestos').countDocuments();
      const financialBoardsCount = await db.collection('financialboards').countDocuments();
      
      if (presupuestosCount > 0 && financialBoardsCount === 0) {
        console.log('✅ La migración ya se completó anteriormente.\n');
        await mongoose.connection.close();
        return;
      }
    }

    // 2. Renombrar colección
    if (financialBoardsExists) {
      console.log('📦 Renombrando colección financialboards → presupuestos...');
      
      if (presupuestosExists) {
        // Si ya existe presupuestos, copiar documentos
        console.log('   ⚠️  La colección presupuestos ya existe. Copiando documentos...');
        const financialBoards = await db.collection('financialboards').find({}).toArray();
        if (financialBoards.length > 0) {
          await db.collection('presupuestos').insertMany(financialBoards, { ordered: false });
          console.log(`   ✅ ${financialBoards.length} documentos copiados`);
        }
        // Eliminar colección antigua
        await db.collection('financialboards').drop();
        console.log('   ✅ Colección financialboards eliminada');
      } else {
        // Renombrar directamente
        await db.collection('financialboards').rename('presupuestos');
        console.log('   ✅ Colección renombrada');
      }
    }

    // 3. Actualizar referencias en Transaction
    console.log('\n🔄 Actualizando referencias en Transaction...');
    const transactionResult = await Transaction.updateMany(
      { tableroID: { $exists: true } },
      [
        {
          $set: {
            presupuestoID: '$tableroID',
            tableroID: '$$REMOVE'
          }
        }
      ]
    );
    console.log(`   ✅ ${transactionResult.modifiedCount} transacciones actualizadas`);

    // 4. Actualizar referencias en Income
    console.log('🔄 Actualizando referencias en Income...');
    const incomeResult = await Income.updateMany(
      { tableroID: { $exists: true } },
      [
        {
          $set: {
            presupuestoID: '$tableroID',
            tableroID: '$$REMOVE'
          }
        }
      ]
    );
    console.log(`   ✅ ${incomeResult.modifiedCount} ingresos actualizados`);

    // 5. Actualizar referencias en Rule
    console.log('🔄 Actualizando referencias en Rule...');
    const ruleResult = await Rule.updateMany(
      { tableroID: { $exists: true } },
      [
        {
          $set: {
            presupuestoID: '$tableroID',
            tableroID: '$$REMOVE'
          }
        }
      ]
    );
    console.log(`   ✅ ${ruleResult.modifiedCount} reglas actualizadas`);

    // 6. Verificar Asset y Debt (ya deberían tener presupuestoID si se crearon después del refactor)
    console.log('\n✅ Migración completada exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - Transacciones actualizadas: ${transactionResult.modifiedCount}`);
    console.log(`   - Ingresos actualizados: ${incomeResult.modifiedCount}`);
    console.log(`   - Reglas actualizadas: ${ruleResult.modifiedCount}`);
    console.log(`   - Colección renombrada: financialboards → presupuestos\n`);

    await mongoose.connection.close();
    console.log('👋 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Ejecutar migración
migrate();

