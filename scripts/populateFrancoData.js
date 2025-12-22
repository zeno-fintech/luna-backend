/**
 * Script para poblar la BD con datos reales de Franco Castro
 * Ejecutar: node scripts/populateFrancoData.js
 */

require('dotenv').config();
require('../src/config/aliases');

const mongoose = require('mongoose');
const User = require('@models/User');
const Profile = require('@models/Profile');
const Presupuesto = require('@models/Presupuesto');
const Rule = require('@models/Rule');
const Asset = require('@models/Asset');
const AssetValuation = require('@models/AssetValuation');
const Debt = require('@models/Debt');
const Payment = require('@models/Payment');

const USER_EMAIL = 'francocastro204@gmail.com';

async function populateFrancoData() {
  try {
    console.log('🔌 Conectando a MongoDB...\n');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 1. Buscar usuario
    console.log('👤 Buscando usuario...');
    const user = await User.findOne({ correo: USER_EMAIL });
    if (!user) {
      throw new Error(`Usuario ${USER_EMAIL} no encontrado. Por favor crea el usuario primero.`);
    }
    console.log(`   ✅ Usuario encontrado: ${user.nombres} ${user.apellidos}\n`);

    // 2. Buscar perfil
    console.log('📋 Buscando perfil...');
    const profile = await Profile.findOne({ usuarioID: user._id });
    if (!profile) {
      throw new Error('Perfil no encontrado para este usuario');
    }
    console.log(`   ✅ Perfil encontrado: ${profile.nombrePerfil}\n`);

    // 3. Crear Presupuesto Financiero "Depto"
    console.log('📊 Creando tablero financiero "Depto"...');
    const now = new Date();
    const año = now.getFullYear();
    const mes = now.getMonth() + 1;
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const id_mes = `${meses[mes - 1]}-${año}`;

    // Verificar si ya existe
    let presupuesto = await Presupuesto.findOne({
      perfilID: profile._id,
      nombre: 'Depto',
      año,
      mes
    });

    if (presupuesto) {
      console.log('   ⚠️  Presupuesto ya existe, actualizando...');
    } else {
      presupuesto = await Presupuesto.create({
        perfilID: profile._id,
        nombre: 'Depto',
        moneda: 'CLP',
        año,
        mes,
        id_mes,
        porcentajeIngresos: 100,
        ingresos: 0,
        gastos: 0,
        saldo: 0,
        color: '#3B82F6',
        icono: 'home'
      });
      console.log('   ✅ Presupuesto creado\n');
    }

    // 4. Crear reglas 50-30-20
    console.log('📐 Creando reglas 50-30-20...');
    
    // Eliminar reglas existentes del tablero
    await Rule.deleteMany({ presupuestoID: presupuesto._id });

    const reglas = [
      {
        presupuestoID: presupuesto._id,
        porcentaje: 50,
        nombre: 'Gastos Esenciales',
        color: '#10B981', // Verde
        icono: 'home'
      },
      {
        presupuestoID: presupuesto._id,
        porcentaje: 30,
        nombre: 'Gastos Extras',
        color: '#F59E0B', // Amarillo
        icono: 'shopping-cart'
      },
      {
        presupuestoID: presupuesto._id,
        porcentaje: 20,
        nombre: 'Objetivos (Salir de Deudas)',
        color: '#EF4444', // Rojo
        icono: 'target'
      }
    ];

    const reglasCreadas = await Rule.insertMany(reglas);
    presupuesto.reglas = reglasCreadas.map(r => r._id);
    await presupuesto.save();
    console.log('   ✅ Reglas creadas: 50% Esenciales, 30% Extras, 20% Objetivos\n');

    // 5. Crear Activos (Propiedades)
    console.log('🏠 Creando activos (propiedades)...');

    // Datos de la cotización
    const UF_2021 = 35000; // Valor UF en 2021 (aproximado)
    const UF_2022 = 37000; // Valor UF en 2022 (aproximado)
    const UF_ACTUAL = 29392.88; // Valor UF actual según cotización

    // Depto Principal
    const valorDeptoUF_2021 = 4334 - 303; // 4.334 - 303 (descuento) = 4.031 UF
    const valorDeptoCLP_2021 = valorDeptoUF_2021 * UF_2021; // Aproximado
    const valorDeptoUF_2022 = 5200; // Según nueva tasación
    const valorDeptoCLP_2022 = valorDeptoUF_2022 * UF_2022; // Aproximado

    const depto = await Asset.create({
      perfilID: profile._id,
      tipo: 'Propiedades',
      valor: Math.round(valorDeptoCLP_2022), // Valor actual
      moneda: 'CLP',
      fecha: new Date('2021-01-15'),
      descripcion: 'Depto Principal - AV AMERICA 755 DP 706',
      rol: '02524-00179',
      direccion: 'AV AMERICA 755 DP 706',
      comuna: 'SAN BERNARDO',
      avaluoFiscal: 65656813, // Según SII
      valorComercial: Math.round(valorDeptoCLP_2022),
      grupoPropiedad: 'depto-america-755',
      tipoPropiedad: 'Depto',
      metrosTotales: 89.94,
      metrosConstruidos: 79.7,
      numeroDormitorios: 3,
      numeroBanos: 2,
      numeroEstacionamientos: 1,
      piso: 7
    });

    // Estacionamiento
    const valorEstacUF = 350;
    const valorEstacCLP = valorEstacUF * UF_ACTUAL;
    const estacionamiento = await Asset.create({
      perfilID: profile._id,
      tipo: 'Propiedades',
      valor: Math.round(valorEstacCLP),
      moneda: 'CLP',
      fecha: new Date('2021-01-15'),
      descripcion: 'Estacionamiento - AV AMERICA 755 BD 30',
      rol: '02524-00293',
      direccion: 'AV AMERICA 755 BD 30',
      comuna: 'SAN BERNARDO',
      avaluoFiscal: 1759035,
      grupoPropiedad: 'depto-america-755',
      tipoPropiedad: 'Estacionamiento'
    });

    // Bodega
    const valorBodegaUF = 60;
    const valorBodegaCLP = valorBodegaUF * UF_ACTUAL;
    const bodega = await Asset.create({
      perfilID: profile._id,
      tipo: 'Propiedades',
      valor: Math.round(valorBodegaCLP),
      moneda: 'CLP',
      fecha: new Date('2021-01-15'),
      descripcion: 'Bodega - AV AMERICA 755 EST 85',
      rol: '02524-00409',
      direccion: 'AV AMERICA 755 EST 85',
      comuna: 'SAN BERNARDO',
      avaluoFiscal: 9953378,
      grupoPropiedad: 'depto-america-755',
      tipoPropiedad: 'Bodega'
    });

    console.log('   ✅ Activos creados: Depto, Estacionamiento, Bodega\n');

    // 6. Crear Tasaciones
    console.log('📈 Creando tasaciones...');

    // Tasación inicial (Compra 2021)
    await AssetValuation.create({
      activoID: depto._id,
      perfilID: profile._id,
      fecha: new Date('2021-01-15'),
      valorUF: valorDeptoUF_2021,
      valorUFEnCLP: UF_2021,
      tipoTasacion: 'Compra',
      institucion: 'Vendedor',
      observaciones: 'Compra inicial - Precio total del conjunto (depto + estacionamiento + bodega) = 4.444 UF'
    });

    // Tasación bancaria (2022)
    await AssetValuation.create({
      activoID: depto._id,
      perfilID: profile._id,
      fecha: new Date('2022-06-01'),
      valorUF: valorDeptoUF_2022,
      valorUFEnCLP: UF_2022,
      tipoTasacion: 'Tasación Bancaria',
      institucion: 'Santander Chile',
      observaciones: 'Tasación para crédito hipotecario - Nueva tasación del banco'
    });

    console.log('   ✅ Tasaciones creadas\n');

    // 7. Crear Deudas
    console.log('💳 Creando deudas...');

    // Crédito Hipotecario
    const montoHipotecarioUF = 3996.90;
    const montoHipotecarioCLP = montoHipotecarioUF * UF_ACTUAL;
    const saldoPendienteUF = 3692.00;
    const saldoPendienteCLP = saldoPendienteUF * UF_ACTUAL;
    const saldoPagadoUF = 304.00;
    const saldoPagadoCLP = saldoPagadoUF * UF_ACTUAL;
    const numeroCuotas = 300; // 25 años
    const cuotasPagadas = 42; // Según imagen

    const hipotecario = await Debt.create({
      perfilID: profile._id,
      nombre: 'Crédito Hipotecario - Depto',
      tipo: 'Bancaria',
      categoria: 'Hipotecario',
      prestador: 'Santander Chile',
      montoTotal: Math.round(montoHipotecarioCLP),
      numeroCuotas: numeroCuotas,
      montoCuota: Math.round(montoHipotecarioCLP / numeroCuotas),
      moneda: 'UF',
      saldoPendiente: Math.round(saldoPendienteCLP),
      saldoPagado: Math.round(saldoPagadoCLP),
      tasaInteres: 0.00316, // 0.316% mensual
      fechaInicio: new Date('2022-04-26'),
      fechaVencimiento: new Date('2047-07-01'),
      estado: 'Activa',
      descripcion: 'Crédito hipotecario para compra de depto'
    });

    // Scotiabank - Consumo (separar en TC y Crédito)
    // TC: ~2M, Crédito: ~6M
    const scotiabankTC = await Debt.create({
      perfilID: profile._id,
      nombre: 'Tarjeta de Crédito Scotiabank',
      tipo: 'Bancaria',
      categoria: 'TC',
      prestador: 'Scotiabank Chile',
      abonoMensual: 100000, // Solo abono mensual, sin monto total (revolving)
      moneda: 'CLP',
      saldoPendiente: 2000000,
      saldoPagado: 0,
      estado: 'Activa',
      descripcion: 'Tarjeta de crédito'
    });

    const scotiabankConsumo = await Debt.create({
      perfilID: profile._id,
      nombre: 'Crédito de Consumo Scotiabank',
      tipo: 'Bancaria',
      categoria: 'Consumo',
      prestador: 'Scotiabank Chile',
      montoTotal: 6000000,
      numeroCuotas: 24,
      montoCuota: 250000,
      moneda: 'CLP',
      saldoPendiente: 6000000,
      saldoPagado: 0,
      estado: 'Activa',
      descripcion: 'Crédito de consumo'
    });

    // Santander - Consumo
    const santanderConsumo = await Debt.create({
      perfilID: profile._id,
      nombre: 'Crédito de Consumo Santander',
      tipo: 'Bancaria',
      categoria: 'Consumo',
      prestador: 'Santander Chile',
      montoTotal: 1620995,
      numeroCuotas: 12,
      montoCuota: 135083,
      moneda: 'CLP',
      saldoPendiente: 1620995,
      saldoPagado: 0,
      estado: 'Activa'
    });

    // CMR Falabella
    const cmrFalabella = await Debt.create({
      perfilID: profile._id,
      nombre: 'Tarjeta de Crédito CMR Falabella',
      tipo: 'Comercial',
      categoria: 'TC',
      prestador: 'CMR Falabella',
      abonoMensual: 200000, // Solo abono mensual, sin monto total (revolving)
      moneda: 'CLP',
      saldoPendiente: 4098678,
      saldoPagado: 0,
      estado: 'Activa'
    });

    // Tenpo Payments
    const tenpo = await Debt.create({
      perfilID: profile._id,
      nombre: 'Crédito Tenpo Payments',
      tipo: 'Institucional',
      categoria: 'Consumo',
      prestador: 'Tenpo Payments S.A.',
      montoTotal: 5638821,
      numeroCuotas: 18,
      montoCuota: 313268,
      moneda: 'CLP',
      saldoPendiente: 5638821,
      saldoPagado: 0,
      estado: 'Activa'
    });

    // Deudas Personales
    // Deidad Garcia: $3M, pago mensual $30K, 4 cuotas pagadas
    const deidadGarcia = await Debt.create({
      perfilID: profile._id,
      nombre: 'Deuda Personal - Deidad Garcia',
      tipo: 'Personal',
      categoria: 'Personal',
      prestador: 'Deidad Garcia',
      montoTotal: 3000000,
      numeroCuotas: 100, // Calculado: 3M / 30K = 100 meses
      montoCuota: 30000,
      moneda: 'CLP',
      saldoPendiente: 3000000 - (30000 * 4), // 4 cuotas pagadas
      saldoPagado: 30000 * 4,
      estado: 'Activa',
      descripcion: 'Deuda personal'
    });

    // Guillermina Araya: $12M, pago mensual $150K
    const guillerminaAraya = await Debt.create({
      perfilID: profile._id,
      nombre: 'Deuda Personal - Guillermina Araya',
      tipo: 'Personal',
      categoria: 'Personal',
      prestador: 'Guillermina Araya',
      montoTotal: 12000000,
      numeroCuotas: 80, // Calculado: 12M / 150K = 80 meses
      montoCuota: 150000,
      moneda: 'CLP',
      saldoPendiente: 12000000 - (150000 * 20), // Estimado: 20 cuotas pagadas
      saldoPagado: 150000 * 20,
      estado: 'Activa',
      descripcion: 'Deuda personal'
    });

    console.log('   ✅ Deudas creadas:\n');
    console.log(`      - Crédito Hipotecario: $${Math.round(saldoPendienteCLP).toLocaleString('es-CL')} CLP`);
    console.log(`      - Scotiabank TC: $${scotiabankTC.saldoPendiente.toLocaleString('es-CL')} CLP`);
    console.log(`      - Scotiabank Consumo: $${scotiabankConsumo.saldoPendiente.toLocaleString('es-CL')} CLP`);
    console.log(`      - Santander Consumo: $${santanderConsumo.saldoPendiente.toLocaleString('es-CL')} CLP`);
    console.log(`      - CMR Falabella: $${cmrFalabella.saldoPendiente.toLocaleString('es-CL')} CLP`);
    console.log(`      - Tenpo: $${tenpo.saldoPendiente.toLocaleString('es-CL')} CLP`);
    console.log(`      - Deidad Garcia: $${deidadGarcia.saldoPendiente.toLocaleString('es-CL')} CLP`);
    console.log(`      - Guillermina Araya: $${guillerminaAraya.saldoPendiente.toLocaleString('es-CL')} CLP\n`);

    // 8. Crear algunos pagos del hipotecario
    console.log('💵 Creando pagos del crédito hipotecario...');
    const montoCuotaHipotecario = Math.round(montoHipotecarioCLP / numeroCuotas);
    
    for (let i = 1; i <= cuotasPagadas; i++) {
      const fechaPago = new Date('2022-04-26');
      fechaPago.setMonth(fechaPago.getMonth() + i);
      
      await Payment.create({
        deudaID: hipotecario._id,
        perfilID: profile._id,
        monto: montoCuotaHipotecario,
        fecha: fechaPago,
        estado: 'pagado',
        numeroCuota: i
      });
    }
    console.log(`   ✅ ${cuotasPagadas} pagos del hipotecario creados\n`);

    // Resumen final
    console.log('✅ ¡Datos poblados exitosamente!\n');
    console.log('📊 Resumen:');
    console.log(`   - Presupuesto Financiero: "Depto" (${meses[mes - 1]} ${año})`);
    console.log(`   - Reglas: 50% Esenciales, 30% Extras, 20% Objetivos`);
    console.log(`   - Activos: 3 propiedades (Depto, Estacionamiento, Bodega)`);
    console.log(`   - Tasaciones: 2 tasaciones del depto`);
    console.log(`   - Deudas: 8 deudas creadas`);
    console.log(`   - Pagos: ${cuotasPagadas} pagos del hipotecario\n`);

    await mongoose.connection.close();
    console.log('👋 Desconectado de MongoDB\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Ejecutar script
populateFrancoData();

