'use strict';
const svc  = require('./empresa.service');
const res_ = require('../../utils/response');
const wrap = require('../../utils/wrapAsync');

const getPerfil         = wrap(async (req, res) => { res_.ok(res, await svc.getPerfil(req.user.id)); });
const updatePerfil      = wrap(async (req, res) => { res_.ok(res, await svc.updatePerfil(req.user.id, req.body), 'Perfil atualizado'); });
const getDashboard      = wrap(async (req, res) => { res_.ok(res, await svc.getDashboard(req.user.id)); });
const getCapacidades    = wrap(async (req, res) => { res_.ok(res, await svc.getCapacidades(req.user.id)); });
const upsertCapacidade  = wrap(async (req, res) => { await svc.upsertCapacidade(req.user.id, req.body); res_.ok(res, null, 'Capacidade atualizada'); });
const deleteCapacidade  = wrap(async (req, res) => { await svc.deleteCapacidade(req.user.id, req.params.id); res_.ok(res, null, 'Removido'); });

module.exports = { getPerfil, updatePerfil, getDashboard, getCapacidades, upsertCapacidade, deleteCapacidade };
