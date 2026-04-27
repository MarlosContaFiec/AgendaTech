'use strict';
const db     = require('../../config/database');
const res_   = require('../../utils/response');
const router = require('express').Router();
const { requireCliente, authenticate } = require('../../middlewares/auth');
const { validate, schemas }            = require('../../middlewares/validate');



async function getPerfil(clienteId) {
  return db.queryOne(
    `SELECT u.id, u.email, u.foto, u.data_criacao,
            c.nome, c.cpf, c.verificado, c.data_nascimento, c.telefone, c.score
     FROM usuario u
     JOIN cliente c ON c.id = u.id
     WHERE u.id = ?`,
    [clienteId]
  );
}

async function updatePerfil(clienteId, data) {
  const { nome, telefone, data_nascimento} = data;
  await db.execute(
    `UPDATE cliente SET
       nome            = COALESCE(?, nome),
       telefone        = COALESCE(?, telefone),
       data_nascimento = COALESCE(?, data_nascimento),
     WHERE id = ?`,
    [nome||null, telefone||null, data_nascimento||null, clienteId]
  );
}

async function getScoreLog(clienteId) {
  return db.query(
    `SELECT pl.*, a.data_agendamento, a.hora_inicio, s.nome AS servico_nome
     FROM pontuacao_log pl
     LEFT JOIN agendamento a ON a.id = pl.agendamento_id
     LEFT JOIN servico s ON s.id = a.servico_id
     WHERE pl.cliente_id = ?
     ORDER BY pl.criado_em DESC
     LIMIT 50`,
    [clienteId]
  );
}

async function getCalendario(clienteId) {
  return db.query(
    `SELECT a.id, a.data_agendamento, a.hora_inicio, a.hora_fim, a.status_agendamento,
            s.nome AS servico_nome, s.duracao_minutos,
            e.nome_fantasia AS empresa_nome,
            e.endereco, e.numero, e.bairro, e.cidade
     FROM agendamento a
     JOIN servico s ON s.id = a.servico_id
     JOIN empresa e ON e.id = a.empresa_id
     WHERE a.cliente_id = ?
       AND a.status_agendamento NOT IN ('cancelado')
       AND a.data_agendamento >= CURDATE() - INTERVAL 30 DAY
     ORDER BY a.data_agendamento ASC, a.hora_inicio ASC`,
    [clienteId]
  );
}



router.get('/perfil',          requireCliente, async (req, res, next) => {
  try { res_.ok(res, await getPerfil(req.user.id)); } catch (e) { next(e); }
});

router.put('/perfil',          requireCliente, validate(schemas.updateClientePerfil), async (req, res, next) => {
  try { await updatePerfil(req.user.id, req.body); res_.ok(res, null, 'Perfil atualizado'); } catch (e) { next(e); }
});

router.get('/score',           requireCliente, async (req, res, next) => {
  try { res_.ok(res, await getScoreLog(req.user.id)); } catch (e) { next(e); }
});

router.post('/cartoes',        requireCliente, async (req, res, next) => {
  try { res_.created(res, await addCartao(req.user.id, req.body)); } catch (e) { next(e); }
});

router.get('/calendario',      requireCliente, async (req, res, next) => {
  try { res_.ok(res, await getCalendario(req.user.id)); } catch (e) { next(e); }
});

module.exports = router;
