<?php 

namespace APP\Services;

use PDO;
use Exception;

class CadastrarServicoService {
    private PDO $pdo;
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }
    public function cadastrar(array $dados): int {
        if (empty($dados['empresa_id'])) {
            throw new Exception('Empresa não informada');
        }
        if (empty($dados['nome'])) {
            throw new Exception('Nome do serviço é obrigatorio');
        }
        if (empty($dados['duracao_minutos'] <= 0)) {
            throw new Exception('Duração inválida');
        }
        if (empty($dados['preco_base'] < 0)) {
            throw new Exception('Preço invalido');
        }
    $sql = "
            INSERT INTO servico 
            (empresa_id, nome, descricao, duracao_minutos, preco_base, ativo)
            VALUES 
            (:empresa_id, :nome, :descricao, :duracao_minutos, :preco_base, :ativo)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([ ':empresa_id'=> $dados['empresa_id'],
            ':nome'=> $dados['nome'],
            ':descricao'=> $dados['descricao'] ?? null,
            ':duracao_minutos'=> $dados['duracao_minutos'],
            ':preco_base'=> $dados['preco_base'],
            ':ativo'=> $dados['ativo'] ?? true,
        ]);

        return (int) $this->pdo->lastInsertId();
    }
}

?>