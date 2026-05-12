require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { connectCloudinary } = require('./config/cloudinary');

const authRoutes        = require('./routes/authRoutes');
const eventRoutes       = require('./routes/eventRoutes');
const facilityRoutes    = require('./routes/facilityRoutes');
const serviceRoutes     = require('./routes/serviceRoutes');
const userRoutes        = require('./routes/userRoutes');
const userServiceRoutes = require('./routes/userServiceRoutes');
const contactRoutes     = require('./routes/contactRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');

const app = express();

connectCloudinary();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB on each request (safe for serverless — cached after first call)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth',          authRoutes);
app.use('/api/events',        eventRoutes);
app.use('/api/facilities',    facilityRoutes);
app.use('/api/services',      serviceRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/user-services', userServiceRoutes);
app.use('/api/contact',       contactRoutes);
app.use('/api/settings',      siteSettingsRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.use((err, req, res, next) => {
  // Always stamp CORS headers on error responses — Vercel serverless
  // can strip headers set by earlier middleware on non-2xx responses.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Only call app.listen() in local development.
// On Vercel (serverless), we export the app — Vercel handles the HTTP layer.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
  );
}

module.exports = app;
