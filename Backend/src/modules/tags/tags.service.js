'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');

async function list(empresaId) {
  return db.query(
    `SELECT t.*, COUNT(r.id) AS total_regras
     FROM tags t
     LEFT JOIN regras r ON r.tag_id = t.id AND r.ativo = 1
     WHERE t.empresa_id = ?
     GROUP BY t.id
     ORDER BY t.nome`,
    [empresaId]
  );
}

async function create(empresaId, data) {
  if (!data.nome?.trim()) throw new AppError(400, 'Nome da tag é obrigatório');
  if (!data.label?.trim()) throw new AppError(400, 'Label da tag é obrigatório');

  const exists = await db.queryOne(
    `SELECT id FROM tags WHERE empresa_id = ? AND nome = ?`, [empresaId, data.nome]
  );
  if (exists) throw new AppError(409, 'Já existe uma tag com esse nome');

  const r = await db.execute(
    `INSERT INTO tags (empresa_id, nome, label, cor, aceita_agendamento, info)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [empresaId, data.nome, data.label, data.cor || '#888888',
     data.aceita_agendamento ? 1 : 0, data.info || null]
  );
  return db.queryOne(`SELECT * FROM tags WHERE id = ?`, [r.insertId]);
}

async function update(empresaId, id, data) {
  const sets = [], vals = [];
  for (const k of ['nome', 'label', 'cor', 'aceita_agendamento', 'info']) {
    if (data[k] !== undefined) {
      sets.push(`${k} = ?`);
      vals.push(k === 'aceita_agendamento' ? (data[k] ? 1 : 0) : data[k]);
    }
  }
  if (!sets.length) throw new AppError(400, 'Nenhum campo para atualizar');
  const r = await db.execute(
    `UPDATE tags SET ${sets.join(', ')} WHERE id = ? AND empresa_id = ?`,
    [...vals, id, empresaId]
  );
  if (r.affectedRows === 0) throw new AppError(404, 'Tag não encontrada');
  return db.queryOne(`SELECT * FROM tags WHERE id = ?`, [id]);
}

async function remove(empresaId, id) {
  const used = await db.queryOne(
    `SELECT COUNT(*) AS qtd FROM regras WHERE tag_id = ? AND ativo = 1`, [id]
  );
  if (used?.qtd > 0) throw new AppError(409, 'Tag está em uso por regras ativas');
  const r = await db.execute(`DELETE FROM tags WHERE id = ? AND empresa_id = ?`, [id, empresaId]);
  if (r.affectedRows === 0) throw new AppError(404, 'Tag não encontrada');
}

module.exports = { list, create, update, remove };
