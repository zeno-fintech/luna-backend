require('dotenv').config();

// Configure path aliases FIRST (before any other imports)
require('./config/aliases');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('@core/config/database');
const rateLimit = require('express-rate-limit');

// Import routes - Level 1 (Admin)
const tenantRoutes = require('@level1/routes/tenants');
const adminRoutes = require('@level1/routes/admin');

// Import routes - Level 2 (Tenant/Company)
const companyRoutes = require('@level2/routes/companies');
const tenantDashboardRoutes = require('@level2/routes/dashboard');

// Import routes - Level 3 (User final)
const authRoutes = require('@level3/routes/auth');
const transactionRoutes = require('@level3/routes/transactions');
const analyticsRoutes = require('@level3/routes/analytics');
const profileRoutes = require('@level3/routes/profiles');
const accountRoutes = require('@level3/routes/accounts');
const debtRoutes = require('@level3/routes/debts');
const paymentRoutes = require('@level3/routes/payments');
const financialBoardRoutes = require('@level3/routes/financialBoards');
const incomeRoutes = require('@level3/routes/incomes');
const categoryRoutes = require('@level3/routes/categories');
const ruleRoutes = require('@level3/routes/rules');
const assetRoutes = require('@level3/routes/assets');
const savingsRoutes = require('@level3/routes/savings');
const budgetRoutes = require('@level3/routes/budgets');
const aiSuggestionsRoutes = require('@level3/routes/aiSuggestions');
const appRoutes = require('@level3/routes/app');
const currencyRoutes = require('@level3/routes/currencies');
const countryRoutes = require('@level3/routes/countries');

const errorHandler = require('@core/middleware/errorHandler');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'LUNA Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'LUNA API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      // Level 1 - Admin
      admin: {
        tenants: '/api/v1/admin/tenants',
        overview: '/api/v1/admin/overview',
        metrics: '/api/v1/admin/metrics'
      },
      // Level 2 - Tenant/Company
      tenant: {
        companies: '/api/v1/tenant/companies',
        dashboard: '/api/v1/tenant/dashboard'
      },
      // Level 3 - User final
      auth: '/api/v1/auth',
      transactions: '/api/v1/transactions',
      analytics: '/api/v1/analytics',
      profiles: '/api/v1/profiles',
      accounts: '/api/v1/accounts',
      debts: {
        list: '/api/v1/debts?perfilID=xxx',
        detail: '/api/v1/debts/:id',
        create: '/api/v1/debts',
        update: '/api/v1/debts/:id',
        delete: '/api/v1/debts/:id',
        pay: '/api/v1/debts/:id/pay',
        summary: '/api/v1/debts/summary?perfilID=xxx'
      },
      payments: {
        list: '/api/v1/payments?perfilID=xxx&deudaID=xxx',
        detail: '/api/v1/payments/:id',
        create: '/api/v1/payments',
        update: '/api/v1/payments/:id',
        delete: '/api/v1/payments/:id'
      },
      financialBoards: {
        list: '/api/v1/financial-boards?perfilID=xxx&año=2024&mes=1',
        detail: '/api/v1/financial-boards/:id',
        create: '/api/v1/financial-boards',
        update: '/api/v1/financial-boards/:id',
        delete: '/api/v1/financial-boards/:id'
      },
      incomes: {
        list: '/api/v1/incomes?perfilID=xxx&tableroID=xxx&tipo=recurrente',
        detail: '/api/v1/incomes/:id',
        create: '/api/v1/incomes',
        update: '/api/v1/incomes/:id',
        delete: '/api/v1/incomes/:id'
      },
      categories: {
        list: '/api/v1/categories?tipo=Gasto',
        detail: '/api/v1/categories/:id',
        create: '/api/v1/categories',
        update: '/api/v1/categories/:id',
        delete: '/api/v1/categories/:id'
      },
      rules: {
        list: '/api/v1/rules?tableroID=xxx',
        detail: '/api/v1/rules/:id',
        create: '/api/v1/rules',
        update: '/api/v1/rules/:id',
        delete: '/api/v1/rules/:id'
      },
      assets: {
        list: '/api/v1/assets?perfilID=xxx&tipo=Propiedades',
        detail: '/api/v1/assets/:id',
        create: '/api/v1/assets',
        update: '/api/v1/assets/:id',
        delete: '/api/v1/assets/:id'
      },
      savings: {
        list: '/api/v1/savings?perfilID=xxx&tipo=Ahorro',
        detail: '/api/v1/savings/:id',
        create: '/api/v1/savings',
        update: '/api/v1/savings/:id',
        delete: '/api/v1/savings/:id'
      },
      budgets: {
        list: '/api/v1/budgets?perfilID=xxx&año=2024&mes=1&categoria=Gastos',
        detail: '/api/v1/budgets/:id',
        create: '/api/v1/budgets',
        update: '/api/v1/budgets/:id',
        delete: '/api/v1/budgets/:id'
      },
      aiSuggestions: {
        suggestBoardIcon: '/api/v1/ai/suggest-board-icon?nombre=Casa',
        suggestFixedExpenses: '/api/v1/ai/suggest-fixed-expenses?perfilID=xxx&tableroID=xxx'
      },
      countries: {
        list: '/api/v1/countries?region=Sudamérica',
        detail: '/api/v1/countries/:codigo'
      },
      currencies: {
        list: '/api/v1/currencies',
        detail: '/api/v1/currencies/:codigo'
      },
      app: {
        summary: '/api/v1/app/summary',
        netWorth: '/api/v1/app/net-worth',
        financialScore: '/api/v1/app/financial-score',
        insights: '/api/v1/app/insights'
      }
    }
  });
});

// Mount routes - Level 1 (Admin)
app.use('/api/v1/admin/tenants', tenantRoutes);
app.use('/api/v1/admin', adminRoutes);

// Mount routes - Level 2 (Tenant/Company)
app.use('/api/v1/tenant/companies', companyRoutes);
app.use('/api/v1/tenant/dashboard', tenantDashboardRoutes);

// Mount routes - Level 3 (User final)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/debts', debtRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/financial-boards', financialBoardRoutes);
app.use('/api/v1/incomes', incomeRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/rules', ruleRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/savings', savingsRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/ai', aiSuggestionsRoutes);
app.use('/api/v1/app', appRoutes);
app.use('/api/v1/currencies', currencyRoutes);
app.use('/api/v1/countries', countryRoutes);

// Error Handling Middleware
app.use(errorHandler);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start Server
const PORT = process.env.PORT || 3001; // Railway asigna el puerto automáticamente

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Wait for MongoDB connection before starting server
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 LUNA Backend running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

