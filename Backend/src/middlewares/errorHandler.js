'use strict';
const res_ = require('../utils/response');


function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  
  if (err.code === 'ER_DUP_ENTRY') {
    const field = err.message.match(/for key '(.+?)'/)?.[1] || 'campo';
    return res_.badRequest(res, `Valor duplicado no campo: ${field}`);
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res_.badRequest(res, 'Referência inválida: registro relacionado não encontrado');
  }
  if (err.code === 'ER_DATA_TOO_LONG') {
    return res_.badRequest(res, 'Dado muito longo para o campo');
  }

  
  if (err.statusCode) {
    return res_.error(res, err.message, err.statusCode);
  }

  return res_.error(res, 'Erro interno do servidor');
}

module.exports = errorHandler;
