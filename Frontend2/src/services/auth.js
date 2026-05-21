import { apiCall } from './api';

export async function apiLogin(cpfCnpj, senha) {
  return apiCall('POST', '/api/auth/login', { cpf_cnpj: cpfCnpj, senha });
}

export async function apiRegisterCliente(dados) {
  return apiCall('POST', '/api/auth/register/cliente', dados);
}

export async function apiRegisterEmpresa(dados) {
  return apiCall('POST', '/api/auth/register/empresa', dados);
}

export async function apiVerificarEmail(email, codigo, tipo) {
  return apiCall('POST', '/api/auth/verificar-email', { email, codigo, tipo });
}

export async function apiReenviarCodigo(email, tipo) {
  return apiCall('POST', '/api/auth/reenviar-codigo', { email, tipo });
}
