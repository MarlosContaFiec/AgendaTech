'use strict';
const db = require('../../config/database');

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
  const conn = await db.beginTransaction();
  try {
    
    const empresaFields = {
      nome_fantasia:           data.nome_fantasia,
      razao_social:            data.razao_social,
      telefone:                data.telefone,
      cep:                     data.cep,
      endereco:                data.endereco,
      numero:                  data.numero,
      complemento:             data.complemento,
      bairro:                  data.bairro,
      cidade:                  data.cidade,
      estado:                  data.estado,
      nicho:                   data.nicho,
      sub_nicho:               data.sub_nicho,
      site:                    data.site,
      max_agendamentos_global: data.max_agendamentos_global,
    };

    const setSql = [], setVals = [];
    for (const [k, v] of Object.entries(empresaFields)) {
      if (v !== undefined) {
        setSql.push(`${k} = ?`);
        setVals.push(v === '' ? null : v);
      }
    }
    if (setSql.length > 0) {
      await conn.execute(
        `UPDATE empresa SET ${setSql.join(', ')} WHERE id = ?`,
        [...setVals, empresaId]
      );
    }

    
    const profileFields = {
      descricao:     data.descricao,
      logo_url:      data.logo_url,
      cor_primaria:  data.cor_primaria,
      cor_secundaria: data.cor_secundaria,
    };

    const profileSets = [], profileVals = [];
    for (const [k, v] of Object.entries(profileFields)) {
      if (v !== undefined) {
        profileSets.push(`${k} = ?`);
        profileVals.push(v === '' ? null : v);
      }
    }

    if (profileVals.length > 0) {
      
      await conn.execute(
        `INSERT INTO empresaProfile (empresa_id)
         VALUES (?)
         ON DUPLICATE KEY UPDATE ${profileSets.join(', ')}`,
        [empresaId, ...profileVals]
      );
    }

    await conn.commit();
    conn.release();
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

async function getDashboard(empresaId) {
  const totals = await db.queryOne(
    `SELECT
        COUNT(DISTINCT a.cliente_id)                                              AS total_clientes,
        COUNT(*)                                                                   AS total_agendamentos,
        SUM(a.status_agendamento = 'concluido')                                   AS concluidos,
        SUM(a.status_agendamento = 'cancelado')                                   AS cancelados,
        SUM(a.status_agendamento = 'pendente')                                    AS pendentes,
        ROUND(AVG(CASE WHEN av.estrelas IS NOT NULL THEN av.estrelas END), 2)     AS media_avaliacao,
        COALESCE(SUM(CASE WHEN a.status_agendamento='concluido' END), 0) AS receita_total
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
  return db.execute(
    `INSERT INTO capacidade_horario (empresa_id, hora_inicio, hora_fim, max_agendamentos)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE max_agendamentos = VALUES(max_agendamentos)`,
    [empresaId, hora_inicio, hora_fim, max_agendamentos]
  );
}

async function deleteCapacidade(empresaId, id) {
  return db.execute(
    `DELETE FROM capacidade_horario WHERE id = ? AND empresa_id = ?`,
    [id, empresaId]
  );
}

module.exports = { getPerfil, updatePerfil, getDashboard, getCapacidades, upsertCapacidade, deleteCapacidade };
