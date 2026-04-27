-- ============================================================
-- MIGRAÇÃO 002 — Adições ao schema (ver CHANGES.md para justificativas)
-- Nota: ADD COLUMN IF NOT EXISTS não existe no MySQL 8.0 (só MariaDB).
--       Os erros de coluna duplicada (errno 1060) são ignorados pelo
--       migrate.js para garantir idempotência.
-- ============================================================
-- eu do futuro altere aqui pra mim rir de voce sempre que se tentar usar comando do mariaDB e dar errado porque se não sabe ler o 
-- QUE EU DEIXEI PRA VOCE { 5 }

ALTER TABLE cliente ADD COLUMN score    DECIMAL(5,2) NOT NULL DEFAULT 100.00;

-- ─── empresa: endereço completo + metadados ──────────────────
ALTER TABLE empresa ADD COLUMN endereco               VARCHAR(200) NULL;
ALTER TABLE empresa ADD COLUMN numero                 VARCHAR(20)  NULL;
ALTER TABLE empresa ADD COLUMN complemento            VARCHAR(100) NULL;
ALTER TABLE empresa ADD COLUMN bairro                 VARCHAR(100) NULL;
ALTER TABLE empresa ADD COLUMN cidade                 VARCHAR(100) NULL;
ALTER TABLE empresa ADD COLUMN estado                 CHAR(2)      NULL;
ALTER TABLE empresa ADD COLUMN nicho                  VARCHAR(100) NULL;
ALTER TABLE empresa ADD COLUMN sub_nicho              VARCHAR(100) NULL;
ALTER TABLE empresa ADD COLUMN max_agendamentos_global INT          NULL;
ALTER TABLE empresa ADD COLUMN verificada             BOOLEAN      NOT NULL DEFAULT FALSE;
ALTER TABLE empresa ADD COLUMN site                   VARCHAR(255) NULL;

-- ─── servico: capacidade e horários ──────────────────────────
ALTER TABLE servico ADD COLUMN aceitamento_automatico BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE servico ADD COLUMN max_por_horario        INT     NULL;
ALTER TABLE servico ADD COLUMN hora_inicio            TIME    NULL;
ALTER TABLE servico ADD COLUMN hora_fim               TIME    NULL;
ALTER TABLE servico ADD COLUMN intervalo_minutos      INT     NOT NULL DEFAULT 0;

-- ─── agendamento: rastreabilidade e capacidade ───────────────
ALTER TABLE agendamento ADD COLUMN empresa_id         INT UNSIGNED NULL;
ALTER TABLE agendamento ADD COLUMN notas              TEXT         NULL;
ALTER TABLE agendamento ADD COLUMN criado_em          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE agendamento ADD COLUMN aceito_em          DATETIME     NULL;
ALTER TABLE agendamento ADD COLUMN cancelado_em       DATETIME     NULL;
ALTER TABLE agendamento ADD COLUMN reagendado_de      INT          NULL;
ALTER TABLE agendamento ADD COLUMN motivo_cancelamento TEXT        NULL;

