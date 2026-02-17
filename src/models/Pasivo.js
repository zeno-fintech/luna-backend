const mongoose = require('mongoose');

/**
 * Modelo unificado de Pasivos
 * Reemplaza: Debt
 * 
 * Estructura de Patrimonio:
 * - Activos: Todo lo que posees
 * - Pasivos: Todo lo que debes (deudas: personal, institucional, bancaria, comercial)
 * - Patrimonio Neto = Activos - Pasivos
 */
const pasivoSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  
  // Identificación básica
  nombre: {
    type: String,
    required: [true, 'El nombre del pasivo es requerido'],
    trim: true
  },
  
  // Tipo de pasivo
  tipo: {
    type: String,
    enum: ['Personal', 'Institucional', 'Bancaria', 'Comercial'],
    required: true
  },
  
  // Categoría específica
  categoria: {
    type: String,
    enum: [
      // Deudas hipotecarias
      'Hipotecario',
      // Deudas automotrices
      'Automotriz',
      // Tarjetas de crédito
      'Tarjeta de Crédito',
      'TC', // Abreviación común
      // Créditos de consumo
      'Consumo',
      'Préstamo Personal',
      'Crédito Bancario',
      // Deudas con terceros
      'Deuda Familiar',
      'Deuda Amigo',
      'Personal', // Tipo genérico para compatibilidad
      // Otros
      'Línea de Crédito',
      'Comercial',
      'Otro'
    ],
    trim: true
  },
  
  // Categorización por plazo
  plazo: {
    type: String,
    enum: ['Corto Plazo', 'Largo Plazo'],
    required: true,
    default: 'Corto Plazo'
  },
  
  // Prestador/entidad a la que se debe
  prestador: {
    type: String,
    required: [true, 'El prestador es requerido'],
    trim: true
  },
  
  // Montos
  montoTotal: {
    type: Number,
    required: function() {
      // Si no tiene abono mensual, el monto total es requerido
      return !this.abonoMensual;
    },
    min: [0, 'El monto total no puede ser negativo']
  },
  saldoPendiente: {
    type: Number,
    required: true,
    min: [0, 'El saldo pendiente no puede ser negativo']
  },
  saldoPagado: {
    type: Number,
    default: 0,
    min: [0, 'El saldo pagado no puede ser negativo']
  },
  
  // Cuotas y pagos
  numeroCuotas: {
    type: Number,
    required: function() {
      // Si tiene monto total, el número de cuotas es requerido
      return !!this.montoTotal;
    },
    min: [1, 'Debe tener al menos 1 cuota']
  },
  abonoMensual: {
    type: Number,
    required: function() {
      // Si no tiene monto total, el abono mensual es requerido
      return !this.montoTotal;
    },
    min: [0, 'El abono mensual no puede ser negativo']
  },
  montoCuota: {
    type: Number,
    required: false, // Se calcula automáticamente en pre-save
    min: [0, 'El monto de la cuota no puede ser negativo']
  },
  
  // Información financiera
  tasaInteres: {
    type: Number,
    default: 0,
    min: [0, 'La tasa de interés no puede ser negativa']
  },
  moneda: {
    type: String,
    enum: ['CLP', 'UF', 'USD', 'COP', 'EUR', 'Otra'],
    default: 'CLP',
    uppercase: true,
    trim: true
  },
  
  // Fechas
  fechaInicio: {
    type: Date,
    default: Date.now
  },
  fechaVencimiento: Date,
  
  // Estado
  estado: {
    type: String,
    enum: ['Activa', 'Pagada', 'Vencida'],
    default: 'Activa'
  },
  
  // Asociación con presupuestos (array para múltiples)
  presupuestoID: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presupuesto'
  }],
  
  descripcion: {
    type: String,
    trim: true
  },
  
  // Metadata flexible para datos adicionales
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Pre-save hook para calcular montoCuota y numeroCuotas automáticamente
pasivoSchema.pre('save', function(next) {
  // Si tiene montoTotal y numeroCuotas, calcular montoCuota
  if (this.montoTotal && this.numeroCuotas) {
    this.montoCuota = Math.round((this.montoTotal / this.numeroCuotas) * 100) / 100;
  }
  
  // Si tiene abonoMensual pero no montoTotal, calcular numeroCuotas basado en abono
  if (this.abonoMensual && !this.montoTotal) {
    this.montoCuota = this.abonoMensual;
  }
  
  // Si tiene montoTotal y abonoMensual, calcular numeroCuotas
  if (this.montoTotal && this.abonoMensual) {
    this.numeroCuotas = Math.ceil(this.montoTotal / this.abonoMensual);
    this.montoCuota = this.abonoMensual;
  }
  
  // Inicializar saldoPendiente si no está definido
  if (this.isNew && !this.saldoPendiente) {
    this.saldoPendiente = this.montoTotal || 0;
  }
  
  // Auto-categorizar plazo según categoría
  if (!this.plazo || this.isModified('categoria')) {
    const categoriasLargoPlazo = ['Hipotecario', 'Automotriz'];
    this.plazo = categoriasLargoPlazo.includes(this.categoria) ? 'Largo Plazo' : 'Corto Plazo';
  }
  
  next();
});

// Indexes
pasivoSchema.index({ perfilID: 1 });
pasivoSchema.index({ perfilID: 1, tipo: 1 });
pasivoSchema.index({ perfilID: 1, estado: 1 });
pasivoSchema.index({ perfilID: 1, plazo: 1 });
pasivoSchema.index({ presupuestoID: 1 });
pasivoSchema.index({ fechaVencimiento: 1 });

module.exports = mongoose.model('Pasivo', pasivoSchema);
