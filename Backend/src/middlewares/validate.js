'use strict';
const Joi = require('joi');
const res_ = require('../utils/response');

const dateOnly = Joi.string().custom((val, helpers) => {
  const d = String(val).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return helpers.error('date.format');
  return d;
}).messages({ 'date.format': 'Data inválida. Use YYYY-MM-DD.' });

function validate(schema) {
  return (req, res, next) => {
    console.log('[VALIDATE] Body recebido:', JSON.stringify(req.body));
    console.log('[VALIDATE] Content-Type:', req.headers['content-type']);

    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      console.log('[VALIDATE] Erros Joi:', error.details.map(d => d.message));
      return res_.badRequest(res, 'Dados inválidos', error.details.map(d => d.message));
    }
    req.body = value;
    next();
  };
}

function isValidCPF(cpf) {
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  if (parseInt(cpf[9]) !== d1) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  return parseInt(cpf[10]) === d2;
}

function isValidCNPJ(cnpj) {
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(cnpj[i]) * pesos1[i];
  let d1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(cnpj[12]) !== d1) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(cnpj[i]) * pesos2[i];
  let d2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return parseInt(cnpj[13]) === d2;
}

function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
    if (error) return res_.badRequest(res, 'Query inválida', error.details.map(d => d.message));
    req.query = value;
    next();
  };
}

const time = Joi.string().pattern(/^\d{2}:\d{2}$/);
const horarioItem = Joi.object({
  dia_semana: Joi.number().integer().min(0).max(6).optional().allow(null),
  hora_inicio: time.required(),
  hora_fim: time.required(),
});

const schemas = {

  registerCliente: Joi.object({
    nome: Joi.string().min(3).max(150).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/).optional(),
    telefone: Joi.string().max(15).optional(),
    data_nascimento: dateOnly.optional(),
  }),
  registerEmpresa: Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    cnpj: Joi.string().required(),
    razao_social: Joi.string().max(200).required(),
    nome_fantasia: Joi.string().max(200).required(),
    telefone: Joi.string().max(15).optional(),
    cep: Joi.string().max(20).optional(),
  }),
