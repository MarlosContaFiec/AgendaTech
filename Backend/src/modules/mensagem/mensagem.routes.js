'use strict';
const db     = require('../../config/database');
const res_   = require('../../utils/response');
const router = require('express').Router();
const { authenticate, requireEmpresa } = require('../../middlewares/auth');
const { validate, schemas }            = require('../../middlewares/validate');



async function listConversas(empresaId) {
  return db.query(
    `SELECT
       c.id AS cliente_id, c.nome AS cliente_nome, c.score AS cliente_score,
       u.foto AS cliente_foto,
       m.mensagem AS ultima_mensagem, m.data_envio, m.enviado_por
     FROM mensagem m
     JOIN cliente c ON c.id = m.cliente_id
     JOIN usuario u ON u.id = c.id
     WHERE m.empresa_id = ?
       AND m.id = (
         SELECT MAX(m2.id) FROM mensagem m2
         WHERE m2.empresa_id = ? AND m2.cliente_id = c.id
       )
     ORDER BY m.data_envio DESC`,
    [empresaId, empresaId]
  );
}

async function listMensagens(empresaId, clienteId, pagina = 1, limite = 50) {
  const offset = (parseInt(pagina) - 1) * parseInt(limite);
  return db.queryRaw(
    `SELECT m.*
     FROM mensagem m
     WHERE m.empresa_id = ? AND m.cliente_id = ?
     ORDER BY m.data_envio ASC
     LIMIT ${parseInt(limite)} OFFSET ${offset}`,
    [empresaId, clienteId]
  );
}

async function sendEmpresa(empresaId, clienteId, data) {
  
  const cli = await db.queryOne(`SELECT id FROM cliente WHERE id = ?`, [clienteId]);
  if (!cli) throw { statusCode: 404, message: 'Cliente não encontrado' };

  const r = await db.execute(
    `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
     VALUES (?, ?, ?, ?, FALSE, 'empresa')`,
    [empresaId, clienteId, data.tipo || 'outro', data.mensagem]
  );
  return db.queryOne(`SELECT * FROM mensagem WHERE id = ?`, [r.insertId]);
}

async function sendCliente(clienteId, empresaId, data) {
  const empresa = await db.queryOne(`SELECT id FROM empresa WHERE id = ?`, [empresaId]);
  if (!empresa) throw { statusCode: 404, message: 'Empresa não encontrada' };

  const r = await db.execute(
    `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
     VALUES (?, ?, ?, ?, FALSE, 'cliente')`,
    [empresaId, clienteId, data.tipo || 'outro', data.mensagem]
  );
  return db.queryOne(`SELECT * FROM mensagem WHERE id = ?`, [r.insertId]);
}

async function getChatConfig(empresaId) {
  const config = await db.queryOne(
    `SELECT * FROM chat_config WHERE empresa_id = ?`, [empresaId]
  );
  const faqs = await db.query(
    `SELECT * FROM chat_faq WHERE empresa_id = ? AND ativo = 1 ORDER BY ordem`, [empresaId]
  );
  return { config, faqs };
}

async function upsertChatConfig(empresaId, data) {
  await db.execute(
    `INSERT INTO chat_config (empresa_id, mensagem_abertura, ativo) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       mensagem_abertura = VALUES(mensagem_abertura),
       ativo             = VALUES(ativo)`,
    [empresaId, data.mensagem_abertura || null, data.ativo ? 1 : 0]
  );
  return getChatConfig(empresaId);
}

async function addFaq(empresaId, data) {
  const r = await db.execute(
    `INSERT INTO chat_faq (empresa_id, pergunta, resposta, ordem) VALUES (?, ?, ?, ?)`,
    [empresaId, data.pergunta, data.resposta, data.ordem || 0]
  );
  return db.queryOne(`SELECT * FROM chat_faq WHERE id = ?`, [r.insertId]);
}

async function deleteFaq(empresaId, id) {
  return db.execute(
    `DELETE FROM chat_faq WHERE id = ? AND empresa_id = ?`, [id, empresaId]
  );
}




router.get('/publico/:empresa_id/faq', async (req, res, next) => {
  try { res_.ok(res, await getChatConfig(req.params.empresa_id)); } catch (e) { next(e); }
});


router.get('/conversas',              requireEmpresa, async (req, res, next) => {
  try { res_.ok(res, await listConversas(req.user.id)); } catch (e) { next(e); }
});
router.get('/conversas/:cliente_id',  requireEmpresa, async (req, res, next) => {
  try { res_.ok(res, await listMensagens(req.user.id, req.params.cliente_id, req.query.pagina, req.query.limite)); }
  catch (e) { next(e); }
});
router.post('/conversas/:cliente_id', requireEmpresa, validate(schemas.sendMensagem), async (req, res, next) => {
  try { res_.created(res, await sendEmpresa(req.user.id, req.params.cliente_id, req.body)); }
  catch (e) { next(e); }
});
router.get('/chat-config',            requireEmpresa, async (req, res, next) => {
  try { res_.ok(res, await getChatConfig(req.user.id)); } catch (e) { next(e); }
});
router.put('/chat-config',            requireEmpresa, validate(schemas.chatConfig), async (req, res, next) => {
  try { res_.ok(res, await upsertChatConfig(req.user.id, req.body)); } catch (e) { next(e); }
});
router.post('/chat-config/faq',       requireEmpresa, validate(schemas.chatFaq), async (req, res, next) => {
  try { res_.created(res, await addFaq(req.user.id, req.body)); } catch (e) { next(e); }
});
router.put('/chat-config/faq/:id',    requireEmpresa, async (req, res, next) => {
  try {
    const { pergunta, resposta, ordem, ativo } = req.body;
    await db.execute(
      `UPDATE chat_faq SET
         pergunta = COALESCE(?, pergunta), resposta = COALESCE(?, resposta),
         ordem    = COALESCE(?, ordem),   ativo     = COALESCE(?, ativo)
       WHERE id = ? AND empresa_id = ?`,
      [pergunta||null, resposta||null, ordem??null, ativo??null, req.params.id, req.user.id]
    );
    res_.ok(res, null, 'FAQ atualizado');
  } catch (e) { next(e); }
});
router.delete('/chat-config/faq/:id', requireEmpresa, async (req, res, next) => {
  try { await deleteFaq(req.user.id, req.params.id); res_.ok(res, null, 'FAQ removido'); }
  catch (e) { next(e); }
});


router.post('/empresa/:empresa_id',   authenticate, validate(schemas.sendMensagem), async (req, res, next) => {
  try { res_.created(res, await sendCliente(req.user.id, req.params.empresa_id, req.body)); }
  catch (e) { next(e); }
});

module.exports = router;
