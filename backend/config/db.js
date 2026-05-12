const mongoose = require('mongoose');

// Cache the connection across serverless function invocations.
// Without this, every cold-start would open a new connection and
// exhaust MongoDB's connection pool quickly.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGO_URI, {
    bufferCommands: false,
  });
};

module.exports = connectDB;
