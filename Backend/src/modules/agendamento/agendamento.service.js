'use strict';
const db = require('../../config/database');
const AppError = require('../../utils/AppError');
const cal = require('../../utils/calendarEngine');
const tpl = require('../../utils/templateEngine');
const { toMinutes, fromMinutes } = require('../../utils/timeHelpers');
const { sendAutoMessage } = require('../../utils/messageHelpers');
const { parsePagination } = require('../../utils/pagination');

async function enviarNotificacaoAutomatica(empresaId, clienteId, agendamentoId, tipo) {
  try {
    const regra = await db.queryOne(
      `SELECT re.*, e.nome_fantasia FROM regra_empresa re JOIN empresa e ON e.id=re.empresa_id
       WHERE re.empresa_id=? AND re.tipo='notificacao' AND re.tipo_notificacao=? AND re.ativo=1 LIMIT 1`,
      [empresaId, tipo]
    );
    if (!regra?.mensagem_template) return;

    const ag = await db.queryOne(`SELECT * FROM agendamento WHERE id=?`, [agendamentoId]);
    const cliente = await db.queryOne(`SELECT c.nome, u.email FROM cliente c JOIN usuario u ON u.id=c.id WHERE c.id=?`, [clienteId]);
    const servico = await db.queryOne(`SELECT nome FROM servico WHERE id=?`, [ag?.servico_id]);

    const tplData = {
      nome_cliente: cliente?.nome,
      nome_empresa: regra.nome_fantasia,
      data: ag?.data_agendamento,
      hora: ag?.hora_inicio,
      servico: servico?.nome,
    };

    const msg = tpl.render(regra.mensagem_template, tplData);

    await sendAutoMessage({ empresaId, clienteId, tipo, mensagem: msg });

    await db.execute(
      `INSERT INTO notificacao_log (empresa_id, cliente_id, agendamento_id, regra_id, tipo, mensagem)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [empresaId, clienteId, agendamentoId, regra.id, tipo, msg]
    );

    if (cliente?.email) {
      const email = require('../../utils/email');
      let html;
      if (tipo === 'confirmacao') {
        html = email.confirmacaoTemplate(cliente.nome, servico?.nome, ag?.data_agendamento, ag?.hora_inicio, regra.nome_fantasia);
        await email.send(cliente.email, `Agendamento confirmado - ${regra.nome_fantasia}`, html);
      } else if (tipo === 'lembrete') {
        html = email.lembreteTemplate(cliente.nome, servico?.nome, ag?.data_agendamento, ag?.hora_inicio, regra.nome_fantasia);
        await email.send(cliente.email, `Lembrete - ${regra.nome_fantasia}`, html);
      }
    }
  } catch (err) {
    console.error('[NOTIF] Falha ao enviar notificação automática:', err.message);
  }
}

async function getSlots(empresaId, servicoId, dateRaw) {
  const date = String(dateRaw).slice(0, 10);

  const { aberto, tags, motivo_fechamento } = await cal.isDayOpen(empresaId, date);
  if (!aberto) return { disponivel: false, motivo: motivo_fechamento, slots: [] };

  const servico = await db.queryOne(
    `SELECT * FROM servico WHERE id = ? AND empresa_id = ? AND ativo = 1`,
    [servicoId, empresaId]
  );
  if (!servico) return { disponivel: false, motivo: 'Serviço não encontrado ou inativo', slots: [] };

  const tagIdsServico = await db.query(
    `SELECT tag_id FROM servico_tag WHERE servico_id = ?`, [servicoId]
  );
  if (tagIdsServico.length > 0) {
    const tagIdsAtivas = tags.map(t => t.id);
    const temTagRequerida = tagIdsServico.some(t => tagIdsAtivas.includes(t.tag_id));
    if (!temTagRequerida) return { disponivel: false, motivo: 'Serviço não disponível neste dia', slots: [] };
  }

  const d = new Date(date + 'T00:00:00');
  const diaSemana = d.getDay();
  let horarioServico = await db.queryOne(
    `SELECT hora_inicio, hora_fim FROM servico_horario
     WHERE servico_id = ? AND (dia_semana IS NULL OR dia_semana = ?) AND ativo = 1
     ORDER BY (dia_semana IS NULL) ASC, dia_semana ASC LIMIT 1`,
    [servicoId, diaSemana]
  );

  if (!horarioServico) {
    horarioServico = await db.queryOne(
      `SELECT hora_inicio, hora_fim FROM servico_horario
       WHERE servico_id = ? AND dia_semana IS NULL AND ativo = 1 LIMIT 1`,
      [servicoId]
    );
  }

  if (!horarioServico && servico.hora_inicio && servico.hora_fim) {
    horarioServico = { hora_inicio: servico.hora_inicio, hora_fim: servico.hora_fim };
  }
  if (!horarioServico) return { disponivel: false, motivo: 'Serviço sem horário configurado para este dia', slots: [] };

  const { hora_inicio: hiStr, hora_fim: hfStr } = horarioServico;
  const duracao = servico.duracao_minutos + (servico.intervalo_minutos || 0);

  const empresa = await db.queryOne(`SELECT max_agendamentos_global FROM empresa WHERE id=?`, [empresaId]);
  const maxGlobal = empresa?.max_agendamentos_global;

  const slots = [];
  let current = toMinutes(hiStr);
  const end = toMinutes(hfStr) - servico.duracao_minutos;

  while (current <= end) {
    const horaInicioSlot = fromMinutes(current);
    const horaFimSlot = fromMinutes(current + servico.duracao_minutos);

    const [{ qtd: qtdServico }] = await db.query(
      `SELECT COUNT(*) AS qtd FROM agendamento
       WHERE servico_id = ? AND data_agendamento = ? AND hora_inicio = ?
         AND status_agendamento NOT IN ('cancelado')`,
      [servicoId, date, horaInicioSlot + ':00']
    );

    const [{ qtd: qtdGlobal }] = await db.query(
      `SELECT COUNT(*) AS qtd FROM agendamento
       WHERE empresa_id = ? AND data_agendamento = ?
         AND hora_inicio <= ? AND hora_fim > ?
         AND status_agendamento NOT IN ('cancelado')`,
      [empresaId, date, horaFimSlot + ':00', horaInicioSlot + ':00']
    );

    const maxServico = servico.max_por_horario;
    const livreServico = maxServico === null || qtdServico < maxServico;
    const livreGlobal = maxGlobal === null || qtdGlobal < maxGlobal;

    slots.push({
      hora_inicio: horaInicioSlot,
      hora_fim: horaFimSlot,
      disponivel: livreServico && livreGlobal,
      vagas_restantes_servico: maxServico !== null ? Math.max(0, maxServico - qtdServico) : null,
    });

    current += duracao;
  }

  return { disponivel: true, tags, slots };
}

/**
 * Helper: Retorna agendamento com todas as informações relacionadas
 * CRÍTICO: Garante que TODOS os endpoints retornam dados consistentes
 */
async function getAgendamentoCompleto(agendamentoId) {
  return db.queryOne(
    `SELECT a.*, 
            c.nome AS cliente_nome, c.score AS cliente_score,
            s.nome AS servico_nome, s.duracao_minutos,
            e.nome_fantasia AS empresa_nome, e.id AS empresa_id
     FROM agendamento a
     JOIN cliente c ON c.id = a.cliente_id
     JOIN servico s ON s.id = a.servico_id
     JOIN empresa e ON e.id = a.empresa_id
     WHERE a.id = ?`,
    [agendamentoId]
  );
}

async function create(clienteId, data) {
  const { servico_id, empresa_id, hora_inicio, notas } = data;
  const data_agendamento = String(data.data_agendamento).slice(0, 10);

  const { disponivel, motivo, slots } = await getSlots(empresa_id, servico_id, data_agendamento);
  if (!disponivel) throw new AppError(409, motivo || 'Dia indisponível');

  const slot = slots.find(s => s.hora_inicio === hora_inicio);
  if (!slot) throw new AppError(409, 'Horário não encontrado na grade do serviço');
  if (!slot.disponivel) throw new AppError(409, 'Horário sem vagas disponíveis');

  const servico = await db.queryOne(`SELECT * FROM servico WHERE id=?`, [servico_id]);
  const horaFim = fromMinutes(toMinutes(hora_inicio) + servico.duracao_minutos);

  const conflito = await db.queryOne(
    `SELECT id FROM agendamento
     WHERE cliente_id=? AND data_agendamento=? AND status_agendamento NOT IN ('cancelado','concluido')
       AND hora_inicio < ? AND hora_fim > ?`,
    [clienteId, data_agendamento, horaFim + ':00', hora_inicio + ':00']
  );
  if (conflito) throw new AppError(409, 'Você já tem um agendamento neste horário');

  const status = servico.aceitamento_automatico ? 'confirmado' : 'pendente';

  const r = await db.execute(
    `INSERT INTO agendamento
      (cliente_id, servico_id, empresa_id, data_agendamento, hora_inicio, hora_fim,
       status_agendamento, notas, valor, criado_em)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [clienteId, servico_id, empresa_id, data_agendamento,
     hora_inicio + ':00', horaFim + ':00', status, notas || null, servico.preco_base]
  );

  if (status === 'confirmado') {
    await enviarNotificacaoAutomatica(empresa_id, clienteId, r.insertId, 'confirmacao');
  }

  return getAgendamentoCompleto(r.insertId);
}

async function listEmpresa(empresaId, filters = {}) {
  const { status, data_inicio, data_fim } = filters;
  const { limite, offset } = parsePagination(filters);
  const where = ['a.empresa_id = ?'];
  const params = [empresaId];

  if (status) { where.push('a.status_agendamento = ?'); params.push(status); }
  if (data_inicio) { where.push('a.data_agendamento >= ?'); params.push(data_inicio); }
  if (data_fim) { where.push('a.data_agendamento <= ?'); params.push(data_fim); }

  return db.queryRaw(
    `SELECT a.*, c.nome AS cliente_nome, c.score AS cliente_score,
            s.nome AS servico_nome
     FROM agendamento a
     JOIN cliente c ON c.id = a.cliente_id
     JOIN servico s ON s.id = a.servico_id
     WHERE ${where.join(' AND ')}
     ORDER BY a.data_agendamento DESC, a.hora_inicio DESC
     LIMIT ? OFFSET ?`,
    [...params, limite, offset]
  );
}

async function listCliente(clienteId, filters = {}) {
  const { status } = filters;
  const { limite, offset } = parsePagination(filters);
  const where = ['a.cliente_id = ?'];
  const params = [clienteId];

  if (status) { where.push('a.status_agendamento = ?'); params.push(status); }

  return db.queryRaw(
    `SELECT a.*, s.nome AS servico_nome, e.nome_fantasia AS empresa_nome,
            e.endereco, e.numero, e.cidade
     FROM agendamento a
     JOIN servico s ON s.id = a.servico_id
     JOIN empresa e ON e.id = a.empresa_id
     WHERE ${where.join(' AND ')}
     ORDER BY a.data_agendamento DESC, a.hora_inicio DESC
     LIMIT ? OFFSET ?`,
    [...params, limite, offset]
  );
}

async function getById(id, userId, tipo) {
  const whereExtra = tipo === 'empresa' ? 'AND a.empresa_id = ?' : 'AND a.cliente_id = ?';
  return db.queryOne(
    `SELECT a.*, c.nome AS cliente_nome, c.score AS cliente_score,
            s.nome AS servico_nome, e.nome_fantasia AS empresa_nome
     FROM agendamento a
     JOIN cliente c ON c.id = a.cliente_id
     JOIN servico s ON s.id = a.servico_id
     JOIN empresa e ON e.id = a.empresa_id
     WHERE a.id = ? ${whereExtra}`,
    [id, userId]
  );
}

async function aceitar(empresaId, id) {
  const ag = await db.queryOne(`SELECT * FROM agendamento WHERE id=? AND empresa_id=?`, [id, empresaId]);
  if (!ag) throw new AppError(404, 'Agendamento não encontrado');
  if (ag.status_agendamento !== 'pendente') throw new AppError(400, 'Agendamento não está pendente');

  await db.execute(
    `UPDATE agendamento SET status_agendamento='confirmado', aceito_em=NOW() WHERE id=?`,
    [id]
  );
  await enviarNotificacaoAutomatica(empresaId, ag.cliente_id, id, 'confirmacao');
  return getAgendamentoCompleto(id);
}

async function recusar(empresaId, id, motivo) {
  const ag = await db.queryOne(`SELECT * FROM agendamento WHERE id=? AND empresa_id=?`, [id, empresaId]);
  if (!ag) throw new AppError(404, 'Agendamento não encontrado');
  if (ag.status_agendamento !== 'pendente') throw new AppError(400, 'Agendamento não está pendente');

  await db.execute(
    `UPDATE agendamento SET status_agendamento='cancelado', cancelado_em=NOW(), motivo_cancelamento=? WHERE id=?`,
    [motivo || 'Recusado pela empresa', id]
  );

  const filaSvc = require('../fila/fila.service');
  await filaSvc.notificarProximo(empresaId, ag.servico_id, ag.data_agendamento, ag.hora_inicio);

  return getAgendamentoCompleto(id);
}


async function concluir(empresaId, id) {
  const ag = await db.queryOne(`SELECT * FROM agendamento WHERE id=? AND empresa_id=?`, [id, empresaId]);
  if (!ag) throw new AppError(404, 'Agendamento não encontrado');
  if (ag.status_agendamento !== 'confirmado') throw new AppError(400, 'Agendamento não está confirmado');

  await db.execute(`UPDATE agendamento SET status_agendamento='concluido' WHERE id=?`, [id]);

  await aplicarScore(ag.cliente_id, id, 1.0, 'Compareceu ao agendamento');
  return getAgendamentoCompleto(id);
}

async function cancelarCliente(clienteId, id, motivo) {
  const ag = await db.queryOne(
    `SELECT a.*, s.empresa_id FROM agendamento a JOIN servico s ON s.id=a.servico_id WHERE a.id=? AND a.cliente_id=?`,
    [id, clienteId]
  );
  if (!ag) throw new AppError(404, 'Agendamento não encontrado');
  if (['cancelado', 'concluido'].includes(ag.status_agendamento)) throw new AppError(400, 'Não é possível cancelar');

  const cliente = await db.queryOne(`SELECT nome FROM cliente WHERE id=?`, [clienteId]);

  const politica = await db.queryOne(
    `SELECT * FROM regra_empresa WHERE empresa_id=? AND tipo='cancelamento' AND ativo=1 LIMIT 1`,
    [ag.empresa_id]
  );

  let taxaInfo = null;
  if (politica?.limite_horas) {
    const agTime = new Date(`${ag.data_agendamento}T${ag.hora_inicio}`);
    const diffHoras = (agTime - Date.now()) / 3_600_000;

    if (diffHoras < politica.limite_horas) {
      const taxa = politica.taxa_percentual
        ? (ag.valor * politica.taxa_percentual) / 100
        : politica.taxa_fixa || 0;
      taxaInfo = { taxa, mensagem: tpl.render(politica.mensagem_template, {
        nome_cliente: cliente?.nome || '', taxa,
      })};

      await aplicarScore(clienteId, id, -0.5, 'Cancelamento tardio');
    }
  }

  await db.execute(
    `UPDATE agendamento SET status_agendamento='cancelado', cancelado_em=NOW(), motivo_cancelamento=? WHERE id=?`,
    [motivo || null, id]
  );

  const filaSvc = require('../fila/fila.service');
  await filaSvc.notificarProximo(ag.empresa_id, ag.servico_id, ag.data_agendamento, ag.hora_inicio);

  return { agendamento: await getAgendamentoCompleto(id), taxaInfo };
}


async function reagendar(clienteId, id, data) {
  const ag = await db.queryOne(
    `SELECT a.*, s.empresa_id, s.duracao_minutos, s.aceitamento_automatico
     FROM agendamento a JOIN servico s ON s.id=a.servico_id
     WHERE a.id=? AND a.cliente_id=?`,
    [id, clienteId]
  );
  if (!ag) throw new AppError(404, 'Agendamento não encontrado');
  if (!['confirmado', 'pendente'].includes(ag.status_agendamento)) throw new AppError(400, 'Não é possível reagendar este agendamento');

  const politica = await db.queryOne(
    `SELECT * FROM regra_empresa WHERE empresa_id=? AND tipo='reagendamento' AND ativo=1 LIMIT 1`,
    [ag.empresa_id]
  );
  if (politica?.limite_horas) {
    const agTime = new Date(`${ag.data_agendamento}T${ag.hora_inicio}`);
    const diffHoras = (agTime - Date.now()) / 3_600_000;
    if (diffHoras < politica.limite_horas) {
      throw new AppError(409, `Reagendamento não permitido com menos de ${politica.limite_horas}h de antecedência`);
    }
  }

  const reagData = String(data.data_agendamento).slice(0, 10);
  const { disponivel, motivo, slots } = await getSlots(ag.empresa_id, ag.servico_id, reagData);
  if (!disponivel) throw new AppError(409, motivo || 'Data indisponível');
  const slot = slots.find(s => s.hora_inicio === data.hora_inicio);
  if (!slot?.disponivel) throw new AppError(409, 'Horário sem vagas');

  const horaFim = fromMinutes(toMinutes(data.hora_inicio) + ag.duracao_minutos);

  const conflito = await db.queryOne(
    `SELECT id FROM agendamento
     WHERE cliente_id=? AND data_agendamento=? AND status_agendamento NOT IN ('cancelado','concluido')
       AND hora_inicio < ? AND hora_fim > ? AND id != ?`,
    [clienteId, reagData, horaFim + ':00', data.hora_inicio + ':00', id]
  );
  if (conflito) throw new AppError(409, 'Você já tem um agendamento neste horário');

  const novoStatus = ag.aceitamento_automatico ? 'confirmado' : 'pendente';

  const r = await db.execute(
    `INSERT INTO agendamento
      (cliente_id, servico_id, empresa_id, data_agendamento, hora_inicio, hora_fim,
       status_agendamento, notas, valor, criado_em, reagendado_de)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
    [clienteId, ag.servico_id, ag.empresa_id, reagData,
     data.hora_inicio + ':00', horaFim + ':00', novoStatus, ag.notas, ag.valor, id]
  );

  await db.execute(
    `UPDATE agendamento SET status_agendamento='cancelado', cancelado_em=NOW(), motivo_cancelamento='Reagendado' WHERE id=?`,
    [id]
  );

  if (novoStatus === 'confirmado') {
    await enviarNotificacaoAutomatica(ag.empresa_id, clienteId, r.insertId, 'confirmacao');
  }

  return getAgendamentoCompleto(r.insertId);
}

async function aplicarScore(clienteId, agendamentoId, variacao, motivo) {
  const cliente = await db.queryOne(`SELECT score FROM cliente WHERE id=?`, [clienteId]);
  if (!cliente) return;

  const novoScore = Math.min(100, Math.max(0, parseFloat(cliente.score) + variacao));
  await db.execute(`UPDATE cliente SET score=? WHERE id=?`, [novoScore, clienteId]);
  await db.execute(
    `INSERT INTO pontuacao_log (cliente_id, agendamento_id, variacao, score_resultante, motivo)
     VALUES (?, ?, ?, ?, ?)`,
    [clienteId, agendamentoId, variacao, novoScore, motivo]
  );
}

module.exports = { getSlots, create, listEmpresa, listCliente, getById, aceitar, recusar, concluir, cancelarCliente, reagendar, aplicarScore };