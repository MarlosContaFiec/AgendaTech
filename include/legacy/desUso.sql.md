//     // AGENDA EVENTO
    //     $pdo->exec("CREATE TABLE IF NOT EXISTS agenda_evento (
    //     id INT PRIMARY KEY AUTO_INCREMENT,
    //     empresa_id INT NOT NULL,
    //     tipo ENUM('unico','recorrente') NOT NULL,
    //     titulo VARCHAR(150),
    //     descricao TEXT,
    //     data_inicio DATE,
    //     data_fim DATE,
    //     tag VARCHAR(50),
    //     FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    // )"
    // );

    //     // AGENDA PADRAO
    //     $pdo->exec("CREATE TABLE IF NOT EXISTS agenda_padrao (
    //     id INT PRIMARY KEY AUTO_INCREMENT,
    //     empresa_id INT NOT NULL,
    //     dia_semana ENUM('domingo','segunda','terca','quarta','quinta','sexta','sabado'),
    //     tag VARCHAR(50),
    //     FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    // )"
    // );

    //     // AGENDA EXCECAO
    //     $pdo->exec("CREATE TABLE IF NOT EXISTS agenda_excecao (
    //     id INT PRIMARY KEY AUTO_INCREMENT,
    //     empresa_id INT NOT NULL,
    //     data_excecao DATE NOT NULL,
    //     tag VARCHAR(50),
    //     observacao TEXT,
    //     FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    // )"
    // );
            // PERFIL CLIENTE - Sem razao atualmente para existir
    //     $pdo->exec("CREATE TABLE IF NOT EXISTS perfil_cliente (
    //     id INT PRIMARY KEY AUTO_INCREMENT,
    //     cliente_id INT NOT NULL,
    //     FOREIGN KEY (cliente_id) REFERENCES usuario(id)
    // )"
    // );

        // FAVORITO
        $pdo->exec("CREATE TABLE IF NOT EXISTS favorito (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cliente_id INT NOT NULL,
        empresa_id INT UNSIGNED NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES usuario(id),
        FOREIGN KEY (empresa_id) REFERENCES empresa(id)
    )"
    );