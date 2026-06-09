'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');
const { buildUpdateSets, ensureAffected } = require('../../utils/queryHelpers');

async function list(empresaId) {
  const servicos = await db.query(
    `SELECT s.*,
            GROUP_CONCAT(DISTINCT sh.dia_semana, '|', sh.hora_inicio, '-', sh.hora_fim) AS horarios_raw,
            GROUP_CONCAT(DISTINCT st.tag_id) AS tag_ids_raw
     FROM servico s
     LEFT JOIN servico_horario sh ON sh.servico_id = s.id AND sh.ativo = 1
     LEFT JOIN servico_tag st ON st.servico_id = s.id
     WHERE s.empresa_id = ?
     GROUP BY s.id
     ORDER BY s.nome`,
    [empresaId]
  );
  return servicos.map(parseServico);
}

async function getById(empresaId, id) {
  const rows = await db.query(
    `SELECT s.*,
            GROUP_CONCAT(DISTINCT sh.dia_semana, '|', sh.hora_inicio, '-', sh.hora_fim) AS horarios_raw,
            GROUP_CONCAT(DISTINCT st.tag_id) AS tag_ids_raw
     FROM servico s
     LEFT JOIN servico_horario sh ON sh.servico_id = s.id AND sh.ativo = 1
     LEFT JOIN servico_tag st ON st.servico_id = s.id
     WHERE s.empresa_id = ? AND s.id = ? AND s.ativo = 1
     GROUP BY s.id`,
    [empresaId, id]
  );
  return rows[0] ? parseServico(rows[0]) : null;
}

function parseServico(s) {
  return {
    ...s,
    horarios: s.horarios_raw
      ? s.horarios_raw.split(',').map(h => {
          const [dh, range] = h.split('|');
          const [hi, hf] = range.split('-');
          return { dia_semana: dh === 'null' ? null : Number(dh), hora_inicio: hi, hora_fim: hf };
        })
      : [],
    tag_ids: s.tag_ids_raw ? s.tag_ids_raw.split(',').map(Number) : [],
    horarios_raw: undefined,
    tag_ids_raw: undefined,
  };
}

async function syncHorariosAndTags(conn, servicoId, horarios, tagIds) {
  if (horarios !== undefined) {
    await conn.execute(`DELETE FROM servico_horario WHERE servico_id = ?`, [servicoId]);
    for (const h of horarios) {
      await conn.execute(
        `INSERT INTO servico_horario (servico_id, dia_semana, hora_inicio, hora_fim) VALUES (?, ?, ?, ?)`,
        [servicoId, h.dia_semana ?? null, h.hora_inicio, h.hora_fim]
      );
    }
  }
  if (tagIds !== undefined) {
    await conn.execute(`DELETE FROM servico_tag WHERE servico_id = ?`, [servicoId]);
    for (const tagId of tagIds) {
      await conn.execute(`INSERT IGNORE INTO servico_tag (servico_id, tag_id) VALUES (?, ?)`, [servicoId, tagId]);
    }
  }
}

async function create(empresaId, data) {
  if (!data.nome?.trim()) throw new AppError(400, 'Nome do serviço é obrigatório');
  if (!data.duracao_minutos || data.duracao_minutos < 1) throw new AppError(400, 'Duração inválida');
  if (data.preco_base == null || data.preco_base < 0) throw new AppError(400, 'Preço inválido');

  const { horarios = [], tag_ids = [], ...fields } = data;

  const servicoId = await db.withTransaction(async (conn) => {
    const r = await conn.execute(
      `INSERT INTO servico (empresa_id, nome, descricao, duracao_minutos, preco_base,
                            aceitamento_automatico, max_por_horario, hora_inicio, hora_fim, intervalo_minutos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [empresaId, fields.nome, fields.descricao || null, fields.duracao_minutos, fields.preco_base,
       fields.aceitamento_automatico ? 1 : 0, fields.max_por_horario || null,
       fields.hora_inicio || null, fields.hora_fim || null, fields.intervalo_minutos || 0]
    );
    const id = r[0].insertId;
    await syncHorariosAndTags(conn, id, horarios, tag_ids);
    return id;
  });

  return getById(empresaId, servicoId);
}

async function update(empresaId, id, data) {
  const exists = await db.queryOne(`SELECT id FROM servico WHERE id = ? AND empresa_id = ?`, [id, empresaId]);
  if (!exists) throw new AppError(404, 'Serviço não encontrado');

  const { horarios, tag_ids, ...fields } = data;

  await db.withTransaction(async (conn) => {
    const allowed = ['nome', 'descricao', 'duracao_minutos', 'preco_base', 'ativo',
      'aceitamento_automatico', 'max_por_horario', 'hora_inicio', 'hora_fim', 'intervalo_minutos'];
    const { sets, vals } = buildUpdateSets(fields, allowed);
    if (sets.length) {
      await conn.execute(
        `UPDATE servico SET ${sets.join(', ')} WHERE id = ? AND empresa_id = ?`,
        [...vals, id, empresaId]
      );
    }
    await syncHorariosAndTags(conn, id, horarios, tag_ids);
  });

  return getById(empresaId, id);
}

async function remove(empresaId, id) {
  const r = await db.execute(
    `UPDATE servico SET ativo = FALSE WHERE id = ? AND empresa_id = ?`,
    [id, empresaId]
  );
  ensureAffected(r, 'Serviço');
}

module.exports = { list, getById, create, update, remove };
