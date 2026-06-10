<?php

class PerfilClienteService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function buscarCliente(int $userId): ?array
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                u.id,
                u.email,
                c.nome,
                c.cpf,
                c.data_nascimento,
                c.telefone,
                c.verificado
            FROM usuario u
            JOIN cliente c ON c.id = u.id
            WHERE u.id = ?
        ");

        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}