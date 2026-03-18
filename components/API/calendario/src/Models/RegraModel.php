<?php

declare(strict_types=1);

namespace Calendario\Models;

use Calendario\Config\Database;
use InvalidArgumentException;
use PDO;

final class RegraModel
{
    private PDO $db;

    // prioridades padrão por tipo
    private const PRIORIDADE = [
        'padrao'  => 10,
        'excecao' => 20,
        'unico'   => 30,
    ];

    public function __construct()
    {
        $this->db = Database::get();
    }

    // ──────────────────────────────────────────────
    //  Listagem
    // ──────────────────────────────────────────────

    /** Retorna todas as regras ativas de uma empresa (com dados da tag). */
    public function listarAtivas(int $empresaId): array
    {
        $stmt = $this->db->prepare('
            SELECT r.*, t.nome AS tag_nome, t.label AS tag_label,
                   t.cor, t.aceita_agendamento, t.info AS tag_info
            FROM regras r
            JOIN tags t ON t.id = r.tag_id
            WHERE r.empresa_id = :empresa_id
              AND r.ativo = 1
            ORDER BY r.prioridade ASC, r.id ASC
        ');
        $stmt->execute([':empresa_id' => $empresaId]);
        return $stmt->fetchAll();
    }

    public function buscarPorId(int $id, int $empresaId): ?array
    {
        $stmt = $this->db->prepare('
            SELECT r.*, t.nome AS tag_nome, t.label AS tag_label,
                   t.cor, t.aceita_agendamento, t.info AS tag_info
            FROM regras r
            JOIN tags t ON t.id = r.tag_id
            WHERE r.id = :id AND r.empresa_id = :empresa_id
        ');
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

        $tipo       = $data['tipo'];
        $prioridade = $data['prioridade'] ?? self::PRIORIDADE[$tipo];

        $stmt = $this->db->prepare('
            INSERT INTO regras (
                empresa_id, tag_id, tipo,
                dia_semana, nth_do_mes, mes,
                unico_dia, unico_mes, unico_ano, unico_repete_anual,
                prioridade, ativo
            ) VALUES (
                :empresa_id, :tag_id, :tipo,
                :dia_semana, :nth_do_mes, :mes,
                :unico_dia, :unico_mes, :unico_ano, :unico_repete_anual,
                :prioridade, 1
            )
        ');

        $stmt->execute($this->mapParams($empresaId, $data, $prioridade));
        return (int) $this->db->lastInsertId();
    }

    public function atualizar(int $id, int $empresaId, array $data): bool
    {
        $this->validar($data);

        $tipo       = $data['tipo'];
        $prioridade = $data['prioridade'] ?? self::PRIORIDADE[$tipo];

        $params = $this->mapParams($empresaId, $data, $prioridade);
        $params[':id'] = $id;

        $stmt = $this->db->prepare('
            UPDATE regras SET
                tag_id              = :tag_id,
                tipo                = :tipo,
                dia_semana          = :dia_semana,
                nth_do_mes          = :nth_do_mes,
                mes                 = :mes,
                unico_dia           = :unico_dia,
                unico_mes           = :unico_mes,
                unico_ano           = :unico_ano,
                unico_repete_anual  = :unico_repete_anual,
                prioridade          = :prioridade
            WHERE id = :id AND empresa_id = :empresa_id
        ');

        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function toggleAtivo(int $id, int $empresaId, bool $ativo): bool
    {
        $stmt = $this->db->prepare('
            UPDATE regras SET ativo = :ativo
            WHERE id = :id AND empresa_id = :empresa_id
        ');
        $stmt->execute([':ativo' => (int) $ativo, ':id' => $id, ':empresa_id' => $empresaId]);
        return $stmt->rowCount() > 0;
    }

    public function deletar(int $id, int $empresaId): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM regras WHERE id = :id AND empresa_id = :empresa_id'
        );
        $stmt->execute([':id' => $id, ':empresa_id' => $empresaId]);
        return $stmt->rowCount() > 0;
    }

    // ──────────────────────────────────────────────
    //  Helpers
    // ──────────────────────────────────────────────

    private function mapParams(int $empresaId, array $data, int $prioridade): array
    {
        return [
            ':empresa_id'         => $empresaId,
            ':tag_id'             => (int) $data['tag_id'],
            ':tipo'               => $data['tipo'],
            ':dia_semana'         => isset($data['dia_semana'])  ? (int) $data['dia_semana']  : null,
            ':nth_do_mes'         => isset($data['nth_do_mes'])  ? (int) $data['nth_do_mes']  : null,
            ':mes'                => isset($data['mes'])         ? (int) $data['mes']         : null,
            ':unico_dia'          => isset($data['unico_dia'])   ? (int) $data['unico_dia']   : null,
            ':unico_mes'          => isset($data['unico_mes'])   ? (int) $data['unico_mes']   : null,
            ':unico_ano'          => isset($data['unico_ano'])   ? (int) $data['unico_ano']   : null,
            ':unico_repete_anual' => (int) ($data['unico_repete_anual'] ?? 0),
            ':prioridade'         => $prioridade,
        ];
    }

    private function validar(array $data): void
    {
        $tipos = ['padrao', 'excecao', 'unico'];
        if (empty($data['tipo']) || !in_array($data['tipo'], $tipos, true)) {
            throw new InvalidArgumentException('Campo "tipo" deve ser: padrao, excecao ou unico.');
        }
        if (empty($data['tag_id'])) {
            throw new InvalidArgumentException('Campo "tag_id" é obrigatório.');
        }

        if ($data['tipo'] === 'unico') {
            if (!isset($data['unico_dia']) || !isset($data['unico_mes'])) {
                throw new InvalidArgumentException('Regra única exige "unico_dia" e "unico_mes".');
            }
        } else {
            if (!isset($data['dia_semana'])) {
                throw new InvalidArgumentException('Regra padrão/exceção exige "dia_semana".');
            }
        }
    }
}
