'use strict';
const svc = require('./documento.service');
const res_ = require('../../utils/response');
const wrap = require('../../utils/wrapAsync');

const list           = wrap(async (req, res) => { res_.ok(res, await svc.list(req.user.id)); });
const create         = wrap(async (req, res) => { res_.created(res, await svc.create(req.user.id, req.body)); });
const remove         = wrap(async (req, res) => { await svc.remove(req.user.id, req.params.id); res_.ok(res, null, 'Documento removido'); });
const listEmpresaDocs = wrap(async (req, res) => { res_.ok(res, await svc.listEmpresaDocs(req.user.id, req.query)); });
const revisar        = wrap(async (req, res) => { res_.ok(res, await svc.revisar(req.user.id, req.params.id, req.body)); });

module.exports = { list, create, remove, listEmpresaDocs, revisar };
