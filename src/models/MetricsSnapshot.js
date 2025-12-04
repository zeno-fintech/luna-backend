const mongoose = require('mongoose');

const metricsSnapshotSchema = new mongoose.Schema({
  scope: {
    type: String,
    enum: ['tenant', 'company', 'user', 'global'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: function() {
      return this.scope !== 'global';
    }
  },
  period: {
    type: String,
    enum: ['day', 'week', 'month', 'year'],
    required: true
  },
  periodValue: {
    type: String,
    required: true
  },
  metrics: {
    // User metrics
    totalUsers: Number,
    activeUsers: Number,
    newUsers: Number,
    
    // Company metrics
    totalCompanies: Number,
    activeCompanies: Number,
    
    // Transaction metrics
    totalTransactions: Number,
    totalIncome: Number,
    totalExpenses: Number,
    netBalance: Number,
    
    // Subscription metrics
    activeSubscriptions: Number,
    mrr: Number, // Monthly Recurring Revenue
    arr: Number, // Annual Recurring Revenue
    
    // Engagement metrics
    totalProfiles: Number,
    totalAccounts: Number,
    avgTransactionsPerUser: Number,
    
    // Geographic metrics
    usersByCountry: mongoose.Schema.Types.Mixed,
    usersByPlan: mongoose.Schema.Types.Mixed,
    
    // Custom metrics (flexible JSON)
    custom: mongoose.Schema.Types.Mixed
  },
  calculatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
metricsSnapshotSchema.index({ scope: 1, targetId: 1, period: 1, periodValue: 1 }, { unique: true });
metricsSnapshotSchema.index({ scope: 1, period: 1, periodValue: 1 });
metricsSnapshotSchema.index({ calculatedAt: -1 });

module.exports = mongoose.model('MetricsSnapshot', metricsSnapshotSchema);

