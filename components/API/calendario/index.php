<?php

declare(strict_types=1);

/**
 * index.php — Ponto de entrada da API REST
 *
 * Rotas:
 *
 *  TAGS (empresa gerencia)
 *  GET    /api/tags?empresa_id=1
 *  POST   /api/tags                      body: { empresa_id, nome, label, cor, aceita_agendamento, info }
 *  PUT    /api/tags/{id}?empresa_id=1    body: { nome, label, cor, aceita_agendamento, info }
 *  DELETE /api/tags/{id}?empresa_id=1
 *
 *  REGRAS (empresa gerencia)
 *  GET    /api/regras?empresa_id=1
 *  POST   /api/regras                    body: { empresa_id, tag_id, tipo, ...campos de condição }
 *  PUT    /api/regras/{id}?empresa_id=1  body: { tag_id, tipo, ...campos de condição }
 *  PATCH  /api/regras/{id}/ativo?empresa_id=1  body: { ativo: true|false }
 *  DELETE /api/regras/{id}?empresa_id=1
 *
 *  CALENDÁRIO (cliente consulta)
 *  GET    /api/calendario/{empresa_id}/{ano}/{mes}
 *  GET    /api/calendario/{empresa_id}/data/{YYYY-MM-DD}
 */

require_once __DIR__ . '/vendor/autoload.php';

use Calendario\Api\Response;
use Calendario\Models\TagModel;
use Calendario\Models\RegraModel;
use Calendario\Services\CalendarioService;

// CORS — ajuste conforme seu ambiente
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Parse da URI ──────────────────────────────────────────────
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = rtrim(preg_replace('#/+#', '/', $uri), '/');
$method = strtoupper($_SERVER['REQUEST_METHOD']);
$body   = json_decode(file_get_contents('php://input'), true) ?? [];

// Remove prefixo /api
$path  = preg_replace('#^/api#', '', $uri);
$parts = array_values(array_filter(explode('/', $path)));

// ── Roteamento ────────────────────────────────────────────────
try {
    $resource = $parts[0] ?? '';

    match ($resource) {
        'tags'       => routeTags($method, $parts, $body),
        'regras'     => routeRegras($method, $parts, $body),
        'calendario' => routeCalendario($method, $parts),
        default      => Response::error('Rota não encontrada.', 404),
    };
} catch (\InvalidArgumentException $e) {
    Response::error($e->getMessage(), 422);
} catch (\RuntimeException $e) {
    Response::error($e->getMessage(), $e->getCode() ?: 500);
} catch (\Throwable $e) {
    Response::error('Erro interno: ' . $e->getMessage(), 500);
}

// ═════════════════════════════════════════════════════════════
//  TAGS
// ═════════════════════════════════════════════════════════════

function routeTags(string $method, array $parts, array $body): void
{
    $model     = new TagModel();
    $empresaId = (int) ($_GET['empresa_id'] ?? $body['empresa_id'] ?? 0);
    $id        = isset($parts[1]) ? (int) $parts[1] : null;

    if (!$empresaId) {
        Response::error('"empresa_id" é obrigatório.', 422);
    }

    match ($method) {
        'GET' => $id
            ? Response::json($model->buscarPorId($id, $empresaId) ?? Response::error('Tag não encontrada.', 404))
            : Response::json($model->listarPorEmpresa($empresaId)),

        'POST' => Response::json(['id' => $model->criar($empresaId, $body)], 201),

        'PUT' => $id
            ? Response::json(['atualizado' => $model->atualizar($id, $empresaId, $body)])
            : Response::error('ID da tag é obrigatório.', 422),

        'DELETE' => $id
            ? Response::json(['deletado' => $model->deletar($id, $empresaId)])
            : Response::error('ID da tag é obrigatório.', 422),

        default => Response::error('Método não suportado.', 405),
    };
}

// ═════════════════════════════════════════════════════════════
//  REGRAS
// ═════════════════════════════════════════════════════════════

function routeRegras(string $method, array $parts, array $body): void
{
    $model     = new RegraModel();
    $empresaId = (int) ($_GET['empresa_id'] ?? $body['empresa_id'] ?? 0);
    $id        = isset($parts[1]) && is_numeric($parts[1]) ? (int) $parts[1] : null;
    $subAction = $parts[2] ?? null; // ex: "ativo"

    if (!$empresaId) {
        Response::error('"empresa_id" é obrigatório.', 422);
    }

    // PATCH /regras/{id}/ativo
    if ($method === 'PATCH' && $id && $subAction === 'ativo') {
        if (!isset($body['ativo'])) {
            Response::error('Campo "ativo" é obrigatório.', 422);
        }
        Response::json(['atualizado' => $model->toggleAtivo($id, $empresaId, (bool) $body['ativo'])]);
    }

    match ($method) {
        'GET' => $id
            ? Response::json($model->buscarPorId($id, $empresaId) ?? Response::error('Regra não encontrada.', 404))
            : Response::json($model->listarAtivas($empresaId)),

        'POST' => Response::json(['id' => $model->criar($empresaId, $body)], 201),

        'PUT' => $id
            ? Response::json(['atualizado' => $model->atualizar($id, $empresaId, $body)])
            : Response::error('ID da regra é obrigatório.', 422),

        'DELETE' => $id
            ? Response::json(['deletado' => $model->deletar($id, $empresaId)])
            : Response::error('ID da regra é obrigatório.', 422),

        default => Response::error('Método não suportado.', 405),
    };
}

// ═════════════════════════════════════════════════════════════
//  CALENDÁRIO
// ═════════════════════════════════════════════════════════════

function routeCalendario(string $method, array $parts): void
{
    if ($method !== 'GET') {
        Response::error('Apenas GET é suportado nesta rota.', 405);
    }

    // /calendario/{empresa_id}/{ano}/{mes}
    // /calendario/{empresa_id}/data/{YYYY-MM-DD}
    $empresaId = isset($parts[1]) ? (int) $parts[1] : 0;

    if (!$empresaId) {
        Response::error('"empresa_id" é obrigatório na URL.', 422);
    }

    $service = new CalendarioService();

    if (isset($parts[2]) && $parts[2] === 'data') {
        // Consulta de data única
        $dataStr = $parts[3] ?? '';
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dataStr)) {
            Response::error('Data inválida. Use o formato YYYY-MM-DD.', 422);
        }
        Response::json($service->resolverData($empresaId, $dataStr));
    }

    // Consulta mensal
    $ano = isset($parts[2]) ? (int) $parts[2] : (int) date('Y');
    $mes = isset($parts[3]) ? (int) $parts[3] : (int) date('n');

    if ($mes < 1 || $mes > 12) {
        Response::error('Mês inválido (1–12).', 422);
    }

    Response::json($service->resolverMes($empresaId, $ano, $mes));
}
