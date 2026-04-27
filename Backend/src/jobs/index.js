'use strict';
const cron = require('node-cron');
const env  = require('../config/env');
const { runNotificacoes } = require('./notificacoes');
const { runPontuacao }    = require('./pontuacao');

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

  console.log(`[JOBS] ✅ notificacoes → "${env.jobs.notificacoesCron}"`);
  console.log(`[JOBS] ✅ pontuacao   → "${env.jobs.pontuacaoCron}"`);
}

module.exports = { startJobs };
