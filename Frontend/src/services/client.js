import { api, upload as uploadFile } from './api'

export const getClientProfile = () => api('/api/cliente/perfil')
export const updateClientProfile = (payload) => api('/api/cliente/perfil', { method: 'PUT', body: payload })
export const getClientCalendar = () => api('/api/cliente/calendario')
export const getClientScore = () => api('/api/cliente/score')

export const listDependents = () => api('/api/cliente/dependentes')
export const createDependent = (payload) => api('/api/cliente/dependentes', { method: 'POST', body: payload })
export const updateDependent = (id, payload) => api(`/api/cliente/dependentes/${id}`, { method: 'PUT', body: payload })
export const deleteDependent = (id) => api(`/api/cliente/dependentes/${id}`, { method: 'DELETE' })

export const listDocuments = () => api('/api/documentos')
export const createDocument = (payload) => api('/api/documentos', { method: 'POST', body: payload })
export const deleteDocument = (id) => api(`/api/documentos/${id}`, { method: 'DELETE' })
export const uploadSingle = (file) => uploadFile('/api/upload/single', file)
export const uploadMultiple = (files) => uploadFile('/api/upload/multiple', files, null, 'arquivos')

export const createSolicitacao = (payload) => api('/api/solicitacoes', { method: 'POST', body: payload })
export const listFila = () => api('/api/fila')
export const entrarFila = (payload) => api('/api/fila', { method: 'POST', body: payload })
export const sairFila = (id) => api(`/api/fila/${id}`, { method: 'DELETE' })
export const converterFila = (id) => api(`/api/fila/${id}/converter`, { method: 'PUT' })

export const listClientAppointments = (status='') => api(`/api/agendamentos/cliente${status ? `?status=${status}` : ''}`)
export const cancelAppointment = (id, motivo='') => api(`/api/agendamentos/${id}/cancelar`, { method: 'PUT', body: { motivo } })
export const rescheduleAppointment = (id, payload) => api(`/api/agendamentos/${id}/reagendar`, { method: 'PUT', body: payload })
export const createEvaluation = (agendamentoId, payload) => api(`/api/avaliacoes/agendamento/${agendamentoId}`, { method: 'POST', body: payload })

export const getNotifications = () => api('/api/notificacoes')
