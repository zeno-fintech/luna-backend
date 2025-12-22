// AI Service - Placeholder for future AI integration
// This will handle:
// - OCR processing for receipts
// - Voice recognition
// - AI recommendations
// - Natural language processing
// - Financial insights and summaries

const isAIEnabled = () => {
  return process.env.AI_ENABLED === 'true' && process.env.OPENAI_API_KEY;
};

// Log AI service usage for analytics
const logAIUsage = (service, userId, metadata = {}) => {
  // TODO: Integrate with analytics service
  console.log(`[AI Service] ${service} called by user ${userId}`, metadata);
};

// Process OCR for receipts and invoices
exports.processOCR = async (imageUrl, userId) => {
  logAIUsage('processOCR', userId, { imageUrl });
  
  if (!isAIEnabled()) {
    // Return mock structure for development
    return {
      success: false,
      message: 'OCR service not yet implemented',
      mock: true,
      data: {
        amount: null,
        merchant: null,
        date: null,
        category: null
      }
    };
  }

  // TODO: Implement OCR processing with OpenAI Vision or Tesseract
  // Example structure:
  // const response = await openai.chat.completions.create({
  //   model: "gpt-4-vision-preview",
  //   messages: [{ role: "user", content: [{ type: "image_url", image_url: { url: imageUrl } }] }]
  // });
  
  throw new Error('OCR service not yet implemented');
};

// Process voice input for transaction creation
exports.processVoice = async (audioUrl, userId) => {
  logAIUsage('processVoice', userId, { audioUrl });
  
  if (!isAIEnabled()) {
    return {
      success: false,
      message: 'Voice recognition service not yet implemented',
      mock: true,
      data: {
        text: null,
        intent: null,
        entities: {}
      }
    };
  }

  // TODO: Implement voice recognition with OpenAI Whisper
  // Example:
  // const transcription = await openai.audio.transcriptions.create({
  //   file: audioFile,
  //   model: "whisper-1"
  // });
  
  throw new Error('Voice recognition service not yet implemented');
};

// Get AI-powered financial recommendations
exports.getRecommendations = async (userId, profileId) => {
  logAIUsage('getRecommendations', userId, { profileId });
  
  if (!isAIEnabled()) {
    return {
      success: false,
      message: 'AI recommendations service not yet implemented',
      mock: true,
      recommendations: []
    };
  }

  // TODO: Implement AI recommendations
  // This would analyze user's financial data and provide personalized recommendations
  // Example structure:
  // const recommendations = await openai.chat.completions.create({
  //   model: "gpt-4",
  //   messages: [
  //     { role: "system", content: "You are a financial advisor..." },
  //     { role: "user", content: `Analyze this user's financial data: ${userData}` }
  //   ]
  // });
  
  throw new Error('AI recommendations service not yet implemented');
};

// Generate financial insights summary
exports.generateInsights = async (userId, profileId, financialData) => {
  logAIUsage('generateInsights', userId, { profileId });
  
  if (!isAIEnabled()) {
    return {
      success: false,
      message: 'AI insights service not yet implemented',
      mock: true,
      insights: {
        summary: 'AI insights will be available soon',
        trends: [],
        alerts: []
      }
    };
  }

  // TODO: Implement AI insights generation
  // This would create natural language summaries of user's financial situation
  
  throw new Error('AI insights service not yet implemented');
};

// Analyze spending patterns
exports.analyzeSpendingPatterns = async (userId, transactions) => {
  logAIUsage('analyzeSpendingPatterns', userId, { transactionCount: transactions.length });
  
  if (!isAIEnabled()) {
    return {
      success: false,
      message: 'Spending analysis not yet implemented',
      mock: true,
      patterns: []
    };
  }

  // TODO: Implement spending pattern analysis with AI
  
  throw new Error('Spending pattern analysis not yet implemented');
};

/**
 * Sugiere un icono basado en el nombre del presupuesto financiero
 * 
 * Analiza el nombre del presupuesto y sugiere un icono apropiado.
 * Por ejemplo: "Casa" → "home", "Depto" → "building", "Auto" → "car", etc.
 * 
 * @param {string} nombreTablero - Nombre del presupuesto financiero
 * @returns {Promise<string>} Nombre del icono sugerido (ej: "home", "building", "car")
 * 
 * @example
 * const icono = await suggestBoardIcon("Casa Principal");
 * // Retorna: "home"
 */
