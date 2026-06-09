import { api } from './api'
import { createCrudService } from './crudFactory'

export const getCompanyProfile = () => api('/api/empresa/perfil')
export const updateCompanyProfile = (payload) => api('/api/empresa/perfil', { method: 'PUT', body: payload })
export const getCompanyDashboard = () => api('/api/empresa/dashboard')
export const listCapacities = () => api('/api/empresa/capacidades')
export const saveCapacity = (payload) => api('/api/empresa/capacidades', { method: 'POST', body: payload })
export const deleteCapacity = (id) => api(`/api/empresa/capacidades/${id}`, { method: 'DELETE' })

const servicoCrud = createCrudService('/api/servicos')
export const listServices  = servicoCrud.list
export const getService    = servicoCrud.get
export const createService = servicoCrud.create
export const updateService = servicoCrud.update
export const deleteService = servicoCrud.remove

const tagCrud = createCrudService('/api/tags')
export const listTags  = tagCrud.list
export const createTag = tagCrud.create
export const updateTag = tagCrud.update
export const deleteTag = tagCrud.remove

const ruleCrud = createCrudService('/api/regras')
export const listRules  = ruleCrud.list
export const createRule = ruleCrud.create
export const updateRule = ruleCrud.update
export const deleteRule = ruleCrud.remove
export const getRuleCalendar = (ano, mes) => api(`/api/regras/calendario?ano=${ano}&mes=${mes}`)
export const getRuleDay = (data) => api(`/api/regras/dia?data=${data}`)

const bizRuleCrud = createCrudService('/api/regras-negocio')
export const listBusinessRules    = (tipo='') => bizRuleCrud.list(tipo ? `?tipo=${tipo}` : '')
export const createBusinessRule   = bizRuleCrud.create
export const updateBusinessRule   = bizRuleCrud.update
export const deleteBusinessRule   = bizRuleCrud.remove
export const getBusinessRulePreview = (id) => api(`/api/regras-negocio/${id}/preview`)
export const getBusinessRuleVars    = () => api('/api/regras-negocio/template/vars')

const faqCrud = createCrudService('/api/mensagens/chat-config/faq')
export const createFaq = faqCrud.create
export const updateFaq = faqCrud.update
export const deleteFaq = faqCrud.remove

export const getPendingRequests = () => api('/api/solicitacoes/pendentes')
export const answerRequest = (id, payload) => api(`/api/solicitacoes/${id}/responder`, { method: 'PUT', body: payload })

export const listCompanyAppointments = (query='') => api(`/api/agendamentos/empresa${query}`)
export const getAppointment = (id) => api(`/api/agendamentos/${id}`)
export const acceptAppointment = (id) => api(`/api/agendamentos/${id}/aceitar`, { method: 'PUT' })
export const refuseAppointment = (id, payload) => api(`/api/agendamentos/${id}/recusar`, { method: 'PUT', body: payload })
export const concludeAppointment = (id) => api(`/api/agendamentos/${id}/concluir`, { method: 'PUT' })

export const listChatConversations = () => api('/api/mensagens/conversas')
export const getConversationMessages = (clienteId, query='') => api(`/api/mensagens/conversas/${clienteId}${query}`)
export const sendMessageToClient = (clienteId, payload) => api(`/api/mensagens/conversas/${clienteId}`, { method: 'POST', body: payload })
export const getChatConfig = () => api('/api/mensagens/chat-config')
export const saveChatConfig = (payload) => api('/api/mensagens/chat-config', { method: 'PUT', body: payload })

export const listCompanyDocs = (query='') => api(`/api/documentos/empresa${query}`)
export const reviewDocument = (id, payload) => api(`/api/documentos/${id}/revisar`, { method: 'PUT', body: payload })

export const listCompanyQueue = () => api('/api/fila/empresa')
export const getNotifications = () => api('/api/notificacoes')

// Re-export public endpoints from their canonical home to avoid import breakage
export { getPublicCompany, getPublicCalendar, getPublicFaq } from './public'
