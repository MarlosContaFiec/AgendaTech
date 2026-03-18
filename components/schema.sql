
-- === === === Calendário de Regras — Schema MySQL === === ===

CREATE DATABASE IF NOT EXISTS calendario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE calendario;


-- Empresas

CREATE TABLE IF NOT EXISTS empresas (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(120)  NOT NULL,
    slug        VARCHAR(120)  NOT NULL UNIQUE,
    criado_em   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Tags criadas pela empresa  (ex: "fechado", "feriado", "páscoa")

CREATE TABLE IF NOT EXISTS tags (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id          INT UNSIGNED NOT NULL,
    nome                VARCHAR(80)  NOT NULL,           --"fechado", "feriado", "páscoa"
    label               VARCHAR(120) NOT NULL,           --texto exibido no calendário
    cor                 VARCHAR(7)   NOT NULL DEFAULT '#888888', -- hex
    aceita_agendamento  TINYINT(1)   NOT NULL DEFAULT 0,
    info                TEXT         NULL,               --descrição extra ao clicar
    criado_em           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_tag_empresa (empresa_id, nome),
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
);


-- Regras  (cada regra liga uma tag a uma condição de disparo)

-- tipo:
--   padrao   → repete toda semana/mês indefinidamente
--   excecao  → sobrepõe um padrão em contexto específico
--   unico    → data pontual, não repete (salvo unico_repete_anual=1)

CREATE TABLE IF NOT EXISTS regras (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id          INT UNSIGNED NOT NULL,
    tag_id              INT UNSIGNED NOT NULL,
    tipo                ENUM('padrao','excecao','unico') NOT NULL,

    --=== === === condição para padrão / exceção === === ===
    dia_semana          TINYINT UNSIGNED NULL,   -- 0=dom … 6=sáb  (NULL = qualquer)
    nth_do_mes          TINYINT UNSIGNED NULL,   -- 1ª, 2ª… ocorrência; 0 = toda semana
    mes                 TINYINT UNSIGNED NULL,   -- 0=jan … 11=dez (NULL = qualquer)

    --=== === === condição para único === === ===
    unico_dia           TINYINT UNSIGNED NULL,   -- 1-31
    unico_mes           TINYINT UNSIGNED NULL,   -- 0-11
    unico_ano           SMALLINT UNSIGNED NULL,  -- NULL = repete todo ano
    unico_repete_anual  TINYINT(1) NOT NULL DEFAULT 0,

    --=== === === prioridade de resolução === === ===
    -- padrão=10, exceção=20, único=30 (maior vence conflito)
    prioridade          TINYINT UNSIGNED NOT NULL DEFAULT 10,

    ativo               TINYINT(1) NOT NULL DEFAULT 1,
    criado_em           DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em       DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)     REFERENCES tags(id)     ON DELETE CASCADE,

    INDEX idx_empresa_tipo (empresa_id, tipo),
    INDEX idx_empresa_ativo (empresa_id, ativo)
);


-- Seed de exemplo

INSERT IGNORE INTO empresas (nome, slug) VALUES ('Restaurante Exemplo', 'restaurante-exemplo');

INSERT IGNORE INTO tags (empresa_id, nome, label, cor, aceita_agendamento, info) VALUES
(1, 'fechado',  'Fechado',          '#E24B4A', 0, 'Estabelecimento fechado neste dia.'),
(1, 'feriado',  'Feriado',          '#BA7517', 0, 'Feriado nacional. Sem atendimento.'),
(1, 'pascoa',   'Páscoa',           '#1D9E75', 1, 'Funcionamento especial de Páscoa. Agendamentos permitidos.'),
(1, 'limpeza',  'Limpeza',          '#378ADD', 0, 'Fechado para limpeza geral.'),
(1, 'promocao', 'Promoção especial','#D4537E', 1, 'Desconto especial de 20% em pratos de peixe.');

-- padrão: todo domingo → fechado (prioridade 10)
INSERT IGNORE INTO regras (empresa_id, tag_id, tipo, dia_semana, nth_do_mes, prioridade)
VALUES (1, 1, 'padrao', 0, 0, 10);

-- padrão: 1ª segunda de cada mês → limpeza (prioridade 10)
INSERT IGNORE INTO regras (empresa_id, tag_id, tipo, dia_semana, nth_do_mes, prioridade)
VALUES (1, 4, 'padrao', 1, 1, 10);

-- único: 5 de julho → feriado (repete todo ano)
INSERT IGNORE INTO regras (empresa_id, tag_id, tipo, unico_dia, unico_mes, unico_repete_anual, prioridade)
VALUES (1, 2, 'unico', 5, 6, 1, 30);

-- único: 1º domingo de abril → páscoa  (exceção que aceita agendamento, prioridade 20)
INSERT IGNORE INTO regras (empresa_id, tag_id, tipo, dia_semana, nth_do_mes, mes, prioridade)
VALUES (1, 3, 'excecao', 0, 1, 3, 20);
