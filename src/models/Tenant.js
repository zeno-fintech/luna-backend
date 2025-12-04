const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del tenant es requerido'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'El slug del tenant es requerido'],
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones']
  },
  type: {
    type: String,
    enum: ['own_brand', 'partner', 'creator'],
    required: true,
    default: 'own_brand'
  },
  branding: {
    logo: {
      type: String,
      trim: true
    },
    primaryColor: {
      type: String,
      default: '#000000',
      trim: true
    },
    secondaryColor: {
      type: String,
      trim: true
    },
    domain: {
      type: String,
      trim: true
    }
  },
  defaultCurrency: {
    type: String,
    default: 'CLP',
    uppercase: true,
    trim: true
  },
  defaultCountry: {
    type: String,
    trim: true
  },
  config: {
    features: {
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
      adsEnabled: {
        type: Boolean,
        default: false
      }
    }
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
tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ type: 1 });
tenantSchema.index({ isActive: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);

