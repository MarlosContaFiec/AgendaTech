<?php

namespace APP\Services;

use PDO;
use Exception;

class CadastrarTagService {

    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function cadastrar(array $dados): int {

        if (empty($dados['empresa_id'])) {
            throw new Exception('Empresa não informada');
        }

        if (empty($dados['nome'])) {
            throw new Exception('Nome da tag é obrigatório');
        }

        if (empty($dados['label'])) {
            throw new Exception('Label da tag é obrigatória');
        }

        $stmt = $this->pdo->prepare("
            INSERT INTO tags
            (empresa_id, nome, label, cor, aceita_agendamento, info)
            VALUES
            (:empresa_id, :nome, :label, :cor, :aceita_agendamento, :info)
        ");

        $stmt->execute([
            ':empresa_id' => $dados['empresa_id'],
            ':nome' => $dados['nome'],
            ':label' => $dados['label'],
            ':cor' => $dados['cor'] ?? '#888888',
            ':aceita_agendamento' => $dados['aceita_agendamento'] ?? 0,
            ':info' => $dados['info'] ?? null,
        ]);

        return (int) $this->pdo->lastInsertId();
    }
}