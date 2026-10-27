import axios from 'axios'

// Same-origin `/api` — Vite proxies it to the Express server in dev, so the
// httpOnly auth cookie works without CORS.
export const api = axios.create({ baseURL: '/api', withCredentials: true })

export function errorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return err?.response?.data?.message || fallback
}

// Only same-site paths are honoured, so ?next= can't redirect off the store.
export function safeNext(searchParams, fallback = '/account') {
  const next = searchParams.get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}
