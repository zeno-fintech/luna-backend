const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  usuarioID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombrePerfil: {
    type: String,
    required: [true, 'Por favor ingresa un nombre para el perfil'],
    trim: true
  },
  tipo: {
    type: String,
    enum: ['persona', 'empresa'],
    required: true,
    default: 'persona'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isPrincipal: {
    type: Boolean,
    default: false
  },
  // Información básica (siempre presente)
  informacionBasica: {
    nombres: {
      type: String,
      trim: true
    },
    apellidos: {
      type: String,
      trim: true
    },
    fechaNacimiento: {
      type: Date
    },
    sexo: {
      type: String,
      enum: ['M', 'F', 'Otro'],
      trim: true
    },
    paisResidencia: {
      type: String,
      trim: true,
      default: 'CL'
    },
    domicilio: {
      calle: {
        type: String,
        trim: true
      },
      numero: {
        type: String,
        trim: true
      },
      comuna: {
        type: String,
        trim: true
      },
      ciudad: {
        type: String,
        trim: true
      },
      region: {
        type: String,
        trim: true
      },
      codigoPostal: {
        type: String,
        trim: true
      },
      pais: {
        type: String,
        trim: true,
        default: 'CL'
      }
    },
    correo: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un correo válido']
      // Opcional para empresas sin cuenta
    },
    correoRespaldo: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un correo válido']
    },
    telefono: {
      type: String,
      trim: true
    }
  },
  configuracion: {
    pais: {
      type: String,
      trim: true,
      default: 'CL'
    },
    moneda: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'CLP',
      maxlength: [3, 'El código de moneda debe tener máximo 3 caracteres']
    },
    zonaHoraria: {
      type: String,
      trim: true,
      default: 'America/Santiago'
    }
  },
  // Verificación (opcional, para implementación futura)
  verificacion: {
    // Estado de verificación
    estado: {
      type: String,
      enum: ['no_verificado', 'pendiente', 'verificado', 'rechazado'],
      default: 'no_verificado'
    },
    fechaVerificacion: {
      type: Date
    },
    // Información para perfiles tipo "persona"
    datosPersonales: {
      rut: {
        type: String,
        trim: true,
        uppercase: true
      },
      dni: {
        type: String,
        trim: true,
        uppercase: true
      },
      pasaporte: {
        type: String,
        trim: true,
        uppercase: true
      },
      // Validación biométrica (integración con servicios externos según país)
      biometrica: {
        tipo: {
          type: String,
          enum: ['huella', 'reconocimiento_facial', 'voz', 'iris'],
          trim: true
        },
        hash: {
          type: String,
          trim: true
        },
        proveedor: {
          type: String,
          trim: true
          // Ej: 'chile_biometrico', 'argentina_renaper', etc.
        },
        fechaValidacion: {
          type: Date
        },
        resultado: {
          type: String,
          enum: ['exitoso', 'fallido', 'pendiente'],
          default: 'pendiente'
        }
      }
    },
    // Información para perfiles tipo "empresa"
    datosEmpresariales: {
      rutEmpresa: {
        type: String,
        trim: true,
        uppercase: true
      },
      razonSocial: {
        type: String,
        trim: true
      },
      nombreFantasia: {
        type: String,
        trim: true
      },
      giro: {
        type: String,
        trim: true
      },
      representanteLegal: {
        nombres: {
          type: String,
          trim: true
        },
        apellidos: {
          type: String,
          trim: true
        },
        rut: {
          type: String,
          trim: true,
          uppercase: true
        }
      },
      direccionFiscal: {
        calle: {
          type: String,
          trim: true
        },
        numero: {
          type: String,
          trim: true
        },
        comuna: {
          type: String,
          trim: true
        },
        ciudad: {
          type: String,
          trim: true
        },
        region: {
          type: String,
          trim: true
        },
        codigoPostal: {
          type: String,
          trim: true
        },
        pais: {
          type: String,
          trim: true,
          default: 'CL'
        }
      },
      telefono: {
        type: String,
        trim: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      }
    },
    // Documentos de respaldo
    documentos: [{
      tipo: {
        type: String,
        enum: ['cedula', 'pasaporte', 'licencia', 'rut_empresa', 'certificado_empresa', 'otro'],
        required: true
      },
      numero: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      },
      fechaEmision: {
        type: Date
      },
      fechaVencimiento: {
        type: Date
      },
      verificado: {
        type: Boolean,
        default: false
      }
    }],
    // Notas y observaciones del proceso de verificación
    observaciones: {
      type: String,
      trim: true
    },
    verificadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true
});

// Indexes
profileSchema.index({ usuarioID: 1 });
profileSchema.index({ usuarioID: 1, isDefault: 1 });
profileSchema.index({ usuarioID: 1, isPrincipal: 1 });
profileSchema.index({ 'informacionBasica.correo': 1 });
profileSchema.index({ 'verificacion.estado': 1 });
profileSchema.index({ 'verificacion.datosPersonales.rut': 1 });
profileSchema.index({ 'verificacion.datosEmpresariales.rutEmpresa': 1 });

// Middleware para validar que solo un perfil por usuario sea default y principal
profileSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    const Profile = mongoose.model('Profile');
    await Profile.updateMany(
      { usuarioID: this.usuarioID, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  
  // Solo un perfil principal por usuario
  if (this.isPrincipal && this.isModified('isPrincipal')) {
    const Profile = mongoose.model('Profile');
    await Profile.updateMany(
      { usuarioID: this.usuarioID, _id: { $ne: this._id } },
      { $set: { isPrincipal: false } }
    );
  }
  
  // Si es perfil principal, asociar correo de la cuenta si existe
  if (this.isPrincipal) {
    const User = mongoose.model('User');
    const user = await User.findById(this.usuarioID);
    if (user && !this.informacionBasica?.correo) {
      if (!this.informacionBasica) {
        this.informacionBasica = {};
      }
      this.informacionBasica.correo = user.correo;
    }
  }
  
  next();
});

// Método para verificar si el perfil está completamente verificado
profileSchema.methods.isVerificado = function() {
  return this.verificacion?.estado === 'verificado';
};

// Método para obtener datos de verificación según el tipo
profileSchema.methods.getDatosVerificacion = function() {
  if (this.tipo === 'persona') {
    return this.verificacion?.datosPersonales || null;
  }
  if (this.tipo === 'empresa') {
    return this.verificacion?.datosEmpresariales || null;
  }
  return null;
};

// Método para verificar si el perfil puede migrar a cuenta independiente
// Todos los perfiles que NO son principales pueden migrar a nuevas cuentas
profileSchema.methods.puedeMigrarACuenta = function() {
  return !this.isPrincipal;
};

// Método para obtener información completa del perfil
profileSchema.methods.getInformacionCompleta = function() {
  return {
    id: this._id,
    nombrePerfil: this.nombrePerfil,
    tipo: this.tipo,
    isDefault: this.isDefault,
    isPrincipal: this.isPrincipal,
    informacionBasica: this.informacionBasica,
    configuracion: this.configuracion,
    verificacion: {
      estado: this.verificacion?.estado || 'no_verificado',
      datos: this.getDatosVerificacion()
    },
    puedeMigrarACuenta: this.puedeMigrarACuenta()
  };
};

module.exports = mongoose.model('Profile', profileSchema);

