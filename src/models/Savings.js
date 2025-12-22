const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  tipo: {
    type: String,
    enum: [
      'Fondo de Emergencia',
      'Ahorro Objetivo',
      'Inversión',
      'Prepago de Deudas',
      'Otro'
    ],
    required: true
  },
  fechaObjetivo: {
    type: Date
    // Fecha objetivo para ahorro (opcional)
  },
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto no puede ser negativo']
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  categoriaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  reglaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule'
  },
  descripcion: {
    type: String,
    trim: true
  },
  tasaRendimiento: {
    type: Number,
    default: 0,
    min: [0, 'La tasa de rendimiento no puede ser negativa']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Savings', savingsSchema);

