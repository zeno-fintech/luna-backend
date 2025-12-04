# LUNA Backend API

Backend API para LUNA - Plataforma de educación financiera con IA y Blockchain

## 🚀 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB con Mongoose
- **Authentication:** JWT
- **Security:** Helmet, CORS, Rate Limiting
- **AI:** OpenAI / Custom AI Services (futuro)
- **Blockchain:** Ethereum / Custom Blockchain (futuro)

## 📋 Prerequisites

- Node.js 18+
- MongoDB 6+
- npm 9+

## 🔧 Installation

```bash
# Clone repository
git clone https://github.com/zeno-fintech/luna-backend.git
cd luna-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## 🏃 Running

```bash
# Development
npm run dev

# Production
npm start

# Tests
npm test

# Linting
npm run lint
npm run lint:fix
```

## 📁 Project Structure

```
luna-backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   │   ├── ai/        # AI services (futuro)
│   │   ├── blockchain/# Blockchain services (futuro)
│   │   ├── auth/      # Authentication services
│   │   └── analytics/ # Analytics services
│   ├── utils/          # Utilities
│   └── config/         # Configuration
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
└── docs/               # Documentation
```

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Registrar nuevo usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/me` - Obtener usuario actual (requiere autenticación)

### Transactions
- `GET /api/v1/transactions` - Obtener todas las transacciones
- `GET /api/v1/transactions/:id` - Obtener una transacción
- `POST /api/v1/transactions` - Crear nueva transacción
- `PUT /api/v1/transactions/:id` - Actualizar transacción
- `DELETE /api/v1/transactions/:id` - Eliminar transacción

### Profiles
- `GET /api/v1/profiles` - Obtener todos los perfiles
- `GET /api/v1/profiles/:id` - Obtener un perfil
- `POST /api/v1/profiles` - Crear nuevo perfil
- `PUT /api/v1/profiles/:id` - Actualizar perfil
- `DELETE /api/v1/profiles/:id` - Eliminar perfil

### Accounts
- `GET /api/v1/accounts` - Obtener todas las cuentas
- `GET /api/v1/accounts/:id` - Obtener una cuenta
- `POST /api/v1/accounts` - Crear nueva cuenta
- `PUT /api/v1/accounts/:id` - Actualizar cuenta
- `DELETE /api/v1/accounts/:id` - Eliminar cuenta

### Analytics
- `GET /api/v1/analytics/summary` - Resumen financiero
- `GET /api/v1/analytics/trends` - Tendencias mensuales

### Health Check
- `GET /health` - Health check del servidor

## 🔐 Environment Variables

Ver `.env.example` para todas las variables de entorno requeridas.

Principales variables:
- `PORT` - Puerto del servidor (default: 3000)
- `MONGODB_URI` - URI de conexión a MongoDB
- `JWT_SECRET` - Secreto para JWT tokens
- `JWT_EXPIRE` - Tiempo de expiración del token
- `CORS_ORIGIN` - Origen permitido para CORS

## 📝 Models

El backend incluye los siguientes modelos:

- **User** - Usuarios del sistema
- **Profile** - Perfiles de usuario
- **Account** - Cuentas bancarias
- **Transaction** - Transacciones (Ingresos/Gastos)
- **Category** - Categorías de transacciones
- **FinancialBoard** - Tableros financieros
- **Rule** - Reglas financieras
- **Debt** - Deudas
- **Payment** - Pagos
- **Savings** - Ahorros e inversiones
- **Asset** - Activos
- **Budget** - Presupuestos
- **Plan** - Planes de suscripción
- **Configuration** - Configuraciones de usuario
- **Currency** - Monedas

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 License

MIT

## 👥 Team

ZENO Financial Tech SPA
