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

// import your DB connect but don't let it crash the module import
const connectDB = require('./config/database');

console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);

const app = express();

// -------------------------------
// ✅ MULTI-ORIGIN CORS SUPPORT
// -------------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL_1,
  process.env.FRONTEND_URL_2,
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('❌ CORS BLOCKED:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ---------------------
// Middleware
// ---------------------
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------------
// Routes (lazy require so module loads quickly)
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
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS Error: Origin not allowed' });
  }
  console.error('🔥 Global error:', err && (err.stack || err.message || err));
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === "development" && { error: err && err.message })
  });
});

// Connect to DB but catch errors so module import doesn't crash
(async () => {
  try {
    // check required envs
    const missing = [];
    if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
    if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');
    if (missing.length) {
      console.warn('⚠️ Missing required env vars:', missing.join(', '));
      // don't throw here so serverless can still start — but DB-dependent endpoints may fail
    } else {
      await connectDB();
      console.log('✅ DB connected (attempted at module load)');
    }
  } catch (err) {
    console.error('DB connection failed during startup (caught):', err && (err.message || err));
    // do not rethrow — rethrowing would crash the function on import
  }
})();

// Export the express app so serverless wrapper can use it
module.exports = app;
