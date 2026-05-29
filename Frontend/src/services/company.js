import { api } from './api'

export const getCompanyProfile = () => api('/api/empresa/perfil')
export const updateCompanyProfile = (payload) => api('/api/empresa/perfil', { method: 'PUT', body: payload })
export const getCompanyDashboard = () => api('/api/empresa/dashboard')
export const listCapacities = () => api('/api/empresa/capacidades')
export const saveCapacity = (payload) => api('/api/empresa/capacidades', { method: 'POST', body: payload })
export const deleteCapacity = (id) => api(`/api/empresa/capacidades/${id}`, { method: 'DELETE' })

export const listServices = () => api('/api/servicos')
export const getService = (id) => api(`/api/servicos/${id}`)
export const createService = (payload) => api('/api/servicos', { method: 'POST', body: payload })
export const updateService = (id, payload) => api(`/api/servicos/${id}`, { method: 'PUT', body: payload })
export const deleteService = (id) => api(`/api/servicos/${id}`, { method: 'DELETE' })

export const listTags = () => api('/api/tags')
export const createTag = (payload) => api('/api/tags', { method: 'POST', body: payload })
export const updateTag = (id, payload) => api(`/api/tags/${id}`, { method: 'PUT', body: payload })
export const deleteTag = (id) => api(`/api/tags/${id}`, { method: 'DELETE' })

export const listRules = () => api('/api/regras')
export const createRule = (payload) => api('/api/regras', { method: 'POST', body: payload })
export const updateRule = (id, payload) => api(`/api/regras/${id}`, { method: 'PUT', body: payload })
export const deleteRule = (id) => api(`/api/regras/${id}`, { method: 'DELETE' })
export const getRuleCalendar = (ano, mes) => api(`/api/regras/calendario?ano=${ano}&mes=${mes}`)
export const getRuleDay = (data) => api(`/api/regras/dia?data=${data}`)

export const listBusinessRules = (tipo='') => api(`/api/regras-negocio${tipo ? `?tipo=${tipo}` : ''}`)
export const createBusinessRule = (payload) => api('/api/regras-negocio', { method: 'POST', body: payload })
export const updateBusinessRule = (id, payload) => api(`/api/regras-negocio/${id}`, { method: 'PUT', body: payload })
export const deleteBusinessRule = (id) => api(`/api/regras-negocio/${id}`, { method: 'DELETE' })
export const getBusinessRulePreview = (id) => api(`/api/regras-negocio/${id}/preview`)
export const getBusinessRuleVars = () => api('/api/regras-negocio/template/vars')

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
export const createFaq = (payload) => api('/api/mensagens/chat-config/faq', { method: 'POST', body: payload })
export const updateFaq = (id, payload) => api(`/api/mensagens/chat-config/faq/${id}`, { method: 'PUT', body: payload })
export const deleteFaq = (id) => api(`/api/mensagens/chat-config/faq/${id}`, { method: 'DELETE' })

export const listCompanyDocs = (query='') => api(`/api/documentos/empresa${query}`)
export const reviewDocument = (id, payload) => api(`/api/documentos/${id}/revisar`, { method: 'PUT', body: payload })

export const listCompanyQueue = () => api('/api/fila/empresa')
export const getNotifications = () => api('/api/notificacoes')

export const getPublicCompany = (id) => api(`/api/empresas/${id}`, { auth: false })
export const getPublicCalendar = (id, ano, mes) => api(`/api/empresas/${id}/calendario?ano=${ano}&mes=${mes}`, { auth: false })
export const getPublicFaq = (empresaId) => api(`/api/mensagens/publico/${empresaId}/faq`, { auth: false })
