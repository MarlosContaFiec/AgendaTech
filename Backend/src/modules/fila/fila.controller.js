'use strict';
const svc = require('./fila.service');
const res_ = require('../../utils/response');

async function entrar(req, res, next) {
  try { res_.created(res, await svc.entrar(req.user.id, req.body)); } catch (e) { next(e); }
}

async function sair(req, res, next) {
  try { await svc.sair(req.user.id, req.params.id); res_.ok(res, null, 'Saiu da fila'); } catch (e) { next(e); }
}

async function listCliente(req, res, next) {
  try { res_.ok(res, await svc.listCliente(req.user.id)); } catch (e) { next(e); }
}

async function listEmpresa(req, res, next) {
  try { res_.ok(res, await svc.listEmpresa(req.user.id, req.query)); } catch (e) { next(e); }
}

async function converter(req, res, next) {
  try { res_.ok(res, await svc.converter(req.user.id, req.params.id)); } catch (e) { next(e); }
}

module.exports = { entrar, sair, listCliente, listEmpresa, converter };
