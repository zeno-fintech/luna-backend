/**
 * @fileoverview Servicio de Nivel de Deuda
 * Calcula el nivel de deuda basado en estado de pago, ratio deuda/ingresos, etc.
 * @module level3/services/debtLevelService
 */

const Debt = require('@models/Debt');
const Payment = require('@models/Payment');
const Transaction = require('@models/Transaction');

/**
 * Calcula el nivel de deuda de un perfil
 * 
 * Niveles:
 * - Nivel 1 (🟢 SALUDABLE): Todas las deudas al día, ratio < 30%
 * - Nivel 2 (🟡 CONTROLADA): Algunos atrasos 30-59 días, ratio 30-50%
 * - Nivel 3 (🟠 EN RIESGO): Atrasos 60-89 días, ratio 50-70%
 * - Nivel 4 (🔴 CRÍTICA): Atrasos 90+ días, ratio > 70%
 * 
 * @param {string} profileId - ID del perfil
 * @param {number} [monthlyIncome] - Ingresos mensuales (opcional, se calcula si no se proporciona)
 * @returns {Promise<Object>} Objeto con nivel de deuda y detalles
 */
exports.calculateDebtLevel = async (profileId, monthlyIncome = null) => {
  // Obtener todas las deudas activas
  const debts = await Debt.find({
    perfilID: profileId,
    estado: { $ne: 'Pagada' }
  });

  if (debts.length === 0) {
    return {
      level: 1,
      levelName: 'SALUDABLE',
      levelColor: 'green',
      levelIcon: '🟢',
      message: 'No tienes deudas activas',
      totalDebt: 0,
      debtToIncomeRatio: 0,
      daysOverdue: 0,
      details: {
        totalDebts: 0,
        activeDebts: 0,
        overdueDebts: 0,
        maxDaysOverdue: 0
      }
    };
  }

  // Calcular ingresos mensuales si no se proporciona
  if (!monthlyIncome) {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    
    const transactions = await Transaction.find({
      perfilID: profileId,
      tipo: 'Ingreso',
      fecha: { $gte: last30Days }
    });

    monthlyIncome = transactions.reduce((sum, t) => sum + (t.monto || 0), 0);
  }

  // Calcular total de deudas
  const totalDebt = debts.reduce((sum, debt) => sum + (debt.saldoPendiente || 0), 0);

  // Calcular ratio deuda/ingresos
  const debtToIncomeRatio = monthlyIncome > 0 
    ? (totalDebt / monthlyIncome) * 100 
    : totalDebt > 0 ? 999 : 0; // Si no hay ingresos pero hay deudas, ratio muy alto

  // Analizar estado de pagos y atrasos
  const now = new Date();
  let maxDaysOverdue = 0;
  let overdueDebts = 0;
  let totalDaysOverdue = 0;

  for (const debt of debts) {
    // Obtener último pago
    const lastPayment = await Payment.findOne({ deudaID: debt._id })
      .sort({ fecha: -1 });

    if (lastPayment) {
      // Calcular días desde último pago
      const daysSinceLastPayment = Math.floor(
        (now - lastPayment.fecha) / (1000 * 60 * 60 * 24)
      );

      // Si hay fecha de vencimiento, calcular días de atraso
      if (debt.fechaVencimiento) {
        const daysOverdue = Math.floor(
          (now - debt.fechaVencimiento) / (1000 * 60 * 60 * 24)
        );

        if (daysOverdue > 0) {
          maxDaysOverdue = Math.max(maxDaysOverdue, daysOverdue);
          totalDaysOverdue += daysOverdue;
          overdueDebts++;
        }
      } else if (debt.montoCuota) {
        // Si no hay fecha de vencimiento pero hay cuota mensual,
        // estimar atraso basado en días desde último pago
        const expectedDaysSincePayment = daysSinceLastPayment;
        if (expectedDaysSincePayment > 30) {
          const estimatedOverdue = expectedDaysSincePayment - 30;
          maxDaysOverdue = Math.max(maxDaysOverdue, estimatedOverdue);
          totalDaysOverdue += estimatedOverdue;
          if (estimatedOverdue > 0) overdueDebts++;
        }
      }
    } else {
      // Si no hay pagos y hay fecha de vencimiento
      if (debt.fechaVencimiento) {
        const daysOverdue = Math.floor(
          (now - debt.fechaVencimiento) / (1000 * 60 * 60 * 24)
        );
        if (daysOverdue > 0) {
          maxDaysOverdue = Math.max(maxDaysOverdue, daysOverdue);
          totalDaysOverdue += daysOverdue;
          overdueDebts++;
        }
      }
    }
  }

  const avgDaysOverdue = overdueDebts > 0 ? totalDaysOverdue / overdueDebts : 0;

  // Determinar nivel de deuda
  let level = 1;
  let levelName = 'SALUDABLE';
  let levelColor = 'green';
  let levelIcon = '🟢';
  let message = '';

  // Criterio 1: Días de atraso máximo
  if (maxDaysOverdue >= 90) {
    level = 4;
    levelName = 'CRÍTICA';
    levelColor = 'red';
    levelIcon = '🔴';
    message = `Tienes deudas con más de 90 días de atraso. Es urgente regularizar tus pagos.`;
  } else if (maxDaysOverdue >= 60) {
    level = 3;
    levelName = 'EN RIESGO';
    levelColor = 'orange';
    levelIcon = '🟠';
    message = `Tienes deudas con más de 60 días de atraso. Considera renegociar o consolidar tus deudas.`;
  } else if (maxDaysOverdue >= 30) {
    level = 2;
    levelName = 'CONTROLADA';
    levelColor = 'yellow';
    levelIcon = '🟡';
    message = `Tienes algunas deudas con atraso. Mantén tus pagos al día para evitar problemas.`;
  } else {
    // Criterio 2: Ratio deuda/ingresos
    if (debtToIncomeRatio > 70) {
      level = 4;
      levelName = 'CRÍTICA';
      levelColor = 'red';
      levelIcon = '🔴';
      message = `Tu ratio deuda/ingresos es muy alto (${debtToIncomeRatio.toFixed(1)}%). Considera reducir tus deudas.`;
    } else if (debtToIncomeRatio > 50) {
      level = Math.max(level, 3);
      if (level === 1) {
        levelName = 'EN RIESGO';
        levelColor = 'orange';
        levelIcon = '🟠';
        message = `Tu ratio deuda/ingresos es alto (${debtToIncomeRatio.toFixed(1)}%). Considera reducir tus deudas.`;
      }
    } else if (debtToIncomeRatio > 30) {
      level = Math.max(level, 2);
      if (level === 1) {
        levelName = 'CONTROLADA';
        levelColor = 'yellow';
        levelIcon = '🟡';
        message = `Tu ratio deuda/ingresos es moderado (${debtToIncomeRatio.toFixed(1)}%). Mantén tus pagos al día.`;
      }
    } else {
      if (level === 1) {
        message = `Tus deudas están bajo control. Ratio deuda/ingresos: ${debtToIncomeRatio.toFixed(1)}%.`;
      }
    }
  }

  return {
    level,
    levelName,
    levelColor,
    levelIcon,
    message,
    totalDebt,
    monthlyIncome,
    debtToIncomeRatio: debtToIncomeRatio.toFixed(2),
    daysOverdue: {
      max: maxDaysOverdue,
      average: Math.round(avgDaysOverdue),
      total: totalDaysOverdue
    },
    details: {
      totalDebts: debts.length,
      activeDebts: debts.filter(d => d.estado === 'Activa').length,
      overdueDebts,
      maxDaysOverdue,
      debtsByType: {
        Personal: debts.filter(d => d.tipo === 'Personal').length,
        Institucional: debts.filter(d => d.tipo === 'Institucional').length,
        Bancaria: debts.filter(d => d.tipo === 'Bancaria').length,
        Comercial: debts.filter(d => d.tipo === 'Comercial').length
      }
    },
    recommendations: generateRecommendations(level, debtToIncomeRatio, maxDaysOverdue, overdueDebts)
  };
};