-- ─── servico_tag: serviço disponível apenas em dias de tag ───
CREATE TABLE IF NOT EXISTS servico_tag (
    servico_id INT NOT NULL,
    tag_id     INT UNSIGNED NOT NULL,
    PRIMARY KEY (servico_id, tag_id),
    FOREIGN KEY (servico_id) REFERENCES servico(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)     REFERENCES tags(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── servico_horario: janelas de disponibilidade ─────────────
CREATE TABLE IF NOT EXISTS servico_horario (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    servico_id  INT NOT NULL,
    dia_semana  TINYINT UNSIGNED NULL COMMENT '0=Dom 6=Sab NULL=todos',
    hora_inicio TIME NOT NULL,
    hora_fim    TIME NOT NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (servico_id) REFERENCES servico(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── regra_empresa: políticas livres da empresa ──────────────
CREATE TABLE IF NOT EXISTS regra_empresa (
    id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id            INT UNSIGNED NOT NULL,
    tipo                  ENUM('notificacao','cancelamento','reagendamento','capacidade') NOT NULL,
    nome                  VARCHAR(150) NOT NULL,
    descricao             TEXT,
    antecedencia_horas    INT NULL,
    mensagem_template     TEXT NULL,
    tipo_notificacao      ENUM('lembrete','confirmacao','cancelamento','reagendamento','outro') NULL,
    limite_horas          INT NULL,
    taxa_percentual       DECIMAL(5,2) NULL,
    taxa_fixa             DECIMAL(10,2) NULL,
    estrelas_min          TINYINT NULL,
    estrelas_max          TINYINT NULL,
    ativo                 BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── pontuacao_log: auditoria do score do cliente ────────────
CREATE TABLE IF NOT EXISTS pontuacao_log (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id       INT UNSIGNED NOT NULL,
    agendamento_id   INT NULL,
    variacao         DECIMAL(5,2) NOT NULL,
    score_resultante DECIMAL(5,2) NOT NULL,
    motivo           VARCHAR(100) NOT NULL,
    criado_em        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id)     REFERENCES cliente(id)     ON DELETE CASCADE,
    FOREIGN KEY (agendamento_id) REFERENCES agendamento(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── chat_config: abertura e FAQ do chat ─────────────────────
CREATE TABLE IF NOT EXISTS chat_config (
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id        INT UNSIGNED UNIQUE NOT NULL,
    mensagem_abertura TEXT NULL,
    ativo             BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chat_faq (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT UNSIGNED NOT NULL,
    pergunta   VARCHAR(255) NOT NULL,
    resposta   TEXT NOT NULL,
    ordem      INT NOT NULL DEFAULT 0,
    ativo      BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── capacidade_horario: limite global por faixa ─────────────
CREATE TABLE IF NOT EXISTS capacidade_horario (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id       INT UNSIGNED NOT NULL,
    hora_inicio      TIME NOT NULL,
    hora_fim         TIME NOT NULL,
    max_agendamentos INT NOT NULL,
    UNIQUE KEY cap_empresa_faixa (empresa_id, hora_inicio, hora_fim),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── notificacao_log: auditoria de envios ────────────────────
CREATE TABLE IF NOT EXISTS notificacao_log (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id     INT UNSIGNED NOT NULL,
    cliente_id     INT UNSIGNED NOT NULL,
    agendamento_id INT NULL,
    regra_id       INT UNSIGNED NULL,
    tipo           VARCHAR(50) NOT NULL,
    mensagem       TEXT NOT NULL,
    enviado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sucesso        BOOLEAN NOT NULL DEFAULT TRUE,
    erro           TEXT NULL,
    FOREIGN KEY (empresa_id)     REFERENCES empresa(id)       ON DELETE CASCADE,
    FOREIGN KEY (cliente_id)     REFERENCES cliente(id)       ON DELETE CASCADE,
    FOREIGN KEY (agendamento_id) REFERENCES agendamento(id)   ON DELETE SET NULL,
    FOREIGN KEY (regra_id)       REFERENCES regra_empresa(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ÍNDICES IDÊMPOTENTES (MySQL 8 SAFE) trampo em mysql; trampo... ufe!
-- ============================================================

    -- agendamento.empresa_id
    SET @sql := (
    SELECT IF(
        EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
            AND table_name = 'agendamento'
            AND index_name = 'idx_ag_empresa'
        ),
        'SELECT ''idx_ag_empresa OK'';',
        'CREATE INDEX idx_ag_empresa ON agendamento (empresa_id);'
    )
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

    -- agendamento.data_agendamento
    SET @sql := (
    SELECT IF(
        EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
            AND table_name = 'agendamento'
            AND index_name = 'idx_ag_data'
        ),
        'SELECT ''idx_ag_data OK'';',
        'CREATE INDEX idx_ag_data ON agendamento (data_agendamento);'
    )
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

    -- agendamento.status_agendamento
    SET @sql := (
    SELECT IF(
        EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
            AND table_name = 'agendamento'
            AND index_name = 'idx_ag_status'
        ),
        'SELECT ''idx_ag_status OK'';',
        'CREATE INDEX idx_ag_status ON agendamento (status_agendamento);'
    )
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

    -- pontuacao_log.cliente_id
    SET @sql := (
    SELECT IF(
        EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
            AND table_name = 'pontuacao_log'
            AND index_name = 'idx_pl_cliente'
        ),
        'SELECT ''idx_pl_cliente OK'';',
        'CREATE INDEX idx_pl_cliente ON pontuacao_log (cliente_id);'
    )
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

    -- notificacao_log.agendamento_id
    SET @sql := (
    SELECT IF(
        EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
            AND table_name = 'notificacao_log'
            AND index_name = 'idx_notif_ag'
        ),
        'SELECT ''idx_notif_ag OK'';',
        'CREATE INDEX idx_notif_ag ON notificacao_log (agendamento_id);'
    )
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

    -- regra_empresa (empresa_id, tipo)
    SET @sql := (
    SELECT IF(
        EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
            AND table_name = 'regra_empresa'
            AND index_name = 'idx_re_empresa'
        ),
        'SELECT ''idx_re_empresa OK'';',
        'CREATE INDEX idx_re_empresa ON regra_empresa (empresa_id, tipo);'
    )
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

    -- servico_horario.servico_id
    SET @sql := (
    SELECT IF(
        EXISTS (
        SELECT 1 FROM information_schema.statistics
        WHERE table_schema = DATABASE()
            AND table_name = 'servico_horario'
            AND index_name = 'idx_sh_servico'
        ),
        'SELECT ''idx_sh_servico OK'';',
        'CREATE INDEX idx_sh_servico ON servico_horario (servico_id);'
    )
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
