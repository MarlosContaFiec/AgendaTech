'use strict';
const svc = require('./dependente.service');
const res_ = require('../../utils/response');
const wrap = require('../../utils/wrapAsync');

const list   = wrap(async (req, res) => { res_.ok(res, await svc.list(req.user.id)); });
const create = wrap(async (req, res) => { res_.created(res, await svc.create(req.user.id, req.body)); });
const update = wrap(async (req, res) => { res_.ok(res, await svc.update(req.user.id, req.params.id, req.body)); });
const remove = wrap(async (req, res) => { await svc.remove(req.user.id, req.params.id); res_.ok(res, null, 'Dependente removido'); });

module.exports = { list, create, update, remove };
