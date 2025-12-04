const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  deudaID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debt',
    required: true
  },
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  monto: {
    type: Number,
    required: [true, 'El monto del pago es requerido'],
    min: [0, 'El monto no puede ser negativo']
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['pagado', 'pendiente', 'vencido'],
    default: 'pendiente'
  },
  numeroCuota: {
    type: Number,
    required: true,
    min: [1, 'El número de cuota debe ser al menos 1']
  },
  transaccionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  fechaVencimiento: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);

