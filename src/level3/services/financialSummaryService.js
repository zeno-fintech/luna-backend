const Activo = require('@models/Activo');
const Pasivo = require('@models/Pasivo');
const Transaction = require('@models/Transaction');
const Profile = require('@models/Profile');

// Calculate net worth (patrimonio neto)
exports.calculateNetWorth = async (profileId) => {
  // Get all activos (unified model: accounts, assets, savings)
  const activos = await Activo.find({ perfilID: profileId });
  const totalActivos = activos.reduce((sum, activo) => sum + (activo.valor || 0), 0);

  // Get all pasivos (unified model: debts)
  const pasivos = await Pasivo.find({ 
    perfilID: profileId,
    estado: { $ne: 'Pagada' }
  });
  const totalPasivos = pasivos.reduce((sum, pasivo) => sum + (pasivo.saldoPendiente || 0), 0);

  // Calcular patrimonio neto
  const patrimonioNeto = totalActivos - totalPasivos;

  // Desglose por categorías
  const activosPorCategoria = activos.reduce((acc, a) => {
    const cat = a.categoria || 'Otro';
    acc[cat] = (acc[cat] || 0) + (a.valor || 0);
    return acc;
  }, {});

  const activosLiquidos = activos
    .filter(a => a.liquidez === 'Corriente')
    .reduce((sum, a) => sum + (a.valor || 0), 0);

  const activosNoLiquidos = activos
    .filter(a => a.liquidez === 'No Corriente')
    .reduce((sum, a) => sum + (a.valor || 0), 0);

  return {
    activos: {
      total: totalActivos,
      cantidad: activos.length,
      porCategoria: activosPorCategoria,
      liquidos: activosLiquidos,
      noLiquidos: activosNoLiquidos,
      breakdown: activos.map(a => ({
        id: a._id,
        nombre: a.nombre,
        tipo: a.tipo,
        categoria: a.categoria,
        liquidez: a.liquidez,
        valor: a.valor,
        moneda: a.moneda
      }))
    },
    pasivos: {
      total: totalPasivos,
      cantidad: pasivos.length,
      breakdown: pasivos.map(p => ({
        id: p._id,
        nombre: p.nombre,
        prestador: p.prestador,
        tipo: p.tipo,
        categoria: p.categoria,
        plazo: p.plazo,
        saldoPendiente: p.saldoPendiente,
        estado: p.estado,
        moneda: p.moneda
      }))
    },
    patrimonioNeto,
    ratio: totalActivos > 0 ? (totalPasivos / totalActivos) * 100 : 0 // Ratio de endeudamiento
  };
};

// Calculate financial score (0-100)
exports.calculateFinancialScore = async (profileId, userId) => {
  let score = 0;
  const factors = {};

  // Get profiles
  const profiles = await Profile.find({ usuarioID: userId }).select('_id');
  const profileIds = profiles.map(p => p._id);

  // Factor 1: Savings rate (0-25 points)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const transactions = await Transaction.find({
    perfilID: { $in: profileIds },
    fecha: { $gte: last30Days }
  });

  const income = transactions
    .filter(t => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + (t.monto || 0), 0);
  
  const expenses = transactions
    .filter(t => t.tipo === 'Gasto')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const savingsScore = Math.min(25, Math.max(0, (savingsRate / 20) * 25)); // 20% savings = 25 points
  score += savingsScore;
  factors.savingsRate = {
    value: savingsRate.toFixed(2),
    score: savingsScore.toFixed(2),
    max: 25
  };

  // Factor 2: Debt-to-income ratio (0-25 points)
  const pasivos = await Pasivo.find({ 
    perfilID: profileId,
    estado: { $ne: 'Pagada' }
  });
  const totalDebt = pasivos.reduce((sum, p) => sum + (p.saldoPendiente || 0), 0);
  const monthlyIncome = income / 1; // Assuming last 30 days = 1 month
  const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebt / monthlyIncome) : 0;
  const debtScore = Math.max(0, 25 - (debtToIncomeRatio * 5)); // Lower is better
  score += debtScore;
  factors.debtToIncomeRatio = {
    value: debtToIncomeRatio.toFixed(2),
    score: debtScore.toFixed(2),
    max: 25
  };

  // Factor 3: Asset diversity (0-15 points)
  const activos = await Activo.find({ perfilID: profileId });
  const assetDiversityScore = Math.min(15, activos.length * 2); // 7+ activos = 15 points
  score += assetDiversityScore;
  factors.assetDiversity = {
    value: activos.length,
    score: assetDiversityScore.toFixed(2),
    max: 15
  };

  // Factor 4: Transaction consistency (0-15 points)
  const daysWithTransactions = new Set(
    transactions.map(t => t.fecha.toISOString().split('T')[0])
  ).size;
  const consistencyScore = Math.min(15, (daysWithTransactions / 30) * 15);
  score += consistencyScore;
  factors.transactionConsistency = {
    value: daysWithTransactions,
    score: consistencyScore.toFixed(2),
    max: 15
  };

  // Factor 5: Asset base (0-10 points)
  const totalAssets = activos.reduce((sum, a) => sum + (a.valor || 0), 0);
  const assetScore = Math.min(10, Math.log10(totalAssets + 1) * 2); // Logarithmic scale
  score += assetScore;
  factors.assetBase = {
    value: totalAssets,
    score: assetScore.toFixed(2),
    max: 10
  };

  // Factor 6: Budget adherence (0-10 points) - Simplified
  // This would require Budget model data, for now we give a base score
  const budgetScore = 5; // Placeholder
  score += budgetScore;
  factors.budgetAdherence = {
    value: 'N/A',
    score: budgetScore.toFixed(2),
    max: 10
  };

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    factors,
    grade: score >= 80 ? 'Excelente' : 
            score >= 60 ? 'Bueno' : 
            score >= 40 ? 'Regular' : 
            'Necesita mejorar'
  };
};

