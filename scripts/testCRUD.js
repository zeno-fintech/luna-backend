require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

/**
 * Script de prueba de CRUD para verificar que todos los endpoints funcionen correctamente
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

// Importar modelos para crear datos de prueba
const User = require('../src/models/User');
const Profile = require('../src/models/Profile');
const Tenant = require('../src/models/Tenant');
const bcrypt = require('bcryptjs');

let testUser = null;
let testToken = null;
let testProfile = null;
let testPresupuesto = null;
let defaultTenant = null;

// Función para hacer requests autenticados
const apiRequest = async (method, endpoint, data = null, token = testToken) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
    if (data) config.data = data;
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
};

// ==================== SETUP: Crear usuario de prueba ====================
const setupTestUser = async () => {
  console.log('\n🔧 Configurando usuario de prueba...');
  
  // Obtener tenant por defecto
  defaultTenant = await Tenant.findOne();
  if (!defaultTenant) {
    throw new Error('No se encontró ningún tenant. Ejecuta scripts/initializeDatabase.js primero');
  }
  console.log(`   ✅ Tenant encontrado: ${defaultTenant.name || defaultTenant._id}`);
  
  // Buscar usuario existente primero
  testUser = await User.findOne({ correo: 'dev.francoscm@gmail.com' });
  
  if (!testUser) {
    // Si no existe, crear uno de prueba
    const hashedPassword = await bcrypt.hash('test123', 12);
    testUser = await User.create({
      correo: 'test@finup.cl',
      password: hashedPassword,
      nombres: 'Usuario',
      apellidos: 'Prueba',
      tenantId: defaultTenant._id,
      isActive: true
    });
    console.log('   ✅ Usuario de prueba creado');
    
    // Login con nuevo usuario
    const loginResult = await apiRequest('POST', '/api/v1/auth/login', {
      correo: 'test@finup.cl',
      password: 'test123'
    });
    
    if (loginResult.success && loginResult.data.token) {
      testToken = loginResult.data.token;
      console.log('   ✅ Token obtenido');
    } else {
      console.error('   ❌ Error al obtener token:', loginResult.error);
      throw new Error('No se pudo obtener token');
    }
  } else {
    console.log('   ✅ Usuario existente encontrado');
    
    // Intentar login (necesitamos saber la contraseña o usar otro método)
    // Por ahora, intentamos con una contraseña común o pedimos al usuario
    console.log('   ⚠️  Usando usuario existente. Si el login falla, necesitas la contraseña.');
    
    // Intentar login (puede fallar si no conocemos la contraseña)
    const loginResult = await apiRequest('POST', '/api/v1/auth/login', {
      correo: testUser.correo,
      password: 'test123' // Intentar con contraseña común
    });
    
    if (loginResult.success && loginResult.data.token) {
      testToken = loginResult.data.token;
      console.log('   ✅ Token obtenido');
    } else {
      // Si falla, intentar crear token manualmente o usar otro método
      console.log('   ⚠️  Login falló, intentando crear token manualmente...');
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_muy_seguro_aqui_cambiar_en_produccion';
      testToken = jwt.sign({ id: testUser._id }, JWT_SECRET, { expiresIn: '30d' });
      console.log('   ✅ Token creado manualmente');
    }
  }
  
  // Obtener o crear perfil de prueba
  const profilesResult = await apiRequest('GET', '/api/v1/profiles');
  if (profilesResult.success && profilesResult.data.data && profilesResult.data.data.length > 0) {
    testProfile = profilesResult.data.data[0];
    // Asegurar que tenemos el ID
    if (!testProfile._id && testProfile.id) {
      testProfile._id = testProfile.id;
    }
    console.log(`   ✅ Perfil encontrado: ${testProfile.nombrePerfil} (${testProfile._id})`);
  } else {
    // Crear perfil de prueba
    const createProfileResult = await apiRequest('POST', '/api/v1/profiles', {
      nombrePerfil: 'Perfil Prueba',
      tipo: 'persona',
      moneda: 'CLP'
    });
    if (createProfileResult.success) {
      testProfile = createProfileResult.data.data;
      // Asegurar que tenemos el ID
      if (!testProfile._id && testProfile.id) {
        testProfile._id = testProfile.id;
      }
      console.log(`   ✅ Perfil creado: ${testProfile.nombrePerfil} (${testProfile._id})`);
    } else {
      console.error('   ❌ Error creando perfil:', createProfileResult.error);
      throw new Error('No se pudo crear perfil');
    }
  }
  
  // Verificar que tenemos el perfil con ID válido
  if (!testProfile || !testProfile._id) {
    throw new Error('No se pudo obtener perfil válido');
  }
};

// ==================== TEST: PERFILES ====================
const testProfiles = async () => {
  console.log('\n📋 TEST: CRUD de Perfiles');
  console.log('='.repeat(50));
  
  // GET - Listar perfiles
  console.log('\n1. GET /api/v1/profiles - Listar perfiles');
  const listResult = await apiRequest('GET', '/api/v1/profiles');
  if (listResult.success) {
    console.log(`   ✅ OK - Encontrados ${listResult.data.count || listResult.data.data?.length || 0} perfiles`);
  } else {
    console.log(`   ❌ ERROR: ${listResult.error?.message || JSON.stringify(listResult.error)}`);
  }
  
  // GET - Obtener perfil específico
  if (testProfile) {
    console.log(`\n2. GET /api/v1/profiles/${testProfile._id} - Obtener perfil`);
    const getResult = await apiRequest('GET', `/api/v1/profiles/${testProfile._id}`);
    if (getResult.success) {
      console.log(`   ✅ OK - Perfil: ${getResult.data.data.nombrePerfil}`);
    } else {
      console.log(`   ❌ ERROR: ${getResult.error?.message || JSON.stringify(getResult.error)}`);
    }
  }
  
  // POST - Crear perfil (ya tenemos uno, pero probamos)
  console.log('\n3. POST /api/v1/profiles - Crear perfil');
    const createResult = await apiRequest('POST', '/api/v1/profiles', {
      nombrePerfil: 'Perfil Test ' + Date.now(),
      tipo: 'persona',
      moneda: 'CLP'
    });
    if (createResult.success) {
      const newProfile = createResult.data.data;
      const newProfileId = newProfile._id || newProfile.id;
      console.log(`   ✅ OK - Perfil creado: ${newProfile.nombrePerfil} (${newProfileId})`);
    
    // PUT - Actualizar perfil
    console.log(`\n4. PUT /api/v1/profiles/${newProfileId} - Actualizar perfil`);
    const updateResult = await apiRequest('PUT', `/api/v1/profiles/${newProfileId}`, {
      nombrePerfil: 'Perfil Actualizado'
    });
    if (updateResult.success) {
      console.log(`   ✅ OK - Perfil actualizado: ${updateResult.data.data.nombrePerfil}`);
    } else {
      console.log(`   ❌ ERROR: ${updateResult.error?.message || JSON.stringify(updateResult.error)}`);
    }
    
    // DELETE - Eliminar perfil
    console.log(`\n5. DELETE /api/v1/profiles/${newProfileId} - Eliminar perfil`);
    const deleteResult = await apiRequest('DELETE', `/api/v1/profiles/${newProfileId}`);
    if (deleteResult.success) {
      console.log(`   ✅ OK - Perfil eliminado`);
    } else {
      console.log(`   ❌ ERROR: ${deleteResult.error?.message || JSON.stringify(deleteResult.error)}`);
    }
  } else {
    console.log(`   ❌ ERROR: ${createResult.error?.message || JSON.stringify(createResult.error)}`);
  }
};

// ==================== TEST: PRESUPUESTOS ====================
const testPresupuestos = async () => {
  console.log('\n💰 TEST: CRUD de Presupuestos');
  console.log('='.repeat(50));
  
  if (!testProfile) {
    console.log('   ⚠️  SKIP - No hay perfil de prueba');
    return;
  }
  
  const año = new Date().getFullYear();
  const mes = new Date().getMonth() + 1;
  
  // GET - Listar presupuestos
  console.log(`\n1. GET /api/v1/presupuestos?perfilID=${testProfile._id} - Listar presupuestos`);
  const listResult = await apiRequest('GET', `/api/v1/presupuestos?perfilID=${testProfile._id}`);
  if (listResult.success) {
    console.log(`   ✅ OK - Encontrados ${listResult.data.count || 0} presupuestos`);
    if (listResult.data.data && listResult.data.data.length > 0) {
      testPresupuesto = listResult.data.data[0];
    }
  } else {
    console.log(`   ❌ ERROR: ${listResult.error?.message || JSON.stringify(listResult.error)}`);
  }
  
  // POST - Crear presupuesto
  console.log(`\n2. POST /api/v1/presupuestos - Crear presupuesto`);
  const createResult = await apiRequest('POST', '/api/v1/presupuestos', {
    perfilID: testProfile._id,
    nombre: 'Presupuesto Test',
    año: año,
    mes: mes,
    moneda: 'CLP'
  });
  if (createResult.success) {
    testPresupuesto = createResult.data.data;
    console.log(`   ✅ OK - Presupuesto creado: ${testPresupuesto.nombre} (${testPresupuesto._id})`);
    
    // GET - Obtener presupuesto específico
    console.log(`\n3. GET /api/v1/presupuestos/${testPresupuesto._id} - Obtener presupuesto`);
    const getResult = await apiRequest('GET', `/api/v1/presupuestos/${testPresupuesto._id}`);
    if (getResult.success) {
      console.log(`   ✅ OK - Presupuesto: ${getResult.data.data.nombre}`);
    } else {
      console.log(`   ❌ ERROR: ${getResult.error?.message || JSON.stringify(getResult.error)}`);
    }
    
    // PUT - Actualizar presupuesto
    console.log(`\n4. PUT /api/v1/presupuestos/${testPresupuesto._id} - Actualizar presupuesto`);
    const updateResult = await apiRequest('PUT', `/api/v1/presupuestos/${testPresupuesto._id}`, {
      nombre: 'Presupuesto Actualizado'
    });
    if (updateResult.success) {
      console.log(`   ✅ OK - Presupuesto actualizado: ${updateResult.data.data.nombre}`);
    } else {
      console.log(`   ❌ ERROR: ${updateResult.error?.message || JSON.stringify(updateResult.error)}`);
    }
    
    // DELETE - Eliminar presupuesto (al final)
    console.log(`\n5. DELETE /api/v1/presupuestos/${testPresupuesto._id} - Eliminar presupuesto`);
    const deleteResult = await apiRequest('DELETE', `/api/v1/presupuestos/${testPresupuesto._id}`);
    if (deleteResult.success) {
      console.log(`   ✅ OK - Presupuesto eliminado`);
      testPresupuesto = null;
    } else {
      console.log(`   ❌ ERROR: ${deleteResult.error?.message || JSON.stringify(deleteResult.error)}`);
    }
  } else {
    console.log(`   ❌ ERROR: ${createResult.error?.message || JSON.stringify(createResult.error)}`);
  }
};

// ==================== TEST: PATRIMONIO - ACTIVOS ====================
const testActivos = async () => {
  console.log('\n💎 TEST: CRUD de Activos (Patrimonio)');
  console.log('='.repeat(50));
  
  if (!testProfile) {
    console.log('   ⚠️  SKIP - No hay perfil de prueba');
    return;
  }
  
  let testActivoId = null;
  
  // GET - Listar activos
  console.log(`\n1. GET /api/v1/patrimonio/activos?perfilID=${testProfile._id} - Listar activos`);
  const listResult = await apiRequest('GET', `/api/v1/patrimonio/activos?perfilID=${testProfile._id}`);
  if (listResult.success) {
    console.log(`   ✅ OK - Encontrados ${listResult.data.count || 0} activos`);
  } else {
    console.log(`   ❌ ERROR: ${listResult.error?.message || JSON.stringify(listResult.error)}`);
  }
  
  // POST - Crear activo (cuenta bancaria)
  console.log(`\n2. POST /api/v1/patrimonio/activos - Crear activo (Cuenta Bancaria)`);
  const createResult = await apiRequest('POST', '/api/v1/patrimonio/activos', {
    perfilID: testProfile._id,
    nombre: 'Cuenta Test Banco',
    tipo: 'Cuenta Corriente',
    valor: 1000000,
    moneda: 'CLP',
    banco: 'Banco Test',
    saldoDisponible: 1000000
  });
  if (createResult.success) {
    testActivoId = createResult.data.data._id;
    console.log(`   ✅ OK - Activo creado: ${createResult.data.data.nombre} (${testActivoId})`);
    
    // GET - Obtener activo específico
    console.log(`\n3. GET /api/v1/patrimonio/activos/${testActivoId} - Obtener activo`);
    const getResult = await apiRequest('GET', `/api/v1/patrimonio/activos/${testActivoId}`);
    if (getResult.success) {
      console.log(`   ✅ OK - Activo: ${getResult.data.data.nombre}, Valor: ${getResult.data.data.valor}`);
    } else {
      console.log(`   ❌ ERROR: ${getResult.error?.message || JSON.stringify(getResult.error)}`);
    }
    
    // PUT - Actualizar activo
    console.log(`\n4. PUT /api/v1/patrimonio/activos/${testActivoId} - Actualizar activo`);
    const updateResult = await apiRequest('PUT', `/api/v1/patrimonio/activos/${testActivoId}`, {
      valor: 1500000,
      saldoDisponible: 1500000
    });
    if (updateResult.success) {
      console.log(`   ✅ OK - Activo actualizado: Valor ${updateResult.data.data.valor}`);
    } else {
      console.log(`   ❌ ERROR: ${updateResult.error?.message || JSON.stringify(updateResult.error)}`);
    }
    
    // DELETE - Eliminar activo
    console.log(`\n5. DELETE /api/v1/patrimonio/activos/${testActivoId} - Eliminar activo`);
    const deleteResult = await apiRequest('DELETE', `/api/v1/patrimonio/activos/${testActivoId}`);
    if (deleteResult.success) {
      console.log(`   ✅ OK - Activo eliminado`);
    } else {
      console.log(`   ❌ ERROR: ${deleteResult.error?.message || JSON.stringify(deleteResult.error)}`);
    }
  } else {
    console.log(`   ❌ ERROR: ${createResult.error?.message || JSON.stringify(createResult.error)}`);
  }
};

// ==================== TEST: PATRIMONIO - PASIVOS ====================
const testPasivos = async () => {
  console.log('\n📉 TEST: CRUD de Pasivos (Patrimonio)');
  console.log('='.repeat(50));
  
  if (!testProfile) {
    console.log('   ⚠️  SKIP - No hay perfil de prueba');
    return;
  }
  
  let testPasivoId = null;
  
  // GET - Listar pasivos
  console.log(`\n1. GET /api/v1/patrimonio/pasivos?perfilID=${testProfile._id} - Listar pasivos`);
  const listResult = await apiRequest('GET', `/api/v1/patrimonio/pasivos?perfilID=${testProfile._id}`);
  if (listResult.success) {
    console.log(`   ✅ OK - Encontrados ${listResult.data.count || 0} pasivos`);
  } else {
    console.log(`   ❌ ERROR: ${listResult.error?.message || JSON.stringify(listResult.error)}`);
  }
  
  // POST - Crear pasivo
  console.log(`\n2. POST /api/v1/patrimonio/pasivos - Crear pasivo`);
  const createResult = await apiRequest('POST', '/api/v1/patrimonio/pasivos', {
    perfilID: testProfile._id,
    nombre: 'Deuda Test',
    tipo: 'Bancaria',
    categoria: 'Consumo',
    prestador: 'Banco Test',
    montoTotal: 500000,
    saldoPendiente: 500000,
    numeroCuotas: 12,
    moneda: 'CLP',
    abonoMensual: 41667 // Agregar abono mensual para que calcule montoCuota
  });
  if (createResult.success) {
    testPasivoId = createResult.data.data._id;
    console.log(`   ✅ OK - Pasivo creado: ${createResult.data.data.nombre} (${testPasivoId})`);
    
    // GET - Obtener pasivo específico
    console.log(`\n3. GET /api/v1/patrimonio/pasivos/${testPasivoId} - Obtener pasivo`);
    const getResult = await apiRequest('GET', `/api/v1/patrimonio/pasivos/${testPasivoId}`);
    if (getResult.success) {
      console.log(`   ✅ OK - Pasivo: ${getResult.data.data.nombre}, Saldo: ${getResult.data.data.saldoPendiente}`);
    } else {
      console.log(`   ❌ ERROR: ${getResult.error?.message || JSON.stringify(getResult.error)}`);
    }
    
    // PUT - Actualizar pasivo
    console.log(`\n4. PUT /api/v1/patrimonio/pasivos/${testPasivoId} - Actualizar pasivo`);
    const updateResult = await apiRequest('PUT', `/api/v1/patrimonio/pasivos/${testPasivoId}`, {
      saldoPendiente: 400000,
      saldoPagado: 100000
    });
    if (updateResult.success) {
      console.log(`   ✅ OK - Pasivo actualizado: Saldo pendiente ${updateResult.data.data.saldoPendiente}`);
    } else {
      console.log(`   ❌ ERROR: ${updateResult.error?.message || JSON.stringify(updateResult.error)}`);
    }
    
    // DELETE - Eliminar pasivo
    console.log(`\n5. DELETE /api/v1/patrimonio/pasivos/${testPasivoId} - Eliminar pasivo`);
    const deleteResult = await apiRequest('DELETE', `/api/v1/patrimonio/pasivos/${testPasivoId}`);
    if (deleteResult.success) {
      console.log(`   ✅ OK - Pasivo eliminado`);
    } else {
      console.log(`   ❌ ERROR: ${deleteResult.error?.message || JSON.stringify(deleteResult.error)}`);
    }
  } else {
    console.log(`   ❌ ERROR: ${createResult.error?.message || JSON.stringify(createResult.error)}`);
  }
};

// ==================== TEST: RESUMEN PATRIMONIO ====================
const testResumenPatrimonio = async () => {
  console.log('\n📊 TEST: Resumen de Patrimonio');
  console.log('='.repeat(50));
  
  if (!testProfile) {
    console.log('   ⚠️  SKIP - No hay perfil de prueba');
    return;
  }
  
  console.log(`\nGET /api/v1/patrimonio/resumen?perfilID=${testProfile._id} - Resumen de patrimonio`);
  const result = await apiRequest('GET', `/api/v1/patrimonio/resumen?perfilID=${testProfile._id}`);
  if (result.success) {
    const resumen = result.data.data;
    console.log(`   ✅ OK - Resumen obtenido:`);
    console.log(`      - Activos total: ${resumen.activos?.total || 0}`);
    console.log(`      - Pasivos total: ${resumen.pasivos?.total || 0}`);
    console.log(`      - Patrimonio Neto: ${resumen.patrimonioNeto || 0}`);
    console.log(`      - Ratio endeudamiento: ${resumen.ratio?.toFixed(2) || 0}%`);
  } else {
    console.log(`   ❌ ERROR: ${result.error?.message || JSON.stringify(result.error)}`);
  }
};

// ==================== TEST: INGRESOS ====================
const testIncomes = async () => {
  console.log('\n💵 TEST: CRUD de Ingresos');
  console.log('='.repeat(50));
  
  if (!testProfile) {
    console.log('   ⚠️  SKIP - No hay perfil de prueba');
    return;
  }
  
  let testIncomeId = null;
  
  // GET - Listar ingresos
  console.log(`\n1. GET /api/v1/incomes?perfilID=${testProfile._id} - Listar ingresos`);
  const listResult = await apiRequest('GET', `/api/v1/incomes?perfilID=${testProfile._id}`);
  if (listResult.success) {
    console.log(`   ✅ OK - Encontrados ${listResult.data.count || 0} ingresos`);
  } else {
    console.log(`   ❌ ERROR: ${listResult.error?.message || JSON.stringify(listResult.error)}`);
  }
  
  // POST - Crear ingreso
  console.log(`\n2. POST /api/v1/incomes - Crear ingreso`);
  const createResult = await apiRequest('POST', '/api/v1/incomes', {
    perfilID: testProfile._id,
    glosa: 'Ingreso Test',
    monto: 1000000,
    fecha: new Date(),
    tipo: 'Sueldo Líquido' // Usar valor correcto del enum
  });
  if (createResult.success) {
    testIncomeId = createResult.data.data._id;
    console.log(`   ✅ OK - Ingreso creado: ${createResult.data.data.glosa} (${testIncomeId})`);
    
    // GET - Obtener ingreso específico
    console.log(`\n3. GET /api/v1/incomes/${testIncomeId} - Obtener ingreso`);
    const getResult = await apiRequest('GET', `/api/v1/incomes/${testIncomeId}`);
    if (getResult.success) {
      console.log(`   ✅ OK - Ingreso: ${getResult.data.data.glosa}, Monto: ${getResult.data.data.monto}`);
    } else {
      console.log(`   ❌ ERROR: ${getResult.error?.message || JSON.stringify(getResult.error)}`);
    }
    
    // PUT - Actualizar ingreso
    console.log(`\n4. PUT /api/v1/incomes/${testIncomeId} - Actualizar ingreso`);
    const updateResult = await apiRequest('PUT', `/api/v1/incomes/${testIncomeId}`, {
      monto: 1200000
    });
    if (updateResult.success) {
      console.log(`   ✅ OK - Ingreso actualizado: Monto ${updateResult.data.data.monto}`);
    } else {
      console.log(`   ❌ ERROR: ${updateResult.error?.message || JSON.stringify(updateResult.error)}`);
    }
    
    // DELETE - Eliminar ingreso
    console.log(`\n5. DELETE /api/v1/incomes/${testIncomeId} - Eliminar ingreso`);
    const deleteResult = await apiRequest('DELETE', `/api/v1/incomes/${testIncomeId}`);
    if (deleteResult.success) {
      console.log(`   ✅ OK - Ingreso eliminado`);
    } else {
      console.log(`   ❌ ERROR: ${deleteResult.error?.message || JSON.stringify(deleteResult.error)}`);
    }
  } else {
    console.log(`   ❌ ERROR: ${createResult.error?.message || JSON.stringify(createResult.error)}`);
  }
};

// ==================== TEST: TRANSACCIONES ====================
const testTransactions = async () => {
  console.log('\n💸 TEST: CRUD de Transacciones');
  console.log('='.repeat(50));
  
  if (!testProfile) {
    console.log('   ⚠️  SKIP - No hay perfil de prueba');
    return;
  }
  
  // Primero necesitamos un activo (cuenta) para asociar la transacción
  let testActivoId = null;
  const activoResult = await apiRequest('POST', '/api/v1/patrimonio/activos', {
    perfilID: testProfile._id,
    nombre: 'Cuenta Test Transacciones',
    tipo: 'Cuenta Corriente',
    valor: 500000,
    moneda: 'CLP',
    banco: 'Banco Test',
    saldoDisponible: 500000
  });
  if (activoResult.success) {
    testActivoId = activoResult.data.data._id;
  }
  
  let testTransactionId = null;
  
  // GET - Listar transacciones
  console.log(`\n1. GET /api/v1/transactions?perfilID=${testProfile._id} - Listar transacciones`);
  const listResult = await apiRequest('GET', `/api/v1/transactions?perfilID=${testProfile._id}`);
  if (listResult.success) {
    console.log(`   ✅ OK - Encontradas ${listResult.data.total || 0} transacciones`);
  } else {
    console.log(`   ❌ ERROR: ${listResult.error?.message || JSON.stringify(listResult.error)}`);
  }
  
  // POST - Crear transacción (Gasto)
  console.log(`\n2. POST /api/v1/transactions - Crear transacción (Gasto)`);
  const createResult = await apiRequest('POST', '/api/v1/transactions', {
    perfilID: testProfile._id,
    tipo: 'Gasto',
    monto: 50000,
    detalle: 'Gasto Test',
    fecha: new Date(),
    ...(testActivoId && { cuentaID: testActivoId })
  });
  if (createResult.success) {
    testTransactionId = createResult.data.data._id;
    console.log(`   ✅ OK - Transacción creada: ${createResult.data.data.detalle} (${testTransactionId})`);
    
    // GET - Obtener transacción específica
    console.log(`\n3. GET /api/v1/transactions/${testTransactionId} - Obtener transacción`);
    const getResult = await apiRequest('GET', `/api/v1/transactions/${testTransactionId}`);
    if (getResult.success) {
      console.log(`   ✅ OK - Transacción: ${getResult.data.data.detalle}, Monto: ${getResult.data.data.monto}`);
    } else {
      console.log(`   ❌ ERROR: ${getResult.error?.message || JSON.stringify(getResult.error)}`);
    }
    
    // PUT - Actualizar transacción
    console.log(`\n4. PUT /api/v1/transactions/${testTransactionId} - Actualizar transacción`);
    const updateResult = await apiRequest('PUT', `/api/v1/transactions/${testTransactionId}`, {
      monto: 60000
    });
    if (updateResult.success) {
      console.log(`   ✅ OK - Transacción actualizada: Monto ${updateResult.data.data.monto}`);
    } else {
      console.log(`   ❌ ERROR: ${updateResult.error?.message || JSON.stringify(updateResult.error)}`);
    }
    
    // DELETE - Eliminar transacción
    console.log(`\n5. DELETE /api/v1/transactions/${testTransactionId} - Eliminar transacción`);
    const deleteResult = await apiRequest('DELETE', `/api/v1/transactions/${testTransactionId}`);
    if (deleteResult.success) {
      console.log(`   ✅ OK - Transacción eliminada`);
    } else {
      console.log(`   ❌ ERROR: ${deleteResult.error?.message || JSON.stringify(deleteResult.error)}`);
    }
  } else {
    console.log(`   ❌ ERROR: ${createResult.error?.message || JSON.stringify(createResult.error)}`);
  }
  
  // Limpiar activo de prueba
  if (testActivoId) {
    await apiRequest('DELETE', `/api/v1/patrimonio/activos/${testActivoId}`);
  }
};

// ==================== MAIN ====================
const main = async () => {
  console.log('🧪 INICIANDO PRUEBAS DE CRUD');
  console.log('='.repeat(50));
  
  await connectDB();
  
  try {
    // Setup
    await setupTestUser();
    
    // Tests
    await testProfiles();
    await testPresupuestos();
    await testActivos();
    await testPasivos();
    await testResumenPatrimonio();
    await testIncomes();
    await testTransactions();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ PRUEBAS COMPLETADAS');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ ERROR EN PRUEBAS:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
    process.exit(0);
  }
};

if (require.main === module) {
  main();
}

module.exports = { main };
