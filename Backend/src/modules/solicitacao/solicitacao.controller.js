'use strict';
const svc = require('./solicitacao.service');
const res_ = require('../../utils/response');
const wrap = require('../../utils/wrapAsync');

const create       = wrap(async (req, res) => { res_.created(res, await svc.create(req.user.id, req.body)); });
const listPendentes = wrap(async (req, res) => { res_.ok(res, await svc.listPendentes(req.user.id)); });
const responder    = wrap(async (req, res) => { res_.ok(res, await svc.responder(req.user.id, req.params.id, req.body)); });

module.exports = { create, listPendentes, responder };
