import { apiCall } from './api';

export async function apiListarServicos() {
  return apiCall('GET', '/api/servicos');
}
export async function apiCriarServico(dados) {
  return apiCall('POST', '/api/servicos', dados);
}
export async function apiEditarServico(id, dados) {
  return apiCall('PUT', `/api/servicos/${id}`, dados);
}
export async function apiDeletarServico(id) {
  return apiCall('DELETE', `/api/servicos/${id}`);
}
