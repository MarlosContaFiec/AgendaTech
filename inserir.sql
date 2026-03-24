create database agendamento_bd;
use agendamento_bd;

CREATE TABLE usuario (
    id_usuario int PRIMARY KEY,
    tipo_usuario varchar(10),
    email_usuario varchar(255),
    senha_hash varchar(255),
    ativo boolean,
    data_criacao date,
    Foto_logo varchar(255)
);

CREATE TABLE empresa (
    id_empresa int,
    Cnpj varchar(14),
    NomeFantasia varchar(50),
    fk_agenda_regras_agenda_regras_PK int,
    fk_usuario__id_usuario int,
    PRIMARY KEY (id_empresa, fk_usuario__id_usuario)
);

CREATE TABLE mensagem (
    id_mensagem int PRIMARY KEY,
    tipo varchar(12),
    mensagem text,
    automatica boolean,
    data_envio date,
    quem varchar(1)
);

CREATE TABLE eventos (
    id_eventos int PRIMARY KEY,
    titulo varchar(50),
    data_inicio date,
    data_fim date,
    tag varchar(25),
    descricao varchar(100),
    tipo varchar(12)
);

CREATE TABLE cadastro_servicos (
    id_cadastro_servicos int PRIMARY KEY,
    nome_servico varchar(25),
    duracao int,
    descricao varchar(200),
    ativo boolean
);

CREATE TABLE cliente (
    id_cliente INT,
    DataNascimento date,
    cpf varchar(11),
    nome varchar(100),
    fk_usuario__id_usuario int,
    PRIMARY KEY (id_cliente, fk_usuario__id_usuario)
);

CREATE TABLE agenda_servico (
    data date,
    hora_inicio time,
    id_agenda_servico int PRIMARY KEY,
    status varchar(5),
    hora_fim time,
    fk_cadastro_servicos_id_cadastro_servicos int,
    fk_cliente_id_cliente INT,
    fk_cliente_fk_usuario__id_usuario int
);

CREATE TABLE agenda_regras (
    agenda_regras_PK int NOT NULL PRIMARY KEY,
    tag varchar(21),
    mes tinyint,
    observacao varchar(50),
    prioridade tinyint,
    ativo boolean,
    ocorrencia tinyint
);

CREATE TABLE envia (
    fk_agenda_servico_id_agenda_servico int,
    fk_mensagem_id_mensagem int
);


CREATE TABLE organiza (
    fk_eventos_id_eventos int,
    fk_empresa_id_empresa int,
    fk_empresa_fk_usuario__id_usuario int
);
 
ALTER TABLE empresa ADD CONSTRAINT FK_empresa_2
    FOREIGN KEY (fk_agenda_regras_agenda_regras_PK)
    REFERENCES agenda_regras (agenda_regras_PK)
    ON DELETE SET NULL;
 
ALTER TABLE empresa ADD CONSTRAINT FK_empresa_3
    FOREIGN KEY (fk_usuario__id_usuario)
    REFERENCES usuario_ (id_usuario)
    ON DELETE CASCADE;
 
ALTER TABLE cliente ADD CONSTRAINT FK_cliente_2
    FOREIGN KEY (fk_usuario__id_usuario)
    REFERENCES usuario_ (id_usuario)
    ON DELETE CASCADE;
 
ALTER TABLE agenda_servico ADD CONSTRAINT FK_agenda_servico_2
    FOREIGN KEY (fk_cadastro_servicos_id_cadastro_servicos)
    REFERENCES cadastro_servicos (id_cadastro_servicos)
    ON DELETE RESTRICT;
 
ALTER TABLE agenda_servico ADD CONSTRAINT FK_agenda_servico_3
    FOREIGN KEY (fk_cliente_id_cliente, fk_cliente_fk_usuario__id_usuario)
    REFERENCES cliente (id_cliente, fk_usuario__id_usuario)
    ON DELETE RESTRICT;
 
ALTER TABLE envia ADD CONSTRAINT FK_envia_1
    FOREIGN KEY (fk_agenda_servico_id_agenda_servico)
    REFERENCES agenda_servico (id_agenda_servico)
    ON DELETE RESTRICT;
 
ALTER TABLE envia ADD CONSTRAINT FK_envia_2
    FOREIGN KEY (fk_mensagem_id_mensagem)
    REFERENCES mensagem (id_mensagem)
    ON DELETE RESTRICT;
 
ALTER TABLE organiza ADD CONSTRAINT FK_organiza_1
    FOREIGN KEY (fk_eventos_id_eventos)
    REFERENCES eventos (id_eventos)
    ON DELETE RESTRICT;
 
