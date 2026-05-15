'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');
const cal = require('../../utils/calendarEngine');
const res_ = require('../../utils/response');
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
  const sets = [], vals = [];
  for (const k of allowed) {
    if (data[k] !== undefined) { sets.push(`${k} = ?`); vals.push(data[k]); }
  }
  if (!sets.length) throw new AppError(400, 'Nenhum campo para atualizar');
  const r = await db.execute(`UPDATE regras SET ${sets.join(', ')} WHERE id = ? AND empresa_id = ?`, [...vals, id, empresaId]);
  if (r.affectedRows === 0) throw new AppError(404, 'Regra não encontrada');
  return db.queryOne(`SELECT r.*, t.nome AS tag_nome, t.label, t.cor FROM regras r JOIN tags t ON t.id=r.tag_id WHERE r.id=?`, [id]);
}

async function remove(empresaId, id) {
  const r = await db.execute(`DELETE FROM regras WHERE id = ? AND empresa_id = ?`, [id, empresaId]);
  if (r.affectedRows === 0) throw new AppError(404, 'Regra não encontrada');
}

async function getCalendario(empresaId, ano, mes) {
  return cal.resolveMonth(empresaId, ano, mes);
}

async function getDia(empresaId, date) {
  return cal.isDayOpen(empresaId, date);
}

async function ctrlList(req, res, next) {
  try { res_.ok(res, await list(req.user.id)); } catch (e) { next(e); }
}
async function ctrlCreate(req, res, next) {
  try { res_.created(res, await create(req.user.id, req.body)); } catch (e) { next(e); }
}
async function ctrlUpdate(req, res, next) {
  try { res_.ok(res, await update(req.user.id, req.params.id, req.body)); } catch (e) { next(e); }
}
async function ctrlRemove(req, res, next) {
  try { await remove(req.user.id, req.params.id); res_.ok(res, null, 'Regra removida'); } catch (e) { next(e); }
}
async function ctrlCalendario(req, res, next) {
  try {
    const { mes, ano } = req.query;
    if (!mes || !ano) return res_.badRequest(res, 'Informe mes e ano');
    res_.ok(res, await getCalendario(req.user.id, parseInt(ano), parseInt(mes)));
  } catch (e) { next(e); }
}
async function ctrlDia(req, res, next) {
  try {
    const { data } = req.query;
    if (!data) return res_.badRequest(res, 'Informe data no formato YYYY-MM-DD');
    res_.ok(res, await getDia(req.user.id, data));
  } catch (e) { next(e); }
}

router.get('/', requireEmpresa, ctrlList);
router.post('/', requireEmpresa, validate(schemas.createRegra), ctrlCreate);
router.put('/:id', requireEmpresa, validate(schemas.updateRegra), ctrlUpdate);
router.delete('/:id', requireEmpresa, ctrlRemove);
router.get('/calendario', requireEmpresa, ctrlCalendario);
router.get('/dia', requireEmpresa, ctrlDia);

module.exports = router;