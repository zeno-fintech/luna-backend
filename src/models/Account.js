const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre de la cuenta es requerido'],
    trim: true
  },
  banco: {
    type: String,
    trim: true
  },
  tipoCuenta: {
    type: String,
    enum: ['Corriente', 'Ahorro', 'Tarjeta de Crédito', 'Efectivo', 'Inversión', 'Otro'],
    default: 'Corriente'
  },
  saldoDisponible: {
    type: Number,
    default: 0,
    min: [0, 'El saldo no puede ser negativo']
  },
  favorito: {
    type: Boolean,
    default: false
  },
  moneda: {
    type: String,
    default: 'CLP',
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);

