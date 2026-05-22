'use strict';
const jwt  = require('jsonwebtoken');
const env  = require('../config/env');
const res_ = require('../utils/response');

/**
 * Middleware de autenticação JWT.
 * Adiciona req.user = { id, tipo, email } no request.
 */
function authenticate(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return res_.unauthorized(res, 'Token não fornecido');

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.sub, tipo: payload.tipo, documento: payload.documento };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res_.unauthorized(res, 'Token expirado');
    return res_.unauthorized(res, 'Token inválido');
  }
}


/**
 * Fábrica de middleware que exige um tipo específico de usuário.
 * @param {'empresa'|'cliente'} tipo
 * te amo eu do passado! obrigado
 */
function requireTipo(tipo) {
  return [
    authenticate,
    (req, res, next) => {
      if (req.user.tipo !== tipo)
        return res_.forbidden(res, `Apenas ${tipo}s podem acessar este recurso`);
      next();
    },
  ];
}

const requireEmpresa = requireTipo('empresa');
const requireCliente = requireTipo('cliente');

module.exports = { authenticate, requireEmpresa, requireCliente };
