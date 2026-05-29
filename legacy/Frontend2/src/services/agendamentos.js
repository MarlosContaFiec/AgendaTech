import { apiCall } from './api';

export async function apiCriarAgendamento(dados) {
  return apiCall('POST', '/api/agendamentos', dados);
}
export async function apiAgendamentosCliente(status = null) {
  const qs = status ? `?status=${status}` : '';
  return apiCall('GET', `/api/agendamentos/cliente${qs}`);
}
export async function apiAgendamentosEmpresa(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiCall('GET', `/api/agendamentos/empresa${qs ? '?' + qs : ''}`);
}
export async function apiDetalheAgendamento(id) {
  return apiCall('GET', `/api/agendamentos/${id}`);
}
export async function apiCancelarAgendamento(id, motivo) {
  return apiCall('PUT', `/api/agendamentos/${id}/cancelar`, { motivo });
}
export async function apiReagendarAgendamento(id, dados) {
  return apiCall('PUT', `/api/agendamentos/${id}/reagendar`, dados);
}
export async function apiAceitarAgendamento(id) {
  return apiCall('PUT', `/api/agendamentos/${id}/aceitar`);
}
export async function apiRecusarAgendamento(id, motivo) {
  return apiCall('PUT', `/api/agendamentos/${id}/recusar`, { motivo });
}
export async function apiConcluirAgendamento(id) {
  return apiCall('PUT', `/api/agendamentos/${id}/concluir`);
}
export async function apiAvaliarAgendamento(agId, dados) {
  return apiCall('POST', `/api/avaliacoes/agendamento/${agId}`, dados);
}
