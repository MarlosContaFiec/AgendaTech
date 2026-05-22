import { apiCall } from './api';

export async function apiListarConversas() {
  return apiCall('GET', '/api/mensagens/conversas');
}
export async function apiHistoricoConversa(clienteId) {
  return apiCall('GET', `/api/mensagens/conversas/${clienteId}`);
}
export async function apiEnviarMsgParaCliente(clienteId, mensagem, tipo = 'texto') {
  return apiCall('POST', `/api/mensagens/conversas/${clienteId}`, { mensagem, tipo });
}
export async function apiEnviarMsgParaEmpresa(empresaId, mensagem) {
  return apiCall('POST', `/api/mensagens/empresa/${empresaId}`, { mensagem });
}
export async function apiConfigChat(dados) {
  return apiCall('PUT', '/api/mensagens/chat-config', dados);
}
export async function apiAddFaq(dados) {
  return apiCall('POST', '/api/mensagens/chat-config/faq', dados);
}
