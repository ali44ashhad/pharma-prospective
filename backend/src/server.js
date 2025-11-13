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
console.log('JWT_SECRET loaded into process:', !!process.env.JWT_SECRET);

const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const cors = require('cors');

const app = express();

// Connect to database
connectDB();

// -------------------------------
// ✅ MULTI-ORIGIN CORS SUPPORT
// -------------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL_1,
  process.env.FRONTEND_URL_2,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean); // remove empty/undefined values

// build a reusable corsOptions object and handler
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn('❌ CORS BLOCKED:', origin);
      // signal to cors middleware that origin is not allowed
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false, // let cors return the response
  optionsSuccessStatus: 204
};

// Use the configured CORS for all routes
app.use(cors(corsOptions));

// Ensure preflight responses use the same options
app.options('*', cors(corsOptions));

// ---------------------
// Middleware
// ---------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------------
// Routes
// ---------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/papers', require('./routes/papers'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // If the error is a CORS error thrown by the origin check, respond with 403
  if (err && err.message === 'Not allowed by CORS') {
    console.warn('CORS error for request origin:', req.headers.origin);
    return res.status(403).json({
      success: false,
      message: 'CORS Error: Origin not allowed'
    });
  }

  console.error('🔥 Global error:', err);

  // fallback 500
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === "development" && { error: err && err.message })
  });
});

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🌍 Allowed origins:", allowedOrigins);
});
