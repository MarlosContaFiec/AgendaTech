const API_BASE = 'http://localhost:3000';

async function renovarToken() {
  const refresh = localStorage.getItem('tb_refresh');
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    const json = await res.json();
    if (json.success) {
      localStorage.setItem('tb_token', json.data.tokens.access);
      localStorage.setItem('tb_refresh', json.data.tokens.refresh);
      return json.data.tokens.access;
    }
  } catch {}
  return null;
}

export async function apiCall(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  const tk = token || localStorage.getItem('tb_token');
  if (tk) headers['Authorization'] = `Bearer ${tk}`;
  const opts = { method, headers };
  if (body && method !== 'GET') opts.body = JSON.stringify(body);
  try {
    let res = await fetch(`${API_BASE}${path}`, opts);
    if (res.status === 401 && tk) {
      const novo = await renovarToken();
      if (novo) {
        headers['Authorization'] = `Bearer ${novo}`;
        const retry = { method, headers };
        if (body && method !== 'GET') retry.body = JSON.stringify(body);
        res = await fetch(`${API_BASE}${path}`, retry);
      }
    }
    return res.json();
  } catch {
    return { success: false, message: 'Erro de conexão com o servidor.' };
  }
}

export function getToken() { return localStorage.getItem('tb_token'); }
export function getTipo() { return localStorage.getItem('tb_tipo'); }
export function salvarAuth(tipo, access, refresh) {
  localStorage.setItem('tb_token', access);
  localStorage.setItem('tb_refresh', refresh);
  localStorage.setItem('tb_tipo', tipo);
}
export function limparAuth() {
  localStorage.removeItem('tb_token');
  localStorage.removeItem('tb_refresh');
  localStorage.removeItem('tb_tipo');
}

export function getEmailNaoVerificado() { return localStorage.getItem('tb_email_pendente'); }
export function setEmailNaoVerificado(email) { localStorage.setItem('tb_email_pendente', email); }
export function limparEmailPendente() { localStorage.removeItem('tb_email_pendente'); }
