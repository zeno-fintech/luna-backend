const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del plan es requerido'],
    trim: true
  },
  scope: {
    type: String,
    enum: ['user_plan', 'tenant_plan'],
    required: true,
    default: 'user_plan'
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  },
  valor: {
    type: Number,
    required: [true, 'El valor del plan es requerido'],
    min: [0, 'El valor no puede ser negativo']
  },
  priceMonthly: {
    type: Number,
    min: [0, 'El precio mensual no puede ser negativo']
  },
  priceYearly: {
    type: Number,
    min: [0, 'El precio anual no puede ser negativo']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    trim: true
  },
  caracteristicas: [{
    type: String,
    trim: true
  }],
  features: {
    maxSystems: {
      type: Number,
      default: 1
    },
    maxAccounts: {
      type: Number,
      default: 5
    },
    ocrEnabled: {
      type: Boolean,
      default: false
    },
    voiceEnabled: {
      type: Boolean,
      default: false
    },
    aiInsightsEnabled: {
      type: Boolean,
      default: false
    },
    exportEnabled: {
      type: Boolean,
      default: false
    },
    adsEnabled: {
      type: Boolean,
      default: true
    },
    supportLevel: {
      type: String,
      enum: ['none', 'basic', 'priority'],
      default: 'none'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSystem: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
planSchema.index({ scope: 1 });
planSchema.index({ tenantId: 1 });
planSchema.index({ isActive: 1 });

module.exports = mongoose.model('Plan', planSchema);

