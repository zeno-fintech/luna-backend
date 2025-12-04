const User = require('@models/User');
const Company = require('@models/Company');
const Transaction = require('@models/Transaction');
const Profile = require('@models/Profile');
const Subscription = require('@models/Subscription');

// Get tenant dashboard metrics
exports.getTenantMetrics = async (tenantId) => {
  const tenantIdObj = tenantId._id || tenantId;

  // Total users
  const totalUsers = await User.countDocuments({ tenantId: tenantIdObj, isActive: true });
  
  // Total companies
  const totalCompanies = await Company.countDocuments({ tenantId: tenantIdObj, isActive: true });

  // Users by company
  const usersByCompany = await User.aggregate([
    {
      $match: {
        tenantId: tenantIdObj,
        isActive: true,
        companyId: { $exists: true, $ne: null }
      }
    },
    {
      $group: {
        _id: '$companyId',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'companies',
        localField: '_id',
        foreignField: '_id',
        as: 'company'
      }
    },
    {
      $unwind: {
        path: '$company',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        companyId: '$_id',
        companyName: '$company.name',
        userCount: '$count'
      }
    }
  ]);

  // Users by plan level
  const usersByPlan = await User.aggregate([
    {
      $match: {
        tenantId: tenantIdObj,
        isActive: true
      }
    },
    {
      $group: {
        _id: '$planLevel',
        count: { $sum: 1 }
      }
    }
  ]);

  // Total profiles
  const userIds = await User.find({ tenantId: tenantIdObj, isActive: true }).select('_id');
  const userIdArray = userIds.map(u => u._id);
  const totalProfiles = await Profile.countDocuments({ usuarioID: { $in: userIdArray } });

  // Total transactions (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const totalTransactions = await Transaction.countDocuments({
    perfilID: { $in: userIdArray },
    fecha: { $gte: thirtyDaysAgo }
  });

  // Active subscriptions
  const activeSubscriptions = await Subscription.countDocuments({
    scope: 'user',
    targetId: { $in: userIdArray },
    status: 'active'
  });

  // Users by country (if available)
  const usersByCountry = await User.aggregate([
    {
      $match: {
        tenantId: tenantIdObj,
        isActive: true
      }
    },
    {
      $group: {
        _id: '$domicilio', // This could be enhanced with a country field
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        location: '$_id',
        userCount: '$count'
      }
    }
  ]);

  return {
    overview: {
      totalUsers,
      totalCompanies,
      totalProfiles,
      activeSubscriptions,
      totalTransactionsLast30Days: totalTransactions
    },
    usersByCompany,
    usersByPlan: usersByPlan.map(p => ({
      planLevel: p._id || 'free',
      count: p.count
    })),
    usersByCountry: usersByCountry.filter(u => u.location).slice(0, 10) // Top 10
  };
};

// Get company metrics (for company admins)
exports.getCompanyMetrics = async (companyId, tenantId) => {
  const companyIdObj = companyId._id || companyId;
  const tenantIdObj = tenantId._id || tenantId;

  // Total users in company
  const totalUsers = await User.countDocuments({
    companyId: companyIdObj,
    tenantId: tenantIdObj,
    isActive: true
  });

  // Users by plan
  const usersByPlan = await User.aggregate([
    {
      $match: {
        companyId: companyIdObj,
        tenantId: tenantIdObj,
        isActive: true
      }
    },
    {
      $group: {
        _id: '$planLevel',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get user IDs for further queries
  const users = await User.find({
    companyId: companyIdObj,
    tenantId: tenantIdObj,
    isActive: true
  }).select('_id');
  const userIdArray = users.map(u => u._id);

  // Total profiles
  const totalProfiles = await Profile.countDocuments({
    usuarioID: { $in: userIdArray }
  });

  // Transactions last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const totalTransactions = await Transaction.countDocuments({
    perfilID: { $in: userIdArray },
    fecha: { $gte: thirtyDaysAgo }
  });

  return {
    overview: {
      totalUsers,
      totalProfiles,
      totalTransactionsLast30Days: totalTransactions
    },
    usersByPlan: usersByPlan.map(p => ({
      planLevel: p._id || 'free',
      count: p.count
    }))
  };
};

