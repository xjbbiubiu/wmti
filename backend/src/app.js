const express = require('express');
const cors = require('cors');
const path = require('path');
const questionRoutes = require('./routes/questions');
const resultRoutes = require('./routes/results');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/posters', express.static(path.join(__dirname, '..', 'public', 'posters')));

app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WMTI backend is running' });
});

app.listen(PORT, () => {
  console.log(`WMLS Backend server running on port ${PORT}`);
});

module.exports = app;
