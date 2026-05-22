import { apiCall } from './api';

export async function apiPerfilEmpresa() {
  return apiCall('GET', '/api/empresa/perfil');
}
export async function apiAtualizarPerfilEmpresa(dados) {
  return apiCall('PUT', '/api/empresa/perfil', dados);
}
export async function apiDashboardEmpresa() {
  return apiCall('GET', '/api/empresa/dashboard');
}
export async function apiSalvarCapacidade(dados) {
  return apiCall('POST', '/api/empresa/capacidades', dados);
}
