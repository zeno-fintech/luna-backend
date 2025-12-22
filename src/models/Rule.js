const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  presupuestoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presupuesto',
    required: true
  },
  porcentaje: {
    type: Number,
    required: [true, 'El porcentaje es requerido'],
    min: [0, 'El porcentaje no puede ser negativo'],
    max: [100, 'El porcentaje no puede ser mayor a 100']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre de la regla es requerido'],
    trim: true
  },
  color: {
    type: String,
    default: '#000000',
    trim: true
  },
  icono: {
    type: String,
    trim: true
  },
  imagen: {
    type: String,
    trim: true
  },
  montoDisponible: {
    type: Number,
    default: 0,
    min: [0, 'El monto disponible no puede ser negativo']
  },
  saldo: {
    type: Number,
    default: 0
  },
  presupuestoRegla: {
    type: Number,
    default: 0,
    min: [0, 'El presupuesto no puede ser negativo']
  }
}, {
  timestamps: true
});

// Pre-save hook para calcular presupuestoRegla y montoDisponible
ruleSchema.pre('save', async function(next) {
  const Presupuesto = require('@models/Presupuesto');
  
  if (this.isNew || this.isModified('porcentaje') || this.isModified('presupuestoID')) {
    const presupuesto = await Presupuesto.findById(this.presupuestoID);
    
    if (presupuesto) {
      // Calcular presupuesto basado en porcentaje del saldo del presupuesto
      // El saldo es ingresos - gastos, pero para presupuesto usamos ingresos
      this.presupuestoRegla = (presupuesto.ingresos * this.porcentaje) / 100;
      
      // Calcular monto disponible (presupuesto - gastos ya realizados en esta regla)
      const Transaction = require('@models/Transaction');
      const gastosRegla = await Transaction.find({
        presupuestoID: presupuesto._id,
        reglaID: this._id,
        tipo: 'Gasto'
      });
      
      const totalGastado = gastosRegla.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
      this.montoDisponible = Math.max(0, this.presupuestoRegla - totalGastado);
      this.saldo = this.presupuestoRegla - totalGastado;
    }
  }
  next();
});

// Método para recalcular monto disponible y saldo
ruleSchema.methods.recalcularMontos = async function() {
  const Presupuesto = require('@models/Presupuesto');
  const Transaction = require('@models/Transaction');
  
  const presupuesto = await Presupuesto.findById(this.presupuestoID);
  if (!presupuesto) return this;
  
  // Recalcular presupuesto
  this.presupuestoRegla = (presupuesto.ingresos * this.porcentaje) / 100;
  
  // Calcular gastos de esta regla
  const gastosRegla = await Transaction.find({
    presupuestoID: presupuesto._id,
    reglaID: this._id,
    tipo: 'Gasto'
  });
  
  const totalGastado = gastosRegla.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
  this.montoDisponible = Math.max(0, this.presupuestoRegla - totalGastado);
  this.saldo = this.presupuestoRegla - totalGastado;
  
  return this.save();
};

module.exports = mongoose.model('Rule', ruleSchema);

