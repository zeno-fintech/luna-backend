const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  perfilID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  tipo: {
    type: String,
    enum: ['Efectivo', 'Inversiones', 'Propiedades', 'Vehículos', 'Otros'],
    required: true
  },
  valor: {
    type: Number,
    required: [true, 'El valor es requerido'],
    min: [0, 'El valor no puede ser negativo']
  },
  moneda: {
    type: String,
    enum: ['CLP', 'UF', 'USD', 'COP', 'EUR', 'Otra'],
    default: 'CLP',
    uppercase: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  descripcion: {
    type: String,
    trim: true
  },
  // Campos específicos para propiedades
  rol: {
    type: String,
    trim: true
    // Número de rol del SII (ej: "02524-00179")
  },
  direccion: {
    type: String,
    trim: true
  },
  comuna: {
    type: String,
    trim: true
  },
  avaluoFiscal: {
    type: Number,
    min: [0, 'El avalúo fiscal no puede ser negativo']
    // Valor fiscal según SII
  },
  valorComercial: {
    type: Number,
    min: [0, 'El valor comercial no puede ser negativo']
    // Valor de mercado estimado
  },
  grupoPropiedad: {
    type: String,
    trim: true
    // Para agrupar propiedades relacionadas (ej: "depto-america-755")
    // Permite relacionar depto + estacionamiento + bodega
  },
  // Detalles específicos de propiedades
  tipoPropiedad: {
    type: String,
    enum: ['Depto', 'Casa', 'Parcela', 'Local Comercial', 'Oficina', 'Bodega', 'Estacionamiento', 'Otro'],
    trim: true
    // Tipo de propiedad inmobiliaria
  },
  metrosTotales: {
    type: Number,
    min: [0, 'Los metros totales no pueden ser negativos']
    // Metros cuadrados totales
  },
  metrosConstruidos: {
    type: Number,
    min: [0, 'Los metros construidos no pueden ser negativos']
    // Metros cuadrados construidos
  },
  metrosTerreno: {
    type: Number,
    min: [0, 'Los metros de terreno no pueden ser negativos']
    // Metros cuadrados de terreno (para casas/parcelas)
  },
  numeroDormitorios: {
    type: Number,
    min: [0, 'El número de dormitorios no puede ser negativo']
  },
  numeroBanos: {
    type: Number,
    min: [0, 'El número de baños no puede ser negativo']
  },
  numeroEstacionamientos: {
    type: Number,
    min: [0, 'El número de estacionamientos no puede ser negativo']
  },
  piso: {
    type: Number
    // Piso del depto (si aplica)
  },
  // Detalles específicos de vehículos
  marca: {
    type: String,
    trim: true
    // Marca del vehículo (ej: "Toyota", "Ford")
  },
  modelo: {
    type: String,
    trim: true
    // Modelo del vehículo (ej: "Corolla", "Ranger")
  },
  año: {
    type: Number,
    min: [1900, 'El año debe ser válido'],
    max: [new Date().getFullYear() + 1, 'El año no puede ser futuro']
    // Año del vehículo
  },
  kilometraje: {
    type: Number,
    min: [0, 'El kilometraje no puede ser negativo']
    // Kilometraje actual del vehículo
  },
  patente: {
    type: String,
    trim: true,
    uppercase: true
    // Patente del vehículo
  },
  color: {
    type: String,
    trim: true
    // Color del vehículo
  },
  // Metadata flexible para datos adicionales
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes para búsquedas eficientes
assetSchema.index({ perfilID: 1 });
assetSchema.index({ perfilID: 1, tipo: 1 });
assetSchema.index({ grupoPropiedad: 1 });
assetSchema.index({ rol: 1 });

module.exports = mongoose.model('Asset', assetSchema);

