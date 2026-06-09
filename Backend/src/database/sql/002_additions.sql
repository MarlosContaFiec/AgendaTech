-- ─── cliente: score para reputação ────────────────────────────

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
ALTER TABLE agendamento ADD COLUMN empresa_id         INT UNSIGNED NOT NULL;
ALTER TABLE agendamento ADD COLUMN notas              TEXT         NULL;
ALTER TABLE agendamento ADD COLUMN valor              DECIMAL(10,2) NULL;
ALTER TABLE agendamento ADD COLUMN criado_em          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE agendamento ADD COLUMN aceito_em          DATETIME     NULL;
ALTER TABLE agendamento ADD COLUMN cancelado_em       DATETIME     NULL;
ALTER TABLE agendamento ADD COLUMN reagendado_de      INT          NULL;
ALTER TABLE agendamento ADD COLUMN motivo_cancelamento TEXT        NULL;

-- ─── Adicionar constraint de chave estrangeira para empresa_id ──
ALTER TABLE agendamento ADD CONSTRAINT fk_agendamento_empresa 
  FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE;

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
    limite_horas          INT NULL COMMENT 'horas antes do agendamento',
    taxa_percentual       DECIMAL(5,2) NULL COMMENT '%',
    taxa_fixa             DECIMAL(10,2) NULL,
    mensagem_template     TEXT,
    tipo_notificacao      VARCHAR(50) NULL COMMENT 'confirmacao, lembrete, etc',
    ativo                 TINYINT(1) NOT NULL DEFAULT 1,
    criado_em             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── notificacao_log: auditoria de notificações ───────────────
CREATE TABLE IF NOT EXISTS notificacao_log (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT UNSIGNED NOT NULL,
    cliente_id INT UNSIGNED NOT NULL,
    agendamento_id INT NULL,
    regra_id INT UNSIGNED NULL,
    tipo VARCHAR(50),
    mensagem TEXT,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (agendamento_id) REFERENCES agendamento(id) ON DELETE SET NULL,
    FOREIGN KEY (regra_id) REFERENCES regra_empresa(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── pontuacao_log: histórico de score do cliente ──────────────
CREATE TABLE IF NOT EXISTS pontuacao_log (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT UNSIGNED NOT NULL,
    agendamento_id INT NULL,
    variacao DECIMAL(5,2) NOT NULL,
    score_resultante DECIMAL(5,2) NOT NULL,
    motivo VARCHAR(150),
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (agendamento_id) REFERENCES agendamento(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── índices ─────────────────────────────────────────────────
CREATE INDEX idx_ag_cliente ON agendamento (cliente_id);
CREATE INDEX idx_ag_servico ON agendamento (servico_id);
CREATE INDEX idx_ag_empresa ON agendamento (empresa_id);
CREATE INDEX idx_ag_data ON agendamento (data_agendamento);
CREATE INDEX idx_msg_empresa ON mensagem (empresa_id);
CREATE INDEX idx_msg_cliente ON mensagem (cliente_id);
CREATE INDEX idx_av_agendamento ON avaliacao (agendamento_id);
CREATE INDEX idx_servico_empresa ON servico (empresa_id);
CREATE INDEX idx_tags_empresa ON tags (empresa_id);
CREATE INDEX idx_regra_empresa ON regra_empresa (empresa_id);
CREATE INDEX idx_notif_empresa ON notificacao_log (empresa_id);
CREATE INDEX idx_pontuacao_cliente ON pontuacao_log (cliente_id);