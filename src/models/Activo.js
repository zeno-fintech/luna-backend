const mongoose = require('mongoose');

/**
 * Modelo unificado de Activos
 * Reemplaza: Account, Asset, Savings
 * 
 * Estructura de Patrimonio:
 * - Activos: Todo lo que posees (cuentas bancarias, propiedades, vehículos, inversiones, efectivo, otros)
 * - Pasivos: Todo lo que debes (deudas)
 * - Patrimonio Neto = Activos - Pasivos
 */
const activoSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  
  // Identificación básica
  nombre: {
    type: String,
    required: [true, 'El nombre del activo es requerido'],
    trim: true
  },
  
  // Tipo de activo (determina qué campos adicionales se usan)
  tipo: {
    type: String,
    enum: [
      // Cuentas bancarias y efectivo (de Account)
      'Cuenta Corriente',
      'Cuenta Ahorro',
      'Tarjeta de Crédito',
      'Efectivo',
      
      // Inversiones (de Asset y Savings)
      'Acciones',
      'Bonos',
      'Fondo Mutuo',
      'Fondo Mutuo Corto Plazo',
      'Criptomonedas',
      'Depósito a Plazo',
      'Fondo de Emergencia',
      'Ahorro Objetivo',
      'Prepago de Deudas',
      
      // Bienes Raíces (de Asset)
      'Casa Propia',
      'Departamento',
      'Terreno',
      'Propiedad Inversión',
      'Propiedades', // Tipo genérico para compatibilidad
      
      // Vehículos (de Asset)
      'Auto',
      'Moto',
      
      // Otros (de Asset y Savings)
      'Joyas',
      'Obras de Arte',
      'Equipamiento',
      'Otro'
    ],
    required: true
  },
  
  // Categorización contable
  categoria: {
    type: String,
    enum: ['Líquido', 'Inversión', 'Bien Raíz', 'Vehículo', 'Otro'],
    required: true,
    default: 'Otro'
  },
  
  // Categorización por liquidez
  liquidez: {
    type: String,
    enum: ['Corriente', 'No Corriente'],
    required: true,
    default: 'Corriente'
  },
  
  // Categorización por plazo
  plazo: {
    type: String,
    enum: ['Corto Plazo', 'Largo Plazo'],
    required: true,
    default: 'Corto Plazo'
  },
  
  // Valor del activo
  valor: {
    type: Number,
    required: [true, 'El valor es requerido'],
    min: [0, 'El valor no puede ser negativo']
  },
  
  // Moneda
  moneda: {
    type: String,
    enum: ['CLP', 'UF', 'USD', 'COP', 'EUR', 'Otra'],
    default: 'CLP',
    uppercase: true,
    trim: true
  },
  
  // Asociación con presupuestos (array para múltiples)
  presupuestoID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presupuesto'
  }],
  
  // Fecha de registro/valoración
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  descripcion: {
    type: String,
    trim: true
  },
  
  // ===== CAMPOS ESPECÍFICOS PARA CUENTAS BANCARIAS =====
  banco: {
    type: String,
    trim: true
  },
  saldoDisponible: {
    type: Number,
    min: [0, 'El saldo disponible no puede ser negativo']
  },
  tipoCuenta: {
    type: String,
    enum: ['Corriente', 'Ahorro', 'Tarjeta de Crédito', 'Efectivo', 'Inversión', 'Otro']
  },
  favorito: {
    type: Boolean,
    default: false
  },
  
  // ===== CAMPOS ESPECÍFICOS PARA PROPIEDADES =====
  rol: {
    type: String,
    trim: true
    // Número de rol del SII (ej: "02524-00179")
  },
  direccion: {
    type: String,
    trim: true
  },
  comuna: {
    type: String,
    trim: true
  },
  avaluoFiscal: {
    type: Number,
    min: [0, 'El avalúo fiscal no puede ser negativo']
  },
  valorComercial: {
    type: Number,
    min: [0, 'El valor comercial no puede ser negativo']
  },
  grupoPropiedad: {
    type: String,
    trim: true
    // Para agrupar propiedades relacionadas (ej: "depto-america-755")
  },
  tipoPropiedad: {
    type: String,
    enum: ['Depto', 'Casa', 'Parcela', 'Local Comercial', 'Oficina', 'Bodega', 'Estacionamiento', 'Otro'],
    trim: true
  },
  metrosTotales: {
    type: Number,
    min: [0, 'Los metros totales no pueden ser negativos']
  },
  metrosConstruidos: {
    type: Number,
    min: [0, 'Los metros construidos no pueden ser negativos']
  },
  metrosTerreno: {
    type: Number,
    min: [0, 'Los metros de terreno no pueden ser negativos']
  },
  numeroDormitorios: {
    type: Number,
    min: [0, 'El número de dormitorios no puede ser negativo']
  },
  numeroBanos: {
    type: Number,
    min: [0, 'El número de baños no puede ser negativo']
  },
  numeroEstacionamientos: {
    type: Number,
    min: [0, 'El número de estacionamientos no puede ser negativo']
  },
  piso: {
    type: Number
  },
  
  // ===== CAMPOS ESPECÍFICOS PARA VEHÍCULOS =====
  marca: {
    type: String,
    trim: true
  },
  modelo: {
    type: String,
    trim: true
  },
  año: {
    type: Number,
    min: [1900, 'El año debe ser válido'],
    max: [new Date().getFullYear() + 1, 'El año no puede ser futuro']
  },
  kilometraje: {
    type: Number,
    min: [0, 'El kilometraje no puede ser negativo']
  },
  patente: {
    type: String,
    trim: true,
    uppercase: true
  },
  color: {
    type: String,
    trim: true
  },
  
  // ===== CAMPOS ESPECÍFICOS PARA AHORROS/INVERSIONES =====
  fechaObjetivo: {
    type: Date
    // Fecha objetivo para ahorro (opcional)
  },
  tasaRendimiento: {
    type: Number,
    default: 0,
    min: [0, 'La tasa de rendimiento no puede ser negativa']
  },
  categoriaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  reglaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule'
  },
  
  // Metadata flexible para datos adicionales
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Pre-save hook para auto-categorizar según tipo
activoSchema.pre('save', function(next) {
  // Auto-categorizar por tipo si no está definido
  if (!this.categoria || this.isModified('tipo')) {
    const tipoCategoriaMap = {
      // Líquidos
      'Cuenta Corriente': 'Líquido',
      'Cuenta Ahorro': 'Líquido',
      'Efectivo': 'Líquido',
      'Fondo Mutuo Corto Plazo': 'Líquido',
      
      // Inversiones
      'Acciones': 'Inversión',
      'Bonos': 'Inversión',
      'Fondo Mutuo': 'Inversión',
      'Criptomonedas': 'Inversión',
      'Depósito a Plazo': 'Inversión',
      'Fondo de Emergencia': 'Inversión',
      'Ahorro Objetivo': 'Inversión',
      'Prepago de Deudas': 'Inversión',
      
      // Bienes Raíces
      'Casa Propia': 'Bien Raíz',
      'Departamento': 'Bien Raíz',
      'Terreno': 'Bien Raíz',
      'Propiedad Inversión': 'Bien Raíz',
      
      // Vehículos
      'Auto': 'Vehículo',
      'Moto': 'Vehículo',
      
      // Otros
      'Tarjeta de Crédito': 'Otro',
      'Joyas': 'Otro',
      'Obras de Arte': 'Otro',
      'Equipamiento': 'Otro',
      'Otro': 'Otro'
    };
    
    this.categoria = tipoCategoriaMap[this.tipo] || 'Otro';
  }
  
  // Auto-categorizar liquidez
  if (!this.liquidez || this.isModified('tipo')) {
    const tiposLiquidos = [
      'Cuenta Corriente', 'Cuenta Ahorro', 'Efectivo', 
      'Fondo Mutuo Corto Plazo', 'Tarjeta de Crédito'
    ];
    this.liquidez = tiposLiquidos.includes(this.tipo) ? 'Corriente' : 'No Corriente';
  }
  
  // Auto-categorizar plazo
  if (!this.plazo || this.isModified('tipo')) {
    const tiposCortoPlazo = [
      'Cuenta Corriente', 'Cuenta Ahorro', 'Efectivo',
      'Fondo Mutuo Corto Plazo', 'Tarjeta de Crédito', 'Depósito a Plazo'
    ];
    this.plazo = tiposCortoPlazo.includes(this.tipo) ? 'Corto Plazo' : 'Largo Plazo';
  }
  
  // Para cuentas bancarias, usar saldoDisponible como valor si no está definido
  if (['Cuenta Corriente', 'Cuenta Ahorro', 'Efectivo'].includes(this.tipo)) {
    if (this.saldoDisponible !== undefined && (!this.valor || this.valor === 0)) {
      this.valor = this.saldoDisponible;
    } else if (this.valor && !this.saldoDisponible) {
      this.saldoDisponible = this.valor;
    }
  }
  
  next();
});

// Indexes para búsquedas eficientes
activoSchema.index({ perfilID: 1 });
activoSchema.index({ perfilID: 1, tipo: 1 });
activoSchema.index({ perfilID: 1, categoria: 1 });
activoSchema.index({ perfilID: 1, liquidez: 1 });
activoSchema.index({ perfilID: 1, plazo: 1 });
activoSchema.index({ presupuestoID: 1 });
activoSchema.index({ grupoPropiedad: 1 });
activoSchema.index({ rol: 1 });

module.exports = mongoose.model('Activo', activoSchema);
