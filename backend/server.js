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

connectDB();
connectCloudinary();

const corsOptions = {
  origin: true,            // Reflect the request origin (allows all origins)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Handle CORS preflight (OPTIONS) for ALL routes BEFORE any auth middleware
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

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
