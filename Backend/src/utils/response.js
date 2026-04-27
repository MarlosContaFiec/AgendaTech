'use strict';

/** Resposta de sucesso padronizada */
const ok = (res, data = null, message = 'OK', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });

/** Resposta de criação padronizada */
const created = (res, data, message = 'Criado com sucesso') =>
  ok(res, data, message, 201);

/** Resposta de erro padronizada */
const error = (res, message = 'Erro interno', statusCode = 500, errors = null) =>
  res.status(statusCode).json({ success: false, message, errors });

/** Não encontrado */
const notFound = (res, entity = 'Recurso') =>
  error(res, `${entity} não encontrado(a)`, 404);

/** Não autorizado */
const unauthorized = (res, message = 'Não autorizado') =>
  error(res, message, 401);

/** Proibido */
const forbidden = (res, message = 'Acesso negado') =>
  error(res, message, 403);

/** Validação inválida */
const badRequest = (res, message, errors = null) =>
  error(res, message, 400, errors);

module.exports = { ok, created, error, notFound, unauthorized, forbidden, badRequest };
