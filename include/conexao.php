    <?php

    $host    = $_ENV['DB_HOST'];
    $port    = $_ENV['DB_PORT'];
    $db      = $_ENV['DB_NAME'];
    $user    = $_ENV['DB_USER'];
    $pass    = $_ENV['DB_PASS'];
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    try {
            $pdo = new PDO(
        "mysql:host=$host;port=$port;charset=$charset",$user,$pass,$options);

        // aqui e pa criar o banco acaso ele não exista
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        
        // conecta no banco que criamos
        $pdo->exec("USE `$db`");

        // USUARIO
        $pdo->exec("CREATE TABLE IF NOT EXISTS usuario (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tipo VARCHAR(20) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        ativo BOOLEAN DEFAULT TRUE,
        data_criacao DATE NOT NULL,
        foto VARCHAR(100)
    );
    ");

        // CLIENTE
        $pdo->exec("CREATE TABLE IF NOT EXISTS cliente (
        id INT PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        cpf VARCHAR(20) UNIQUE,
        data_nascimento DATE NULL,
        telefone VARCHAR(15) NULL,
        verificado BOOLEAN NULL,
        FOREIGN KEY (id) REFERENCES usuario(id) ON DELETE CASCADE
    );
    ");

        // EMPRESA
        $pdo->exec("CREATE TABLE IF NOT EXISTS empresa (
        id INT PRIMARY KEY,
        cnpj VARCHAR(20) UNIQUE,
        razao_social VARCHAR(200),
        nome_fantasia VARCHAR(200),
        telefone VARCHAR(15) NULL,
        cep VARCHAR(20) NULL,
        FOREIGN KEY (id) REFERENCES usuario(id) ON DELETE CASCADE
    );
    ");

        // EMPRESA PROFILE
        $pdo->exec("CREATE TABLE IF NOT EXISTS empresaProfile (
        id INT PRIMARY KEY AUTO_INCREMENT,
        verificada BOOLEAN DEFAULT FALSE,
        descricao TEXT,
        logo_url VARCHAR(255),
        cor_primaria VARCHAR(7),
        cor_secundaria VARCHAR(7),
        cidade VARCHAR(100),
        ativo BOOLEAN DEFAULT TRUE,
        empresa_id INT,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    );
    ");

        // SERVICO
        $pdo->exec("CREATE TABLE IF NOT EXISTS servico (
        id INT PRIMARY KEY AUTO_INCREMENT,
        empresa_id INT NOT NULL,
        nome VARCHAR(150) NOT NULL,
        descricao TEXT,
        duracao_minutos INT NOT NULL,
        preco_base DECIMAL(10,2) NOT NULL,
        ativo BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    );
    ");

        // AGENDA EVENTO
        $pdo->exec("CREATE TABLE IF NOT EXISTS agenda_evento (
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
    ");

        // AGENDA PADRAO
        $pdo->exec("CREATE TABLE IF NOT EXISTS agenda_padrao (
        id INT PRIMARY KEY AUTO_INCREMENT,
        empresa_id INT NOT NULL,
        dia_semana ENUM('domingo','segunda','terca','quarta','quinta','sexta','sabado'),
        tag VARCHAR(50),
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    );
    ");

        // AGENDA EXCECAO
        $pdo->exec("CREATE TABLE IF NOT EXISTS agenda_excecao (
        id INT PRIMARY KEY AUTO_INCREMENT,
        empresa_id INT NOT NULL,
        data_excecao DATE NOT NULL,
        tag VARCHAR(50),
        observacao TEXT,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    );
    ");

        // AGENDAMENTO
        $pdo->exec("CREATE TABLE IF NOT EXISTS agendamento (
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
    ");

        // AVALIACAO
        $pdo->exec("CREATE TABLE IF NOT EXISTS avaliacao (
        id INT PRIMARY KEY AUTO_INCREMENT,
        agendamento_id INT NOT NULL,
        cliente_id INT NOT NULL,
        estrelas INT CHECK (estrelas BETWEEN 1 AND 5),
        feedback TEXT,
        resposta_empresa TEXT,
        FOREIGN KEY (agendamento_id) REFERENCES agendamento(id),
        FOREIGN KEY (cliente_id) REFERENCES usuario(id)
    );
    ");

        // MENSAGEM
        $pdo->exec("CREATE TABLE IF NOT EXISTS mensagem (
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
    ");

        // REGRA EMPRESA
        $pdo->exec("CREATE TABLE IF NOT EXISTS regra_empresa (
        id INT PRIMARY KEY AUTO_INCREMENT,
        empresa_id INT NOT NULL,
        tipo ENUM('cancelamento','adiamento','geral'),
        prazo_horas INT,
        taxa DECIMAL(10,2),
        mensagem_padrao TEXT,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    );
    ");

        // DASHBOARD EMPRESA
        $pdo->exec("CREATE TABLE IF NOT EXISTS dashboard_empresa (
        id INT PRIMARY KEY AUTO_INCREMENT,
        empresa_id INT NOT NULL,
        total_clientes INT DEFAULT 0,
        total_servicos INT DEFAULT 0,
        total_cancelamentos INT DEFAULT 0,
        total_adiamentos INT DEFAULT 0,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    );
    ");

        // FAVORITO
        $pdo->exec("CREATE TABLE IF NOT EXISTS favorito (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cliente_id INT NOT NULL,
        empresa_id INT NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES usuario(id),
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    );
    ");

        // PERFIL CLIENTE
        $pdo->exec("CREATE TABLE IF NOT EXISTS perfil_cliente (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cliente_id INT NOT NULL,
        cpf VARCHAR(20),
        FOREIGN KEY (cliente_id) REFERENCES usuario(id)
    );
    ");
    } catch (\PDOException $e) {
        die("Erro: " . $e->getMessage());
    }
