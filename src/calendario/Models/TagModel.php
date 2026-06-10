<?php

declare(strict_types=1);

namespace Calendario\Models;

use Calendario\Config\Database;
use InvalidArgumentException;
use PDO;

final class TagModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::get();
    }

    // ──────────────────────────────────────────────
    //  Listagem
    // ──────────────────────────────────────────────

    public function listarPorEmpresa(int $empresaId): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM tags WHERE empresa_id = :empresa_id ORDER BY nome'
        );
        $stmt->execute([':empresa_id' => $empresaId]);
        return $stmt->fetchAll();
    }

    public function buscarPorId(int $id, int $empresaId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM tags WHERE id = :id AND empresa_id = :empresa_id'
        );
        $stmt->execute([':id' => $id, ':empresa_id' => $empresaId]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    // ──────────────────────────────────────────────
    //  Escrita
    // ──────────────────────────────────────────────

    public function criar(int $empresaId, array $data): int
    {
        $this->validar($data);

        $stmt = $this->db->prepare('
            INSERT INTO tags (empresa_id, nome, label, cor, aceita_agendamento, info)
            VALUES (:empresa_id, :nome, :label, :cor, :aceita_agendamento, :info)
        ');

        $stmt->execute([
            ':empresa_id'         => $empresaId,
            ':nome'               => strtolower(trim($data['nome'])),
            ':label'              => trim($data['label']),
            ':cor'                => $data['cor'] ?? '#888888',
            ':aceita_agendamento' => (int) ($data['aceita_agendamento'] ?? 0),
            ':info'               => $data['info'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function atualizar(int $id, int $empresaId, array $data): bool
    {
        $this->validar($data);

        $stmt = $this->db->prepare('
            UPDATE tags
            SET nome = :nome,
                label = :label,
                cor = :cor,
                aceita_agendamento = :aceita_agendamento,
                info = :info
            WHERE id = :id AND empresa_id = :empresa_id
        ');

        $stmt->execute([
            ':id'                 => $id,
            ':empresa_id'         => $empresaId,
            ':nome'               => strtolower(trim($data['nome'])),
            ':label'              => trim($data['label']),
            ':cor'                => $data['cor'] ?? '#888888',
            ':aceita_agendamento' => (int) ($data['aceita_agendamento'] ?? 0),
            ':info'               => $data['info'] ?? null,
        ]);

        return $stmt->rowCount() > 0;
    }

    public function deletar(int $id, int $empresaId): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM tags WHERE id = :id AND empresa_id = :empresa_id'
        );
        $stmt->execute([':id' => $id, ':empresa_id' => $empresaId]);
        return $stmt->rowCount() > 0;
    }

    // ──────────────────────────────────────────────
    //  Validação
    // ──────────────────────────────────────────────

    private function validar(array $data): void
    {
        if (empty($data['nome'])) {
            throw new InvalidArgumentException('Campo "nome" é obrigatório.');
        }
        if (empty($data['label'])) {
            throw new InvalidArgumentException('Campo "label" é obrigatório.');
        }
        if (!empty($data['cor']) && !preg_match('/^#[0-9A-Fa-f]{6}$/', $data['cor'])) {
            throw new InvalidArgumentException('Campo "cor" deve ser um hex válido (#RRGGBB).');
        }
    }
}
