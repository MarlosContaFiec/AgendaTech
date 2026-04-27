'use strict';
const svc  = require('./servico.service');
const res_ = require('../../utils/response');

async function list(req, res, next) {
  try { res_.ok(res, await svc.list(req.user.id)); }
  catch (err) { next(err); }
}
async function getById(req, res, next) {
  try {
    const s = await svc.getById(req.user.id, req.params.id);
    if (!s) return res_.notFound(res, 'Serviço');
    res_.ok(res, s);
  } catch (err) { next(err); }
}
async function create(req, res, next) {
  try { res_.created(res, await svc.create(req.user.id, req.body)); }
  catch (err) { next(err); }
}
async function update(req, res, next) {
  try { res_.ok(res, await svc.update(req.user.id, req.params.id, req.body)); }
  catch (err) { next(err); }
}
async function remove(req, res, next) {
  try {
    await svc.remove(req.user.id, req.params.id);
    res_.ok(res, null, 'Serviço desativado');
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove };
