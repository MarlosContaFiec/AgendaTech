'use strict';
const svc  = require('./empresa.service');
const res_ = require('../../utils/response');

async function getPerfil(req, res, next) {
  try { res_.ok(res, await svc.getPerfil(req.user.id)); }
  catch (err) { next(err); }
}

async function updatePerfil(req, res, next) {
  try {
    await svc.updatePerfil(req.user.id, req.body);
    res_.ok(res, null, 'Perfil atualizado');
  } catch (err) { next(err); }
}

async function getDashboard(req, res, next) {
  try { res_.ok(res, await svc.getDashboard(req.user.id)); }
  catch (err) { next(err); }
}

async function getCapacidades(req, res, next) {
  try { res_.ok(res, await svc.getCapacidades(req.user.id)); }
  catch (err) { next(err); }
}

async function upsertCapacidade(req, res, next) {
  try {
    await svc.upsertCapacidade(req.user.id, req.body);
    res_.ok(res, null, 'Capacidade atualizada');
  } catch (err) { next(err); }
}

async function deleteCapacidade(req, res, next) {
  try {
    await svc.deleteCapacidade(req.user.id, req.params.id);
    res_.ok(res, null, 'Removido');
  } catch (err) { next(err); }
}

module.exports = { getPerfil, updatePerfil, getDashboard, getCapacidades, upsertCapacidade, deleteCapacidade };
