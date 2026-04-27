'use strict';
const db = require('../config/database');

/**
 * Job executado a cada 15 minutos.
 * Verifica agendamentos confirmados que já passaram do horário
 * e não foram marcados como concluídos. Aplica penalidade de não comparecimento.
 * Janela: agendamento que terminou há mais de 30min e está ainda 'confirmado'.
 */
async function runPontuacao() {
  console.log('[JOB:SCORE] Verificando não comparecimentos...');

  try {
    const atrasados = await db.query(
      `SELECT a.*, c.score AS score_atual
       FROM agendamento a
       JOIN cliente c ON c.id = a.cliente_id
       WHERE a.status_agendamento = 'confirmado'
         AND TIMESTAMP(a.data_agendamento, a.hora_fim) < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
         AND NOT EXISTS (
           SELECT 1 FROM pontuacao_log pl
           WHERE pl.agendamento_id = a.id AND pl.motivo LIKE '%não compareceu%'
         )`
    );

    let atualizados = 0;

    for (const ag of atrasados) {
      
      await db.execute(
        `UPDATE agendamento SET status_agendamento='cancelado',
          cancelado_em=NOW(), motivo_cancelamento='Não compareceu'
         WHERE id=?`,
        [ag.id]
      );

      
      const novoScore = Math.max(0, parseFloat(ag.score_atual) - 1);
      await db.execute(`UPDATE cliente SET score=? WHERE id=?`, [novoScore, ag.cliente_id]);
      await db.execute(
        `INSERT INTO pontuacao_log (cliente_id, agendamento_id, variacao, score_resultante, motivo)
         VALUES (?, ?, -1.00, ?, 'Não compareceu sem aviso')`,
        [ag.cliente_id, ag.id, novoScore]
      );

      
      const cliente = await db.queryOne(`SELECT nome FROM cliente WHERE id=?`, [ag.cliente_id]);
      await db.execute(
        `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
         VALUES (?, ?, 'cancelamento', ?, TRUE, 'empresa')`,
        [ag.empresa_id, ag.cliente_id,
         `Olá ${cliente?.nome || ''}! Identificamos que você não compareceu ao seu agendamento em ${ag.data_agendamento}. Isso impactou sua pontuação de confiabilidade (-1 ponto).`]
      );

      atualizados++;
      console.log(`[JOB:SCORE] Penalidade aplicada: cliente#${ag.cliente_id} ag#${ag.id} | score: ${ag.score_atual} → ${novoScore}`);
    }

    console.log(`[JOB:SCORE] Concluído. ${atualizados} cliente(s) penalizado(s).`);
  } catch (err) {
    console.error('[JOB:SCORE] Erro:', err.message);
  }
}

module.exports = { runPontuacao };
