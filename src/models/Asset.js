const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  tipo: {
    type: String,
    enum: ['Efectivo', 'Inversiones', 'Propiedades', 'Vehículos', 'Otros'],
    required: true
  },
  valor: {
    type: Number,
    required: [true, 'El valor es requerido'],
    min: [0, 'El valor no puede ser negativo']
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  descripcion: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Asset', assetSchema);

