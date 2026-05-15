'use strict';
require('dotenv').config();

const env = {
  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'agendatech_bd',
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASS     || '',
  },
  jwt: {
    secret:         process.env.JWT_SECRET,
    refreshSecret:  process.env.JWT_REFRESH_SECRET,
    expiresIn:      process.env.JWT_EXPIRES_IN      || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  server: {
    port:    parseInt(process.env.PORT || '3000'),
    env:     process.env.NODE_ENV || 'development',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max:      parseInt(process.env.RATE_LIMIT_MAX       || '100'),
  },
  upload: {
    maxMb:  parseInt(process.env.UPLOAD_MAX_MB || '10'),
    path:   process.env.UPLOAD_PATH || './uploads',
  },
  jobs: {
    enabled: process.env.JOBS_ENABLED === 'true',
    notificacoesCron: process.env.JOB_NOTIFICACOES_CRON || '0 * * * *',
    pontuacaoCron: process.env.JOB_PONTUACAO_CRON || '*/15 * * * *',
    filaExpiracaoCron: process.env.JOB_FILA_EXPIRACAO_CRON || '0 */2 * * *',
    solicitacaoExpiracaoCron: process.env.JOB_SOLICITACAO_EXPIRACAO_CRON || '0 8 * * *',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_KEY || '',
    from: process.env.SMTP_FROM || 'AgendaTech <noreply@agendatech.com>',
  },
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
  },


};

module.exports = env;
