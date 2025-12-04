const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  scope: {
    type: String,
    enum: ['user', 'tenant', 'company'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'scopeModel'
  },
  scopeModel: {
    type: String,
    required: true,
    enum: ['User', 'Tenant', 'Company']
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'trial', 'cancelled', 'expired', 'pending'],
    default: 'active'
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  renewalType: {
    type: String,
    enum: ['monthly', 'yearly', 'one_time'],
    default: 'monthly'
  },
  billingCycle: {
    type: Number,
    default: 1
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'El monto no puede ser negativo']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
    trim: true
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  externalSubscriptionId: {
    type: String,
    trim: true
  },
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ scope: 1, targetId: 1 });
subscriptionSchema.index({ planId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);

