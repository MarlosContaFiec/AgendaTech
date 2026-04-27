-- ============================================================
-- MIGRAÇÃO 003 — Dados de seed para testes
-- ============================================================

-- Usuário empresa (senha: Empresa@123)
INSERT IGNORE INTO usuario (id, tipo, email, senha_hash, ativo)
VALUES (1, 'empresa', 'barbearia@teste.com',
  '$2a$10$x7by5JPeZy516ZOhvuH5d.xOpdhQ.I4LosCk1c8ASo0G/i5cF/4uO', TRUE);

INSERT IGNORE INTO empresa (id, cnpj, razao_social, nome_fantasia, telefone, cep,
    endereco, numero, bairro, cidade, estado, nicho, sub_nicho, verificada)
VALUES (1, '12.345.678/0001-90', 'Barbearia Estilo LTDA', 'Barbearia Estilo',
    '(19) 99999-0001', '13330-000',
    'Rua das Flores', '100', 'Centro', 'Indaiatuba', 'SP', 'beleza', 'barbearia', TRUE);

INSERT IGNORE INTO empresaProfile (empresa_id, descricao, cor_primaria, cor_secundaria, cidade)
VALUES (1, 'A melhor barbearia de Indaiatuba. Cortes modernos e clássicos.', '#1a1a2e', '#e94560', 'Indaiatuba');

-- Usuário cliente (senha: Cliente@123)
INSERT IGNORE INTO usuario (id, tipo, email, senha_hash, ativo)
VALUES (2, 'cliente', 'joao@teste.com',
  '$2a$10$x7by5JPeZy516ZOhvuH5d.xOpdhQ.I4LosCk1c8ASo0G/i5cF/4uO', TRUE);

INSERT IGNORE INTO cliente (id, nome, cpf, verificado, data_nascimento, telefone, score)
VALUES (2, 'João Silva', '529.982.247-25', TRUE, '1995-03-15', '(19) 98888-0001', 100.00);

-- Serviços
INSERT IGNORE INTO servico (id, empresa_id, nome, descricao, duracao_minutos, preco_base,
    ativo, aceitamento_automatico, max_por_horario, hora_inicio, hora_fim)
VALUES
  (1, 1, 'Corte Simples', 'Corte tradicional com máquina e tesoura', 30, 35.00, TRUE, TRUE, 2, '09:00:00', '19:00:00'),
  (2, 1, 'Corte com Desenho', 'Corte com arte e design personalizado', 45, 55.00, TRUE, FALSE, 2, '09:00:00', '17:00:00'),
  (3, 1, 'Barba Completa', 'Modelagem e hidratação da barba', 30, 40.00, TRUE, TRUE, NULL, '09:00:00', '19:00:00');

-- Horários dos serviços (seg-sab)
INSERT IGNORE INTO servico_horario (servico_id, dia_semana, hora_inicio, hora_fim)
VALUES
  (1, NULL, '09:00:00', '19:00:00'),
  (2, 2, '09:00:00', '17:00:00'),
  (2, 4, '09:00:00', '17:00:00'),
  (3, NULL, '09:00:00', '19:00:00');

-- Tags
INSERT IGNORE INTO tags (id, empresa_id, nome, label, cor, aceita_agendamento, info)
VALUES
  (1, 1, 'fechado', 'Fechado', '#ff0000', 0, 'Estabelecimento fechado neste dia'),
  (2, 1, 'domingo', 'Domingo', '#ff6b6b', 0, 'Fechado aos domingos'),
  (3, 1, 'pascoa', 'Páscoa', '#ffd700', 1, 'Aberto na Páscoa com horário especial'),
  (4, 1, 'desconto15', '15% OFF', '#00b894', 1, 'Desconto especial de 15% em todos os serviços');

-- Regras de calendário
INSERT IGNORE INTO regras (empresa_id, tag_id, tipo, dia_semana, prioridade)
VALUES
  (1, 2, 'padrao', 0, 5),    -- Fechado todo domingo (prioridade 5)
  (1, 3, 'unico', NULL, 10); -- Páscoa (unico, prioridade 10 sobrepõe domingo)

-- Regras de negócio
INSERT IGNORE INTO regra_empresa (empresa_id, tipo, nome, antecedencia_horas, mensagem_template, tipo_notificacao)
VALUES (1, 'notificacao', 'Lembrete 12h antes', 12,
  'Olá {nome_cliente}! Lembrando que você tem um agendamento amanhã às {hora} para {servico} na {nome_empresa}. Até lá!',
  'lembrete');

INSERT IGNORE INTO regra_empresa (empresa_id, tipo, nome, limite_horas, taxa_percentual, mensagem_template, tipo_notificacao)
VALUES (1, 'cancelamento', 'Taxa cancelamento tardio', 24, 30.00,
  'Cancelamento realizado com menos de 24h de antecedência. Taxa de 30% (R$ {taxa}) será aplicada.',
  'cancelamento');

INSERT IGNORE INTO regra_empresa (empresa_id, tipo, nome, limite_horas)
VALUES (1, 'reagendamento', 'Limite reagendamento 48h', 48);

-- Chat config
INSERT IGNORE INTO chat_config (empresa_id, mensagem_abertura)
VALUES (1, 'Olá! Bem-vindo à Barbearia Estilo 💈 Como posso ajudar você hoje?');

INSERT IGNORE INTO chat_faq (empresa_id, pergunta, resposta, ordem)
VALUES
  (1, 'Qual o horário de funcionamento?', 'Funcionamos de segunda a sábado, das 9h às 19h.', 1),
  (1, 'Aceita walk-in?', 'Sim, mas agendamento tem prioridade!', 2),
  (1, 'Qual a forma de pagamento?', 'Aceitamos PIX, cartão de crédito/débito e dinheiro.', 3);

-- Capacidade de horário
INSERT IGNORE INTO capacidade_horario (empresa_id, hora_inicio, hora_fim, max_agendamentos)
VALUES
  (1, '09:00:00', '12:00:00', 4),
  (1, '12:00:00', '14:00:00', 2),
  (1, '14:00:00', '19:00:00', 4);
