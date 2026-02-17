const Tenant = require('@models/Tenant');
const Company = require('@models/Company');
const User = require('@models/User');
const Transaction = require('@models/Transaction');
const Subscription = require('@models/Subscription');
const Profile = require('@models/Profile');
const Activo = require('@models/Activo'); // Reemplaza Account
const MetricsSnapshot = require('@models/MetricsSnapshot');

// Get global overview metrics (Nivel 1 - Holding)
exports.getGlobalOverview = async () => {
  // Total tenants
  const totalTenants = await Tenant.countDocuments({ isActive: true });
  
  // Total companies
  const totalCompanies = await Company.countDocuments({ isActive: true });
  
  // Total users
  const totalUsers = await User.countDocuments({ isActive: true });
  const activeUsers = await User.countDocuments({ 
    isActive: true,
    lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
  });
  
  // New users last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = await User.countDocuments({
    isActive: true,
    createdAt: { $gte: thirtyDaysAgo }
  });

  // Tenants by type
  const tenantsByType = await Tenant.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Users by tenant
  const usersByTenant = await User.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$tenantId',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'tenants',
        localField: '_id',
        foreignField: '_id',
        as: 'tenant'
      }
    },
    {
      $unwind: {
        path: '$tenant',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        tenantId: '$_id',
        tenantName: '$tenant.name',
        tenantSlug: '$tenant.slug',
        userCount: '$count'
      }
    },
    {
      $sort: { userCount: -1 }
    },
    {
      $limit: 10
    }
  ]);

  // Users by plan level
  const usersByPlan = await User.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$planLevel',
        count: { $sum: 1 }
      }
    }
  ]);

  // Active subscriptions
  const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
  
  // Calculate MRR (Monthly Recurring Revenue)
  const subscriptions = await Subscription.find({ 
    status: 'active',
    renewalType: { $in: ['monthly', 'yearly'] }
  });
  
  let mrr = 0;
  subscriptions.forEach(sub => {
    if (sub.renewalType === 'monthly') {
      mrr += sub.amount;
    } else if (sub.renewalType === 'yearly') {
      mrr += sub.amount / 12;
    }
  });

  // Transactions last 30 days
  const userIds = await User.find({ isActive: true }).select('_id');
  const userIdArray = userIds.map(u => u._id);
  const profiles = await Profile.find({ usuarioID: { $in: userIdArray } }).select('_id');
  const profileIds = profiles.map(p => p._id);
  
  const totalTransactions = await Transaction.countDocuments({
    perfilID: { $in: profileIds },
    fecha: { $gte: thirtyDaysAgo }
  });

  const transactions = await Transaction.find({
    perfilID: { $in: profileIds },
    fecha: { $gte: thirtyDaysAgo }
  });

  const totalIncome = transactions
    .filter(t => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  const totalExpenses = transactions
    .filter(t => t.tipo === 'Gasto')
    .reduce((sum, t) => sum + (t.monto || 0), 0);

  // Top tenants by user count
  const topTenants = await User.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$tenantId',
        userCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'tenants',
        localField: '_id',
        foreignField: '_id',
        as: 'tenant'
      }
    },
    {
      $unwind: {
        path: '$tenant',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        tenantId: '$_id',
        tenantName: '$tenant.name',
        tenantSlug: '$tenant.slug',
        tenantType: '$tenant.type',
        userCount: '$userCount'
      }
    },
    {
      $sort: { userCount: -1 }
    },
    {
      $limit: 10
    }
  ]);

  return {
    overview: {
      totalTenants,
      totalCompanies,
      totalUsers,
      activeUsers,
      newUsers,
      activeSubscriptions,
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(mrr * 12 * 100) / 100,
      totalTransactionsLast30Days: totalTransactions,
      totalIncomeLast30Days: totalIncome,
      totalExpensesLast30Days: totalExpenses,
      netBalanceLast30Days: totalIncome - totalExpenses
    },
    tenantsByType: tenantsByType.map(t => ({
      type: t._id,
      count: t.count
    })),
    usersByPlan: usersByPlan.map(p => ({
      planLevel: p._id || 'free',
      count: p.count
    })),
    topTenants,
    usersByTenant: usersByTenant.slice(0, 10)
  };
};

// Get tenant details for admin view
exports.getTenantDetails = async (tenantId) => {
  const tenant = await Tenant.findById(tenantId)
    .populate('createdBy', 'nombres apellidos correo');

  if (!tenant) {
    throw new Error('Tenant no encontrado');
  }

  const totalUsers = await User.countDocuments({ 
    tenantId: tenant._id, 
    isActive: true 
  });
  
  const totalCompanies = await Company.countDocuments({ 
    tenantId: tenant._id, 
    isActive: true 
  });

  const activeSubscriptions = await Subscription.countDocuments({
    scope: 'user',
    status: 'active',
    targetId: { $in: await User.find({ tenantId: tenant._id }).select('_id').then(users => users.map(u => u._id)) }
  });

  return {
    tenant: {
      id: tenant._id,
      name: tenant.name,
      slug: tenant.slug,
      type: tenant.type,
      defaultCurrency: tenant.defaultCurrency,
      defaultCountry: tenant.defaultCountry,
      branding: tenant.branding,
      config: tenant.config,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt
    },
    metrics: {
      totalUsers,
      totalCompanies,
      activeSubscriptions
    }
  };
};

// Calculate and save metrics snapshot
exports.calculateAndSaveSnapshot = async (scope, targetId, period, periodValue) => {
  let metrics = {};

  if (scope === 'global') {
    const overview = await this.getGlobalOverview();
    metrics = {
      totalUsers: overview.overview.totalUsers,
      activeUsers: overview.overview.activeUsers,
      newUsers: overview.overview.newUsers,
      totalCompanies: overview.overview.totalCompanies,
      totalTransactions: overview.overview.totalTransactionsLast30Days,
      totalIncome: overview.overview.totalIncomeLast30Days,
      totalExpenses: overview.overview.totalExpensesLast30Days,
      netBalance: overview.overview.netBalanceLast30Days,
      activeSubscriptions: overview.overview.activeSubscriptions,
      mrr: overview.overview.mrr,
      arr: overview.overview.arr,
      usersByPlan: overview.usersByPlan,
      custom: {
        tenantsByType: overview.tenantsByType,
        topTenants: overview.topTenants
      }
    };
  } else if (scope === 'tenant') {
    // Similar logic for tenant-specific metrics
    const tenantId = targetId;
    const totalUsers = await User.countDocuments({ tenantId, isActive: true });
    const totalCompanies = await Company.countDocuments({ tenantId, isActive: true });
    
    metrics = {
      totalUsers,
      activeUsers: totalUsers, // Simplified
      totalCompanies,
      activeSubscriptions: 0 // Would need to calculate
    };
  }

  // Save or update snapshot
  await MetricsSnapshot.findOneAndUpdate(
    { scope, targetId, period, periodValue },
    { 
      metrics,
      calculatedAt: new Date()
    },
    { upsert: true, new: true }
  );
};