/**
 * Genera recomendaciones basadas en el nivel de deuda
 */
function generateRecommendations(level, debtToIncomeRatio, maxDaysOverdue, overdueDebts) {
  const recommendations = [];

  if (level === 4) {
    recommendations.push('Contacta a tus acreedores para renegociar tus deudas');
    recommendations.push('Considera consolidar tus deudas en un solo crédito con mejor tasa');
    recommendations.push('Prioriza el pago de deudas con mayor tasa de interés');
    if (maxDaysOverdue >= 90) {
      recommendations.push('Urgente: Regulariza tus pagos para evitar reportes negativos');
    }
  } else if (level === 3) {
    recommendations.push('Considera renegociar las deudas con mayor atraso');
    recommendations.push('Prioriza el pago de deudas con mayor tasa de interés');
    if (debtToIncomeRatio > 50) {
      recommendations.push('Reduce tus gastos o aumenta tus ingresos para mejorar tu ratio');
    }
  } else if (level === 2) {
    recommendations.push('Mantén tus pagos al día para evitar problemas');
    if (debtToIncomeRatio > 30) {
      recommendations.push('Considera reducir tus deudas para mejorar tu ratio deuda/ingresos');
    }
  } else {
    recommendations.push('Tus deudas están bajo control. Mantén tus pagos al día');
    if (debtToIncomeRatio < 20) {
      recommendations.push('Excelente ratio deuda/ingresos. Sigue así');
    }
  }

  return recommendations;
}

