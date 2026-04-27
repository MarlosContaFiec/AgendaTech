'use strict';

/**
 * Substitui variáveis em templates de mensagem.
 *
 * Variáveis suportadas:
 *  {nome_cliente}   → nome do cliente
 *  {nome_empresa}   → nome fantasia da empresa
 *  {data}           → data do agendamento (DD/MM/YYYY)
 *  {hora}           → hora de início (HH:MM)
 *  {servico}        → nome do serviço
 *  {valor}          → valor cobrado formatado em R$
 *  {taxa}           → valor da taxa de cancelamento em R$
 *  {duracao}        → duração do serviço em minutos
 *  {endereco}       → endereço da empresa
 */
function render(template, vars = {}) {
  if (!template) return '';

  const formatDate = (d) => {
    if (!d) return '';
    const date = typeof d === 'string' ? new Date(d + 'T00:00:00') : d;
    return date.toLocaleDateString('pt-BR');
  };

  const formatBRL = (v) =>
    parseFloat(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const replacements = {
    '{nome_cliente}':  vars.nome_cliente  || '',
    '{nome_empresa}':  vars.nome_empresa  || '',
    '{data}':          formatDate(vars.data),
    '{hora}':          vars.hora          ? String(vars.hora).slice(0,5) : '',
    '{servico}':       vars.servico       || '',
    '{valor}':         formatBRL(vars.valor),
    '{taxa}':          formatBRL(vars.taxa),
    '{duracao}':       vars.duracao       ? `${vars.duracao} minutos` : '',
    '{endereco}':      vars.endereco      || '',
    '{motivo}':        vars.motivo        || '',
  };

  return template.replace(
    /\{[a-z_]+\}/g,
    (match) => replacements[match] !== undefined ? replacements[match] : match
  );
}

/**
 * Retorna a lista de variáveis disponíveis para exibir na UI.
 */
function availableVars() {
  return [
    { var: '{nome_cliente}',  descricao: 'Nome do cliente' },
    { var: '{nome_empresa}',  descricao: 'Nome fantasia da empresa' },
    { var: '{data}',          descricao: 'Data do agendamento (DD/MM/YYYY)' },
    { var: '{hora}',          descricao: 'Hora de início (HH:MM)' },
    { var: '{servico}',       descricao: 'Nome do serviço agendado' },
    { var: '{valor}',         descricao: 'Valor cobrado (R$)' },
    { var: '{taxa}',          descricao: 'Taxa de cancelamento (R$)' },
    { var: '{duracao}',       descricao: 'Duração do serviço' },
    { var: '{endereco}',      descricao: 'Endereço da empresa' },
    { var: '{motivo}',        descricao: 'Motivo do cancelamento/reagendamento' },
  ];
}

module.exports = { render, availableVars };
