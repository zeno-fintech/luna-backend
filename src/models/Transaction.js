const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  tipo: {
    type: String,
    enum: ['Ingreso', 'Gasto', 'Transferencia'],
    required: true
  },
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto no puede ser negativo']
  },
  cuentaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  categoriaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  presupuestoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presupuesto'
    // Opcional: si está, el gasto pertenece a un presupuesto específico
  },
  reglaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule'
  },
  deudaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debt'
  },
  esGastoFijo: {
    type: Boolean,
    default: false
    // Si es true, se copia automáticamente al crear nuevo mes
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  detalle: {
    type: String,
    trim: true
  },
  metodoPago: {
    type: String,
    enum: ['Efectivo', 'Tarjeta de Débito', 'Tarjeta de Crédito', 'Transferencia', 'Otro'],
    default: 'Efectivo'
  },
  recurrencia: {
    type: String,
    enum: ['Ninguna', 'Diaria', 'Semanal', 'Quincenal', 'Mensual', 'Anual'],
    default: 'Ninguna'
  },
  esRecurrente: {
    type: Boolean,
    default: false
  },
  imagenRecibo: {
    type: String,
    trim: true
  },
  ocrProcessed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ perfilID: 1, fecha: -1 });
transactionSchema.index({ tipo: 1, fecha: -1 });
transactionSchema.index({ presupuestoID: 1 });
transactionSchema.index({ esGastoFijo: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);

