-- ============================================================
-- MIGRAÇÃO 003 — Dados de seed para testes
-- ============================================================

-- ─── Usuários ────────────────────────────────────────────────

-- Empresa 1 (senha: Empresa@123)
INSERT IGNORE INTO usuario (id, tipo, email, senha_hash, ativo)
VALUES (1, 'empresa', 'barbearia@teste.com',
  '$2a$10$x7by5JPeZy516ZOhvuH5d.xOpdhQ.I4LosCk1c8ASo0G/i5cF/4uO', TRUE);

-- Empresa 2 (senha: Empresa@123)
INSERT IGNORE INTO usuario (id, tipo, email, senha_hash, ativo)
VALUES (2, 'empresa', 'studio@teste.com',
  '$2a$10$x7by5JPeZy516ZOhvuH5d.xOpdhQ.I4LosCk1c8ASo0G/i5cF/4uO', TRUE);

-- Cliente 1 (senha: Cliente@123)
INSERT IGNORE INTO usuario (id, tipo, email, senha_hash, ativo)
VALUES (3, 'cliente', 'joao@teste.com',
  '$2a$10$x7by5JPeZy516ZOhvuH5d.xOpdhQ.I4LosCk1c8ASo0G/i5cF/4uO', TRUE);

-- Cliente 2 (senha: Cliente@123)
INSERT IGNORE INTO usuario (id, tipo, email, senha_hash, ativo)
VALUES (4, 'cliente', 'maria@teste.com',
  '$2a$10$x7by5JPeZy516ZOhvuH5d.xOpdhQ.I4LosCk1c8ASo0G/i5cF/4uO', TRUE);

-- Cliente 3 (senha: Cliente@123)
INSERT IGNORE INTO usuario (id, tipo, email, senha_hash, ativo)
VALUES (5, 'cliente', 'pedro@teste.com',
  '$2a$10$x7by5JPeZy516ZOhvuH5d.xOpdhQ.I4LosCk1c8ASo0G/i5cF/4uO', TRUE);

-- Cliente inativo (senha: Cliente@123)
INSERT IGNORE INTO usuario (id, tipo, email, senha_hash, ativo)
VALUES (6, 'cliente', 'ana@teste.com',
  '$2a$10$x7by5JPeZy516ZOhvuH5d.xOpdhQ.I4LosCk1c8ASo0G/i5cF/4uO', FALSE);

-- ─── Empresas ────────────────────────────────────────────────

INSERT IGNORE INTO empresa (id, cnpj, razao_social, nome_fantasia, telefone, cep,
    endereco, numero, bairro, cidade, estado, nicho, sub_nicho, verificada, max_agendamentos_global)
VALUES (1, '12.345.678/0001-90', 'Barbearia Estilo LTDA', 'Barbearia Estilo',
    '(19) 99999-0001', '13330-000',
    'Rua das Flores', '100', 'Centro', 'Indaiatuba', 'SP', 'beleza', 'barbearia', TRUE, 4);

INSERT IGNORE INTO empresa (id, cnpj, razao_social, nome_fantasia, telefone, cep,
    endereco, numero, bairro, cidade, estado, nicho, sub_nicho, verificada, max_agendamentos_global)
VALUES (2, '98.765.432/0001-10', 'Studio Beauty LTDA', 'Studio Beauty',
    '(19) 97777-0002', '13330-200',
    'Avenida Brasil', '500', 'Jardim Europa', 'Indaiatuba', 'SP', 'beleza', 'salao', TRUE, 6);

-- ─── Profiles ────────────────────────────────────────────────

INSERT IGNORE INTO empresaProfile (empresa_id, descricao, cor_primaria, cor_secundaria, ativo)
VALUES (1, 'A melhor barbearia de Indaiatuba. Cortes modernos e clássicos.', '#1a1a2e', '#e94560', TRUE);

INSERT IGNORE INTO empresaProfile (empresa_id, descricao, cor_primaria, cor_secundaria, ativo)
VALUES (2, 'Studio de beleza completo com profissionais especializados.', '#2d3436', '#6c5ce7', TRUE);

-- ─── Clientes ────────────────────────────────────────────────

