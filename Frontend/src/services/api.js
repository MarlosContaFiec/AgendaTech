import { clearSession, getSession, saveSession } from './session'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function buildUrl(path) {
  return `${API_URL}${path}`
}

async function parseResponse(response) {
  try {
    return await response.json()
  } catch {
    return { success: false, message: 'Resposta inválida do servidor' }
  }
}

async function refreshTokens() {
  const { refresh } = getSession()
  if (!refresh) return null

  const response = await fetch(buildUrl('/api/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  })
  const payload = await parseResponse(response)
  const tokens = payload?.data?.tokens || payload?.tokens || payload?.data || null

  if (!response.ok || !tokens?.access) {
    clearSession()
    return null
  }

  saveSession({ access: tokens.access, refresh: tokens.refresh || refresh })
  return tokens
}

export async function api(path, { method = 'GET', body = null, token = null, auth = true, headers = {}, retry = true } = {}) {
  const session = getSession()
  const access = token || session.access

  const finalHeaders = { ...headers }
  let finalBody = undefined

  if (body instanceof FormData) {
    finalBody = body
  } else if (body !== null && body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json'
    finalBody = JSON.stringify(body)
  }

  if (auth && access) {
    finalHeaders.Authorization = `Bearer ${access}`
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers: finalHeaders,
    body: finalBody,
  })

  const payload = await parseResponse(response)

  if (response.status === 401 && auth && retry && !path.startsWith('/api/auth/login') && !path.startsWith('/api/auth/register') && !path.startsWith('/api/auth/verificar') && !path.startsWith('/api/auth/reenviar-verificacao')) {
    const tokens = await refreshTokens()
    if (tokens?.access) {
      return api(path, { method, body, token: tokens.access, auth, headers, retry: false })
    }
  }

  return {
    status: response.status,
    ok: response.ok,
    ...payload,
  }
}

export async function upload(path, file, token = null, fieldName = 'arquivo') {
  const formData = new FormData()
  if (Array.isArray(file)) {
    file.forEach((item) => formData.append(fieldName, item))
  } else {
    formData.append(fieldName, file)
  }
  return api(path, { method: 'POST', body: formData, token, auth: true })
}

export { API_URL, buildUrl }
