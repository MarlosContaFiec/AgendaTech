'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');

async function list(clienteId) {
  return db.query(
    `SELECT * FROM dependente WHERE cliente_id = ? ORDER BY nome`,
    [clienteId]
  );
}

async function create(clienteId, data) {
  if (!data.nome?.trim()) throw new AppError(400, 'Nome é obrigatório');
  if (!data.idade || data.idade < 0 || data.idade > 120) throw new AppError(400, 'Idade inválida');

  const r = await db.execute(
    `INSERT INTO dependente (cliente_id, nome, idade) VALUES (?, ?, ?)`,
    [clienteId, data.nome, data.idade]
  );
  return db.queryOne(`SELECT * FROM dependente WHERE id = ?`, [r.insertId]);
}

async function update(clienteId, id, data) {
  const sets = [], vals = [];
  if (data.nome !== undefined) { sets.push('nome = ?'); vals.push(data.nome); }
  if (data.idade !== undefined) { sets.push('idade = ?'); vals.push(data.idade); }
  if (!sets.length) throw new AppError(400, 'Nenhum campo para atualizar');

  const r = await db.execute(
    `UPDATE dependente SET ${sets.join(', ')} WHERE id = ? AND cliente_id = ?`,
    [...vals, id, clienteId]
  );
  if (r.affectedRows === 0) throw new AppError(404, 'Dependente não encontrado');
  return db.queryOne(`SELECT * FROM dependente WHERE id = ?`, [id]);
}

async function remove(clienteId, id) {
  const r = await db.execute(
    `DELETE FROM dependente WHERE id = ? AND cliente_id = ?`,
    [id, clienteId]
  );
  if (r.affectedRows === 0) throw new AppError(404, 'Dependente não encontrado');
}

module.exports = { list, create, update, remove };
