'use strict';
const svc = require('./solicitacao.service');
const res_ = require('../../utils/response');

async function create(req, res, next) {
  try { res_.created(res, await svc.create(req.user.id, req.body)); } catch (e) { next(e); }
}

async function listPendentes(req, res, next) {
  try { res_.ok(res, await svc.listPendentes(req.user.id)); } catch (e) { next(e); }
}

async function responder(req, res, next) {
  try { res_.ok(res, await svc.responder(req.user.id, req.params.id, req.body)); } catch (e) { next(e); }
}

module.exports = { create, listPendentes, responder };