INSERT IGNORE INTO cliente (id, nome, cpf, verificado, data_nascimento, telefone, score)
VALUES (3, 'João Silva', '529.982.247-25', TRUE, '1995-03-15', '(19) 98888-0001', 100.00);

INSERT IGNORE INTO cliente (id, nome, cpf, verificado, data_nascimento, telefone, score)
VALUES (4, 'Maria Santos', '383.551.768-58', TRUE, '1990-07-22', '(19) 98888-0002', 95.50);

INSERT IGNORE INTO cliente (id, nome, cpf, verificado, data_nascimento, telefone, score)
VALUES (5, 'Pedro Oliveira', '149.324.347-66', FALSE, '1988-11-03', '(19) 98888-0003', 88.00);

INSERT IGNORE INTO cliente (id, nome, cpf, verificado, data_nascimento, telefone, score)
VALUES (6, 'Ana Costa', '765.726.370-94', TRUE, '1992-01-10', '(19) 98888-0004', 100.00);

-- ─── Serviços ────────────────────────────────────────────────

INSERT IGNORE INTO servico (id, empresa_id, nome, descricao, duracao_minutos, preco_base,
    ativo, aceitamento_automatico, max_por_horario, hora_inicio, hora_fim)
VALUES
  (1, 1, 'Corte Simples', 'Corte tradicional com máquina e tesoura', 30, 35.00, TRUE, TRUE, 2, '09:00:00', '19:00:00'),
  (2, 1, 'Corte com Desenho', 'Corte com arte e design personalizado', 45, 55.00, TRUE, FALSE, 2, '09:00:00', '17:00:00'),
  (3, 1, 'Barba Completa', 'Modelagem e hidratação da barba', 30, 40.00, TRUE, TRUE, NULL, '09:00:00', '19:00:00'),
  (4, 2, 'Corte Feminino', 'Corte e finalização feminina', 60, 80.00, TRUE, TRUE, 3, '09:00:00', '18:00:00'),
  (5, 2, 'Manicure', 'Alongamento e decoração de unhas', 45, 45.00, TRUE, TRUE, 4, '09:00:00', '18:00:00');

-- ─── Horários dos serviços ───────────────────────────────────

INSERT IGNORE INTO servico_horario (servico_id, dia_semana, hora_inicio, hora_fim)
VALUES
  (1, NULL, '09:00:00', '19:00:00'),
  (2, 2, '09:00:00', '17:00:00'),
  (2, 4, '09:00:00', '17:00:00'),
  (3, NULL, '09:00:00', '19:00:00'),
  (4, NULL, '09:00:00', '18:00:00'),
  (5, NULL, '09:00:00', '18:00:00');

-- ─── Tags ────────────────────────────────────────────────────

INSERT IGNORE INTO tags (id, empresa_id, nome, label, cor, aceita_agendamento, info)
VALUES
  (1, 1, 'fechado', 'Fechado', '#ff0000', 0, 'Estabelecimento fechado neste dia'),
  (2, 1, 'domingo', 'Domingo', '#ff6b6b', 0, 'Fechado aos domingos'),
  (3, 1, 'pascoa', 'Páscoa', '#ffd700', 1, 'Aberto na Páscoa com horário especial'),
  (4, 1, 'desconto15', '15% OFF', '#00b894', 1, 'Desconto especial de 15% em todos os serviços'),
  (5, 2, 'domingo2', 'Domingo', '#ff6b6b', 0, 'Fechado aos domingos');

-- ─── Regras de calendário ────────────────────────────────────

INSERT IGNORE INTO regras (empresa_id, tag_id, tipo, dia_semana, prioridade)
VALUES
  (1, 2, 'padrao', 0, 5),
  (1, 3, 'unico', NULL, 10),
  (2, 5, 'padrao', 0, 5);

-- ─── Regras de negócio ───────────────────────────────────────

INSERT IGNORE INTO regra_empresa (empresa_id, tipo, nome, antecedencia_horas, mensagem_template, tipo_notificacao)
VALUES (1, 'notificacao', 'Lembrete 12h antes', 12,
  'Olá {nome_cliente}! Lembrando que você tem um agendamento amanhã às {hora} para {servico} na {nome_empresa}. Até lá!',
  'lembrete');

