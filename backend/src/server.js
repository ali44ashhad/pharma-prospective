// // backend/src/server.js
// require('dotenv').config();
// console.log('JWT_SECRET loaded into process:', !!process.env.JWT_SECRET);
// const express = require('express');
// const cookieParser = require('cookie-parser');
// const connectDB = require('./config/database');
// const { authenticate } = require('./middleware/auth');

// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Security headers are set in production via reverse proxy
// if (process.env.NODE_ENV === 'development') {
//   const cors = require('cors');
//   app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true
//   }));
// }

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/papers', require('./routes/papers'));

// // Health check route
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'Server is running', 
//     timestamp: new Date().toISOString() 
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Global error handler:', err);
//   res.status(500).json({
//     success: false,
//     message: 'Internal server error',
//     ...(process.env.NODE_ENV === 'development' && { error: err.message })
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
// });




// server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();

// -------------------------------
// Multi-origin CORS config (reusable)
const allowedOrigins = [
  process.env.FRONTEND_URL_1,
  process.env.FRONTEND_URL_2,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow tools like curl/postman (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('❌ CORS BLOCKED:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // ensure preflight uses same options

// --------------------- middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------------- Routes
// IMPORTANT: register routes WITHOUT the '/api' prefix here.
// We'll mount this Express app as a serverless function at /api
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/papers', require('./routes/papers'));

// health (accessible at /api/health)
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server running', timestamp: new Date().toISOString() });
});

// 404
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// global error handler
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS Error: Origin not allowed' });
  }
  console.error('🔥 Global error:', err && (err.stack || err.message || err));
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err && err.message })
  });
});

// Try to connect to DB but do not throw on import — log errors instead
(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI not set — DB will not connect in this environment');
      return;
    }
    await connectDB();
    console.log('✅ DB connected (attempted at import)');
  } catch (e) {
    console.error('DB connection failed (caught):', e && (e.message || e));
    // intentionally not rethrowing to avoid crashing function import
  }
})();

module.exports = app;
