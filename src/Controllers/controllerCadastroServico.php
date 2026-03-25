<?php

namespace App\Controllers;

use App\Services\CadastrarServicoService;
use PDO;
use Exception;

class ServicoController
{
    private CadastrarServicoService $service;

    public function __construct(PDO $pdo)
    {
        $this->service = new CadastrarServicoService($pdo);
    }

    public function store(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo 'Método não permitido';
            return;
        }

        try {

            $dados = [
                'empresa_id'      => $_SESSION['empresa_id'],
                'nome'            => trim($_POST['nome'] ?? ''),
                'descricao'       => trim($_POST['descricao'] ?? ''),
                'duracao_minutos' => (int) ($_POST['duracao_minutos'] ?? 0),
                'preco_base'      => (float) ($_POST['preco_base'] ?? 0),
                'ativo'           => isset($_POST['ativo']),
            ];

            $idServico = $this->service->cadastrar($dados);

            $_SESSION['flash_success'] = 'Serviço cadastrado com sucesso!';
            header('Location: /empresa/servicos');
            exit;

        } catch (Exception $e) {

            $_SESSION['flash_error'] = $e->getMessage();
            header('Location: /empresa/servicos/criar');
            exit;
        }
    }
}