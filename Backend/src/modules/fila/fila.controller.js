'use strict';
const svc = require('./fila.service');
const res_ = require('../../utils/response');
const wrap = require('../../utils/wrapAsync');

const entrar      = wrap(async (req, res) => { res_.created(res, await svc.entrar(req.user.id, req.body)); });
const sair        = wrap(async (req, res) => { await svc.sair(req.user.id, req.params.id); res_.ok(res, null, 'Saiu da fila'); });
const listCliente = wrap(async (req, res) => { res_.ok(res, await svc.listCliente(req.user.id)); });
const listEmpresa = wrap(async (req, res) => { res_.ok(res, await svc.listEmpresa(req.user.id, req.query)); });
const converter   = wrap(async (req, res) => { res_.ok(res, await svc.converter(req.user.id, req.params.id)); });

module.exports = { entrar, sair, listCliente, listEmpresa, converter };
