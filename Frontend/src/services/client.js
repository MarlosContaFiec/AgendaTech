import { api, upload as uploadFile } from './api'
import { createCrudService } from './crudFactory'

export const getClientProfile = () => api('/api/cliente/perfil')
export const updateClientProfile = (payload) => api('/api/cliente/perfil', { method: 'PUT', body: payload })
export const getClientCalendar = () => api('/api/cliente/calendario')
export const getClientScore = () => api('/api/cliente/score')

const depCrud = createCrudService('/api/cliente/dependentes')
export const listDependents  = depCrud.list
export const createDependent = depCrud.create
export const updateDependent = depCrud.update
export const deleteDependent = depCrud.remove

const docCrud = createCrudService('/api/documentos')
export const listDocuments  = docCrud.list
export const createDocument = docCrud.create
export const deleteDocument = docCrud.remove
export const uploadSingle   = (file) => uploadFile('/api/upload/single', file)
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