INSERT IGNORE INTO regra_empresa (empresa_id, tipo, nome, antecedencia_horas, mensagem_template, tipo_notificacao)
VALUES (1, 'notificacao', 'Confirmação automática', NULL,
  '{nome_cliente}, seu agendamento de {servico} na {nome_empresa} foi confirmado para {data} às {hora}.',
  'confirmacao');

INSERT IGNORE INTO regra_empresa (empresa_id, tipo, nome, limite_horas, taxa_percentual, mensagem_template, tipo_notificacao)
VALUES (1, 'cancelamento', 'Taxa cancelamento tardio', 24, 30.00,
  'Cancelamento realizado com menos de 24h de antecedência. Taxa de 30% (R$ {taxa}) será aplicada.',
  'cancelamento');

INSERT IGNORE INTO regra_empresa (empresa_id, tipo, nome, limite_horas)
VALUES (1, 'reagendamento', 'Limite reagendamento 48h', 48);

INSERT IGNORE INTO regra_empresa (empresa_id, tipo, nome, antecedencia_horas, mensagem_template, tipo_notificacao)
VALUES (2, 'notificacao', 'Lembrete 24h antes', 24,
  'Oi {nome_cliente}! Só lembrando do seu horário amanhã às {hora} no {nome_empresa}. Te esperamos!',
  'lembrete');

-- ─── Chat ────────────────────────────────────────────────────

INSERT IGNORE INTO chat_config (empresa_id, mensagem_abertura)
VALUES (1, 'Olá! Bem-vindo à Barbearia Estilo. Como posso ajudar você hoje?');

INSERT IGNORE INTO chat_config (empresa_id, mensagem_abertura)
VALUES (2, 'Olá! Bem-vinda ao Studio Beauty. Como posso ajudar?');

INSERT IGNORE INTO chat_faq (empresa_id, pergunta, resposta, ordem)
VALUES
  (1, 'Qual o horário de funcionamento?', 'Funcionamos de segunda a sábado, das 9h às 19h.', 1),
  (1, 'Aceita walk-in?', 'Sim, mas agendamento tem prioridade!', 2),
  (1, 'Qual a forma de pagamento?', 'Aceitamos PIX, cartão de crédito/débito e dinheiro.', 3),
  (2, 'Vocês fazem sobrancelha?', 'Sim! Temos profissional especializada em design de sobrancelha.', 1),
  (2, 'Precisa agendar?', 'Recomendamos agendar para garantir seu horário, mas aceitamos walk-in.', 2);

-- ─── Capacidade ──────────────────────────────────────────────

INSERT IGNORE INTO capacidade_horario (empresa_id, hora_inicio, hora_fim, max_agendamentos)
VALUES
  (1, '09:00:00', '12:00:00', 4),
  (1, '12:00:00', '14:00:00', 2),
  (1, '14:00:00', '19:00:00', 4),
  (2, '09:00:00', '12:00:00', 6),
  (2, '12:00:00', '14:00:00', 3),
  (2, '14:00:00', '18:00:00', 6);

-- ─── Agendamentos (diversos status) ──────────────────────────

-- Concluído (passado)
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, notas, criado_em)
VALUES (1, 3, 1, 1, DATE_SUB(CURDATE(), INTERVAL 3 DAY),
    '10:00:00', '10:30:00', 'concluido', 35.00, 'Corte de manutenção', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- Concluído (passado)
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, criado_em)
VALUES (2, 4, 1, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY),
    '11:00:00', '11:30:00', 'concluido', 35.00, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Concluído (passado) — empresa 2
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, criado_em)
VALUES (3, 3, 4, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    '14:00:00', '15:00:00', 'concluido', 80.00, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Cancelado (passado)
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, motivo_cancelamento, cancelado_em, criado_em)
VALUES (4, 5, 2, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY),
    '09:00:00', '09:45:00', 'cancelado', 55.00, 'Conflito de horário', DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY));

