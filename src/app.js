const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { specs, swaggerUi, swaggerServe } = require('./config/swagger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Health
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

// Swagger
app.use('/api-docs', swaggerServe, swaggerUi.setup(specs));

// Static web demo (Projects screen)
app.use('/web', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', require('./interface/routes'));

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;


