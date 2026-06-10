'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');
const tpl = require('../../utils/templateEngine');
const { sendAutoMessage } = require('../../utils/messageHelpers');
const { ensureAffected } = require('../../utils/queryHelpers');

async function entrar(clienteId, data) {
  const { servico_id, empresa_id, data_agendamento, hora_inicio } = data;

  const servico = await db.queryOne(
    `SELECT * FROM servico WHERE id = ? AND empresa_id = ? AND ativo = 1`,
    [servico_id, empresa_id]
  );
  if (!servico) throw new AppError(404, 'Serviço não encontrado');

  const jaNaFila = await db.queryOne(
    `SELECT id FROM fila_espera WHERE cliente_id = ? AND servico_id = ? AND data_agendamento = ? AND hora_inicio = ? AND status = 'aguardando'`,
    [clienteId, servico_id, data_agendamento, hora_inicio]
  );
  if (jaNaFila) throw new AppError(409, 'Você já está na fila para este horário');

  const r = await db.execute(
    `INSERT INTO fila_espera (cliente_id, servico_id, empresa_id, data_agendamento, hora_inicio)
     VALUES (?, ?, ?, ?, ?)`,
    [clienteId, servico_id, empresa_id, data_agendamento, hora_inicio]
  );
  return db.queryOne(`SELECT * FROM fila_espera WHERE id = ?`, [r.insertId]);
}

async function sair(clienteId, id) {
  const r = await db.execute(
    `UPDATE fila_espera SET status = 'cancelado' WHERE id = ? AND cliente_id = ? AND status = 'aguardando'`,
    [id, clienteId]
  );
  ensureAffected(r, 'Registro na fila');
}

async function listCliente(clienteId) {
  return db.query(
    `SELECT f.*, s.nome AS servico_nome, e.nome_fantasia
     FROM fila_espera f
     JOIN servico s ON s.id = f.servico_id
     JOIN empresa e ON e.id = f.empresa_id
     WHERE f.cliente_id = ? AND f.status IN ('aguardando', 'notificado')
     ORDER BY f.criado_em DESC`,
    [clienteId]
  );
}

async function listEmpresa(empresaId, filters = {}) {
  const { data_agendamento, status } = filters;
  const where = ['f.empresa_id = ?'];
  const params = [empresaId];

  if (data_agendamento) { where.push('f.data_agendamento = ?'); params.push(data_agendamento); }
  if (status) { where.push('f.status = ?'); params.push(status); }

  return db.query(
    `SELECT f.*, c.nome AS cliente_nome, c.score AS cliente_score,
            s.nome AS servico_nome
     FROM fila_espera f
     JOIN cliente c ON c.id = f.cliente_id
     JOIN servico s ON s.id = f.servico_id
     WHERE ${where.join(' AND ')}
     ORDER BY f.criado_em ASC`,
    params
  );
}

async function notificarProximo(empresaId, servicoId, dataAgendamento, horaInicio) {
  const empresa = await db.queryOne(
    `SELECT metodo_fila FROM empresa WHERE id = ?`, [empresaId]
  );
  const ordem = empresa?.metodo_fila === 'score' ? 'c.score DESC' : 'f.criado_em ASC';

  const proximo = await db.queryOne(
    `SELECT f.*, c.nome AS cliente_nome, s.nome AS servico_nome
     FROM fila_espera f
     JOIN cliente c ON c.id = f.cliente_id
     JOIN servico s ON s.id = f.servico_id
     WHERE f.empresa_id = ? AND f.servico_id = ?
       AND f.data_agendamento = ? AND f.hora_inicio = ?
       AND f.status = 'aguardando'
     ORDER BY ${ordem}
     LIMIT 1`,
    [empresaId, servicoId, dataAgendamento, horaInicio]
  );
  if (!proximo) return null;

  await db.execute(
    `UPDATE fila_espera SET status = 'notificado' WHERE id = ?`,
    [proximo.id]
  );

  const regra = await db.queryOne(
    `SELECT mensagem_template FROM regra_empresa
     WHERE empresa_id = ? AND tipo = 'notificacao' AND ativo = 1 LIMIT 1`,
    [empresaId]
  );

  let msg;
  if (regra?.mensagem_template) {
    msg = tpl.render(regra.mensagem_template, {
      nome_cliente: proximo.cliente_nome,
      nome_empresa: proximo.servico_nome,
      data: dataAgendamento,
      hora: horaInicio,
      servico: proximo.servico_nome,
    });
    msg += '\n\nUma vaga abriu! Acesse o app para agendar.';
  } else {
    msg = `${proximo.cliente_nome}, uma vaga abriu para ${proximo.servico_nome} em ${dataAgendamento} às ${horaInicio}. Acesse o app para garantir!`;
  }

  await sendAutoMessage({
    empresaId,
    clienteId: proximo.cliente_id,
    tipo: 'outro',
    mensagem: msg,
  });

  return proximo;
}

async function converter(clienteId, filaId) {
  const fila = await db.queryOne(
    `SELECT * FROM fila_espera WHERE id = ? AND cliente_id = ? AND status = 'notificado'`,
    [filaId, clienteId]
  );
  if (!fila) throw new AppError(404, 'Registro na fila não encontrado ou não notificado');

  await db.execute(
    `UPDATE fila_espera SET status = 'convertido' WHERE id = ?`, [filaId]
  );

  return { message: 'Vaga garantida! Faça o agendamento normalmente.', fila };
}

module.exports = { entrar, sair, listCliente, listEmpresa, notificarProximo, converter };
