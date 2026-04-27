
'use strict';
const db = require('../../config/database');

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
  for (const k of ['nome','label','cor','aceita_agendamento','info']) {
    if (data[k] !== undefined) {
      sets.push(`${k} = ?`);
      vals.push(k === 'aceita_agendamento' ? (data[k] ? 1 : 0) : data[k]);
    }
  }
  if (!sets.length) return;
  await db.execute(
    `UPDATE tags SET ${sets.join(', ')} WHERE id = ? AND empresa_id = ?`,
    [...vals, id, empresaId]
  );
  return db.queryOne(`SELECT * FROM tags WHERE id = ?`, [id]);
}

async function remove(empresaId, id) {
  return db.execute(`DELETE FROM tags WHERE id = ? AND empresa_id = ?`, [id, empresaId]);
}

module.exports = { list, create, update, remove };
