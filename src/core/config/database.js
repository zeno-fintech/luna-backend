const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/luna';
    
    const conn = await mongoose.connect(mongoURI, {
      // Opciones para mejor manejo de conexiones
      maxPoolSize: 10, // Mantener hasta 10 conexiones en el pool
      serverSelectionTimeoutMS: 5000, // Timeout para seleccionar servidor
      socketTimeoutMS: 45000, // Timeout para operaciones
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Manejo de eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    // Manejo de cierre graceful
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('💡 Asegúrate de que:');
    console.error('   1. MongoDB está corriendo o la URI es correcta');
    console.error('   2. La variable MONGODB_URI está configurada en .env');
    console.error('   3. Las credenciales son correctas');
    process.exit(1);
  }
};

module.exports = connectDB;