ALTER TABLE organiza ADD CONSTRAINT FK_organiza_2
    FOREIGN KEY (fk_empresa_id_empresa, fk_empresa_fk_usuario__id_usuario)
    REFERENCES empresa (id_empresa, fk_usuario__id_usuario)
    ON DELETE RESTRICT;

INSERT INTO usuario (id_usuario, tipo_usuario, email_usuario, senha_hash, ativo, data_criacao, Foto_logo) VALUES
(1, 'empresa', 'marcos.silva@gmail.com', '$2y$10$K8hF2k9dP3QwZx1YtL9vEeX7QbA9cR1sF4T6U8wJp2LmN5oPqR7uC', true, '2024-01-15', 'logo_admin1.png'),
(2, 'empresa', 'ana.costa@yahoo.com', '$2y$10$Jd82Kf9aLmN4PqR6tY8uWvX1Zc3E5rT7yH2UoP9aS6DfG1hJkL0Mn', true, '2024-02-10', 'foto_ana.png'),
(3, 'empresa', 'joao.pereira@hotmail.com', '$2y$10$QwErTyUiOp1234567890asdfghjklzxcvbnmPOIUYTREWQ09876', true, '2024-03-05', 'foto_joao.png'),
(4, 'empresa', 'carla.mendes@outlook.com', '$2y$10$AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz', true, '2023-12-20', 'logo_admin2.png'),
(5, 'empresa', 'lucas.rocha@gmail.com', '$2y$10$ZxCvBnMaSdFgHjKlQwErTyUiOp0987654321asdfghjklPOIUYT', false, '2024-04-01', 'foto_lucas.png'),
(6, 'cliente', 'fernanda.almeida@gmail.com', '$2y$10$LkJHgFdSaQwErTyUiOp1234567890ZXCVBNMasdfghjklpoiuy', true, '2024-05-18', 'foto_fernanda.png'),
(7, 'cliente', 'rodrigo.santos@yahoo.com.br', '$2y$10$MnbVcXzLkJhGfDsAqWeRtYuIoP0987654321PoiUYTRewqAsDf', true, '2024-06-22', 'foto_rodrigo.png'),
(8, 'cliente', 'patricia.oliveira@gmail.com', '$2y$10$AsDfGhJkLqWeRtYuIoPzXcVbNm0987654321mNbVcXzLkJhGfD', true, '2024-07-30', 'logo_admin3.png'),
(9, 'cliente', 'bruno.ribeiro@outlook.com', '$2y$10$HgFdSaQwErTyUiOpZxCvBnM1234567890poiuytrewqlkjhgf', true, '2024-08-14', 'foto_bruno.png'),
(10, 'cliente', 'juliana.teixeira@gmail.com', '$2y$10$QazWsxEdcRfvtgbyhnujmiklop1234567890ZAQXSWCDEVFR', true, '2024-09-05', 'foto_juliana.png');

INSERT INTO empresa (id_empresa, Cnpj, NomeFantasia, fk_agenda_regras_agenda_regras_PK, fk_usuario__id_usuario) VALUES
(1, '12345678000195', 'Tech Soluções Ltda', 1, 1),
(2, '98765432000110', 'Padaria Pão Doce', 2, 2),
(3, '45678912000133', 'Clínica Vida & Saúde', 3, 3),
(4, '32165498000177', 'Auto Mecânica Rápida', 4, 4),
(5, '74185296000155', 'Loja Estilo Urbano', 5, 5);

INSERT INTO cadastro_servicos VALUES
(1, 'Suporte Técnico', 60, 'Manutenção de sistemas', TRUE, 1),
(2, 'Instalação Software', 90, 'Instalação de sistemas', TRUE, 1),

(3, 'Encomenda de Bolos', 120, 'Bolos personalizados', TRUE, 2),
(4, 'Café da Manhã', 30, 'Serviço matinal', TRUE, 2),

(5, 'Consulta Médica', 45, 'Consulta geral', TRUE, 3),
(6, 'Exame Rotina', 30, 'Exames básicos', TRUE, 3),

(7, 'Troca de Óleo', 40, 'Troca de óleo do motor', TRUE, 4),
(8, 'Revisão Completa', 120, 'Revisão geral', TRUE, 4),

(9, 'Atendimento Cliente', 20, 'Atendimento na loja', TRUE, 5),
(10, 'Personal Stylist', 60, 'Consultoria de moda', TRUE, 5);

