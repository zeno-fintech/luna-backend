const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  presupuestoID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presupuesto'
    // Opcional: si está, va directo a ese presupuesto. Si no, se divide entre presupuestos
  },
  glosa: {
    type: String,
    required: [true, 'La glosa del ingreso es requerida'],
    trim: true
  },
  monto: {
    type: Number,
    required: [true, 'El monto del ingreso es requerido'],
    min: [0, 'El monto no puede ser negativo']
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  tipo: {
    type: String,
    enum: [
      // Ingresos laborales
      'Sueldo Líquido', 'Bono', 'Comisión',
      // Ingresos pasivos
      'Arriendo', 'Dividendo', 'Interés',
      // Ingresos variables
      'Freelance', 'Venta Ocasional',
      // Otros ingresos
      'Pensión Alimenticia', 'Subsidio', 'Otro'
    ],
    default: 'Sueldo Líquido'
  },
  tipoTrabajador: {
    type: String,
    enum: ['Dependiente', 'Independiente', 'No Aplica'],
    default: 'No Aplica'
    // Para futuro uso tributario (Chile)
  },
  porcentajeDistribucion: {
    type: Number,
    min: [0, 'El porcentaje no puede ser negativo'],
    max: [100, 'El porcentaje no puede ser mayor a 100']
    // Solo se usa si tableroID no está definido y hay múltiples tableros
  }
}, {
  timestamps: true
});

// Indexes
incomeSchema.index({ perfilID: 1, fecha: -1 });
incomeSchema.index({ presupuestoID: 1 });
incomeSchema.index({ tipo: 1 });

module.exports = mongoose.model('Income', incomeSchema);

