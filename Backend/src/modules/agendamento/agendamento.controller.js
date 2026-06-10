'use strict';
const svc  = require('./agendamento.service');
const res_ = require('../../utils/response');
const wrap = require('../../utils/wrapAsync');

const getSlots = wrap(async (req, res) => {
  const { empresa_id, servico_id, data } = req.query;
  if (!empresa_id || !servico_id || !data)
    return res_.badRequest(res, 'Informe empresa_id, servico_id e data');
  res_.ok(res, await svc.getSlots(empresa_id, servico_id, data));
});

const create = wrap(async (req, res) => {
  res_.created(res, await svc.create(req.user.id, req.body), 'Agendamento criado');
});

const listEmpresa = wrap(async (req, res) => {
  res_.ok(res, await svc.listEmpresa(req.user.id, req.query));
});

const listCliente = wrap(async (req, res) => {
  res_.ok(res, await svc.listCliente(req.user.id, req.query));
});

const getById = wrap(async (req, res) => {
  const ag = await svc.getById(req.params.id, req.user.id, req.user.tipo);
  if (!ag) return res_.notFound(res, 'Agendamento');
  res_.ok(res, ag);
});

const aceitar = wrap(async (req, res) => {
  res_.ok(res, await svc.aceitar(req.user.id, req.params.id), 'Agendamento confirmado');
});

const recusar = wrap(async (req, res) => {
  res_.ok(res, await svc.recusar(req.user.id, req.params.id, req.body.motivo));
});

const concluir = wrap(async (req, res) => {
  res_.ok(res, await svc.concluir(req.user.id, req.params.id), 'Agendamento concluído');
});

const cancelarCliente = wrap(async (req, res) => {
  const result = await svc.cancelarCliente(req.user.id, req.params.id, req.body.motivo);
  res_.ok(res, result, 'Agendamento cancelado');
});

const reagendar = wrap(async (req, res) => {
  res_.ok(res, await svc.reagendar(req.user.id, req.params.id, req.body), 'Reagendado com sucesso');
});

module.exports = { getSlots, create, listEmpresa, listCliente, getById, aceitar, recusar, concluir, cancelarCliente, reagendar };
