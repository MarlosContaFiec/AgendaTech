 <?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$host    = $_ENV['DB_HOST'];
$port    = $_ENV['DB_PORT'];
$db      = $_ENV['DB_NAME'];
$user    = $_ENV['DB_USER'];
$pass    = $_ENV['DB_PASS'];
$charset = 'utf8mb4';

$maxTentativas = 15;
$tentativa = 0;

while ($tentativa < $maxTentativas) {
    try {
        $pdo = new PDO(
            "mysql:host=$host;port=$port;charset=$charset",
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
        break;
    } catch (PDOException $e) {
        $tentativa++;
        sleep(2);
    }
}

if (!isset($pdo)) {
    die("❌ Erro na conexão com o banco (timeout Docker)");
}

if (!isset($pdo)) {
    die("❌ Banco não respondeu após várias tentativas.");
}

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$db`");

    // USUARIO
        $pdo->exec("CREATE TABLE IF NOT EXISTS usuario (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        tipo VARCHAR(20) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        ativo BOOLEAN DEFAULT TRUE,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        foto VARCHAR(100)
    )"
    );

    // CLIENTE
        $pdo->exec("CREATE TABLE IF NOT EXISTS cliente (
        id INT UNSIGNED PRIMARY KEY,
        nome VARCHAR(150) NOT NULL,
        cpf VARCHAR(20) UNIQUE,
        verificado BOOLEAN NULL,
        data_nascimento DATE NULL,
        telefone VARCHAR(15) NULL,
        FOREIGN KEY (id) REFERENCES usuario(id) ON DELETE CASCADE
    )"
    );

    // EMPRESA
        $pdo->exec("CREATE TABLE IF NOT EXISTS empresa (
        id INT UNSIGNED PRIMARY KEY,
        cnpj VARCHAR(20) UNIQUE,
        razao_social VARCHAR(200),
        nome_fantasia VARCHAR(200),
        telefone VARCHAR(15) NULL,
        cep VARCHAR(20) NULL,
        FOREIGN KEY (id) REFERENCES usuario(id) ON DELETE CASCADE
    )"
    );

    // EMPRESA PROFILE
        $pdo->exec("CREATE TABLE IF NOT EXISTS empresaProfile (
        id INT PRIMARY KEY AUTO_INCREMENT,
        descricao TEXT,
        logo_url VARCHAR(255),
        cor_primaria VARCHAR(18),
        cor_secundaria VARCHAR(18),
        cidade VARCHAR(100),
        ativo BOOLEAN DEFAULT TRUE,
        empresa_id INT UNSIGNED UNIQUE NOT NULL,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    )"
    );
    //Serviço agenda
        $pdo->exec("CREATE TABLE IF NOT EXISTS servico (
            id INT AUTO_INCREMENT PRIMARY KEY,
            empresa_id INT UNSIGNED NOT NULL,
            nome VARCHAR(150) NOT NULL,
            descricao TEXT,
            duracao_minutos INT NOT NULL,
            preco_base DECIMAL(10,2) NOT NULL,
            ativo BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (empresa_id) REFERENCES empresa(id)
        )"
        );

    //AGENDAMENTO
        $pdo->exec("CREATE TABLE IF NOT EXISTS agendamento 
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            cliente_id INT UNSIGNED NOT NULL,
            servico_id INT NOT NULL,
            data_agendamento DATE NOT NULL,
            hora_inicio TIME NOT NULL,
            hora_fim TIME NOT NULL,
            status_agendamento ENUM('confirmado','cancelado','pendente','concluido') DEFAULT 'pendente',
            FOREIGN KEY (cliente_id) REFERENCES cliente(id),
            FOREIGN KEY (servico_id) REFERENCES servico(id)
        )"
        );

    // AVALIACAO
        $pdo->exec("CREATE TABLE IF NOT EXISTS avaliacao 
        (
        id INT PRIMARY KEY AUTO_INCREMENT,
        agendamento_id INT NOT NULL,
        cliente_id INT UNSIGNED NOT NULL,
        estrelas INT CHECK (estrelas BETWEEN 1 AND 5),
        feedback TEXT,
        resposta_empresa TEXT,
        FOREIGN KEY (agendamento_id) REFERENCES agendamento(id),
        FOREIGN KEY (cliente_id) REFERENCES usuario(id)
        )"
        );
    // TAGS
        $pdo->exec("CREATE TABLE IF NOT EXISTS tags 
        (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            empresa_id INT UNSIGNED NOT NULL,
            nome VARCHAR(80) NOT NULL,
            label VARCHAR(120) NOT NULL,
            cor VARCHAR(7) NOT NULL DEFAULT '#888888',
            aceita_agendamento TINYINT(1) NOT NULL DEFAULT 0,
            info TEXT,
            criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY tag_empresa (empresa_id, nome),
            FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
        )"
        );
    // REGRAS
        $pdo->exec("CREATE TABLE IF NOT EXISTS regras 
        (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            empresa_id INT UNSIGNED NOT NULL,
            tag_id INT UNSIGNED NOT NULL,
            tipo ENUM('padrao','excecao','unico') NOT NULL,

            dia_semana TINYINT UNSIGNED NULL,
            qnd_ocorre TINYINT UNSIGNED NULL,
            mes TINYINT UNSIGNED NULL,

            unico_dia TINYINT UNSIGNED NULL,
            unico_mes TINYINT UNSIGNED NULL,
            unico_ano SMALLINT UNSIGNED NULL,
            unico_repete_anual TINYINT(1) NOT NULL DEFAULT 0,

            prioridade TINYINT UNSIGNED NOT NULL DEFAULT 10,
            ativo TINYINT(1) NOT NULL DEFAULT 1,

            criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,

            INDEX idx_empresa_tipo (empresa_id, tipo),
            INDEX idx_empresa_ativo (empresa_id, ativo)
        )"
        );

    // MENSAGEM
        $pdo->exec("CREATE TABLE IF NOT EXISTS mensagem (
        id INT PRIMARY KEY AUTO_INCREMENT,
        empresa_id INT UNSIGNED NOT NULL,
        cliente_id INT UNSIGNED NOT NULL,
        tipo ENUM('cancelamento','confirmacao','lembrete','outro'),
        mensagem TEXT NOT NULL,
        automatica BOOLEAN DEFAULT FALSE,
        data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
        enviado_por ENUM('cliente','empresa'),
        FOREIGN KEY (empresa_id) REFERENCES empresa(id),
        FOREIGN KEY (cliente_id) REFERENCES usuario(id)
        )"
    );

    // REGRA EMPRESA
        $pdo->exec("CREATE TABLE IF NOT EXISTS regra_empresa (
        id INT PRIMARY KEY AUTO_INCREMENT,
        empresa_id INT UNSIGNED NOT NULL,
        tipo ENUM('cancelamento','adiamento','geral'),
        prazo_horas INT,
        taxa DECIMAL(10,2),
        mensagem_padrao TEXT,
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    )"
    );

    //indeces a ideia é o sql use os index automaticamente para acelerar a busca - tará comentado de onde é cada um
    try{
    // AGENDAMENTO
    try { $pdo->exec("CREATE INDEX idx_ag_empresa_data ON agendamento (empresa_id, data_agendamento)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    try { $pdo->exec("CREATE INDEX idx_ag_cliente ON agendamento (cliente_id)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    try { $pdo->exec("CREATE INDEX idx_ag_servico ON agendamento (servico_id)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    // MENSAGEM
    try { $pdo->exec("CREATE INDEX idx_msg_empresa ON mensagem (empresa_id)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    try { $pdo->exec("CREATE INDEX idx_msg_cliente ON mensagem (cliente_id)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    // AVALIACAO
    try { $pdo->exec("CREATE INDEX idx_av_agendamento ON avaliacao (agendamento_id)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    // SERVICO
    try { $pdo->exec("CREATE INDEX idx_servico_empresa ON servico (empresa_id)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    // TAGS / REGRAS
    try { $pdo->exec("CREATE INDEX idx_tags_empresa   ON tags (empresa_id)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    try { $pdo->exec("CREATE INDEX idx_regras_empresa ON regras (empresa_id)");
        } catch (PDOException $e) {
            //inginora pois não tem if not exists para index
        }
    } catch(Exception $e) {
        die("Erro na criação do index: " . $e->getMessage());
    }
    
 catch (PDOException $e) {
    die("Erro na conexão: " . $e->getMessage());
} catch (\Exception $e) {
    die("Erro inesperado: " . $e->getMessage());
}
