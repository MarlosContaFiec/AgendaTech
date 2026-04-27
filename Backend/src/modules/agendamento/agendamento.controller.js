'use strict';
const svc  = require('./agendamento.service');
const res_ = require('../../utils/response');

async function getSlots(req, res, next) {
  try {
    const { empresa_id, servico_id, data } = req.query;
    if (!empresa_id || !servico_id || !data)
      return res_.badRequest(res, 'Informe empresa_id, servico_id e data');
    res_.ok(res, await svc.getSlots(empresa_id, servico_id, data));
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    res_.created(res, await svc.create(req.user.id, req.body), 'Agendamento criado');
  } catch (e) { next(e); }
}

async function listEmpresa(req, res, next) {
  try {
    res_.ok(res, await svc.listEmpresa(req.user.id, req.query));
  } catch (e) { next(e); }
}

async function listCliente(req, res, next) {
  try {
    res_.ok(res, await svc.listCliente(req.user.id, req.query));
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const ag = await svc.getById(req.params.id, req.user.id, req.user.tipo);
    if (!ag) return res_.notFound(res, 'Agendamento');
    res_.ok(res, ag);
  } catch (e) { next(e); }
}

async function aceitar(req, res, next) {
  try {
    res_.ok(res, await svc.aceitar(req.user.id, req.params.id), 'Agendamento confirmado');
  } catch (e) { next(e); }
}

async function recusar(req, res, next) {
  try {
    res_.ok(res, await svc.recusar(req.user.id, req.params.id, req.body.motivo));
  } catch (e) { next(e); }
}

async function concluir(req, res, next) {
  try {
    res_.ok(res, await svc.concluir(req.user.id, req.params.id), 'Agendamento concluído');
  } catch (e) { next(e); }
}

async function cancelarCliente(req, res, next) {
  try {
    const result = await svc.cancelarCliente(req.user.id, req.params.id, req.body.motivo);
    res_.ok(res, result, 'Agendamento cancelado');
  } catch (e) { next(e); }
}

async function reagendar(req, res, next) {
  try {
    res_.ok(res, await svc.reagendar(req.user.id, req.params.id, req.body), 'Reagendado com sucesso');
  } catch (e) { next(e); }
}

module.exports = { getSlots, create, listEmpresa, listCliente, getById, aceitar, recusar, concluir, cancelarCliente, reagendar };
