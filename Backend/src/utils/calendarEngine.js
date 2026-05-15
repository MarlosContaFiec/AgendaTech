'use strict';
const db = require('../config/database');

/**
 * Retorna o número de ocorrência do dia da semana dentro do mês.
 * Ex: segunda-feira → 1ª, 2ª, 3ª, 4ª ou 5ª do mês.
 */
function getNthOccurrenceInMonth(date) {
  const d = new Date(date);
  return Math.ceil(d.getDate() / 7);
}

/**
 * Verifica se uma regra se aplica a uma data específica.
 */
function ruleMatchesDate(rule, date) {
  const d        = new Date(date + 'T00:00:00');
  const dayOfWeek  = d.getDay();          
  const dayOfMonth = d.getDate();
  const month      = d.getMonth() + 1;   
  const year       = d.getFullYear();

  if (rule.tipo === 'padrao' || rule.tipo === 'excecao') {
    
    if (rule.dia_semana !== null && rule.dia_semana !== dayOfWeek) return false;

    
    if (rule.qnd_ocorre !== null) {
      const occurrence = getNthOccurrenceInMonth(date);
      if (occurrence !== rule.qnd_ocorre) return false;
    }

    
    if (rule.mes !== null && rule.mes !== month) return false;

    return true;
  }

  if (rule.tipo === 'unico') {
    if (rule.unico_dia  !== null && rule.unico_dia  !== dayOfMonth) return false;
    if (rule.unico_mes  !== null && rule.unico_mes  !== month)      return false;

    if (rule.unico_repete_anual) {
      
      return true;
    } else {
      
      if (rule.unico_ano !== null && rule.unico_ano !== year) return false;
      return true;
    }
  }

  return false;
}

/**
 * Resolve quais tags se aplicam a uma data para uma empresa.
 * Retorna array de tags com seus campos + { aceita_agendamento }
 *
 * Lógica de prioridade:
 *  1. Coleta todas as regras ativas que batem a data
 *  2. Para cada tag, guarda a regra de maior prioridade
 *  3. Retorna as tags únicas com maior prioridade ganhando
 *  4. Se qualquer tag tiver aceita_agendamento=0 → bloqueia o dia
 */
async function resolveTagsForDay(empresaId, date) {
  const rules = await db.query(
    `SELECT r.*, t.nome, t.label, t.cor, t.aceita_agendamento, t.info
     FROM regras r
     JOIN tags t ON t.id = r.tag_id
     WHERE r.empresa_id = ? AND r.ativo = 1 AND t.empresa_id = ?
     ORDER BY r.prioridade DESC`,
    [empresaId, empresaId]
  );

  const matched = rules.filter(r => ruleMatchesDate(r, date));

  
  const tagMap = new Map();
  for (const r of matched) {
    if (!tagMap.has(r.tag_id) || r.prioridade > tagMap.get(r.tag_id).prioridade) {
      tagMap.set(r.tag_id, r);
    }
  }

  return Array.from(tagMap.values()).map(r => ({
    id:                 r.tag_id,
    nome:               r.nome,
    label:              r.label,
    cor:                r.cor,
    aceita_agendamento: r.aceita_agendamento,
    info:               r.info,
    prioridade:         r.prioridade,
    tipo_regra:         r.tipo,
  }));
}

/**
 * Retorna se um dia aceita agendamentos (true/false) e quais tags estão ativas.
 */
async function isDayOpen(empresaId, date) {
  const tags = await resolveTagsForDay(empresaId, date);

  
  if (tags.length === 0) return { aberto: true, tags: [] };

  
  const bloqueada = tags.find(t => t.aceita_agendamento === 0);
  return {
    aberto: !bloqueada,
    tags,
    motivo_fechamento: bloqueada ? bloqueada.label : null,
  };
}

/**
 * Resolve um mês inteiro de uma vez.
 * Retorna objeto { 'YYYY-MM-DD': { aberto, tags } }
 */
async function resolveMonth(empresaId, year, month) {
  const rules = await db.query(
    `SELECT r.*, t.nome, t.label, t.cor, t.aceita_agendamento, t.info
     FROM regras r
     JOIN tags t ON t.id = r.tag_id
     WHERE r.empresa_id = ? AND r.ativo = 1 AND t.empresa_id = ?
     ORDER BY r.prioridade DESC`,
    [empresaId, empresaId]
  );

  const result = {};
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const matched = rules.filter(r => ruleMatchesDate(r, date));
    const tagMap = new Map();
    for (const r of matched) {
      if (!tagMap.has(r.tag_id) || r.prioridade > tagMap.get(r.tag_id).prioridade) {
        tagMap.set(r.tag_id, r);
      }
    }
    const tags = Array.from(tagMap.values()).map(r => ({
      id: r.tag_id,
      nome: r.nome,
      label: r.label,
      cor: r.cor,
      aceita_agendamento: r.aceita_agendamento,
      info: r.info,
      prioridade: r.prioridade,
      tipo_regra: r.tipo,
    }));

    if (tags.length === 0) {
      result[date] = { aberto: true, tags: [] };
    } else {
      const bloqueada = tags.find(t => t.aceita_agendamento === 0);
      result[date] = {
        aberto: !bloqueada,
        tags,
        motivo_fechamento: bloqueada ? bloqueada.label : null,
      };
    }
  }

  return result;
}


module.exports = { resolveTagsForDay, isDayOpen, resolveMonth, ruleMatchesDate };
