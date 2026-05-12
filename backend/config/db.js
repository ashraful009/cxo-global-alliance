const mongoose = require('mongoose');

// Cache the connection across serverless function invocations.
// Without this, every cold-start would open a new connection and
// exhaust MongoDB's connection pool quickly.
let cached = global._mongooseConnection;

const connectDB = async () => {
  // Already connected — reuse the existing connection
  if (cached && cached.readyState === 1) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
    global._mongooseConnection = mongoose.connection;
    cached = global._mongooseConnection;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
