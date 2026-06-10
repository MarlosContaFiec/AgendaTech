'use strict';
const db = require('../config/database');

/**
 * Inserts an automatic message into the mensagem table.
 *
 * @param {Object} opts
 * @param {number} opts.empresaId
 * @param {number} opts.clienteId
 * @param {string} opts.tipo       - Message type (e.g. 'outro', 'confirmacao')
 * @param {string} opts.mensagem   - Message content
 * @param {string} opts.enviadoPor - 'empresa' | 'cliente'
 */
async function sendAutoMessage({ empresaId, clienteId, tipo = 'outro', mensagem, enviadoPor = 'empresa' }) {
  await db.execute(
    `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
     VALUES (?, ?, ?, ?, TRUE, ?)`,
    [empresaId, clienteId, tipo, mensagem, enviadoPor]
  );
}

module.exports = { sendAutoMessage };
