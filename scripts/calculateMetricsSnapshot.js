/**
 * Script para calcular y guardar métricas agregadas
 * 
 * Uso:
 * node scripts/calculateMetricsSnapshot.js [scope] [period] [periodValue] [targetId]
 * 
 * Ejemplos:
 * node scripts/calculateMetricsSnapshot.js global month 2025-02
 * node scripts/calculateMetricsSnapshot.js tenant month 2025-02 <tenantId>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const adminMetricsService = require('../src/level1/services/adminMetricsService');

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

const calculateSnapshot = async () => {
  try {
    const scope = process.argv[2] || 'global';
    const period = process.argv[3] || 'month';
    const periodValue = process.argv[4] || new Date().toISOString().slice(0, 7); // YYYY-MM
    const targetId = process.argv[5] || null;

    if (!['global', 'tenant', 'company', 'user'].includes(scope)) {
      console.error('❌ Scope inválido. Debe ser: global, tenant, company o user');
      process.exit(1);
    }

    if (!['day', 'week', 'month', 'year'].includes(period)) {
      console.error('❌ Period inválido. Debe ser: day, week, month o year');
      process.exit(1);
    }

    console.log(`\n📊 Calculando métricas...`);
    console.log(`   Scope: ${scope}`);
    console.log(`   Period: ${period}`);
    console.log(`   Period Value: ${periodValue}`);
    if (targetId) {
      console.log(`   Target ID: ${targetId}`);
    }

    await adminMetricsService.calculateAndSaveSnapshot(
      scope,
      targetId,
      period,
      periodValue
    );

    console.log(`\n✅ Métricas calculadas y guardadas exitosamente`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await calculateSnapshot();
  await mongoose.connection.close();
  console.log('\n✅ Proceso completado');
  process.exit(0);
};

main();

