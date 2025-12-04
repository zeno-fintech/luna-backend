const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  periodo: {
    type: String,
    enum: ['Mes', 'Año'],
    required: true
  },
  categoria: {
    type: String,
    enum: ['Ingresos', 'Gastos'],
    required: true
  },
  montoPresupuestado: {
    type: Number,
    required: [true, 'El monto presupuestado es requerido'],
    min: [0, 'El monto no puede ser negativo']
  },
  montoReal: {
    type: Number,
    default: 0,
    min: [0, 'El monto real no puede ser negativo']
  },
  desviacion: {
    type: Number,
    default: 0
  },
  mes: {
    type: Number,
    min: [1, 'El mes debe ser entre 1 y 12'],
    max: [12, 'El mes debe ser entre 1 y 12']
  },
  año: {
    type: Number,
    required: true
  },
  categoriaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {
  timestamps: true
});

// Método para recalcular monto real y desviación
budgetSchema.methods.recalcularMontos = async function() {
  const Transaction = require('@models/Transaction');
  
  // Calcular monto real basado en transacciones
  let query = {
    perfilID: this.perfilID,
    tipo: this.categoria === 'Ingresos' ? 'Ingreso' : 'Gasto'
  };

  // Si hay categoriaID, filtrar por categoría
  if (this.categoriaID) {
    query.categoriaID = this.categoriaID;
  }

  // Filtrar por período
  if (this.periodo === 'Mes' && this.mes && this.año) {
    const startDate = new Date(this.año, this.mes - 1, 1);
    const endDate = new Date(this.año, this.mes, 0, 23, 59, 59);
    query.fecha = { $gte: startDate, $lte: endDate };
  } else if (this.periodo === 'Año' && this.año) {
    const startDate = new Date(this.año, 0, 1);
    const endDate = new Date(this.año, 11, 31, 23, 59, 59);
    query.fecha = { $gte: startDate, $lte: endDate };
  }

  const transactions = await Transaction.find(query);
  this.montoReal = transactions.reduce((sum, t) => sum + (t.monto || 0), 0);
  
  // Calcular desviación (montoReal - montoPresupuestado)
  this.desviacion = this.montoReal - this.montoPresupuestado;
  
  return this.save();
};

// Index for better query performance
budgetSchema.index({ perfilID: 1, periodo: 1, mes: 1, año: 1 });

module.exports = mongoose.model('Budget', budgetSchema);

