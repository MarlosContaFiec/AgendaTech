'use strict';
const svc  = require('./auth.service');
const res_ = require('../../utils/response');

async function registerCliente(req, res, next) {
  try {
    const result = await svc.registerCliente(req.body);
    res_.created(res, result, 'Cliente cadastrado com sucesso');
  } catch (err) { next(err); }
}

async function registerEmpresa(req, res, next) {
  try {
    const result = await svc.registerEmpresa(req.body);
    res_.created(res, result, 'Empresa cadastrada com sucesso');
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const result = await svc.login(req.body.email, req.body.senha);
    res_.ok(res, result, 'Login realizado com sucesso');
  } catch (err) { next(err); }
}

async function refresh(req, res, next) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res_.badRequest(res, 'refresh_token obrigatório');
    const result = await svc.refresh(refresh_token);
    res_.ok(res, result, 'Tokens renovados');
  } catch (err) { next(err); }
}

async function me(req, res, next) {
  try {
    const data = await svc.me(req.user.id, req.user.tipo);
    res_.ok(res, data);
  } catch (err) { next(err); }
}

module.exports = { registerCliente, registerEmpresa, login, refresh, me };
