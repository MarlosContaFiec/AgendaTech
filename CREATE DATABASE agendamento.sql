CREATE DATABASE agendamento_bd;
USE agendamento_bd;

-- =========================
-- USUARIOS
-- =========================
CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo ENUM('cliente','empresa') NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    data_criacao DATE NOT NULL
);

-- =========================
-- FILHAS
-- =========================

CREATE TABLE cliente (
    id INT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(20) UNIQUE,
    FOREIGN KEY (id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE empresa (
    id INT PRIMARY KEY,
    cnpj VARCHAR(20) UNIQUE,
    razao_social VARCHAR(200),
    nome_fantasia VARCHAR(200),
    FOREIGN KEY (id) REFERENCES usuario(id) ON DELETE CASCADE
);


-- =========================
-- EMPRESA
-- =========================
CREATE TABLE empresaProfile (
    id INT PRIMARY KEY AUTO_INCREMENT,
    verificada BOOLEAN DEFAULT FALSE,
    descricao TEXT,
    logo_url VARCHAR(255),
    cor_primaria VARCHAR(7),
    cor_secundaria VARCHAR(7),
    cidade VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id) REFERENCES empresa(id) 
);

-- =========================
-- SERVICO
-- =========================
CREATE TABLE servico (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    duracao_minutos INT NOT NULL,
    preco_base DECIMAL(10,2) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

-- =========================
-- AGENDA EVENTO
-- =========================
CREATE TABLE agenda_evento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    tipo ENUM('unico','recorrente') NOT NULL,
    titulo VARCHAR(150),
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE,
    tag VARCHAR(50),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

-- =========================
-- AGENDA PADRAO
-- =========================
CREATE TABLE agenda_padrao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    dia_semana ENUM('domingo','segunda','terca','quarta','quinta','sexta','sabado'),
    tag VARCHAR(50),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

-- =========================
-- AGENDA EXCECAO
-- =========================
CREATE TABLE agenda_excecao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    data_excecao DATE NOT NULL,
    tag VARCHAR(50),
    observacao TEXT,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

-- =========================
-- AGENDAMENTO
-- =========================
CREATE TABLE agendamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    servico_id INT NOT NULL,
    data_agendamento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status_agendamento ENUM('confirmado','cancelado','pendente','concluido'),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id),
    FOREIGN KEY (servico_id) REFERENCES servico(id)
);

-- =========================
-- AVALIACAO
-- =========================
CREATE TABLE avaliacao (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agendamento_id INT NOT NULL,
    cliente_id INT NOT NULL,
    estrelas INT CHECK (estrelas BETWEEN 1 AND 5),
    feedback TEXT,
    resposta_empresa TEXT,
    FOREIGN KEY (agendamento_id) REFERENCES agendamento(id),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);

-- =========================
-- MENSAGEM
-- =========================
CREATE TABLE mensagem (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    cliente_id INT NOT NULL,
    tipo ENUM('cancelamento','confirmacao','lembrete','outro'),
    mensagem TEXT NOT NULL,
    automatica BOOLEAN DEFAULT FALSE,
    data_envio DATETIME,
    enviado_por ENUM('cliente','empresa'),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);

-- =========================
-- REGRA EMPRESA
-- =========================
CREATE TABLE regra_empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    tipo ENUM('cancelamento','adiamento','geral'),
    prazo_horas INT,
    taxa DECIMAL(10,2),
    mensagem_padrao TEXT,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

-- =========================
-- DASHBOARD EMPRESA
-- =========================
CREATE TABLE dashboard_empresa (
    id INT PRIMARY KEY AUTO_INCREMENT,
    empresa_id INT NOT NULL,
    total_clientes INT DEFAULT 0,
    total_servicos INT DEFAULT 0,
    total_cancelamentos INT DEFAULT 0,
    total_adiamentos INT DEFAULT 0,
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

-- =========================
-- FAVORITO
-- =========================
CREATE TABLE favorito (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    empresa_id INT NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES usuario(id),
    FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

-- =========================
-- PERFIL CLIENTE
-- =========================
CREATE TABLE perfil_cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    cpf VARCHAR(20),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);