exports.suggestBoardIcon = async (nombreTablero) => {
  // Mapeo simple de palabras clave a iconos
  // En el futuro, esto podría usar IA para análisis más sofisticado
  const nombreLower = nombreTablero.toLowerCase();
  
  const iconMap = {
    // Casa/Hogar
    casa: 'home',
    hogar: 'home',
    vivienda: 'home',
    residencia: 'home',
    
    // Departamento
    depto: 'building',
    departamento: 'building',
    apartamento: 'building',
    apto: 'building',
    
    // Auto/Vehículo
    auto: 'car',
    vehiculo: 'car',
    coche: 'car',
    moto: 'motorcycle',
    
    // Empresa/Negocio
    empresa: 'briefcase',
    negocio: 'briefcase',
    trabajo: 'briefcase',
    oficina: 'office-building',
    
    // Viajes
    viaje: 'plane',
    vacaciones: 'plane',
    turismo: 'plane',
    
    // Educación
    colegio: 'graduation-cap',
    universidad: 'graduation-cap',
    educacion: 'graduation-cap',
    
    // Salud
    salud: 'heart',
    medico: 'heart',
    hospital: 'heart',
    
    // Otros
    ahorro: 'piggy-bank',
    inversion: 'chart-line',
    gastos: 'wallet',
    ingresos: 'money-bill'
  };
  
  // Buscar coincidencias
  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (nombreLower.includes(keyword)) {
      return icon;
    }
  }
  
  // Si no hay coincidencia, retornar icono por defecto
  return 'wallet';
};

/**
 * Sugiere gastos que deberían marcarse como fijos
 * 
 * Analiza los gastos de los últimos meses y sugiere cuáles deberían
 * marcarse como fijos si se repiten 2-3 meses consecutivos.
 * 
 * @param {string} perfilID - ID del perfil
 * @param {string} [presupuestoID] - ID del presupuesto (opcional)
 * @returns {Promise<Array>} Array de transacciones sugeridas para marcar como fijas
 * 
 * @example
 * const sugerencias = await suggestFixedExpenses("507f1f77bcf86cd799439011");
 * // Retorna: [{ transactionId: "...", detalle: "Internet", mesesRepetidos: 3, ... }]
 */
exports.suggestFixedExpenses = async (perfilID, presupuestoID = null) => {
  const Transaction = require('@models/Transaction');
  
  // Obtener gastos de los últimos 3 meses
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  
  const query = {
    perfilID,
    tipo: 'Gasto',
    esGastoFijo: false, // Solo los que NO están marcados como fijos
    fecha: { $gte: threeMonthsAgo }
  };
  
  if (presupuestoID) {
    query.presupuestoID = presupuestoID;
  }
  
  const gastos = await Transaction.find(query)
    .sort({ detalle: 1, fecha: -1 });
  
  // Agrupar por detalle (glosa) y contar repeticiones por mes
  const gastosPorDetalle = {};
  
  gastos.forEach(gasto => {
    const key = gasto.detalle?.toLowerCase().trim() || 'sin-detalle';
    if (!gastosPorDetalle[key]) {
      gastosPorDetalle[key] = {
        detalle: gasto.detalle,
        transacciones: [],
        meses: new Set(),
        montoPromedio: 0,
        totalRepeticiones: 0
      };
    }
    
    gastosPorDetalle[key].transacciones.push(gasto);
    const mesAno = `${gasto.fecha.getFullYear()}-${gasto.fecha.getMonth()}`;
    gastosPorDetalle[key].meses.add(mesAno);
    gastosPorDetalle[key].totalRepeticiones++;
  });
  
  // Calcular monto promedio y filtrar los que se repiten 2-3 meses
  const sugerencias = [];
  
  for (const [key, data] of Object.entries(gastosPorDetalle)) {
    const mesesRepetidos = data.meses.size;
    const montoPromedio = data.transacciones.reduce((sum, t) => sum + t.monto, 0) / data.transacciones.length;
    
    // Si se repite en 2 o más meses diferentes, sugerir como fijo
    if (mesesRepetidos >= 2) {
      sugerencias.push({
        transactionId: data.transacciones[0]._id,
        detalle: data.detalle,
        montoPromedio: Math.round(montoPromedio),
        mesesRepetidos,
        totalRepeticiones: data.totalRepeticiones,
        ultimaFecha: data.transacciones[0].fecha,
        categoriaID: data.transacciones[0].categoriaID,
        reglaID: data.transacciones[0].reglaID
      });
    }
  }
  
  // Ordenar por meses repetidos (más repetidos primero)
  sugerencias.sort((a, b) => b.mesesRepetidos - a.mesesRepetidos);
  
  return sugerencias;
};

