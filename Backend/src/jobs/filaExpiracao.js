'use strict';
const db = require('../config/database');

async function runFilaExpiracao() {
  console.log('[JOB:FILA] Verificando notificações de fila expiradas...');

  try {
    const expirados = await db.query(
      `SELECT f.*, c.nome AS cliente_nome, s.nome AS servico_nome
       FROM fila_espera f
       JOIN cliente c ON c.id = f.cliente_id
       JOIN servico s ON s.id = f.servico_id
       WHERE f.status = 'notificado'
         AND f.criado_em < DATE_SUB(NOW(), INTERVAL 4 HOUR)`
    );

    let processados = 0;

    for (const fila of expirados) {
      await db.execute(
        `UPDATE fila_espera SET status = 'cancelado' WHERE id = ?`,
        [fila.id]
      );

      const filaSvc = require('../modules/fila/fila.service');
      await filaSvc.notificarProximo(fila.empresa_id, fila.servico_id, fila.data_agendamento, fila.hora_inicio);

      processados++;
      console.log(`[JOB:FILA] Expirado: fila#${fila.id} cliente#${fila.cliente_id} | ${fila.servico_nome}`);
    }

    console.log(`[JOB:FILA] Concluído. ${processados} notificação(ões) expirada(s).`);
  } catch (err) {
    console.error('[JOB:FILA] Erro:', err.message);
  }
}

module.exports = { runFilaExpiracao };
