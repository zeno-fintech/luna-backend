const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'El tenant es requerido']
  },
  name: {
    type: String,
    required: [true, 'El nombre de la empresa es requerido'],
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  size: {
    type: Number,
    default: 0,
    min: [0, 'El tamaño no puede ser negativo']
  },
  config: {
    segments: [{
      type: String,
      trim: true
    }],
    costCenters: [{
      type: String,
      trim: true
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ tenantId: 1 });
companySchema.index({ tenantId: 1, name: 1 });
companySchema.index({ isActive: 1 });

module.exports = mongoose.model('Company', companySchema);

