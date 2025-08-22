const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/database'); // initialize DB once

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transactions');

dotenv.config();
const app = express();

// Render/Vercel sit behind a proxy; needed for secure cookies
app.set('trust proxy', 1);

// Allow local + your deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

// Optionally allow Vercel preview deployments (*.vercel.app)
// Comment out if you don’t want previews to work.
// const allowVercelPreview = (origin) =>
//   typeof origin === 'string' && origin.endsWith('.vercel.app');

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // Postman / server-to-server
    if (allowedOrigins.includes(origin) /* || allowVercelPreview(origin) */) {
      return cb(null, true);
    }
    return cb(null, false); // not allowed, but don’t throw
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'HELLO WORLD 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
