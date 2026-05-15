'use strict';
const cron = require('node-cron');
const env = require('../config/env');
const { runNotificacoes } = require('./notificacoes');
const { runPontuacao } = require('./pontuacao');
const { runFilaExpiracao } = require('./filaExpiracao');
const { runSolicitacaoExpiracao } = require('./solicitacaoExpiracao');

function startJobs() {
  if (!env.jobs.enabled) {
    console.log('[JOBS] Jobs desabilitados (JOBS_ENABLED=false)');
    return;
  }

  console.log('[JOBS] Registrando jobs agendados...');

  cron.schedule(env.jobs.notificacoesCron, async () => {
    await runNotificacoes();
  }, { timezone: 'America/Sao_Paulo' });

  cron.schedule(env.jobs.pontuacaoCron, async () => {
    await runPontuacao();
  }, { timezone: 'America/Sao_Paulo' });

  cron.schedule('0 */2 * * *', async () => {
    await runFilaExpiracao();
  }, { timezone: 'America/Sao_Paulo' });

  cron.schedule('0 8 * * *', async () => {
    await runSolicitacaoExpiracao();
  }, { timezone: 'America/Sao_Paulo' });

  cron.schedule(env.jobs.filaExpiracaoCron, async () => {
  await runFilaExpiracao();
}, { timezone: 'America/Sao_Paulo' });

cron.schedule(env.jobs.solicitacaoExpiracaoCron, async () => {
  await runSolicitacaoExpiracao();
}, { timezone: 'America/Sao_Paulo' });

  console.log(`[JOBS] notificacoes → "${env.jobs.notificacoesCron}"`);
  console.log(`[JOBS] pontuacao → "${env.jobs.pontuacaoCron}"`);
  console.log(`[JOBS] fila_expiracao → "${env.jobs.filaExpiracaoCron}"`);
  console.log(`[JOBS] solicitacao_expiracao → "${env.jobs.solicitacaoExpiracaoCron}"`);
}

module.exports = { startJobs };
