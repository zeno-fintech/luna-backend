const Asset = require('@models/Asset');
const Debt = require('@models/Debt');
const Account = require('@models/Account');
const Transaction = require('@models/Transaction');
const Savings = require('@models/Savings');
const Profile = require('@models/Profile');

// Calculate net worth (patrimonio neto)
exports.calculateNetWorth = async (profileId) => {
  // Get all assets
  const assets = await Asset.find({ perfilID: profileId });
  const totalAssets = assets.reduce((sum, asset) => sum + (asset.valor || 0), 0);

  // Get all debts (pasivos)
  const debts = await Debt.find({ 
    perfilID: profileId,
    estado: { $ne: 'Pagada' }
  });
  const totalDebts = debts.reduce((sum, debt) => sum + (debt.saldoPendiente || 0), 0);

  // Get account balances - Account is linked to perfilID (Profile)
  const accounts = await Account.find({ 
    perfilID: profileId
  });
  const totalCash = accounts.reduce((sum, account) => sum + (account.saldoDisponible || 0), 0);

  // Get savings/investments
  const savings = await Savings.find({ perfilID: profileId });
  const totalSavings = savings.reduce((sum, saving) => sum + (saving.monto || 0), 0);

  const netWorth = totalAssets + totalCash + totalSavings - totalDebts;

  return {
    assets: {
      total: totalAssets,
      breakdown: assets.map(a => ({
        tipo: a.tipo,
        valor: a.valor,
        descripcion: a.descripcion
      }))
    },
    cash: {
      total: totalCash,
      accounts: accounts.map(a => ({
        nombre: a.nombre,
        banco: a.banco,
        saldo: a.saldoDisponible
      }))
    },
    savings: {
      total: totalSavings,
      breakdown: savings.map(s => ({
        tipo: s.tipo,
        monto: s.monto
      }))
    },
    liabilities: {
      total: totalDebts,
      breakdown: debts.map(d => ({
        prestador: d.prestador,
        tipo: d.tipo,
        saldoPendiente: d.saldoPendiente,
        estado: d.estado
      }))
    },
    netWorth
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
  const debts = await Debt.find({ 
    perfilID: profileId,
    estado: { $ne: 'Pagada' }
  });
  const totalDebt = debts.reduce((sum, d) => sum + (d.saldoPendiente || 0), 0);
  const monthlyIncome = income / 1; // Assuming last 30 days = 1 month
  const debtToIncomeRatio = monthlyIncome > 0 ? (totalDebt / monthlyIncome) : 0;
  const debtScore = Math.max(0, 25 - (debtToIncomeRatio * 5)); // Lower is better
  score += debtScore;
  factors.debtToIncomeRatio = {
    value: debtToIncomeRatio.toFixed(2),
    score: debtScore.toFixed(2),
    max: 25
  };

  // Factor 3: Account diversity (0-15 points)
  const accounts = await Account.find({ usuarioID: userId });
  const accountDiversityScore = Math.min(15, accounts.length * 3); // 5+ accounts = 15 points
  score += accountDiversityScore;
  factors.accountDiversity = {
    value: accounts.length,
    score: accountDiversityScore.toFixed(2),
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
  const assets = await Asset.find({ perfilID: profileId });
  const totalAssets = assets.reduce((sum, a) => sum + (a.valor || 0), 0);
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

  // Get accounts summary - Account is linked to usuarioID (User)
  const accounts = await Account.find({ usuarioID: userId });
  const totalAccountBalance = accounts.reduce((sum, a) => sum + (a.saldoDisponible || 0), 0);

  // Get debts summary
  const debts = await Debt.find({ 
    perfilID: { $in: profileIds },
    estado: { $ne: 'Pagada' }
  });
  const totalDebt = debts.reduce((sum, d) => sum + (d.saldoPendiente || 0), 0);

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
    accounts: {
      total: accounts.length,
      totalBalance: totalAccountBalance,
      accounts: accounts.map(a => ({
        id: a._id,
        nombre: a.nombre,
        banco: a.banco,
        tipoCuenta: a.tipoCuenta,
        saldo: a.saldoDisponible,
        favorito: a.favorito
      }))
    },
    debts: {
      total: debts.length,
      totalAmount: totalDebt,
      activeDebts: debts.filter(d => d.estado === 'Activa').length,
      debts: debts.map(d => ({
        id: d._id,
        prestador: d.prestador,
        tipo: d.tipo,
        saldoPendiente: d.saldoPendiente,
        estado: d.estado
      }))
    },
    profiles: profiles.map(p => ({
      id: p._id,
      nombrePerfil: p.nombrePerfil,
      isDefault: p.isDefault
    }))
  };
};

