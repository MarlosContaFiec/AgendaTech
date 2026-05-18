'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');

async function list(clienteId) {
  return db.query(
    `SELECT * FROM documento_cliente WHERE cliente_id = ? ORDER BY criado_em DESC`,
    [clienteId]
  );
}

async function create(clienteId, data) {
  if (!data.tipo?.trim()) throw new AppError(400, 'Tipo do documento é obrigatório');
  if (!data.arquivo_url?.trim()) throw new AppError(400, 'Arquivo é obrigatório');

  const r = await db.execute(
    `INSERT INTO documento_cliente (cliente_id, tipo, arquivo_url) VALUES (?, ?, ?)`,
    [clienteId, data.tipo, data.arquivo_url]
  );
  return db.queryOne(`SELECT * FROM documento_cliente WHERE id = ?`, [r.insertId]);
}

async function listEmpresaDocs(empresaId, filters = {}) {
  const { status, cliente_id } = filters;
  const pagina = parseInt(filters.pagina) || 1;
  const limite = parseInt(filters.limite) || 20;
  const where = ['a.empresa_id = ?'];
  const params = [empresaId];

  if (status) { where.push('d.status = ?'); params.push(status); }
  if (cliente_id) { where.push('d.cliente_id = ?'); params.push(cliente_id); }

  const offset = (pagina - 1) * limite;

  return db.queryRaw(
    `SELECT d.*, c.nome AS cliente_nome
     FROM documento_cliente d
     JOIN cliente c ON c.id = d.cliente_id
     JOIN agendamento a ON a.cliente_id = d.cliente_id
     WHERE ${where.join(' AND ')}
     GROUP BY d.id
     ORDER BY d.criado_em DESC
     LIMIT ${limite} OFFSET ${offset}`,
    params
  );
}

async function revisar(empresaId, documentoId, data) {
  if (!['aprovado', 'rejeitado'].includes(data.status)) {
    throw new AppError(400, 'Status deve ser aprovado ou rejeitado');
  }

  const doc = await db.queryOne(
    `SELECT d.* FROM documento_cliente d
     JOIN agendamento a ON a.cliente_id = d.cliente_id
     WHERE d.id = ? AND a.empresa_id = ?
     LIMIT 1`,
    [documentoId, empresaId]
  );
  if (!doc) throw new AppError(404, 'Documento não encontrado');

  await db.execute(
    `UPDATE documento_cliente SET status = ?, observacao = ?, revisado_em = NOW() WHERE id = ?`,
    [data.status, data.observacao || null, documentoId]
  );
  return db.queryOne(`SELECT * FROM documento_cliente WHERE id = ?`, [documentoId]);
}

async function remove(clienteId, id) {
  const r = await db.execute(
    `DELETE FROM documento_cliente WHERE id = ? AND cliente_id = ?`,
    [id, clienteId]
  );
  if (r.affectedRows === 0) throw new AppError(404, 'Documento não encontrado');
}

module.exports = { list, create, listEmpresaDocs, revisar, remove };
