'use strict';
const db     = require('../../config/database'); 
const res_   = require('../../utils/response');
const router = require('express').Router();
const { authenticate, requireEmpresa, requireCliente } = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');



async function create(clienteId, agendamentoId, data) {
  
  const ag = await db.queryOne(
    `SELECT * FROM agendamento WHERE id=? AND cliente_id=? AND status_agendamento='concluido'`,
    [agendamentoId, clienteId]
  );
  if (!ag) throw { statusCode: 404, message: 'Agendamento não encontrado ou não está concluído' };

  
  const exists = await db.queryOne(`SELECT id FROM avaliacao WHERE agendamento_id=?`, [agendamentoId]);
  if (exists) throw { statusCode: 409, message: 'Agendamento já foi avaliado' };

  const r = await db.execute(
    `INSERT INTO avaliacao (agendamento_id, cliente_id, estrelas, feedback) VALUES (?, ?, ?, ?)`,
    [agendamentoId, clienteId, data.estrelas, data.feedback || null]
  );

  
  await dispararRespostaAutomatica(ag.empresa_id, r.insertId, data.estrelas);

  return db.queryOne(`SELECT * FROM avaliacao WHERE id=?`, [r.insertId]);
}

async function listEmpresa(empresaId, filters = {}) {
  const { estrelas_min, estrelas_max, pagina = 1, limite = 20 } = filters;
  const where = ['a.empresa_id = ?'], params = [empresaId];

  if (estrelas_min) { where.push('av.estrelas >= ?'); params.push(estrelas_min); }
  if (estrelas_max) { where.push('av.estrelas <= ?'); params.push(estrelas_max); }

  const offA = (parseInt(pagina) - 1) * parseInt(limite);
  const limA = parseInt(limite);

  return db.queryRaw(
    `SELECT av.*, c.nome AS cliente_nome, s.nome AS servico_nome,
            a.data_agendamento, a.hora_inicio
     FROM avaliacao av
     JOIN agendamento a ON a.id = av.agendamento_id
     JOIN cliente c ON c.id = av.cliente_id
     JOIN servico s ON s.id = a.servico_id
     WHERE ${where.join(' AND ')}
     ORDER BY av.id DESC
     LIMIT ${limA} OFFSET ${offA}`,
    params
  );
}

async function responder(empresaId, avaliacaoId, resposta) {
  
  const av = await db.queryOne(
    `SELECT av.* FROM avaliacao av
     JOIN agendamento a ON a.id = av.agendamento_id
     WHERE av.id=? AND a.empresa_id=?`,
    [avaliacaoId, empresaId]
  );
  if (!av) throw { statusCode: 404, message: 'Avaliação não encontrada' };

  await db.execute(`UPDATE avaliacao SET resposta_empresa=? WHERE id=?`, [resposta, avaliacaoId]);
  return db.queryOne(`SELECT * FROM avaliacao WHERE id=?`, [avaliacaoId]);
}

async function dispararRespostaAutomatica(empresaId, avaliacaoId, estrelas) {
  try {
    const regra = await db.queryOne(
      `SELECT * FROM regra_empresa
       WHERE empresa_id=? AND tipo='notificacao'
         AND estrelas_min <= ? AND estrelas_max >= ? AND ativo=1 LIMIT 1`,
      [empresaId, estrelas, estrelas]
    );
    if (!regra?.mensagem_template) return;
    await db.execute(
      `UPDATE avaliacao SET resposta_empresa=? WHERE id=?`,
      [regra.mensagem_template, avaliacaoId]
    );
  } catch (err) {
    console.error('[AVALIACAO] Erro resposta automática:', err.message);
  }
}

async function stats(empresaId) {
  return db.queryOne(
    `SELECT
       COUNT(*) AS total,
       ROUND(AVG(av.estrelas), 2) AS media,
       SUM(av.estrelas = 5) AS cinco,
       SUM(av.estrelas = 4) AS quatro,
       SUM(av.estrelas = 3) AS tres,
       SUM(av.estrelas = 2) AS dois,
       SUM(av.estrelas = 1) AS um
     FROM avaliacao av
     JOIN agendamento a ON a.id = av.agendamento_id
     WHERE a.empresa_id = ?`,
    [empresaId]
  );
}



const ctrl = {
  create: async (req, res, next) => {
    try { res_.created(res, await create(req.user.id, req.params.agendamento_id, req.body)); }
    catch (e) { next(e); }
  },
  listEmpresa: async (req, res, next) => {
    try { res_.ok(res, await listEmpresa(req.user.id, req.query)); }
    catch (e) { next(e); }
  },
  responder: async (req, res, next) => {
    try { res_.ok(res, await responder(req.user.id, req.params.id, req.body.resposta)); }
    catch (e) { next(e); }
  },
  stats: async (req, res, next) => {
    try { res_.ok(res, await stats(req.user.id)); }
    catch (e) { next(e); }
  },
};




router.post('/agendamento/:agendamento_id',
  requireCliente, validate(schemas.createAvaliacao), ctrl.create);


router.get('/',          requireEmpresa, ctrl.listEmpresa);
router.get('/stats',     requireEmpresa, ctrl.stats);
router.put('/:id',       requireEmpresa, validate(schemas.responderAvaliacao), ctrl.responder);

module.exports = router;
