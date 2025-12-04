const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  tableroID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FinancialBoard'
    // Opcional: si está, va directo a ese tablero. Si no, se divide entre tableros
  },
  glosa: {
    type: String,
    required: [true, 'La glosa del ingreso es requerida'],
    trim: true
  },
  monto: {
    type: Number,
    required: [true, 'El monto del ingreso es requerido'],
    min: [0, 'El monto no puede ser negativo']
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: ['recurrente', 'ocasional'],
    default: 'ocasional'
  },
  porcentajeDistribucion: {
    type: Number,
    min: [0, 'El porcentaje no puede ser negativo'],
    max: [100, 'El porcentaje no puede ser mayor a 100']
    // Solo se usa si tableroID no está definido y hay múltiples tableros
  }
}, {
  timestamps: true
});

// Indexes
incomeSchema.index({ perfilID: 1, fecha: -1 });
incomeSchema.index({ tableroID: 1 });
incomeSchema.index({ tipo: 1 });

module.exports = mongoose.model('Income', incomeSchema);

