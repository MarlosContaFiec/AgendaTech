'use strict';
const db  = require('../config/database');
const tpl = require('../utils/templateEngine');

/**
 * Job executado de hora em hora.
 * Para cada regra de notificação com antecedencia_horas definida,
 * busca agendamentos confirmados que batem a janela de tempo e envia notificação
 * caso ainda não tenha sido enviada.
 */
async function runNotificacoes() {
  console.log('[JOB:NOTIF] Iniciando varredura de notificações...');

  try {
    
    const regras = await db.query(
      `SELECT re.*, e.nome_fantasia
       FROM regra_empresa re
       JOIN empresa e ON e.id = re.empresa_id
       WHERE re.tipo = 'notificacao'
         AND re.antecedencia_horas IS NOT NULL
         AND re.mensagem_template IS NOT NULL
         AND re.ativo = 1`
    );

    let enviados = 0;

    for (const regra of regras) {
      
      const agendamentos = await db.query(
        `SELECT a.*, c.nome AS cliente_nome, u.email AS cliente_email,
                s.nome AS servico_nome, e.nome_fantasia,
                e.endereco, e.numero, e.cidade
         FROM agendamento a
         JOIN cliente c ON c.id = a.cliente_id
         JOIN usuario u ON u.id = c.id
         JOIN servico s ON s.id = a.servico_id
         JOIN empresa e ON e.id = a.empresa_id
         WHERE a.empresa_id = ?
           AND a.status_agendamento = 'confirmado'
           AND TIMESTAMP(a.data_agendamento, a.hora_inicio)
               BETWEEN DATE_ADD(NOW(), INTERVAL ? HOUR) - INTERVAL 30 MINUTE
                   AND DATE_ADD(NOW(), INTERVAL ? HOUR) + INTERVAL 30 MINUTE`,
        [regra.empresa_id, regra.antecedencia_horas, regra.antecedencia_horas]
      );

      for (const ag of agendamentos) {
        
        const jaSent = await db.queryOne(
          `SELECT id FROM notificacao_log
           WHERE agendamento_id=? AND regra_id=? AND sucesso=1`,
          [ag.id, regra.id]
        );
        if (jaSent) continue;

        const mensagem = tpl.render(regra.mensagem_template, {
          nome_cliente: ag.cliente_nome,
          nome_empresa: ag.nome_fantasia,
          data:         ag.data_agendamento,
          hora:         ag.hora_inicio,
          servico:      ag.servico_nome,
          endereco:     [ag.endereco, ag.numero, ag.cidade].filter(Boolean).join(', '),
        });

        
        await db.execute(
          `INSERT INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, enviado_por)
           VALUES (?, ?, ?, ?, TRUE, 'empresa')`,
          [regra.empresa_id, ag.cliente_id, regra.tipo_notificacao || 'lembrete', mensagem]
        );

        
        await db.execute(
          `INSERT INTO notificacao_log (empresa_id, cliente_id, agendamento_id, regra_id, tipo, mensagem, sucesso)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [regra.empresa_id, ag.cliente_id, ag.id, regra.id, regra.tipo_notificacao || 'lembrete', mensagem]
        );

        enviados++;
        console.log(`[JOB:NOTIF] Enviado para cliente ${ag.cliente_nome} | ag#${ag.id}`);
      }
    }

    console.log(`[JOB:NOTIF] Concluído. ${enviados} notificação(ões) enviada(s).`);
  } catch (err) {
    console.error('[JOB:NOTIF] Erro:', err.message);
  }
}

module.exports = { runNotificacoes };
