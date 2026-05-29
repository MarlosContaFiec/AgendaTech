import { apiCall } from './api';

export async function apiPerfilCliente() {
  return apiCall('GET', '/api/cliente/perfil');
}
export async function apiAtualizarPerfilCliente(dados) {
  return apiCall('PUT', '/api/cliente/perfil', dados);
}
export async function apiCalendarioCliente() {
  return apiCall('GET', '/api/cliente/calendario');
}
export async function apiScoreCliente() {
  return apiCall('GET', '/api/cliente/score');
}
export async function apiEnviarDocumento(dados) {
  return apiCall('POST', '/api/cliente/documentos', dados);
}
export async function apiListarDocumentos() {
  return apiCall('GET', '/api/cliente/documentos');
}
export async function apiSalvarCartao(dados) {
  return apiCall('POST', '/api/cliente/cartoes', dados);
}
export async function apiRemoverCartao(id) {
  return apiCall('DELETE', `/api/cliente/cartoes/${id}`);
}
