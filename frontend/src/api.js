/**
 * API base: dev 默认走 Vite proxy（/api → localhost:3000）；生产可设 VITE_API_BASE。
 */
export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  const base = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '')
  return `${base}${p}`
}

export function imageUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`
  const base = (import.meta.env.VITE_API_BASE ?? 'http://localhost:3000').replace(/\/$/, '')
  return `${base}${p}`
}
