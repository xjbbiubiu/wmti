const mysql = require('mysql2/promise');
const path = require('path');

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

// 解析 IP 地域（离线库，无需外部 API）
let ip2region = null;
try {
  const Ip2Region = require('ip2region').default || require('ip2region');
  ip2region = new Ip2Region(path.join(__dirname, '..', '..', 'data', 'ip2region.xdb'));
} catch (e) {
  console.error('[Analytics] ip2region init failed:', e.message);
}

function parseIP(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return { country: '本地', province: '', city: '' };
  }
  if (!ip2region) return { country: '', province: '', city: '' };
  try {
    const result = ip2region.search(ip);
    if (result) {
      // ip2region 返回格式如 "中国|省|市" ，可能有多余空字节
      const country = (result.country || '').replace(/\x00/g, '').trim();
      const province = (result.province || '').replace(/\x00/g, '').trim();
      const city = (result.city || '').replace(/\x00/g, '').trim();
      return { country, province, city };
    }
  } catch (e) {
    // ignore
  }
  return { country: '', province: '', city: '' };
}

// 确保 page_views 表有新字段（幂等执行，启动时调用一次）
async function ensureColumns() {
  try {
    const p = getPool();
    const [cols] = await p.execute("SHOW COLUMNS FROM page_views LIKE 'country'");
    if (cols.length === 0) {
      await p.execute(`
        ALTER TABLE page_views
        ADD COLUMN country VARCHAR(64) DEFAULT '' AFTER browser,
        ADD COLUMN province VARCHAR(64) DEFAULT '' AFTER country,
        ADD COLUMN city VARCHAR(64) DEFAULT '' AFTER province
      `);
      console.log('[Analytics] ALTER TABLE page_views: country/province/city added');
    }
  } catch (err) {
    console.error('[Analytics] ensureColumns error:', err.message);
  }
}

async function trackEvent({
  event_type,
  ip,
  user_agent,
  country,
  province,
  city,
  referer,
  url_path,
  quiz_type,
  quiz_type_code,
  session_id
}) {
  // 自动解析 IP 地域（如果调用方未传入）
  if (!country && !province && !city) {
    const geo = parseIP(ip);
    country = geo.country;
    province = geo.province;
    city = geo.city;
  }

  try {
    const { device, os, browser } = parseUA(user_agent);
    const p = getPool();
    await p.execute(
      `INSERT INTO page_views
        (event_type, ip, user_agent, device_type, os, browser, country, province, city, referer, url_path, quiz_type, quiz_type_code, session_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_type || null,
        ip || null,
        user_agent || null,
        device || null,
        os || null,
        browser || null,
        country || null,
        province || null,
        city || null,
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

// 启动时执行一次，确保表结构正确
ensureColumns();

module.exports = { trackEvent, getPool };
