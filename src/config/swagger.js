const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LUNA Backend API',
      version: '1.0.0',
      description: 'API REST para LUNA - Plataforma de educación financiera con IA y Blockchain',
      contact: {
        name: 'ZENO Financial Tech SPA',
        email: 'dev@zenofintech.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo local'
      },
      {
        url: 'https://tu-proyecto.railway.app',
        description: 'Servidor de producción (Railway)'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del endpoint /api/v1/auth/login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Endpoints de salud del servidor'
      },
      {
        name: 'Auth',
        description: 'Autenticación y registro de usuarios'
      },
      {
        name: 'Profiles',
        description: 'Gestión de perfiles financieros'
      },
      {
        name: 'Accounts',
        description: 'Gestión de cuentas bancarias'
      },
      {
        name: 'Transactions',
        description: 'Gestión de transacciones (ingresos/gastos)'
      },
      {
        name: 'Debts',
        description: 'Gestión de deudas'
      },
      {
        name: 'Payments',
        description: 'Gestión de pagos de deudas'
      },
      {
        name: 'Financial Boards',
        description: 'Gestión de tableros financieros mensuales'
      },
      {
        name: 'Incomes',
        description: 'Gestión de ingresos'
      },
      {
        name: 'Categories',
        description: 'Gestión de categorías'
      },
      {
        name: 'Rules',
        description: 'Gestión de reglas de presupuesto'
      },
      {
        name: 'Assets',
        description: 'Gestión de activos'
      },
      {
        name: 'Savings',
        description: 'Gestión de ahorros e inversiones'
      },
      {
        name: 'Budgets',
        description: 'Gestión de presupuestos'
      },
      {
        name: 'Analytics',
        description: 'Análisis y reportes financieros'
      },
      {
        name: 'App',
        description: 'Resúmenes y insights financieros'
      },
      {
        name: 'AI Suggestions',
        description: 'Sugerencias basadas en IA'
      },
      {
        name: 'Countries',
        description: 'Información de países (público)'
      },
      {
        name: 'Currencies',
        description: 'Información de monedas (público)'
      },
      {
        name: 'Admin',
        description: 'Endpoints de administración (Nivel 1 - SUPERADMIN)'
      },
      {
        name: 'Tenant',
        description: 'Endpoints de tenant/empresa (Nivel 2)'
      }
    ]
  },
  apis: [
    './src/index.js',
    './src/level3/routes/*.js',
    './src/level2/routes/*.js',
    './src/level1/routes/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerSetup = (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'LUNA API Documentation',
    customfavIcon: '/favicon.ico'
  }));

  // Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = { swaggerSetup, swaggerSpec };

