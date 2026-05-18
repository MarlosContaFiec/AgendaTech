'use strict';
const db = require('../config/database');

async function runSolicitacaoExpiracao() {
  console.log('[JOB:SOL] Verificando solicitações de horário estendido expiradas...');

  try {
    const expirados = await db.query(
      `SELECT sh.*, a.cliente_id, a.empresa_id, s.nome AS servico_nome,
              a.data_agendamento
       FROM solicitacao_horario sh
       JOIN agendamento a ON a.id = sh.agendamento_id
       JOIN servico s ON s.id = a.servico_id
       WHERE sh.status = 'pendente'
         AND sh.criado_em < DATE_SUB(NOW(), INTERVAL 48 HOUR)`
    );

    let processados = 0;

    for (const sol of expirados) {
      await db.execute(
        `UPDATE solicitacao_horario SET status = 'negado', resposta_empresa = ?, respondido_em = NOW() WHERE id = ?`,
        ['Expirado por falta de resposta', sol.id]
      );

      await db.execute(
        `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
         VALUES (?, ?, 'outro', ?, TRUE, 'empresa')`,
        [sol.empresa_id, sol.cliente_id,
         `Sua solicitação de +${sol.minutos_extra} minutos para ${sol.servico_nome} em ${sol.data_agendamento} foi cancelada por falta de resposta da empresa.`]
      );

      processados++;
      console.log(`[JOB:SOL] Expirado: sol#${sol.id} ag#${sol.agendamento_id}`);
    }

    console.log(`[JOB:SOL] Concluído. ${processados} solicitação(ões) expirada(s).`);
  } catch (err) {
    console.error('[JOB:SOL] Erro:', err.message);
  }
}

module.exports = { runSolicitacaoExpiracao };
