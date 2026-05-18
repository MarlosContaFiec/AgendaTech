'use strict';
const svc = require('./dependente.service');
const res_ = require('../../utils/response');

async function list(req, res, next) {
  try { res_.ok(res, await svc.list(req.user.id)); } catch (e) { next(e); }
}

async function create(req, res, next) {
  try { res_.created(res, await svc.create(req.user.id, req.body)); } catch (e) { next(e); }
}

async function update(req, res, next) {
  try { res_.ok(res, await svc.update(req.user.id, req.params.id, req.body)); } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try { await svc.remove(req.user.id, req.params.id); res_.ok(res, null, 'Dependente removido'); } catch (e) { next(e); }
}

module.exports = { list, create, update, remove };
