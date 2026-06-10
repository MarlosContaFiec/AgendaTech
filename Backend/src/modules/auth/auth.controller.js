'use strict';
const svc  = require('./auth.service');
const res_ = require('../../utils/response');
const wrap = require('../../utils/wrapAsync');

const registerCliente = wrap(async (req, res) => {
  res_.created(res, await svc.registerCliente(req.body), 'Cliente cadastrado com sucesso');
});

const registerEmpresa = wrap(async (req, res) => {
  res_.created(res, await svc.registerEmpresa(req.body), 'Empresa cadastrada com sucesso');
});

const login = wrap(async (req, res) => {
  res_.ok(res, await svc.login(req.body.documento, req.body.senha), 'Login realizado com sucesso');
});

const refresh = wrap(async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) return res_.badRequest(res, 'refresh_token obrigatório');
  res_.ok(res, await svc.refresh(refresh_token), 'Tokens renovados');
});

const me = wrap(async (req, res) => {
  res_.ok(res, await svc.me(req.user.id, req.user.tipo));
});

const verificarEmail = wrap(async (req, res) => {
  const result = await svc.verificarEmail(req.params.token);
  res_.ok(res, result, result.message);
});

const reenviarVerificacao = wrap(async (req, res) => {
  const result = await svc.reenviarVerificacao(req.body.email);
  res_.ok(res, result, result.message);
});

module.exports = { registerCliente, registerEmpresa, login, refresh, me, verificarEmail, reenviarVerificacao };
