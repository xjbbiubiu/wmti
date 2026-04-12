const express = require('express');
const { trackEvent } = require('../middleware/analytics');

const router = express.Router();

// POST /api/analytics/track
// body: { event_type, quiz_type?, quiz_type_code?, session_id? }
router.post('/track', async (req, res) => {
  const {
    event_type,
    quiz_type,
    quiz_type_code,
    session_id
  } = req.body;

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.headers['x-real-ip']
    || req.ip
    || req.connection?.remoteAddress
    || '';

  const user_agent = req.headers['user-agent'] || '';
  const referer = req.headers['referer'] || req.headers['refer'] || '';
  const url_path = req.originalUrl || '';

  if (!event_type) {
    return res.status(400).json({ error: 'event_type required' });
  }

  // 异步记录，不阻塞响应
  trackEvent({
    event_type,
    ip,
    user_agent,
    referer,
    url_path,
    quiz_type,
    quiz_type_code,
    session_id
  });

  res.json({ ok: 1 });
});

// GET /api/analytics/stats - 简单的统计数据（可后续扩展）
router.get('/stats', async (req, res) => {
  try {
    const { getPool } = require('../middleware/analytics');
    const p = getPool();
    const [rows] = await p.execute(`
      SELECT
        event_type,
        COUNT(*) as count,
        DATE(created_at) as date
      FROM page_views
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY event_type, DATE(created_at)
      ORDER BY date DESC
    `);
    const [total] = await p.execute(`
      SELECT event_type, COUNT(*) as total FROM page_views GROUP BY event_type
    `);
    const totalMap = Object.fromEntries(total.map(r => [r.event_type, r.total]));
    res.json({ daily: rows, total: totalMap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
