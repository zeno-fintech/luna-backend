/**
 * Script para inicializar monedas con sus formatos
 * Ejecutar: node scripts/initializeCurrencies.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Currency = require('../src/models/Currency');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const currencies = [
  // Chile
  {
    nombre: 'Peso Chileno',
    codigo: 'CLP',
    simbolo: '$',
    isActive: true, // ✅ ACTIVO para MVP
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 0,
      posicionSimbolo: 'before'
    }
  },
  {
    nombre: 'Unidad de Fomento',
    codigo: 'UF',
    simbolo: 'UF',
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 2,
      posicionSimbolo: 'before'
    }
  },
  // Estados Unidos / Ecuador / Panamá
  {
    nombre: 'Dólar Estadounidense',
    codigo: 'USD',
    simbolo: '$',
    isActive: true, // ✅ ACTIVO para MVP
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 2,
      posicionSimbolo: 'before'
    }
  },
  // Colombia
  {
    nombre: 'Peso Colombiano',
    codigo: 'COP',
    simbolo: '$',
    isActive: false, // ⏸️ INACTIVO (activar cuando se expanda a Colombia)
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 0,
      posicionSimbolo: 'before'
    }
  },
  // Perú
  {
    nombre: 'Sol Peruano',
    codigo: 'PEN',
    simbolo: 'S/',
    isActive: false, // ⏸️ INACTIVO
    formato: {
      separadorMiles: ',',
      separadorDecimales: '.',
      decimales: 2,
      posicionSimbolo: 'before'
    }
  },
  // Argentina
  {
    nombre: 'Peso Argentino',
    codigo: 'ARS',
    simbolo: '$',
    isActive: false, // ⏸️ INACTIVO
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 2,
      posicionSimbolo: 'before'
    }
  },
  // Brasil
  {
    nombre: 'Real Brasileño',
    codigo: 'BRL',
    simbolo: 'R$',
    isActive: false, // ⏸️ INACTIVO
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 2,
      posicionSimbolo: 'before'
    }
  },
  // Uruguay
  {
    nombre: 'Peso Uruguayo',
    codigo: 'UYU',
    simbolo: '$',
    isActive: false, // ⏸️ INACTIVO
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 2,
      posicionSimbolo: 'before'
    }
  },
  // Paraguay
  {
    nombre: 'Guaraní Paraguayo',
    codigo: 'PYG',
    simbolo: '₲',
    isActive: false, // ⏸️ INACTIVO
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 0,
      posicionSimbolo: 'before'
    }
  },
  // Europa (por si acaso)
  {
    nombre: 'Euro',
    codigo: 'EUR',
    simbolo: '€',
    isActive: false, // ⏸️ INACTIVO
    formato: {
      separadorMiles: '.',
      separadorDecimales: ',',
      decimales: 2,
      posicionSimbolo: 'after'
    }
  }
];

const initializeCurrencies = async () => {
  try {
    console.log('\n📊 Inicializando monedas...\n');

    for (const currencyData of currencies) {
      const existing = await Currency.findOne({ codigo: currencyData.codigo });
      
      if (existing) {
        // Actualizar formato si existe
        existing.formato = currencyData.formato;
        existing.simbolo = currencyData.simbolo;
        existing.nombre = currencyData.nombre;
        // No actualizar isActive si ya existe (para no desactivar manualmente activados)
        if (currencyData.isActive !== undefined && !existing.isActive) {
          existing.isActive = currencyData.isActive;
        }
        await existing.save();
        console.log(`✅ Actualizada: ${currencyData.codigo} - ${currencyData.nombre} - ${existing.isActive ? 'ACTIVA' : 'INACTIVA'}`);
      } else {
        // Crear nueva
        const created = await Currency.create(currencyData);
        console.log(`✅ Creada: ${currencyData.codigo} - ${currencyData.nombre} - ${created.isActive ? 'ACTIVA' : 'INACTIVA'}`);
      }
    }

    // Mostrar resumen
    const activas = await Currency.countDocuments({ isActive: true });
    const inactivas = await Currency.countDocuments({ isActive: false });
    
    console.log('\n📊 Resumen:');
    console.log(`   ✅ Monedas activas: ${activas}`);
    console.log(`   ⏸️  Monedas inactivas: ${inactivas}`);
    console.log('\n💡 Para activar una moneda, actualiza isActive: true en la base de datos\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await initializeCurrencies();
  await mongoose.connection.close();
  console.log('✅ Proceso completado');
  process.exit(0);
};

main();

