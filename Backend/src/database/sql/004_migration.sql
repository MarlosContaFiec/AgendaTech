-- ============================================================
-- MIGRAÇÃO 004 — Novas tabelas, colunas e correções
-- ============================================================

-- ─── dependentes do cliente ──────────────────────────────────
CREATE TABLE IF NOT EXISTS dependente (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT UNSIGNED NOT NULL,
    nome VARCHAR(150) NOT NULL,
    idade TINYINT UNSIGNED NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── documentos do cliente ───────────────────────────────────
CREATE TABLE IF NOT EXISTS documento_cliente (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT UNSIGNED NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    arquivo_url VARCHAR(255) NOT NULL,
    status ENUM('pendente','aprovado','rejeitado') NOT NULL DEFAULT 'pendente',
    observacao TEXT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revisado_em DATETIME NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── cartões do cliente ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cartao_cliente (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT UNSIGNED NOT NULL,
    token_referencia VARCHAR(255) NOT NULL,
    ultimos_quatro CHAR(4) NOT NULL,
    bandeira VARCHAR(30) NULL,
    titular VARCHAR(150) NULL,
    principal BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── solicitação de horário estendido ────────────────────────
CREATE TABLE IF NOT EXISTS solicitacao_horario (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    agendamento_id INT NOT NULL,
    minutos_extra INT UNSIGNED NOT NULL,
    motivo TEXT NULL,
    status ENUM('pendente','aceito','negado') NOT NULL DEFAULT 'pendente',
    resposta_empresa TEXT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    respondido_em DATETIME NULL,
    FOREIGN KEY (agendamento_id) REFERENCES agendamento(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── fila de espera ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fila_espera (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT UNSIGNED NOT NULL,
    servico_id INT NOT NULL,
    empresa_id INT UNSIGNED NOT NULL,
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    status ENUM('aguardando','notificado','convertido','cancelado') NOT NULL DEFAULT 'aguardando',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE,
    FOREIGN KEY (servico_id) REFERENCES servico(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── agendamento: horário estendido ──────────────────────────
ALTER TABLE agendamento ADD COLUMN horario_estendido BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE agendamento ADD COLUMN motivo_estendido TEXT NULL;

-- ─── empresa: método de prioridade da fila ───────────────────
ALTER TABLE empresa ADD COLUMN metodo_fila ENUM('ordem_chegada','score') NOT NULL DEFAULT 'score';

-- ─── Usuario: ────────────────────────────────────────────────
ALTER TABLE usuario ADD COLUMN email_verificado BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE usuario ADD COLUMN token_verificacao VARCHAR(255) NULL;
ALTER TABLE usuario ADD COLUMN token_expira_em DATETIME NULL;

-- ─── índices ─────────────────────────────────────────────────
CREATE INDEX idx_dep_cliente ON dependente (cliente_id);
CREATE INDEX idx_doc_cliente ON documento_cliente (cliente_id);
CREATE INDEX idx_cart_cliente ON cartao_cliente (cliente_id);
CREATE INDEX idx_sol_agendamento ON solicitacao_horario (agendamento_id);
CREATE INDEX idx_fila_empresa_data ON fila_espera (empresa_id, data_agendamento);
CREATE INDEX idx_fila_cliente ON fila_espera (cliente_id);
