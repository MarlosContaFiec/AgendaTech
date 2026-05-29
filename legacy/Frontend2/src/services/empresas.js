import { apiCall } from './api';

export async function apiEmpresasDestaque() {
  return apiCall('GET', '/api/empresas/destaques');
}
export async function apiListarEmpresas(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiCall('GET', `/api/empresas${qs ? '?' + qs : ''}`);
}
export async function apiListarNichos() {
  return apiCall('GET', '/api/empresas/nichos');
}
export async function apiPerfilPublicoEmpresa(id) {
  return apiCall('GET', `/api/empresas/${id}`);
}
export async function apiDisponibilidade(empresaId, servicoId, data) {
  return apiCall('GET', `/api/empresas/${empresaId}/disponibilidade?servico_id=${servicoId}&data=${data}`);
}
export async function apiCalendarioEmpresa(empresaId, ano, mes) {
  return apiCall('GET', `/api/empresas/${empresaId}/calendario?ano=${ano}&mes=${mes}`);
}
export async function apiFaqPublico(empresaId) {
  return apiCall('GET', `/api/mensagens/publico/${empresaId}/faq`);
}
