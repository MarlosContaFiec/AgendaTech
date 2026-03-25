<?php

namespace APP\Services;

use PDO;
use Exception;

class CadastrarRegraService {

    private PDO $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function cadastrar(array $dados): int {

        if (empty($dados['empresa_id'])) {
            throw new Exception('Empresa não informada');
        }

        if (empty($dados['tag_id'])) {
            throw new Exception('Tag não informada');
        }

        if (empty($dados['tipo'])) {
            throw new Exception('Tipo da regra é obrigatório');
        }

        $stmt = $this->pdo->prepare("
            INSERT INTO regras
            (
                empresa_id, tag_id, tipo,
                dia_semana, qnd_ocorre, mes,
                unico_dia, unico_mes, unico_ano, unico_repete_anual,
                prioridade, ativo
            )
            VALUES
            (
                :empresa_id, :tag_id, :tipo,
                :dia_semana, :qnd_ocorre, :mes,
                :unico_dia, :unico_mes, :unico_ano, :repete,
                :prioridade, :ativo
            )
        ");

        $stmt->execute([
            ':empresa_id' => $dados['empresa_id'],
            ':tag_id' => $dados['tag_id'],
            ':tipo' => $dados['tipo'],

            ':dia_semana' => $dados['dia_semana'] ?? null,
            ':qnd_ocorre' => $dados['qnd_ocorre'] ?? null,
            ':mes' => $dados['mes'] ?? null,

            ':unico_dia' => $dados['unico_dia'] ?? null,
            ':unico_mes' => $dados['unico_mes'] ?? null,
            ':unico_ano' => $dados['unico_ano'] ?? null,
            ':repete' => $dados['unico_repete_anual'] ?? 0,

            ':prioridade' => $dados['prioridade'] ?? 10,
            ':ativo' => $dados['ativo'] ?? 1,
        ]);

        return (int) $this->pdo->lastInsertId();
    }
}