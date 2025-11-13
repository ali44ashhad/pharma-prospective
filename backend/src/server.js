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
].filter(Boolean); // remove empty values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no-origin requests (mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS BLOCKED:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Preflight
app.options("*", cors());

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
  console.error('🔥 Global error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === "development" && { error: err.message })
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
