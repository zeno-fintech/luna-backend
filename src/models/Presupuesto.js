const mongoose = require('mongoose');

const presupuestoSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del presupuesto es requerido'],
    trim: true
  },
  icono: {
    type: String,
    trim: true
    // Icono del presupuesto (puede ser sugerido por IA basado en el nombre)
  },
  imagen: {
    type: String,
    trim: true
    // Imagen del presupuesto (opcional)
  },
  color: {
    type: String,
    default: '#3B82F6',
    trim: true
    // Color primario del presupuesto (hex, default: azul)
  },
  moneda: {
    type: String,
    trim: true,
    uppercase: true,
    default: 'CLP',
    maxlength: [3, 'El código de moneda debe tener máximo 3 caracteres']
  },
  ingresos: {
    type: Number,
    default: 0,
    min: [0, 'Los ingresos no pueden ser negativos']
  },
  gastos: {
    type: Number,
    default: 0,
    min: [0, 'Los gastos no pueden ser negativos']
  },
  saldo: {
    type: Number,
    default: 0
  },
  id_mes: {
    type: String,
    required: true,
    trim: true
  },
  año: {
    type: Number,
    required: true
  },
  mes: {
    type: Number,
    required: true,
    min: [1, 'El mes debe ser entre 1 y 12'],
    max: [12, 'El mes debe ser entre 1 y 12']
  },
  porcentajeIngresos: {
    type: Number,
    default: 100,
    min: [0, 'El porcentaje no puede ser negativo'],
    max: [100, 'El porcentaje no puede ser mayor a 100']
  },
  reglas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rule'
  }]
}, {
  timestamps: true
});

// Pre-save hook para calcular saldo automáticamente
presupuestoSchema.pre('save', function(next) {
  this.saldo = this.ingresos - this.gastos;
  next();
});

// Método para actualizar ingresos y gastos desde transacciones
presupuestoSchema.methods.recalcularTotales = async function() {
  const Transaction = require('@models/Transaction');
  const Income = require('@models/Income');
  
  // Calcular ingresos desde Income
  const ingresos = await Income.find({ presupuestoID: this._id });
  this.ingresos = ingresos.reduce((sum, ing) => sum + (ing.monto || 0), 0);
  
  // Calcular gastos desde Transaction
  const gastos = await Transaction.find({ 
    presupuestoID: this._id,
    tipo: 'Gasto'
  });
  this.gastos = gastos.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
  
  // Calcular saldo
  this.saldo = this.ingresos - this.gastos;
  
  return this.save();
};

// Index for better query performance
presupuestoSchema.index({ perfilID: 1, id_mes: 1, año: 1 });
presupuestoSchema.index({ perfilID: 1, mes: 1, año: 1 });

module.exports = mongoose.model('Presupuesto', presupuestoSchema);

