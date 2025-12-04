const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  tableroID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FinancialBoard',
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
  if (this.isNew || this.isModified('porcentaje') || this.isModified('tableroID')) {
    const FinancialBoard = require('@models/FinancialBoard');
    const board = await FinancialBoard.findById(this.tableroID);
    
    if (board) {
      // Calcular presupuesto basado en porcentaje del saldo del tablero
      // El saldo es ingresos - gastos, pero para presupuesto usamos ingresos
      this.presupuestoRegla = (board.ingresos * this.porcentaje) / 100;
      
      // Calcular monto disponible (presupuesto - gastos ya realizados en esta regla)
      const Transaction = require('@models/Transaction');
      const gastosRegla = await Transaction.find({
        tableroID: board._id,
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
  const FinancialBoard = require('@models/FinancialBoard');
  const Transaction = require('@models/Transaction');
  
  const board = await FinancialBoard.findById(this.tableroID);
  if (!board) return this;
  
  // Recalcular presupuesto
  this.presupuestoRegla = (board.ingresos * this.porcentaje) / 100;
  
  // Calcular gastos de esta regla
  const gastosRegla = await Transaction.find({
    tableroID: board._id,
    reglaID: this._id,
    tipo: 'Gasto'
  });
  
  const totalGastado = gastosRegla.reduce((sum, gasto) => sum + (gasto.monto || 0), 0);
  this.montoDisponible = Math.max(0, this.presupuestoRegla - totalGastado);
  this.saldo = this.presupuestoRegla - totalGastado;
  
  return this.save();
};

module.exports = mongoose.model('Rule', ruleSchema);

