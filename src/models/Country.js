const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del país es requerido'],
    unique: true,
    trim: true
  },
  codigo: {
    type: String,
    required: [true, 'El código del país es requerido'],
    uppercase: true,
    trim: true,
    maxlength: [3, 'El código debe tener máximo 3 caracteres']
  },
  codigoISO: {
    type: String,
    required: [true, 'El código ISO del país es requerido'],
    uppercase: true,
    trim: true,
    length: [2, 'El código ISO debe tener 2 caracteres']
  },
  monedaDefault: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    maxlength: [3, 'El código de moneda debe tener máximo 3 caracteres']
  },
  region: {
    type: String,
    enum: ['Norteamérica', 'Centroamérica', 'Sudamérica', 'Caribe'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: false
    // Por defecto inactivo, solo se activa para pruebas/producción
  },
  codigoTelefono: {
    type: String,
    required: [true, 'El código telefónico es requerido'],
    trim: true
    // Ejemplo: "+56" para Chile, "+51" para Perú, "+1" para US
  },
  bandera: {
    icono: {
      type: String,
      trim: true
      // Código de emoji o nombre de icono (ej: "🇨🇱", "flag-chile")
    },
    imagen: {
      type: String,
      trim: true
      // URL de imagen de la bandera (opcional)
    }
  },
  configuracion: {
    formatoFecha: {
      type: String,
      default: 'DD/MM/YYYY',
      enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
    },
    formatoTelefono: {
      type: String,
      trim: true
      // Ejemplo: "+56 9 XXXX XXXX" para Chile
    },
    zonaHoraria: {
      type: String,
      default: 'America/Santiago',
      trim: true
    }
  }
}, {
  timestamps: true
});

// Indexes
countrySchema.index({ codigo: 1 }, { unique: true });
countrySchema.index({ codigoISO: 1 }, { unique: true });
countrySchema.index({ isActive: 1 });
countrySchema.index({ region: 1 });

module.exports = mongoose.model('Country', countrySchema);