login: Joi.object({
  documento: Joi.string().required().custom((value, helpers) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) {
      if (!isValidCPF(digits)) return helpers.error('any.invalid', { type: 'cpf' });
      return digits;
    }
    if (digits.length === 14) {
      if (!isValidCNPJ(digits)) return helpers.error('any.invalid', { type: 'cnpj' });
      return digits;
    }
    return helpers.error('any.length');
  }).messages({
    'any.required': 'CPF ou CNPJ é obrigatório',
    'any.length': 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos)',
    'any.invalid': 'CPF ou CNPJ inválido',
  }),
  senha: Joi.string().min(6).required(),
}),

  updatePerfil: Joi.object({
    nome_fantasia: Joi.string().max(200).optional(),
    razao_social: Joi.string().max(200).optional(),
    telefone: Joi.string().max(15).optional(),
    cep: Joi.string().max(15).optional(),
    endereco: Joi.string().max(200).optional(),
    numero: Joi.string().max(20).optional(),
    complemento: Joi.string().max(100).optional(),
    bairro: Joi.string().max(100).optional(),
    cidade: Joi.string().max(100).optional(),
    estado: Joi.string().length(2).optional(),
    nicho: Joi.string().max(100).optional(),
    sub_nicho: Joi.string().max(100).optional(),
    site: Joi.string().uri().optional().allow(''),
    max_agendamentos_global: Joi.number().integer().min(1).optional().allow(null),
    descricao: Joi.string().optional().allow(''),
    logo_url: Joi.string().optional().allow(''),
    cor_primaria: Joi.string().max(18).optional(),
    cor_secundaria: Joi.string().max(18).optional(),
  }),
  capacidadeHorario: Joi.object({
    hora_inicio: time.required(),
    hora_fim: time.required(),
    max_agendamentos: Joi.number().integer().min(1).required(),
  }),

  createServico: Joi.object({
    nome: Joi.string().max(150).required(),
    descricao: Joi.string().optional().allow(''),
    duracao_minutos: Joi.number().integer().min(5).required(),
    preco_base: Joi.number().positive().required(),
    aceitamento_automatico: Joi.boolean().default(true),
    max_por_horario: Joi.number().integer().min(1).optional().allow(null),
    hora_inicio: time.optional().allow(null),
    hora_fim: time.optional().allow(null),
    intervalo_minutos: Joi.number().integer().min(0).default(0),
    horarios: Joi.array().items(horarioItem).optional(),
    tag_ids: Joi.array().items(Joi.number().integer()).optional(),
    ativo: Joi.boolean().optional(),
  }),
  updateServico: Joi.object({
    nome: Joi.string().max(150).optional(),
    descricao: Joi.string().optional().allow(''),
    duracao_minutos: Joi.number().integer().min(5).optional(),
    preco_base: Joi.number().positive().optional(),
    aceitamento_automatico: Joi.boolean().optional(),
    max_por_horario: Joi.number().integer().min(1).optional().allow(null),
    hora_inicio: time.optional().allow(null),
    hora_fim: time.optional().allow(null),
    intervalo_minutos: Joi.number().integer().min(0).optional(),
    horarios: Joi.array().items(horarioItem).optional(),
    tag_ids: Joi.array().items(Joi.number().integer()).optional(),
    ativo: Joi.boolean().optional(),
  }),

  createTag: Joi.object({
    nome: Joi.string().max(80).required(),
    label: Joi.string().max(120).required(),
    cor: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/).default('#888888'),
    aceita_agendamento: Joi.boolean().default(true),
    info: Joi.string().optional().allow(''),
  }),
  updateTag: Joi.object({
    nome: Joi.string().max(80).optional(),
    label: Joi.string().max(120).optional(),
    cor: Joi.string().pattern(/^#[0-9a-fA-F]{6}$/).optional(),
    aceita_agendamento: Joi.boolean().optional(),
    info: Joi.string().optional().allow(''),
  }),

  createRegra: Joi.object({
    tag_id: Joi.number().integer().required(),
    tipo: Joi.string().valid('padrao', 'excecao', 'unico').required(),
    dia_semana: Joi.number().integer().min(0).max(6).optional().allow(null),
    qnd_ocorre: Joi.number().integer().min(1).max(5).optional().allow(null),
    mes: Joi.number().integer().min(1).max(12).optional().allow(null),
    unico_dia: Joi.number().integer().min(1).max(31).optional().allow(null),
    unico_mes: Joi.number().integer().min(1).max(12).optional().allow(null),
    unico_ano: Joi.number().integer().min(2020).max(2100).optional().allow(null),
    unico_repete_anual: Joi.boolean().default(false),
    prioridade: Joi.number().integer().min(0).max(255).default(10),
  }),
  updateRegra: Joi.object({
    tag_id: Joi.number().integer().optional(),
    tipo: Joi.string().valid('padrao', 'excecao', 'unico').optional(),
    dia_semana: Joi.number().integer().min(0).max(6).optional().allow(null),
    qnd_ocorre: Joi.number().integer().min(1).max(5).optional().allow(null),
    mes: Joi.number().integer().min(1).max(12).optional().allow(null),
    unico_dia: Joi.number().integer().min(1).max(31).optional().allow(null),
    unico_mes: Joi.number().integer().min(1).max(12).optional().allow(null),
    unico_ano: Joi.number().integer().min(2020).max(2100).optional().allow(null),
    unico_repete_anual: Joi.boolean().optional(),
    prioridade: Joi.number().integer().min(0).max(255).optional(),
    ativo: Joi.boolean().optional(),
  }),

  createRegraNegocio: Joi.object({
    tipo: Joi.string().valid('notificacao', 'cancelamento', 'reagendamento', 'capacidade').required(),
    nome: Joi.string().max(150).required(),
    descricao: Joi.string().optional().allow(''),
    antecedencia_horas: Joi.number().integer().optional().allow(null),
    mensagem_template: Joi.string().optional().allow('', null),
    tipo_notificacao: Joi.string().valid('lembrete', 'confirmacao', 'cancelamento', 'reagendamento', 'outro').optional().allow(null),
    limite_horas: Joi.number().integer().optional().allow(null),
    taxa_percentual: Joi.number().min(0).max(100).optional().allow(null),
    taxa_fixa: Joi.number().min(0).optional().allow(null),
    estrelas_min: Joi.number().integer().min(1).max(5).optional().allow(null),
    estrelas_max: Joi.number().integer().min(1).max(5).optional().allow(null),
    ativo: Joi.boolean().optional(),
  }),
  updateRegraNegocio: Joi.object({
    tipo: Joi.string().valid('notificacao', 'cancelamento', 'reagendamento', 'capacidade').optional(),
    nome: Joi.string().max(150).optional(),
    descricao: Joi.string().optional().allow(''),
    antecedencia_horas: Joi.number().integer().optional().allow(null),
    mensagem_template: Joi.string().optional().allow('', null),
    tipo_notificacao: Joi.string().valid('lembrete', 'confirmacao', 'cancelamento', 'reagendamento', 'outro').optional().allow(null),
    limite_horas: Joi.number().integer().optional().allow(null),
    taxa_percentual: Joi.number().min(0).max(100).optional().allow(null),
    taxa_fixa: Joi.number().min(0).optional().allow(null),
    estrelas_min: Joi.number().integer().min(1).max(5).optional().allow(null),
    estrelas_max: Joi.number().integer().min(1).max(5).optional().allow(null),
    ativo: Joi.boolean().optional(),
  }),

  createAgendamento: Joi.object({
    servico_id: Joi.number().integer().required(),
    empresa_id: Joi.number().integer().required(),
    data_agendamento: dateOnly.required(),
    hora_inicio: time.required(),
    notas: Joi.string().optional().allow(''),
  }),
  reagendar: Joi.object({
    data_agendamento: dateOnly.required(),
    hora_inicio: time.required(),
    motivo: Joi.string().optional().allow(''),
  }),
  cancelar: Joi.object({
    motivo: Joi.string().optional().allow(''),
  }),
  recusar: Joi.object({
    motivo: Joi.string().optional().allow(''),
  }),

  createAvaliacao: Joi.object({
    estrelas: Joi.number().integer().min(1).max(5).required(),
    feedback: Joi.string().optional().allow(''),
  }),
  responderAvaliacao: Joi.object({
    resposta: Joi.string().min(1).required(),
  }),

  sendMensagem: Joi.object({
    mensagem: Joi.string().min(1).required(),
    tipo: Joi.string().valid('cancelamento', 'confirmacao', 'lembrete', 'outro').default('outro'),
  }),
  chatConfig: Joi.object({
    mensagem_abertura: Joi.string().optional().allow('', null),
    ativo: Joi.boolean().default(true),
  }),
  chatFaq: Joi.object({
    pergunta: Joi.string().max(255).required(),
    resposta: Joi.string().required(),
    ordem: Joi.number().integer().default(0),
    ativo: Joi.boolean().optional(),
  }),

  updateClientePerfil: Joi.object({
    nome: Joi.string().min(3).max(150).optional(),
    telefone: Joi.string().max(15).optional(),
    data_nascimento: dateOnly.optional(),
    cpf: Joi.string().optional().allow('', null),
  }),
  createDependente: Joi.object({
    nome: Joi.string().min(2).max(150).required(),
    idade: Joi.number().integer().min(0).max(120).required(),
  }),
  updateDependente: Joi.object({
    nome: Joi.string().min(2).max(150).optional(),
    idade: Joi.number().integer().min(0).max(120).optional(),
  }),
  filtroEmpresas: Joi.object({
    busca: Joi.string().optional().allow(''),
    nicho: Joi.string().optional().allow(''),
    cidade: Joi.string().optional().allow(''),
    estado: Joi.string().length(2).optional().allow(''),
    pagina: Joi.number().integer().min(1).default(1),
    limite: Joi.number().integer().min(1).max(50).default(20),
  }),
  filtroDisponibilidade: Joi.object({
    data: dateOnly.required(),
    servico_id: Joi.number().integer().required(),
  }),
  createDocumento: Joi.object({
    tipo: Joi.string().max(50).required(),
    arquivo_url: Joi.string().required(),
  }),
  revisarDocumento: Joi.object({
    status: Joi.string().valid('aprovado', 'rejeitado').required(),
    observacao: Joi.string().optional().allow(''),
  }),
  solicitacaoHorario: Joi.object({
    agendamento_id: Joi.number().integer().required(),
    minutos_extra: Joi.number().integer().min(5).max(120).required(),
    motivo: Joi.string().optional().allow(''),
  }),
  responderSolicitacao: Joi.object({
    status: Joi.string().valid('aceito', 'negado').required(),
    resposta_empresa: Joi.string().optional().allow(''),
  }),
  entrarFila: Joi.object({
    servico_id: Joi.number().integer().required(),
    empresa_id: Joi.number().integer().required(),
    data_agendamento: dateOnly.required(),
    hora_inicio: time.required(),
  }),
  reenviarVerificacao: Joi.object({
    email: Joi.string().email().required(),
  }),

};

module.exports = { validate, validateQuery, schemas };
