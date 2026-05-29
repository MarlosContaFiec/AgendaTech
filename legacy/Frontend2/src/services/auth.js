import { apiCall } from './api';

export async function apiLogin(documento, senha) {
  const documentoLimpo = documento.replace(/\D/g, '');
  return apiCall('POST', '/api/auth/login', { documento: documentoLimpo, senha });
}

export async function apiRegisterCliente(dados) {
  return apiCall('POST', '/api/auth/register/cliente', dados);
}

export async function apiRegisterEmpresa(dados) {
  return apiCall('POST', '/api/auth/register/empresa', dados);
}

export async function apiGetMe() {
  return apiCall('GET', '/api/auth/me');
}

export async function apiVerificarEmail(token) {
  return apiCall('GET', `/api/auth/verificar/${token}`);
}

export async function apiReenviarVerificacao(email) {
  return apiCall('POST', '/api/auth/reenviar-verificacao', { email });
}
