<?php 

namespace APP\Services;

use PDO;
use Exception;

class CadastrarServicoService {
    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }
    public function cadastrar(array $dados): int {
        if (empty($dados['empresa_id'])) {
            throw new Exception('Empresa não informada');
        }
        if (empty($dados['nome'])) {
            throw new Exception('Nome do serviço é obrigatório');
        }
        if (!isset($dados['duracao_minutos']) || $dados['duracao_minutos'] <= 0) {
            throw new Exception('Duração inválida');
        }
        if (!isset($dados['preco_base']) || $dados['preco_base'] < 0) {
            throw new Exception('Preço inválido');
        }
        $this->pdo->beginTransaction();

        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO servico
                (empresa_id, nome, descricao, duracao_minutos, preco_base, ativo)
                VALUES
                (:empresa_id, :nome, :descricao, :duracao, :preco, :ativo)
            ");

            $stmt->execute([
                ':empresa_id' => $dados['empresa_id'],
                ':nome' => $dados['nome'],
                ':descricao' => $dados['descricao'] ?? null,
                ':duracao' => $dados['duracao_minutos'],
                ':preco' => $dados['preco_base'],
                ':ativo' => $dados['ativo'] ?? 1,
            ]);
            $servicoId = (int) $this->pdo->lastInsertId();

            if (!empty($dados['tags']) && is_array($dados['tags'])) {
                $stmtTag = $this->pdo->prepare("
                    INSERT INTO servico_tag (servico_id, tag_id)
                    VALUES (:servico_id, :tag_id)
                ");
                foreach ($dados['tags'] as $tagId) {
                    $stmtTag->execute([
                        ':servico_id' => $servicoId,
                        ':tag_id' => $tagId
                    ]);
                }
            }
            $this->pdo->commit();
            return $servicoId;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}