INSERT INTO eventos VALUES
(1, 'Atualização Sistema', '2026-03-25', '2026-03-25', 'TI', 'Atualização interna', 'manutencao', 1),
(2, 'Implantação ERP', '2026-03-26', '2026-03-27', 'TI', 'Novo sistema', 'projeto', 1),

(3, 'Produção Especial', '2026-03-25', '2026-03-25', 'Padaria', 'Alta demanda', 'producao', 2),
(4, 'Promoção Café', '2026-03-26', '2026-03-26', 'Padaria', 'Descontos', 'promocao', 2),

(5, 'Mutirão', '2026-03-25', '2026-03-25', 'Saúde', 'Atendimento intensivo', 'atendimento', 3),
(6, 'Vacinação', '2026-03-27', '2026-03-28', 'Saúde', 'Campanha', 'campanha', 3),

(7, 'Revisão Veicular', '2026-03-25', '2026-03-25', 'Mecânica', 'Revisões', 'servico', 4),
(8, 'Troca Óleo Promo', '2026-03-26', '2026-03-26', 'Mecânica', 'Promoção', 'promocao', 4),

(9, 'Nova Coleção', '2026-03-25', '2026-03-25', 'Varejo', 'Lançamento', 'evento', 5),
(10, 'Liquidação', '2026-03-28', '2026-03-29', 'Varejo', 'Descontos', 'promocao', 5);

INSERT INTO agenda_regras VALUES
(1, 'TI', 3, 'Manutenção mensal', 1, TRUE, 1),
(2, 'Padaria', 3, 'Alta produção diária', 2, TRUE, 7),
(3, 'Saúde', 3, 'Atendimento clínico', 1, TRUE, 5),
(4, 'Mecânica', 3, 'Revisões semanais', 2, TRUE, 3),
(5, 'Varejo', 3, 'Promoções mensais', 3, TRUE, 2);

INSERT INTO cliente VALUES
(1, '1995-03-12', '12345678901', 'Fernanda Almeida', 6),
(2, '1988-07-25', '23456789012', 'Rodrigo Santos', 7),
(3, '1992-11-03', '34567890123', 'Patricia Oliveira', 8),
(4, '2000-01-15', '45678901234', 'Bruno Ribeiro', 9),
(5, '1997-09-09', '56789012345', 'Juliana Teixeira', 10);

INSERT INTO mensagem (id_mensagem, tipo, mensagem, automatica, data_envio, quem) VALUES
(1, 'texto', 'Olá, gostaria de agendar um horário para amanhã.', false, '2024-06-01', 'cliente'),
(2, 'texto', 'Claro! Qual horário você prefere?', true, '2024-06-01', 'empresa'),

(3, 'texto', 'Seu horário está confirmado para o dia 10/06 às 10h.', true, '2024-06-06', 'empresa'),
(4, 'texto', 'Perfeito, estarei lá.', false, '2024-06-06', 'Cliente'),

(5, 'texto', 'Vocês estão abertos hoje?', false, '2024-06-02', 'Cliente'),
(6, 'texto', 'Sim, atendemos até às 18h.', true, '2024-06-02', 'empresa'),

(7, 'texto', 'Preciso cancelar meu horário.', false, '2024-06-03', 'Cliente'),
(8, 'texto', 'Seu agendamento foi cancelado com sucesso.', true, '2024-06-03', 'empresa'),

(9, 'texto', 'Tem promoção essa semana?', false, '2024-06-04', 'Cliente'),
(10, 'texto', 'Sim! Estamos com 20% de desconto em serviços selecionados.', true, '2024-06-04', 'empresa');

INSERT INTO agenda_servico VALUES

('2026-03-25', '09:00:00', 1, 'OK', '10:00:00', 1, 1, 6),
('2026-03-26', '14:00:00', 2, 'OK', '15:30:00', 2, 2, 7),

('2026-03-25', '08:00:00', 3, 'OK', '10:00:00', 3, 3, 8),
('2026-03-26', '07:30:00', 4, 'OK', '08:00:00', 4, 4, 9),

('2026-03-25', '10:00:00', 5, 'OK', '10:45:00', 5, 5, 10),
('2026-03-27', '11:00:00', 6, 'OK', '11:30:00', 6, 1, 6),

('2026-03-25', '13:00:00', 7, 'OK', '13:40:00', 7, 2, 7),
('2026-03-26', '15:00:00', 8, 'OK', '17:00:00', 8, 3, 8),

('2026-03-25', '16:00:00', 9, 'OK', '16:20:00', 9, 4, 9),
('2026-03-28', '17:00:00', 10, 'OK', '18:00:00', 10, 5, 10);