const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del rol es requerido'],
    trim: true,
    uppercase: true
  },
  level: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
    default: 3
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    resource: {
      type: String,
      trim: true
    },
    actions: [{
      type: String,
      enum: ['create', 'read', 'update', 'delete', 'manage']
    }]
  }],
  isSystem: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
roleSchema.index({ name: 1 }, { unique: true });
roleSchema.index({ level: 1 });

module.exports = mongoose.model('Role', roleSchema);

