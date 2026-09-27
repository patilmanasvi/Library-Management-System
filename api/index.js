const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
// Import route modules
const bookRoutes = require('../routes/books');
const authRoutes = require('../routes/auth');
const borrowRoutes = require('../routes/borrows');
const paymentRoutes = require('../routes/payments');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (React build) when built
app.use(express.static(path.join(__dirname, '..', 'build')));

// Mount API routes under /api
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/payments', paymentRoutes);

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = serverless(app);