-- Confirmado (futuro próximo)
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, aceito_em, criado_em)
VALUES (5, 3, 2, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    '10:00:00', '10:45:00', 'confirmado', 55.00, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Confirmado (futuro próximo)
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, aceito_em, criado_em)
VALUES (6, 4, 3, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    '11:00:00', '11:30:00', 'confirmado', 40.00, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Pendente (aguardando aceite)
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, criado_em)
VALUES (7, 5, 2, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    '14:00:00', '14:45:00', 'pendente', 55.00, DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- Pendente — empresa 2
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, criado_em)
VALUES (8, 3, 5, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    '09:00:00', '09:45:00', 'pendente', 45.00, DATE_SUB(NOW(), INTERVAL 30 MINUTE));

-- Reagendado
INSERT IGNORE INTO agendamento (id, cliente_id, servico_id, empresa_id, data_agendamento,
    hora_inicio, hora_fim, status_agendamento, valor, reagendado_de, criado_em)
VALUES (9, 4, 4, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY),
    '15:00:00', '16:00:00', 'confirmado', 80.00, 4, DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- ─── Avaliações ──────────────────────────────────────────────

INSERT IGNORE INTO avaliacao (agendamento_id, cliente_id, estrelas, feedback, resposta_empresa)
VALUES (1, 3, 5, 'Excelente corte! Muito profissional.', 'Obrigado João! Volte sempre!');

INSERT IGNORE INTO avaliacao (agendamento_id, cliente_id, estrelas, feedback)
VALUES (2, 4, 4, 'Bom atendimento, mas a espera foi um pouco longa.');

INSERT IGNORE INTO avaliacao (agendamento_id, cliente_id, estrelas, feedback, resposta_empresa)
VALUES (3, 3, 5, 'Studio incrível, adorei o resultado!', 'Ficamos felizes que gostou! Até a próxima!');

-- ─── Score log ───────────────────────────────────────────────

INSERT IGNORE INTO pontuacao_log (cliente_id, agendamento_id, variacao, score_resultante, motivo, criado_em)
VALUES
  (3, 1, 1.00, 100.00, 'Compareceu ao agendamento', DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
  (3, 3, 1.00, 100.00, 'Compareceu ao agendamento', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
  (4, 2, 1.00, 95.50, 'Compareceu ao agendamento', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
  (5, 4, -0.50, 88.00, 'Cancelamento tardio', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- ─── Mensagens do chat ───────────────────────────────────────

INSERT IGNORE INTO mensagem (empresa_id, cliente_id, tipo, mensagem, automatica, data_envio, enviado_por)
VALUES
  (1, 3, 'confirmacao', 'João, seu agendamento de Corte Simples na Barbearia Estilo foi confirmado para 3 dias atrás às 10:00.', TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY), 'empresa'),
  (1, 3, 'outro', 'Obrigado! Até lá!', FALSE, DATE_SUB(NOW(), INTERVAL 4 DAY), 'cliente'),
  (1, 3, 'confirmacao', 'João, seu agendamento de Corte com Desenho na Barbearia Estilo foi confirmado para amanhã às 10:00.', TRUE, DATE_SUB(NOW(), INTERVAL 2 HOUR), 'empresa'),
  (1, 4, 'lembrete', 'Maria, seu agendamento de Barba Completa na Barbearia Estilo está confirmado para amanhã às 11:00.', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR), 'empresa'),
  (2, 3, 'confirmacao', 'João, seu agendamento de Corte Feminino no Studio Beauty foi confirmado para amanhã às 09:00.', TRUE, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'empresa');

-- ─── Notificação log ─────────────────────────────────────────

INSERT IGNORE INTO notificacao_log (empresa_id, cliente_id, agendamento_id, regra_id, tipo, mensagem, sucesso, enviado_em)
VALUES
  (1, 3, 1, 1, 'confirmacao', 'João, seu agendamento de Corte Simples na Barbearia Estilo foi confirmado para 3 dias atrás às 10:00.', TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY)),
  (1, 4, 2, 1, 'confirmacao', 'Maria, seu agendamento de Corte Simples na Barbearia Estilo foi confirmado para 2 dias atrás às 11:00.', TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY)),
  (1, 3, 5, 1, 'lembrete', 'João, seu agendamento de Corte com Desenho na Barbearia Estilo está para amanhã às 10:00.', TRUE, DATE_SUB(NOW(), INTERVAL 2 HOUR));