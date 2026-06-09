'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');
const cal = require('../../utils/calendarEngine');
const res_ = require('../../utils/response');
const wrap = require('../../utils/wrapAsync');
const { buildUpdateSets, ensureAffected } = require('../../utils/queryHelpers');
const router = require('express').Router();
const { requireEmpresa } = require('../../middlewares/auth');
const { validate, validateQuery, schemas } = require('../../middlewares/validate');

async function list(empresaId) {
  return db.query(
    `SELECT r.*, t.nome AS tag_nome, t.label AS tag_label, t.cor AS tag_cor
     FROM regras r
     JOIN tags t ON t.id = r.tag_id
     WHERE r.empresa_id = ?
     ORDER BY r.prioridade DESC, r.id`,
    [empresaId]
  );
}

async function create(empresaId, data) {
  const r = await db.execute(
    `INSERT INTO regras
      (empresa_id, tag_id, tipo, dia_semana, qnd_ocorre, mes,
       unico_dia, unico_mes, unico_ano, unico_repete_anual, prioridade)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [empresaId, data.tag_id, data.tipo,
     data.dia_semana ?? null, data.qnd_ocorre ?? null, data.mes ?? null,
     data.unico_dia ?? null, data.unico_mes ?? null, data.unico_ano ?? null,
     data.unico_repete_anual ? 1 : 0, data.prioridade ?? 10]
  );
  return db.queryOne(`SELECT r.*, t.nome AS tag_nome, t.label, t.cor FROM regras r JOIN tags t ON t.id=r.tag_id WHERE r.id=?`, [r.insertId]);
}

async function update(empresaId, id, data) {
  const allowed = ['tag_id', 'tipo', 'dia_semana', 'qnd_ocorre', 'mes',
    'unico_dia', 'unico_mes', 'unico_ano', 'unico_repete_anual', 'prioridade', 'ativo'];
  const { sets, vals } = buildUpdateSets(data, allowed);
  if (!sets.length) throw new AppError(400, 'Nenhum campo para atualizar');
  const r = await db.execute(`UPDATE regras SET ${sets.join(', ')} WHERE id = ? AND empresa_id = ?`, [...vals, id, empresaId]);
  ensureAffected(r, 'Regra');
  return db.queryOne(`SELECT r.*, t.nome AS tag_nome, t.label, t.cor FROM regras r JOIN tags t ON t.id=r.tag_id WHERE r.id=?`, [id]);
}

async function remove(empresaId, id) {
  const r = await db.execute(`DELETE FROM regras WHERE id = ? AND empresa_id = ?`, [id, empresaId]);
  ensureAffected(r, 'Regra');
}

router.get('/', requireEmpresa, wrap(async (req, res) => { res_.ok(res, await list(req.user.id)); }));
router.post('/', requireEmpresa, validate(schemas.createRegra), wrap(async (req, res) => { res_.created(res, await create(req.user.id, req.body)); }));
router.put('/:id', requireEmpresa, validate(schemas.updateRegra), wrap(async (req, res) => { res_.ok(res, await update(req.user.id, req.params.id, req.body)); }));
router.delete('/:id', requireEmpresa, wrap(async (req, res) => { await remove(req.user.id, req.params.id); res_.ok(res, null, 'Regra removida'); }));
router.get('/calendario', requireEmpresa, wrap(async (req, res) => {
  const { mes, ano } = req.query;
  if (!mes || !ano) return res_.badRequest(res, 'Informe mes e ano');
  res_.ok(res, await cal.resolveMonth(req.user.id, parseInt(ano), parseInt(mes)));
}));
router.get('/dia', requireEmpresa, wrap(async (req, res) => {
  const { data } = req.query;
  if (!data) return res_.badRequest(res, 'Informe data no formato YYYY-MM-DD');
  res_.ok(res, await cal.isDayOpen(req.user.id, data));
}));

module.exports = router;
