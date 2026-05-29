import { api } from './api'
import { clearSession, saveSession } from './session'

export async function loginRequest(documento, senha) {
  return api('/api/auth/login', { method: 'POST', body: { documento, senha }, auth: false })
}

export async function registerClienteRequest(payload) {
  return api('/api/auth/register/cliente', { method: 'POST', body: payload, auth: false })
}

export async function registerEmpresaRequest(payload) {
  return api('/api/auth/register/empresa', { method: 'POST', body: payload, auth: false })
}

export async function verifyTokenRequest(token) {
  return api(`/api/auth/verificar/${token}`, { method: 'GET', auth: false })
}

export async function resendVerificationRequest(email) {
  return api('/api/auth/reenviar-verificacao', { method: 'POST', body: { email }, auth: false })
}

export async function meRequest(token = null) {
  return api('/api/auth/me', { method: 'GET', token })
}

export function persistLogin(session) {
  saveSession(session)
}

export function logoutSession() {
  clearSession()
}
