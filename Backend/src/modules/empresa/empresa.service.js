'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');
const { buildUpdateSets, ensureAffected } = require('../../utils/queryHelpers');

async function getPerfil(empresaId) {
  return db.queryOne(
    `SELECT u.id, u.email, u.foto, u.data_criacao,
            e.cnpj, e.razao_social, e.nome_fantasia, e.telefone, e.cep,
            e.endereco, e.numero, e.complemento, e.bairro, e.cidade, e.estado,
            e.nicho, e.sub_nicho, e.site, e.verificada, e.max_agendamentos_global,
            ep.descricao, ep.logo_url, ep.cor_primaria, ep.cor_secundaria, ep.ativo as perfil_ativo
     FROM usuario u
     JOIN empresa e ON e.id = u.id
     LEFT JOIN empresaProfile ep ON ep.empresa_id = e.id
     WHERE u.id = ?`,
    [empresaId]
  );
}

async function updatePerfil(empresaId, data) {
  const empresaAllowed = [
    'nome_fantasia', 'razao_social', 'telefone', 'cep', 'endereco', 'numero',
    'complemento', 'bairro', 'cidade', 'estado', 'nicho', 'sub_nicho', 'site',
    'max_agendamentos_global',
  ];
  const profileAllowed = ['descricao', 'logo_url', 'cor_primaria', 'cor_secundaria'];

  const emptyToNull = (v) => (v === '' ? null : v);
  const empresaTransforms = Object.fromEntries(empresaAllowed.map(k => [k, emptyToNull]));
  const profileTransforms = Object.fromEntries(profileAllowed.map(k => [k, emptyToNull]));

  const empresa = buildUpdateSets(data, empresaAllowed, empresaTransforms);
  const profile = buildUpdateSets(data, profileAllowed, profileTransforms);

  if (empresa.sets.length === 0 && profile.sets.length === 0) {
    throw new AppError(400, 'Nenhum campo para atualizar');
  }

  await db.withTransaction(async (conn) => {
    if (empresa.sets.length > 0) {
      await conn.execute(
        `UPDATE empresa SET ${empresa.sets.join(', ')} WHERE id = ?`,
        [...empresa.vals, empresaId]
      );
    }

    if (profile.vals.length > 0) {
      await conn.execute(
        `INSERT INTO empresaProfile (empresa_id)
         VALUES (?)
         ON DUPLICATE KEY UPDATE ${profile.sets.join(', ')}`,
        [empresaId, ...profile.vals]
      );
    }
  });

  return getPerfil(empresaId);
}

async function getDashboard(empresaId) {
  const totals = await db.queryOne(
    `SELECT
        COUNT(DISTINCT a.cliente_id) AS total_clientes,
        COUNT(*) AS total_agendamentos,
        SUM(a.status_agendamento = 'concluido') AS concluidos,
        SUM(a.status_agendamento = 'cancelado') AS cancelados,
        SUM(a.status_agendamento = 'pendente') AS pendentes,
        ROUND(AVG(CASE WHEN av.estrelas IS NOT NULL THEN av.estrelas END), 2) AS media_avaliacao,
        COALESCE(SUM(CASE WHEN a.status_agendamento = 'concluido' THEN a.valor ELSE 0 END), 0) AS receita_total
     FROM agendamento a
     LEFT JOIN avaliacao av ON av.agendamento_id = a.id
     WHERE a.empresa_id = ?`,
    [empresaId]
  );

  const porServico = await db.query(
    `SELECT s.nome,
            COUNT(*) AS total,
            SUM(a.status_agendamento = 'concluido') AS concluidos,
            SUM(a.status_agendamento = 'cancelado') AS cancelados
     FROM agendamento a
     JOIN servico s ON s.id = a.servico_id
     WHERE a.empresa_id = ?
     GROUP BY s.id, s.nome`,
    [empresaId]
  );

  const ultimosAgendamentos = await db.query(
    `SELECT a.id, a.data_agendamento, a.hora_inicio, a.status_agendamento,
            c.nome AS cliente_nome, s.nome AS servico_nome
     FROM agendamento a
     JOIN cliente c ON c.id = a.cliente_id
     JOIN servico s ON s.id = a.servico_id
     WHERE a.empresa_id = ?
     ORDER BY a.data_agendamento DESC, a.hora_inicio DESC
     LIMIT 10`,
    [empresaId]
  );

  return { ...totals, por_servico: porServico, ultimos: ultimosAgendamentos };
}

async function getCapacidades(empresaId) {
  return db.query(
    `SELECT * FROM capacidade_horario WHERE empresa_id = ? ORDER BY hora_inicio`,
    [empresaId]
  );
}

async function upsertCapacidade(empresaId, data) {
  const { hora_inicio, hora_fim, max_agendamentos } = data;
  if (!hora_inicio || !hora_fim) throw new AppError(400, 'hora_inicio e hora_fim são obrigatórios');
  if (max_agendamentos == null || max_agendamentos < 1) throw new AppError(400, 'max_agendamentos deve ser >= 1');

  return db.execute(
    `INSERT INTO capacidade_horario (empresa_id, hora_inicio, hora_fim, max_agendamentos)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE max_agendamentos = VALUES(max_agendamentos)`,
    [empresaId, hora_inicio, hora_fim, max_agendamentos]
  );
}

async function deleteCapacidade(empresaId, id) {
  const r = await db.execute(
    `DELETE FROM capacidade_horario WHERE id = ? AND empresa_id = ?`,
    [id, empresaId]
  );
  ensureAffected(r, 'Capacidade');
}

module.exports = { getPerfil, updatePerfil, getDashboard, getCapacidades, upsertCapacidade, deleteCapacidade };