// Get complete financial summary
exports.getFinancialSummary = async (userId, profileId = null) => {
  // Get user profiles
  const profiles = await Profile.find({ usuarioID: userId });
  const profileIds = profiles.map(p => p._id);
  
  // Use first profile if none specified
  const targetProfileId = profileId || profileIds[0];
  
  if (!targetProfileId) {
    throw new Error('No se encontró perfil para el usuario');
  }

  // Calculate net worth
  const netWorth = await this.calculateNetWorth(targetProfileId);

  // Calculate financial score
  const financialScore = await this.calculateFinancialScore(targetProfileId, userId);

  // Get cash flow (last 30 days)
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  
  const transactions = await Transaction.find({
    perfilID: { $in: profileIds },
    fecha: { $gte: last30Days }
  }).sort({ fecha: -1 });

  const income = transactions
    .filter(t => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + (t.monto || 0), 0);
  
  const expenses = transactions
    .filter(t => t.tipo === 'Gasto')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  const cashFlow = income - expenses;

  // Get activos summary (unified model)
  const activos = await Activo.find({ perfilID: targetProfileId });
  const totalActivos = activos.reduce((sum, a) => sum + (a.valor || 0), 0);
  const activosLiquidos = activos
    .filter(a => a.liquidez === 'Corriente')
    .reduce((sum, a) => sum + (a.valor || 0), 0);

  // Get pasivos summary (unified model)
  const pasivos = await Pasivo.find({ 
    perfilID: targetProfileId,
    estado: { $ne: 'Pagada' }
  });
  const totalPasivos = pasivos.reduce((sum, p) => sum + (p.saldoPendiente || 0), 0);

  return {
    netWorth,
    financialScore,
    cashFlow: {
      period: 'last_30_days',
      income,
      expenses,
      net: cashFlow,
      transactions: transactions.length
    },
    activos: {
      total: activos.length,
      totalValor: totalActivos,
      totalLiquidos: activosLiquidos,
      activos: activos.map(a => ({
        id: a._id,
        nombre: a.nombre,
        tipo: a.tipo,
        categoria: a.categoria,
        liquidez: a.liquidez,
        valor: a.valor,
        moneda: a.moneda,
        banco: a.banco,
        favorito: a.favorito
      }))
    },
    pasivos: {
      total: pasivos.length,
      totalAmount: totalPasivos,
      activePasivos: pasivos.filter(p => p.estado === 'Activa').length,
      pasivos: pasivos.map(p => ({
        id: p._id,
        nombre: p.nombre,
        prestador: p.prestador,
        tipo: p.tipo,
        categoria: p.categoria,
        plazo: p.plazo,
        saldoPendiente: p.saldoPendiente,
        estado: p.estado,
        moneda: p.moneda
      }))
    },
    profiles: profiles.map(p => ({
      id: p._id,
      nombrePerfil: p.nombrePerfil,
      isDefault: p.isDefault
    }))
  };
};

