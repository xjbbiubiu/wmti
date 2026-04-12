const express = require('express');
const cors = require('cors');
const path = require('path');
const questionRoutes = require('./routes/questions');
const resultRoutes = require('./routes/results');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const BASE_PATH = '/wmti';

app.use(cors());
app.use(express.json());

// Strip /wmti prefix in production
if (isProduction) {
  app.use((req, res, next) => {
    if (req.path.startsWith(BASE_PATH)) {
      req.url = req.url.replace(BASE_PATH, '') || '/';
    }
    next();
  });
}

// Posters are always served from backend/public
app.use('/posters', express.static(path.join(__dirname, '..', 'public', 'posters')));

// API routes
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WMTI backend is running' });
});

// Serve frontend in production
if (isProduction) {
  const staticPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(staticPath));

  // SPA fallback
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  console.log(`[Production] Serving frontend from ${staticPath} under ${BASE_PATH}`);
}

app.listen(PORT, () => {
  console.log(`WMLS Backend server running on port ${PORT}`);
});

module.exports = app;
