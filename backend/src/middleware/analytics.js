const mysql = require('mysql2/promise');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'wmti',
      password: process.env.MYSQL_PASSWORD || 'WmtiPass2026!',
      database: 'wmti',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

// 从 User-Agent 解析设备和浏览器信息
function parseUA(ua) {
  if (!ua) return { device: 'unknown', os: 'unknown', browser: 'unknown' };

  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua);
  const isTablet = /tablet|ipad/i.test(ua);
  const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

  let os = 'unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/mac os|macos|iphone|ipad|ipod/i.test(ua)) os = 'macOS/iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'unknown';
  if (/micromessenger|wechat/i.test(ua)) browser = 'WeChat';
  else if (/qq/i.test(ua)) browser = 'QQ';
  else if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/edg/i.test(ua)) browser = 'Edge';

  return { device, os, browser };
}

async function trackEvent({
  event_type,
  ip,
  user_agent,
  referer,
  url_path,
  quiz_type,
  quiz_type_code,
  session_id
}) {
  try {
    const { device, os, browser } = parseUA(user_agent);
    const p = getPool();
    await p.execute(
      `INSERT INTO page_views
        (event_type, ip, user_agent, device_type, os, browser, referer, url_path, quiz_type, quiz_type_code, session_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_type || null,
        ip || null,
        user_agent || null,
        device || null,
        os || null,
        browser || null,
        referer || null,
        url_path || null,
        quiz_type || null,
        quiz_type_code || null,
        session_id || null
      ]
    );
  } catch (err) {
    console.error('[Analytics] Track error:', err.message);
  }
}

module.exports = { trackEvent, getPool };
