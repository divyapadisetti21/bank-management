const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const pool = require('./config/database'); // ✅ database connection

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transactions');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();
const app = express();

// ✅ Allowed origins (both local + deployed frontend)
const allowedOrigins = [
  'http://localhost:3000',          // Local React frontend
  process.env.FRONTEND_URL || ''    // Deployed frontend (from .env)
];

// ✅ CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman/server-to-server
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'HELLO WORLD 🚀' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
