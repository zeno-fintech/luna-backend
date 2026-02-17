const mongoose = require('mongoose');

/**
 * Modelo para historial de tasaciones de activos
 * Permite registrar múltiples tasaciones a lo largo del tiempo
 * y calcular la evolución del valor en UF y CLP
 */
const assetValuationSchema = new mongoose.Schema({
  activoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activo', // Actualizado: Asset → Activo
    required: true
  },
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Valor en UF (si aplica)
  valorUF: {
    type: Number,
    min: [0, 'El valor en UF no puede ser negativo']
  },
  // Valor de 1 UF en CLP en el momento de la tasación
  valorUFEnCLP: {
    type: Number,
    min: [0, 'El valor de UF en CLP no puede ser negativo']
  },
  // Valor calculado en CLP (valorUF * valorUFEnCLP)
  valorCLP: {
    type: Number,
    min: [0, 'El valor en CLP no puede ser negativo']
  },
  // Valor directo en CLP (si no se usa UF)
  valorDirectoCLP: {
    type: Number,
    min: [0, 'El valor directo en CLP no puede ser negativo']
  },
  // Tipo de tasación
  tipoTasacion: {
    type: String,
    enum: ['Compra', 'Tasación Bancaria', 'Avalúo Fiscal', 'Tasación Comercial', 'Otro'],
    default: 'Tasación Bancaria'
  },
  // Institución que realizó la tasación
  institucion: {
    type: String,
    trim: true
    // Ej: "Santander Chile", "SII", "Tasador Independiente"
  },
  // Observaciones o notas
  observaciones: {
    type: String,
    trim: true
  },
  // Metadata adicional
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Pre-save hook para calcular valorCLP automáticamente
assetValuationSchema.pre('save', function(next) {
  // Si tiene valorUF y valorUFEnCLP, calcular valorCLP
  if (this.valorUF && this.valorUFEnCLP) {
    this.valorCLP = Math.round(this.valorUF * this.valorUFEnCLP);
  } else if (this.valorDirectoCLP) {
    // Si tiene valor directo en CLP, usarlo
    this.valorCLP = this.valorDirectoCLP;
  }
  next();
});

// Indexes
assetValuationSchema.index({ activoID: 1 });
assetValuationSchema.index({ activoID: 1, fecha: -1 }); // Para obtener historial ordenado
assetValuationSchema.index({ perfilID: 1 });

module.exports = mongoose.model('AssetValuation', assetValuationSchema);

