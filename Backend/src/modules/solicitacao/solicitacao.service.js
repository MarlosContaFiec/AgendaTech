'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');

async function create(clienteId, data) {
  const { agendamento_id, minutos_extra, motivo } = data;

  const ag = await db.queryOne(
    `SELECT a.*, s.empresa_id, s.duracao_minutos, s.nome AS servico_nome
     FROM agendamento a
     JOIN servico s ON s.id = a.servico_id
     WHERE a.id = ? AND a.cliente_id = ?`,
    [agendamento_id, clienteId]
  );
  if (!ag) throw new AppError(404, 'Agendamento não encontrado');
  if (!['confirmado', 'pendente'].includes(ag.status_agendamento)) {
    throw new AppError(400, 'Agendamento não está em status válido para solicitar extensão');
  }

  const exists = await db.queryOne(
    `SELECT id FROM solicitacao_horario WHERE agendamento_id = ? AND status = 'pendente'`,
    [agendamento_id]
  );
  if (exists) throw new AppError(409, 'Já existe uma solicitação pendente para este agendamento');

  const r = await db.execute(
    `INSERT INTO solicitacao_horario (agendamento_id, minutos_extra, motivo) VALUES (?, ?, ?)`,
    [agendamento_id, minutos_extra, motivo || null]
  );

  await db.execute(
    `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
     VALUES (?, ?, 'outro', ?, TRUE, 'cliente')`,
    [ag.empresa_id, clienteId,
     `Solicitação de horário estendido: +${minutos_extra} minutos para ${ag.servico_nome} em ${ag.data_agendamento}. Motivo: ${motivo || 'Não informado'}`]
  );

  return db.queryOne(`SELECT * FROM solicitacao_horario WHERE id = ?`, [r.insertId]);
}

async function listByAgendamento(agendamentoId) {
  return db.query(
    `SELECT * FROM solicitacao_horario WHERE agendamento_id = ? ORDER BY criado_em DESC`,
    [agendamentoId]
  );
}

async function listPendentes(empresaId) {
  return db.query(
    `SELECT sh.*, a.data_agendamento, a.hora_inicio, a.hora_fim,
            c.nome AS cliente_nome, s.nome AS servico_nome
     FROM solicitacao_horario sh
     JOIN agendamento a ON a.id = sh.agendamento_id
     JOIN cliente c ON c.id = a.cliente_id
     JOIN servico s ON s.id = a.servico_id
     WHERE a.empresa_id = ? AND sh.status = 'pendente'
     ORDER BY sh.criado_em ASC`,
    [empresaId]
  );
}

async function responder(empresaId, solicitacaoId, data) {
  if (!['aceito', 'negado'].includes(data.status)) {
    throw new AppError(400, 'Status deve ser aceito ou negado');
  }

  const sol = await db.queryOne(
    `SELECT sh.*, a.id AS ag_id, a.cliente_id, a.empresa_id, a.hora_fim,
            a.data_agendamento, s.nome AS servico_nome
     FROM solicitacao_horario sh
     JOIN agendamento a ON a.id = sh.agendamento_id
     JOIN servico s ON s.id = a.servico_id
     WHERE sh.id = ? AND a.empresa_id = ? AND sh.status = 'pendente'`,
    [solicitacaoId, empresaId]
  );
  if (!sol) throw new AppError(404, 'Solicitação não encontrada ou já respondida');

  await db.execute(
    `UPDATE solicitacao_horario SET status = ?, resposta_empresa = ?, respondido_em = NOW() WHERE id = ?`,
    [data.status, data.resposta_empresa || null, solicitacaoId]
  );

  if (data.status === 'aceito') {
    const novaHoraFim = addMinutes(sol.hora_fim, sol.minutos_extra);
    await db.execute(
      `UPDATE agendamento SET horario_estendido = TRUE, hora_fim = ? WHERE id = ?`,
      [novaHoraFim, sol.ag_id]
    );
  }

  const statusLabel = data.status === 'aceito' ? 'aceita' : 'negada';
  let msg = `Sua solicitação de +${sol.minutos_extra} minutos para ${sol.servico_nome} foi ${statusLabel}.`;
  if (data.resposta_empresa) msg += ` Resposta: ${data.resposta_empresa}`;

  await db.execute(
    `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
     VALUES (?, ?, 'outro', ?, TRUE, 'empresa')`,
    [empresaId, sol.cliente_id, msg]
  );

  return db.queryOne(`SELECT * FROM solicitacao_horario WHERE id = ?`, [solicitacaoId]);
}

function addMinutes(timeStr, minutes) {
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}:00`;
}

module.exports = { create, listByAgendamento, listPendentes, responder };
