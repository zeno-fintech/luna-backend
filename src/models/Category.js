const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoría es requerido'],
    trim: true,
    unique: true
  },
  icono: {
    type: String,
    trim: true
  },
  imagen: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#000000',
    trim: true
  },
  tipo: {
    type: String,
    enum: ['Ingreso', 'Gasto', 'Ambos'],
    default: 'Gasto'
  },
  isSystem: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);

