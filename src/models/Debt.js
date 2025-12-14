const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre de la deuda es requerido'],
    trim: true
  },
  tipo: {
    type: String,
    enum: ['Personal', 'Institucional', 'Bancaria', 'Comercial'],
    required: true
  },
  categoria: {
    type: String,
    enum: ['TC', 'LC', 'Hipotecario', 'Consumo', 'Personal', 'Comercial', 'Otro'],
    trim: true
    // TC = Tarjeta de Crédito
    // LC = Línea de Crédito
    // Hipotecario = Crédito Hipotecario
    // Consumo = Crédito de Consumo
    // Personal = Deuda personal
    // Comercial = Deuda comercial
  },
  prestador: {
    type: String,
    required: [true, 'El prestador es requerido'],
    trim: true
  },
  montoTotal: {
    type: Number,
    required: function() {
      // Si no tiene abono mensual, el monto total es requerido
      return !this.abonoMensual;
    },
    min: [0, 'El monto total no puede ser negativo']
  },
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
    required: function() {
      // Si tiene monto total, el monto de cuota se calcula automáticamente
      return !!this.montoTotal;
    },
    min: [0, 'El monto de la cuota no puede ser negativo']
  },
  moneda: {
    type: String,
    enum: ['CLP', 'UF', 'USD', 'COP', 'EUR', 'Otra'],
    default: 'CLP',
    uppercase: true,
    trim: true
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
  tasaInteres: {
    type: Number,
    default: 0,
    min: [0, 'La tasa de interés no puede ser negativa']
  },
  fechaInicio: {
    type: Date,
    default: Date.now
  },
  fechaVencimiento: Date,
  estado: {
    type: String,
    enum: ['Activa', 'Pagada', 'Vencida'],
    default: 'Activa'
  },
  descripcion: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Pre-save hook para calcular montoCuota y numeroCuotas automáticamente
debtSchema.pre('save', function(next) {
  // Si tiene montoTotal y numeroCuotas, calcular montoCuota
  if (this.montoTotal && this.numeroCuotas) {
    this.montoCuota = Math.round((this.montoTotal / this.numeroCuotas) * 100) / 100;
  }
  
  // Si tiene abonoMensual pero no montoTotal, calcular numeroCuotas basado en abono
  // (esto es para deudas sin plazo definido pero con compromiso mensual)
  if (this.abonoMensual && !this.montoTotal) {
    // Si no hay monto total, asumimos que es una deuda abierta
    // El numeroCuotas puede ser null o un número estimado
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
  
  next();
});

// Indexes
debtSchema.index({ perfilID: 1 });
debtSchema.index({ perfilID: 1, estado: 1 });
debtSchema.index({ fechaVencimiento: 1 });

module.exports = mongoose.model('Debt', debtSchema);

