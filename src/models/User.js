const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: [true, 'Por favor ingresa tu nombre'],
    trim: true
  },
  apellidos: {
    type: String,
    required: [true, 'Por favor ingresa tu apellido'],
    trim: true
  },
  correo: {
    type: String,
    required: [true, 'Por favor ingresa tu correo'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un correo válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor ingresa una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  telefono: {
    type: String,
    trim: true
  },
  condicion: {
    type: String,
    enum: ['Titular', 'Adicional'],
    default: 'Titular'
  },
  domicilio: {
    type: String,
    trim: true
  },
  id_plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: [true, 'El tenant es requerido']
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  planLevel: {
    type: String,
    enum: ['free', 'premium', 'pro'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
userSchema.index({ tenantId: 1 });
userSchema.index({ tenantId: 1, correo: 1 }, { unique: true });
userSchema.index({ companyId: 1 });
userSchema.index({ tenantId: 1, companyId: 1 });

module.exports = mongoose.model('User', userSchema);

