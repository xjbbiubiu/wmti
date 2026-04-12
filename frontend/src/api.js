const BASE = '/wmti'

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${BASE}${p}`
}

export function imageUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${BASE}${p}`
}

// 生成或获取 session_id（会话级唯一标识）
export function getSessionId() {
  let sid = sessionStorage.getItem('wmti_sid')
  if (!sid) {
    sid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    sessionStorage.setItem('wmti_sid', sid)
  }
  return sid
}

// 发送埋点（异步，不阻塞页面）
export function track(event_type, extra = {}) {
  const body = {
    event_type,
    session_id: getSessionId(),
    ...extra
  }
  navigator.sendBeacon?.(`${BASE}/api/analytics/track`, JSON.stringify(body))
  // fallback for sync
  fetch(`${BASE}/api/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true
  }).catch(() => {})
}
