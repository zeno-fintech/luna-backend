const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la moneda es requerido'],
    unique: true,
    trim: true
  },
  codigo: {
    type: String,
    required: [true, 'El código de la moneda es requerido'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [3, 'El código debe tener máximo 3 caracteres']
  },
  simbolo: {
    type: String,
    trim: true
  },
  valor: {
    type: Number,
    default: 1,
    min: [0, 'El valor no puede ser negativo']
  },
  formato: {
    separadorMiles: {
      type: String,
      default: '.',
      enum: ['.', ',', ' ', ''],
      // '.' para Chile (CLP), ',' para algunos países, ' ' para otros, '' sin separador
    },
    separadorDecimales: {
      type: String,
      default: ',',
      enum: ['.', ','],
      // ',' para Chile (CLP), '.' para USD y otros
    },
    decimales: {
      type: Number,
      default: 0,
      min: 0,
      max: 4
      // 0 para CLP (sin decimales), 2 para USD, EUR, etc.
    },
    posicionSimbolo: {
      type: String,
      default: 'before',
      enum: ['before', 'after']
      // 'before' para $1.000, 'after' para 1.000€
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Currency', currencySchema);

