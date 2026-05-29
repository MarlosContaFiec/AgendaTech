const ACCESS_KEY = 'agendatech_access_token'
const REFRESH_KEY = 'agendatech_refresh_token'
const USER_KEY = 'agendatech_user'

export function getSession() {
  return {
    access: localStorage.getItem(ACCESS_KEY) || '',
    refresh: localStorage.getItem(REFRESH_KEY) || '',
    user: safeJson(localStorage.getItem(USER_KEY)),
  }
}

export function saveSession({ access, refresh, user }) {
  if (access !== undefined) localStorage.setItem(ACCESS_KEY, access || '')
  if (refresh !== undefined) localStorage.setItem(REFRESH_KEY, refresh || '')
  if (user !== undefined) localStorage.setItem(USER_KEY, user ? JSON.stringify(user) : '')
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

function safeJson(value) {
  try { return value ? JSON.parse(value) : null } catch { return null }
}
