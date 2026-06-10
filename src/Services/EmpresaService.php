<?php

class EmpresaService
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function cnpjExiste(string $cnpj): bool
    {
        $stmt = $this->pdo->prepare("SELECT 1 FROM empresa WHERE cnpj = ?");
        $stmt->execute([$cnpj]);
        return $stmt->rowCount() > 0;
    }

    public function validarSenha(string $senha, string $confirmar): ?string
    {
        if (strlen($senha) < 8) return "Senha muito curta";
        if (!preg_match('/[A-Z]/', $senha)) return "Precisa letra maiúscula";
        if (!preg_match('/[a-z]/', $senha)) return "Precisa letra minúscula";
        if (!preg_match('/[0-9]/', $senha)) return "Precisa número";
        if (!preg_match('/[!@#$%&*]/', $senha)) return "Precisa caractere especial";
        if ($senha !== $confirmar) return "Senhas não coincidem";

        return null;
    }
}