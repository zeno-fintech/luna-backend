const mongoose = require('mongoose');

const configurationSchema = new mongoose.Schema({
  usuarioID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre de la configuración es requerido'],
    trim: true
  },
  valor: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
configurationSchema.index({ usuarioID: 1, nombre: 1 }, { unique: true });

module.exports = mongoose.model('Configuration', configurationSchema);

