/**
 * @fileoverview Servicio de Insights - Proporciona insights financieros con soporte de IA
 * @module level3/services/insightsService
 */

// Insights Service - Uses AI service when available
// Provides financial insights and recommendations to users

const aiService = require('@core/services/ai/aiService');
const financialSummaryService = require('./financialSummaryService');

/**
 * Obtiene insights financieros del usuario con soporte de IA
 * 
 * Genera insights financieros básicos siempre disponibles y opcionalmente
 * insights avanzados con IA si está habilitada. Los insights incluyen análisis
 * de patrimonio neto, tasa de ahorro, salud de deudas y score financiero.
 * 
 * @param {string} userId - ID del usuario (MongoDB ObjectId)
 * @param {string} [profileId] - ID del perfil del cual obtener insights (opcional)
 * 
 * @returns {Promise<Object>} Objeto con insights que incluye:
 * - success: true
 * - insights: Objeto con:
 *   - basic: Insights básicos siempre disponibles:
 *     - netWorth: Objeto con valor, tendencia y mensaje del patrimonio neto
 *     - savingsRate: Objeto con valor (porcentaje) y mensaje de tasa de ahorro
 *     - debtHealth: Objeto con valor y mensaje sobre salud de deudas
 *     - financialScore: Objeto con score, grado y mensaje del score financiero
 *   - ai: Insights avanzados con IA (null si IA no está disponible)
 *   - aiEnabled: Boolean indicando si IA está habilitada
 * - recommendations: Array de strings con recomendaciones basadas en los datos
 * 
 * @throws {Error} Si hay un error al generar los insights
 * 
 * @example
 * const insights = await getUserInsights('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');
 * // Retorna: { success: true, insights: { basic: {...}, ai: null, aiEnabled: false }, recommendations: [...] }
 */
exports.getUserInsights = async (userId, profileId) => {
  try {
    // Get financial summary data
    const summary = await financialSummaryService.getFinancialSummary(userId, profileId);
    
    // Try to get AI insights (will return mock if not enabled)
    let aiInsights = null;
    try {
      aiInsights = await aiService.generateInsights(userId, profileId, summary);
    } catch (error) {
      // AI not available, continue without it
      console.log('[Insights] AI service not available, using basic insights');
    }

    // Basic insights (always available)
    const basicInsights = {
      netWorth: {
        value: summary.netWorth.netWorth,
        trend: 'stable', // Would calculate from historical data
        message: summary.netWorth.netWorth >= 0 
          ? 'Tu patrimonio neto es positivo' 
          : 'Tienes más deudas que activos'
      },
      savingsRate: {
        value: summary.cashFlow.income > 0 
          ? ((summary.cashFlow.net / summary.cashFlow.income) * 100).toFixed(2)
          : 0,
        message: summary.cashFlow.net > 0
          ? 'Estás ahorrando dinero'
          : 'Tus gastos superan tus ingresos'
      },
      debtHealth: {
        value: summary.debts.totalAmount,
        message: summary.debts.totalAmount === 0
          ? 'No tienes deudas activas'
          : `Tienes ${summary.debts.total} deuda(s) activa(s)`
      },
      financialScore: {
        value: summary.financialScore.score,
        grade: summary.financialScore.grade,
        message: `Tu score financiero es ${summary.financialScore.score}/100 (${summary.financialScore.grade})`
      }
    };

    return {
      success: true,
      insights: {
        basic: basicInsights,
        ai: aiInsights?.insights || null,
        aiEnabled: aiInsights?.success === true
      },
      recommendations: [
        // Basic recommendations based on data
        summary.cashFlow.net < 0 && 'Considera reducir tus gastos o aumentar tus ingresos',
        summary.debts.totalAmount > 0 && 'Prioriza el pago de deudas con mayor tasa de interés',
        summary.financialScore.score < 60 && 'Mejora tu score financiero aumentando tus ahorros',
        summary.netWorth.netWorth < 0 && 'Enfócate en reducir deudas para mejorar tu patrimonio neto'
      ].filter(Boolean)
    };
  } catch (error) {
    throw new Error(`Error generating insights: ${error.message}`);
  }
};

/**
 * Obtiene insights específicos sobre patrones de gastos
 * 
 * Analiza los patrones de gastos del usuario durante un período específico.
 * Actualmente retorna una estructura básica, pendiente de implementación completa.
 * 
 * @param {string} userId - ID del usuario (MongoDB ObjectId)
 * @param {string} [profileId] - ID del perfil (opcional)
 * @param {string} [period='30days'] - Período a analizar (opcional, default: '30days', opciones: '7days', '30days', '90days', '1year')
 * 
 * @returns {Promise<Object>} Objeto con insights de gastos que incluye:
 * - success: true
 * - insights: Objeto con:
 *   - topCategories: Array de categorías principales con montos (pendiente implementación)
 *   - trends: Array de tendencias de gastos en el tiempo (pendiente implementación)
 *   - anomalies: Array de gastos anómalos detectados (pendiente implementación)
 * - aiEnabled: Boolean indicando si IA está habilitada (actualmente false)
 * 
 * @example
 * const spendingInsights = await getSpendingInsights('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', '90days');
 * // Retorna: { success: true, insights: { topCategories: [], trends: [], anomalies: [] }, aiEnabled: false }
 */
exports.getSpendingInsights = async (userId, profileId, period = '30days') => {
  // This would analyze spending patterns
  // For now, return basic structure
  return {
    success: true,
    insights: {
      topCategories: [],
      trends: [],
      anomalies: []
    },
    aiEnabled: false
  };
};
