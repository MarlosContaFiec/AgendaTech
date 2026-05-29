import { api } from './api'

export const getFeaturedCompanies = () => api('/api/empresas/destaques', { auth: false })
export const getCompanies = (query = '') => api(`/api/empresas${query}`, { auth: false })
export const getNiches = () => api('/api/empresas/nichos', { auth: false })
export const getCities = () => api('/api/empresas/cidades', { auth: false })
export const getPublicCompany = (id) => api(`/api/empresas/${id}`, { auth: false })
export const getPublicCalendar = (id, ano, mes) => api(`/api/empresas/${id}/calendario?ano=${ano}&mes=${mes}`, { auth: false })
export const getAvailability = (id, servico_id, data) => api(`/api/empresas/${id}/disponibilidade?servico_id=${servico_id}&data=${data}`, { auth: false })
export const getPublicFaq = (empresaId) => api(`/api/mensagens/publico/${empresaId}/faq`, { auth: false })
