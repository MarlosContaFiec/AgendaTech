'use strict';
const db = require('../config/database');
const tpl = require('../utils/templateEngine');

async function runPontuacao() {
  console.log('[JOB:SCORE] Verificando não comparecimentos...');

  try {
    const atrasados = await db.query(
      `SELECT a.*, c.score AS score_atual, c.nome AS cliente_nome,
              e.nome_fantasia, s.nome AS servico_nome
       FROM agendamento a
       JOIN cliente c ON c.id = a.cliente_id
       JOIN empresa e ON e.id = a.empresa_id
       JOIN servico s ON s.id = a.servico_id
       WHERE a.status_agendamento = 'confirmado'
         AND TIMESTAMP(a.data_agendamento, a.hora_fim) < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
         AND NOT EXISTS (
           SELECT 1 FROM pontuacao_log pl
           WHERE pl.agendamento_id = a.id AND pl.motivo LIKE '%não compareceu%'
         )`
    );

    let atualizados = 0;

    for (const ag of atrasados) {
      const conn = await db.beginTransaction();
      try {
        await conn.execute(
          `UPDATE agendamento SET status_agendamento='cancelado',
            cancelado_em=NOW(), motivo_cancelamento='Não compareceu'
           WHERE id=?`,
          [ag.id]
        );

        const novoScore = Math.max(0, parseFloat(ag.score_atual) - 1);
        await conn.execute(`UPDATE cliente SET score=? WHERE id=?`, [novoScore, ag.cliente_id]);
        await conn.execute(
          `INSERT INTO pontuacao_log (cliente_id, agendamento_id, variacao, score_resultante, motivo)
           VALUES (?, ?, -1.00, ?, 'Não compareceu sem aviso')`,
          [ag.cliente_id, ag.id, novoScore]
        );

        let mensagem;
        const regra = await db.queryOne(
          `SELECT mensagem_template FROM regra_empresa
           WHERE empresa_id=? AND tipo='notificacao' AND tipo_notificacao='cancelamento' AND ativo=1 LIMIT 1`,
          [ag.empresa_id]
        );
        if (regra?.mensagem_template) {
          mensagem = tpl.render(regra.mensagem_template, {
            nome_cliente: ag.cliente_nome,
            nome_empresa: ag.nome_fantasia,
            data: ag.data_agendamento,
            hora: ag.hora_inicio,
            servico: ag.servico_nome,
          });
        } else {
          mensagem = `Olá ${ag.cliente_nome || ''}! Identificamos que você não compareceu ao seu agendamento em ${ag.data_agendamento}. Isso impactou sua pontuação de confiabilidade (-1 ponto).`;
        }

        await conn.execute(
          `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
           VALUES (?, ?, 'cancelamento', ?, TRUE, 'empresa')`,
          [ag.empresa_id, ag.cliente_id, mensagem]
        );

        await conn.commit();
        conn.release();

        atualizados++;
        console.log(`[JOB:SCORE] Penalidade aplicada: cliente#${ag.cliente_id} ag#${ag.id} | score: ${ag.score_atual} → ${novoScore}`);
      } catch (err) {
        await conn.rollback();
        conn.release();
        console.error(`[JOB:SCORE] Erro no agendamento#${ag.id}:`, err.message);
      }
    }

    console.log(`[JOB:SCORE] Concluído. ${atualizados} cliente(s) penalizado(s).`);
  } catch (err) {
    console.error('[JOB:SCORE] Erro:', err.message);
  }
}

module.exports = { runPontuacao };
