/**
 * Script para inicializar países de América con sus configuraciones
 * Ejecutar: node scripts/initializeCountries.js
 * 
 * Por defecto, solo CHILE estará activo (isActive: true)
 * Los demás países estarán inactivos (isActive: false) para activarlos después
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Country = require('../src/models/Country');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const countries = [
  // Chile - ACTIVO por defecto (MVP)
  {
    nombre: 'Chile',
    codigo: 'CL',
    codigoISO: 'CL',
    monedaDefault: 'CLP',
    codigoTelefono: '+56',
    region: 'Sudamérica',
    isActive: true, // ✅ ACTIVO para MVP
    bandera: {
      icono: '🇨🇱',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+56 9 XXXX XXXX',
      zonaHoraria: 'America/Santiago'
    }
  },
  // Colombia
  {
    nombre: 'Colombia',
    codigo: 'CO',
    codigoISO: 'CO',
    monedaDefault: 'COP',
    codigoTelefono: '+57',
    region: 'Sudamérica',
    isActive: false,
    bandera: {
      icono: '🇨🇴',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+57 X XXX XXXX',
      zonaHoraria: 'America/Bogota'
    }
  },
  // Perú
  {
    nombre: 'Perú',
    codigo: 'PE',
    codigoISO: 'PE',
    monedaDefault: 'PEN',
    codigoTelefono: '+51',
    region: 'Sudamérica',
    isActive: false,
    bandera: {
      icono: '🇵🇪',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+51 9XX XXX XXX',
      zonaHoraria: 'America/Lima'
    }
  },
  // Argentina
  {
    nombre: 'Argentina',
    codigo: 'AR',
    codigoISO: 'AR',
    monedaDefault: 'ARS',
    codigoTelefono: '+54',
    region: 'Sudamérica',
    isActive: false,
    bandera: {
      icono: '🇦🇷',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+54 9 XX XXXX XXXX',
      zonaHoraria: 'America/Argentina/Buenos_Aires'
    }
  },
  // Brasil
  {
    nombre: 'Brasil',
    codigo: 'BR',
    codigoISO: 'BR',
    monedaDefault: 'BRL',
    codigoTelefono: '+55',
    region: 'Sudamérica',
    isActive: false,
    bandera: {
      icono: '🇧🇷',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+55 XX XXXXX-XXXX',
      zonaHoraria: 'America/Sao_Paulo'
    }
  },
  // Uruguay
  {
    nombre: 'Uruguay',
    codigo: 'UY',
    codigoISO: 'UY',
    monedaDefault: 'UYU',
    codigoTelefono: '+598',
    region: 'Sudamérica',
    isActive: false,
    bandera: {
      icono: '🇺🇾',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+598 XXXX XXXX',
      zonaHoraria: 'America/Montevideo'
    }
  },
  // Paraguay
  {
    nombre: 'Paraguay',
    codigo: 'PY',
    codigoISO: 'PY',
    monedaDefault: 'PYG',
    codigoTelefono: '+595',
    region: 'Sudamérica',
    isActive: false,
    bandera: {
      icono: '🇵🇾',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+595 XX XXX XXX',
      zonaHoraria: 'America/Asuncion'
    }
  },
  // Ecuador
  {
    nombre: 'Ecuador',
    codigo: 'EC',
    codigoISO: 'EC',
    monedaDefault: 'USD',
    codigoTelefono: '+593',
    region: 'Sudamérica',
    isActive: false,
    bandera: {
      icono: '🇪🇨',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+593 XX XXX XXXX',
      zonaHoraria: 'America/Guayaquil'
    }
  },
  // Panamá
  {
    nombre: 'Panamá',
    codigo: 'PA',
    codigoISO: 'PA',
    monedaDefault: 'USD',
    codigoTelefono: '+507',
    region: 'Centroamérica',
    isActive: false,
    bandera: {
      icono: '🇵🇦',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'MM/DD/YYYY',
      formatoTelefono: '+507 XXXX-XXXX',
      zonaHoraria: 'America/Panama'
    }
  },
  // Estados Unidos
  {
    nombre: 'Estados Unidos',
    codigo: 'US',
    codigoISO: 'US',
    monedaDefault: 'USD',
    codigoTelefono: '+1',
    region: 'Norteamérica',
    isActive: false,
    bandera: {
      icono: '🇺🇸',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'MM/DD/YYYY',
      formatoTelefono: '+1 (XXX) XXX-XXXX',
      zonaHoraria: 'America/New_York'
    }
  },
  // México
  {
    nombre: 'México',
    codigo: 'MX',
    codigoISO: 'MX',
    monedaDefault: 'MXN',
    codigoTelefono: '+52',
    region: 'Norteamérica',
    isActive: false,
    bandera: {
      icono: '🇲🇽',
      imagen: null
    },
    configuracion: {
      formatoFecha: 'DD/MM/YYYY',
      formatoTelefono: '+52 XX XXXX XXXX',
      zonaHoraria: 'America/Mexico_City'
    }
  }
];

const initializeCountries = async () => {
  try {
    console.log('\n🌎 Inicializando países de América...\n');

    for (const countryData of countries) {
      const existing = await Country.findOne({ codigo: countryData.codigo });
      
      if (existing) {
        // Actualizar si existe
        existing.nombre = countryData.nombre;
        existing.codigoISO = countryData.codigoISO;
        existing.monedaDefault = countryData.monedaDefault;
        existing.codigoTelefono = countryData.codigoTelefono;
        existing.region = countryData.region;
        existing.bandera = countryData.bandera;
        existing.configuracion = countryData.configuracion;
        // No actualizar isActive si ya existe (para no desactivar manualmente activados)
        if (!existing.isActive) {
          existing.isActive = countryData.isActive;
        }
        await existing.save();
        console.log(`✅ Actualizado: ${countryData.nombre} (${countryData.codigo}) - ${existing.isActive ? 'ACTIVO' : 'INACTIVO'}`);
      } else {
        // Crear nuevo
        await Country.create(countryData);
        console.log(`✅ Creado: ${countryData.nombre} (${countryData.codigo}) - ${countryData.isActive ? 'ACTIVO' : 'INACTIVO'}`);
      }
    }

    // Mostrar resumen
    const activos = await Country.countDocuments({ isActive: true });
    const inactivos = await Country.countDocuments({ isActive: false });
    
    console.log('\n📊 Resumen:');
    console.log(`   ✅ Países activos: ${activos}`);
    console.log(`   ⏸️  Países inactivos: ${inactivos}`);
    console.log('\n💡 Para activar un país, actualiza isActive: true en la base de datos\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await initializeCountries();
  await mongoose.connection.close();
  console.log('✅ Proceso completado');
  process.exit(0);
};

main();

