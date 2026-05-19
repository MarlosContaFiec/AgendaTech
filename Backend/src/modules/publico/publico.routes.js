'use strict';
const db     = require('../../config/database');
const res_   = require('../../utils/response');
const cal    = require('../../utils/calendarEngine');
const router = require('express').Router();
const { validateQuery, schemas } = require('../../middlewares/validate');



async function listarEmpresas(filters = {}) {
  const { busca, nicho, cidade, estado } = filters;
  const pagina = parseInt(filters.pagina) || 1;
  const limite = parseInt(filters.limite) || 20;
  const where = ['u.ativo = 1'];
  const params = [];

  if (busca) {
    where.push('(e.nome_fantasia LIKE ? OR e.nicho LIKE ? OR e.sub_nicho LIKE ?)');
    const t = `%${busca}%`;
    params.push(t, t, t);
  }
  if (nicho) { where.push('e.nicho = ?'); params.push(nicho); }
  if (cidade) { where.push('e.cidade LIKE ?'); params.push(`%${cidade}%`); }
  if (estado) { where.push('e.estado = ?'); params.push(estado); }

  const offset = (pagina - 1) * limite;

  return db.queryRaw(
    `SELECT e.id, e.nome_fantasia, e.nicho, e.sub_nicho, e.cidade, e.estado,
            e.endereco, e.numero, e.bairro, e.telefone, e.site, e.verificada,
            ep.descricao, ep.logo_url, ep.cor_primaria,
            ROUND(AVG(av.estrelas), 1) AS media_avaliacao,
            COUNT(DISTINCT ag.id) AS total_agendamentos_mes
     FROM empresa e
     JOIN usuario u ON u.id = e.id
     LEFT JOIN empresaProfile ep ON ep.empresa_id = e.id
     LEFT JOIN agendamento ag ON ag.empresa_id = e.id
           AND ag.data_agendamento >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
     LEFT JOIN avaliacao av ON av.agendamento_id = ag.id
     WHERE ${where.join(' AND ')}
     GROUP BY e.id
     ORDER BY total_agendamentos_mes DESC, e.id DESC
     LIMIT ${limite} OFFSET ${offset}`,
    params
  );
}


async function getPerfilPublico(empresaId) {
  const empresa = await db.queryOne(
    `SELECT e.id, e.nome_fantasia, e.nicho, e.sub_nicho,
            e.cidade, e.estado, e.endereco, e.numero, e.bairro, e.telefone, e.site,
            ep.descricao, ep.logo_url, ep.cor_primaria, ep.cor_secundaria,
            ROUND(AVG(av.estrelas), 1) AS media_avaliacao,
            COUNT(DISTINCT av.id)      AS total_avaliacoes
     FROM empresa e
     LEFT JOIN empresaProfile ep ON ep.empresa_id = e.id
     LEFT JOIN agendamento ag ON ag.empresa_id = e.id
     LEFT JOIN avaliacao av ON av.agendamento_id = ag.id
     WHERE e.id = ?
     GROUP BY e.id`,
    [empresaId]
  );
  if (!empresa) return null;

  const servicos = await db.query(
    `SELECT id, nome, descricao, duracao_minutos, preco_base,
            aceitamento_automatico, hora_inicio, hora_fim
     FROM servico WHERE empresa_id = ? AND ativo = 1`,
    [empresaId]
  );

  const avaliacoes = await db.query(
    `SELECT av.estrelas, av.feedback, av.resposta_empresa,
            c.nome AS cliente_nome, ag.data_agendamento
     FROM avaliacao av
     JOIN agendamento ag ON ag.id = av.agendamento_id
     JOIN cliente c      ON c.id  = av.cliente_id
     WHERE ag.empresa_id = ?
     ORDER BY av.id DESC LIMIT 10`,
    [empresaId]
  );

  return { ...empresa, servicos, avaliacoes };
}

async function getDisponibilidade(empresaId, servicoId, date) {
  const agSvc = require('../agendamento/agendamento.service');
  return agSvc.getSlots(empresaId, servicoId, date);
}

async function getCalendarioPublico(empresaId, ano, mes) {
  return cal.resolveMonth(empresaId, parseInt(ano), parseInt(mes));
}

async function getDestaquesUltimas24h() {
  return db.query(
    `SELECT e.id, e.nome_fantasia, e.nicho, e.sub_nicho, e.cidade, e.estado,
            ep.descricao, ep.logo_url, ep.cor_primaria,
            COUNT(DISTINCT ag.id) AS agendamentos_24h,
            ROUND(AVG(av.estrelas), 1) AS media_avaliacao
     FROM empresa e
     JOIN usuario u ON u.id = e.id AND u.ativo = 1
     LEFT JOIN empresaProfile ep ON ep.empresa_id = e.id
     LEFT JOIN agendamento ag ON ag.empresa_id = e.id
           AND ag.criado_em >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
     LEFT JOIN avaliacao av ON av.agendamento_id = ag.id
     GROUP BY e.id
     HAVING agendamentos_24h > 0
     ORDER BY agendamentos_24h DESC, e.id DESC
     LIMIT 10`
  );
}

async function getNichos() {
  return db.query(
    `SELECT nicho, sub_nicho, COUNT(*) AS total
     FROM empresa
     WHERE nicho IS NOT NULL
     GROUP BY nicho, sub_nicho
     ORDER BY nicho, total DESC`
  );
}

async function getCidades() {
  return db.query(
    `SELECT cidade, estado, COUNT(*) as total
     FROM empresa
     JOIN usuario u ON u.id = empresa.id AND u.ativo = 1
     WHERE cidade IS NOT NULL AND cidade != ''
     GROUP BY cidade, estado
     ORDER BY total DESC`
  );
}


router.get('/empresas/cidades', async (_req, res, next) => {
  try { res_.ok(res, await getCidades()); } catch (e) { next(e); }
});

router.get('/empresas/destaques', async (_req, res, next) => {
  try { res_.ok(res, await getDestaquesUltimas24h()); } catch (e) { next(e); }
});

router.get('/empresas/nichos', async (_req, res, next) => {
  try { res_.ok(res, await getNichos()); } catch (e) { next(e); }
});

router.get('/empresas', validateQuery(schemas.filtroEmpresas), async (req, res, next) => {
  try { res_.ok(res, await listarEmpresas(req.query)); } catch (e) { next(e); }
});

router.get('/empresas/:id', async (req, res, next) => {
  try {
    const p = await getPerfilPublico(req.params.id);
    if (!p) return res_.notFound(res, 'Empresa');
    res_.ok(res, p);
  } catch (e) { next(e); }
});

router.get('/empresas/:id/disponibilidade',
  validateQuery(schemas.filtroDisponibilidade),
  async (req, res, next) => {
    try {
      const { servico_id, data } = req.query;
      if (!servico_id) return res_.badRequest(res, 'servico_id obrigatório');
      res_.ok(res, await getDisponibilidade(req.params.id, servico_id, data));
    } catch (e) { next(e); }
  }
);

router.get('/empresas/:id/calendario', async (req, res, next) => {
  try {
    const { ano, mes } = req.query;
    if (!ano || !mes) return res_.badRequest(res, 'Informe ano e mes');
    res_.ok(res, await getCalendarioPublico(req.params.id, ano, mes));
  } catch (e) { next(e); }
});

module.exports = router;
