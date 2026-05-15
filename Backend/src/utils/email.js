'use strict';
const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!env.smtp.user || !env.smtp.pass) {
    console.warn('[EMAIL] SMTP não configurado. Emails serão logados no console.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });

  return transporter;
}

async function send(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.log(`[EMAIL:DEV] Para: ${to} | Assunto: ${subject}`);
    return { sent: false, reason: 'SMTP não configurado' };
  }

  try {
    const info = await t.sendMail({
      from: env.smtp.from,
      to,
      subject,
      html,
    });
    console.log(`[EMAIL] Enviado para ${to}: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EMAIL] Falha ao enviar para ${to}:`, err.message);
    return { sent: false, reason: err.message };
  }
}

function confirmacaoTemplate(nome, servico, data, hora, empresa) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h2 style="color:#1a1a2e;">Agendamento Confirmado</h2>
      <p>Olá <strong>${nome}</strong>,</p>
      <p>Seu agendamento foi confirmado:</p>
      <table style="width:100%;border-collapse:collapse;margin:15px 0;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Serviço:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${servico}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Data:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${data}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Horário:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${hora}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Local:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${empresa}</strong></td></tr>
      </table>
      <p style="color:#666;font-size:13px;">Caso precise cancelar ou reagendar, acesse o app.</p>
    </div>
  `;
}

function lembreteTemplate(nome, servico, data, hora, empresa) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h2 style="color:#e94560;">Lembrete de Agendamento</h2>
      <p>Olá <strong>${nome}</strong>,</p>
      <p>Lembrando que você tem um agendamento amanhã:</p>
      <table style="width:100%;border-collapse:collapse;margin:15px 0;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Serviço:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${servico}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Data:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${data}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Horário:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${hora}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Local:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${empresa}</strong></td></tr>
      </table>
      <p style="color:#666;font-size:13px;">Te esperamos!</p>
    </div>
  `;
}

function cancelamentoTemplate(nome, servico, data, motivo) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h2 style="color:#d63031;">Agendamento Cancelado</h2>
      <p>Olá <strong>${nome}</strong>,</p>
      <p>Seu agendamento foi cancelado.</p>
      <table style="width:100%;border-collapse:collapse;margin:15px 0;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Serviço:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${servico}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Data:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${data}</strong></td></tr>
        ${motivo ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Motivo:</td><td style="padding:8px;border-bottom:1px solid #eee;">${motivo}</td></tr>` : ''}
      </table>
    </div>
  `;
}

function vagaAbertaTemplate(nome, servico, data, hora, empresa) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h2 style="color:#00b894;">Vaga Disponível!</h2>
      <p>Olá <strong>${nome}</strong>,</p>
      <p>Uma vaga abriu para o serviço que você estava na fila:</p>
      <table style="width:100%;border-collapse:collapse;margin:15px 0;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Serviço:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${servico}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Data:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${data}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Horário:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${hora}</strong></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;color:#666;">Local:</td><td style="padding:8px;border-bottom:1px solid #eee;"><strong>${empresa}</strong></td></tr>
      </table>
      <p style="color:#e17055;font-weight:bold;">Acesse o app agora para garantir sua vaga!</p>
    </div>
  `;
}
function verificacaoTemplate(nome, link) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
      <h2 style="color:#1a1a2e;">Confirme seu email</h2>
      <p>Olá <strong>${nome}</strong>,</p>
      <p>Seja bem-vindo ao <strong>AgendaTech</strong>!</p>
      <p>Clique no botão abaixo para confirmar seu email:</p>
      <div style="text-align:center;margin:25px 0;">
        <a href="${link}" style="background:#1a1a2e;color:#fff;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">
          Confirmar Email
        </a>
      </div>
      <p style="color:#666;font-size:13px;">Se você não criou uma conta, ignore este email.</p>
      <p style="color:#666;font-size:13px;">Este link expira em 24 horas.</p>
    </div>
  `;
}


module.exports = { send, confirmacaoTemplate, lembreteTemplate, cancelamentoTemplate, vagaAbertaTemplate, verificacaoTemplate };
