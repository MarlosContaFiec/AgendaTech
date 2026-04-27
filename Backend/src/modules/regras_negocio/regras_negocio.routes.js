'use strict';
const db     = require('../../config/database');
const tpl    = require('../../utils/templateEngine');
const res_   = require('../../utils/response');
const router = require('express').Router();
const { requireEmpresa }    = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');



async function list(empresaId, tipo) {
  if (tipo) {
    return db.query(
      `SELECT * FROM regra_empresa WHERE empresa_id = ? AND tipo = ? ORDER BY id`,
      [empresaId, tipo]
    );
  }
  return db.query(
    `SELECT * FROM regra_empresa WHERE empresa_id = ? ORDER BY tipo, id`,
    [empresaId]
  );
}

async function create(empresaId, data) {
  const r = await db.execute(
    `INSERT INTO regra_empresa
      (empresa_id, tipo, nome, descricao, antecedencia_horas, mensagem_template,
       tipo_notificacao, limite_horas, taxa_percentual, taxa_fixa, estrelas_min, estrelas_max)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [empresaId, data.tipo, data.nome, data.descricao || null,
     data.antecedencia_horas || null, data.mensagem_template || null,
     data.tipo_notificacao   || null, data.limite_horas     || null,
     data.taxa_percentual    || null, data.taxa_fixa         || null,
     data.estrelas_min       || null, data.estrelas_max      || null]
  );
  return db.queryOne(`SELECT * FROM regra_empresa WHERE id = ?`, [r.insertId]);
}

async function update(empresaId, id, data) {
  const allowed = ['nome','descricao','antecedencia_horas','mensagem_template',
                   'tipo_notificacao','limite_horas','taxa_percentual','taxa_fixa',
                   'estrelas_min','estrelas_max','ativo'];
  const sets = [], vals = [];
  for (const k of allowed) {
    if (data[k] !== undefined) { sets.push(`${k} = ?`); vals.push(data[k]); }
  }
  if (!sets.length) throw { statusCode: 400, message: 'Nenhum campo para atualizar' };
  await db.execute(
    `UPDATE regra_empresa SET ${sets.join(', ')} WHERE id = ? AND empresa_id = ?`,
    [...vals, id, empresaId]
  );
  return db.queryOne(`SELECT * FROM regra_empresa WHERE id = ?`, [id]);
}

async function remove(empresaId, id) {
  return db.execute(
    `DELETE FROM regra_empresa WHERE id = ? AND empresa_id = ?`, [id, empresaId]
  );
}

async function previewTemplate(empresaId, id) {
  const regra = await db.queryOne(
    `SELECT re.*, e.nome_fantasia FROM regra_empresa re
     JOIN empresa e ON e.id = re.empresa_id
     WHERE re.id = ? AND re.empresa_id = ?`,
    [id, empresaId]
  );
  if (!regra) throw { statusCode: 404, message: 'Regra não encontrada' };
  const preview = tpl.render(regra.mensagem_template || '', {
    nome_cliente: 'João Silva (exemplo)',
    nome_empresa: regra.nome_fantasia,
    data:         new Date().toISOString().split('T')[0],
    hora:         '14:00',
    servico:      'Corte Simples (exemplo)',
    valor:        120.00,
    taxa:         36.00,
  });
  return { preview, variaveis: tpl.availableVars() };
}



const ctrl = {
  list:    async (req, res, next) => { try { res_.ok(res, await list(req.user.id, req.query.tipo)); }                    catch (e) { next(e); } },
  create:  async (req, res, next) => { try { res_.created(res, await create(req.user.id, req.body)); }                   catch (e) { next(e); } },
  update:  async (req, res, next) => { try { res_.ok(res, await update(req.user.id, req.params.id, req.body)); }         catch (e) { next(e); } },
  remove:  async (req, res, next) => { try { await remove(req.user.id, req.params.id); res_.ok(res, null, 'Removido'); } catch (e) { next(e); } },
  preview: async (req, res, next) => { try { res_.ok(res, await previewTemplate(req.user.id, req.params.id)); }          catch (e) { next(e); } },
  vars:    (_req, res)             => { res_.ok(res, tpl.availableVars()); },
};


router.get('/template/vars',  requireEmpresa, ctrl.vars);    
router.get('/',               requireEmpresa, ctrl.list);
router.post('/',              requireEmpresa, validate(schemas.createRegraNegocio), ctrl.create);
router.put('/:id',            requireEmpresa, validate(schemas.createRegraNegocio), ctrl.update);
router.delete('/:id',         requireEmpresa, ctrl.remove);
router.get('/:id/preview',    requireEmpresa, ctrl.preview);

module.exports = router;
