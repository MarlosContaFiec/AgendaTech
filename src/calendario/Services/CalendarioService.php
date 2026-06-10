<?php

declare(strict_types=1);

namespace Calendario\Services;

use Calendario\Models\RegraModel;
use DateTimeImmutable;
use DateInterval;

/**
 * CalendarioService
 *
 * Resolve quais tags se aplicam a cada dia de um intervalo,
 * respeitando a hierarquia: padrão → exceção sobrescreve → único aparece junto.
 *
 * Regra de resolução:
 *   1. Coleta todos os padrões que batem com o dia.
 *   2. Verifica se alguma exceção bate com o mesmo dia E mesma condição (dia_semana+nth).
 *      Se sim, remove o padrão e aplica a exceção no lugar.
 *   3. Aplica os únicos por cima (sempre aparecem, não cancelam nada).
 *   4. O campo `aceita_agendamento` final é o do item de maior prioridade.
 */
final class CalendarioService
{
    private RegraModel $regraModel;

    public function __construct()
    {
        $this->regraModel = new RegraModel();
    }

    // ──────────────────────────────────────────────────────────
    //  API pública
    // ──────────────────────────────────────────────────────────

    /**
     * Retorna os dias de um mês com suas tags resolvidas.
     *
     * @return array<int, array{
     *   data: string,
     *   dia: int,
     *   dia_semana: int,
     *   aceita_agendamento: bool,
     *   tags: list<array>
     * }>
     */
    public function resolverMes(int $empresaId, int $ano, int $mes): array
    {
        $regras    = $this->regraModel->listarAtivas($empresaId);
        $diasNoMes = (int) (new DateTimeImmutable("$ano-$mes-01"))->format('t');
        $resultado = [];

        for ($dia = 1; $dia <= $diasNoMes; $dia++) {
            $data        = new DateTimeImmutable(sprintf('%04d-%02d-%02d', $ano, $mes, $dia));
            $diaSemana   = (int) $data->format('w'); // 0=dom … 6=sáb
            $mesIdx      = (int) $data->format('n') - 1; // 0-based

            $tags = $this->resolverDia($regras, $ano, $mesIdx, $dia, $diaSemana);

            // aceita_agendamento = true só se TODAS as tags ativas permitirem
            $aceitaAgendamento = empty($tags)
                ? true
                : !in_array(false, array_column($tags, 'aceita_agendamento'), true);

            $resultado[] = [
                'data'               => $data->format('Y-m-d'),
                'dia'                => $dia,
                'dia_semana'         => $diaSemana,
                'aceita_agendamento' => $aceitaAgendamento,
                'tags'               => array_values($tags),
            ];
        }

        return $resultado;
    }

    /**
     * Resolve um único dia.
     */
    public function resolverData(int $empresaId, string $dataStr): array
    {
        $data      = new DateTimeImmutable($dataStr);
        $ano       = (int) $data->format('Y');
        $mesIdx    = (int) $data->format('n') - 1;
        $dia       = (int) $data->format('j');
        $diaSemana = (int) $data->format('w');

        $regras = $this->regraModel->listarAtivas($empresaId);
        $tags   = $this->resolverDia($regras, $ano, $mesIdx, $dia, $diaSemana);

        $aceitaAgendamento = empty($tags)
            ? true
            : !in_array(false, array_column($tags, 'aceita_agendamento'), true);

        return [
            'data'               => $data->format('Y-m-d'),
            'dia'                => $dia,
            'dia_semana'         => $diaSemana,
            'aceita_agendamento' => $aceitaAgendamento,
            'tags'               => array_values($tags),
        ];
    }

    // ──────────────────────────────────────────────────────────
    //  Lógica interna de resolução
    // ──────────────────────────────────────────────────────────

    private function resolverDia(
        array $regras,
        int $ano,
        int $mesIdx,   // 0-based
        int $dia,
        int $diaSemana
    ): array {
        $padroes  = [];
        $excecoes = [];
        $unicos   = [];

        foreach ($regras as $r) {
            match ($r['tipo']) {
                'padrao'  => $this->testePadrao($r, $ano, $mesIdx, $dia, $diaSemana)  && ($padroes[]  = $r),
                'excecao' => $this->testePadrao($r, $ano, $mesIdx, $dia, $diaSemana)  && ($excecoes[] = $r),
                'unico'   => $this->testeUnico($r, $ano, $mesIdx, $dia)               && ($unicos[]   = $r),
            };
        }

        // Remove padrões que têm exceção cobrindo a mesma condição de disparo
        $padroesFiltrados = array_filter(
            $padroes,
            fn($p) => !$this->excecaoCobre($excecoes, $p)
        );

        $aplicadas = [...$padroesFiltrados, ...$excecoes, ...$unicos];

        // Formata para retorno
        return array_map(fn($r) => [
            'regra_id'           => (int) $r['id'],
            'tipo'               => $r['tipo'],
            'tag_nome'           => $r['tag_nome'],
            'tag_label'          => $r['tag_label'],
            'cor'                => $r['cor'],
            'aceita_agendamento' => (bool) $r['aceita_agendamento'],
            'info'               => $r['tag_info'],
            'prioridade'         => (int) $r['prioridade'],
        ], $aplicadas);
    }

    /**
     * Verifica se uma regra do tipo padrão/exceção bate com o dia.
     */
    private function testePadrao(
        array $r,
        int $ano,
        int $mesIdx,
        int $dia,
        int $diaSemana
    ): bool {
        // Filtra por dia da semana
        if ($r['dia_semana'] !== null && (int) $r['dia_semana'] !== $diaSemana) {
            return false;
        }

        // Filtra por mês (exceção específica de mês)
        if ($r['mes'] !== null && (int) $r['mes'] !== $mesIdx) {
            return false;
        }

        // Filtra por Nª ocorrência do dia da semana no mês
        if ($r['nth_do_mes'] !== null && (int) $r['nth_do_mes'] > 0) {
            $nth = $this->nthOcorrencia($ano, $mesIdx + 1, $diaSemana, (int) $r['nth_do_mes']);
            if ($nth !== $dia) {
                return false;
            }
        }

        return true;
    }

    /**
     * Verifica se uma regra única bate com o dia.
     */
    private function testeUnico(array $r, int $ano, int $mesIdx, int $dia): bool
    {
        if ((int) $r['unico_dia'] !== $dia) {
            return false;
        }
        if ((int) $r['unico_mes'] !== $mesIdx) {
            return false;
        }
        // Se tem ano definido e não repete anualmente, verifica o ano exato
        if ($r['unico_ano'] !== null && !(bool) $r['unico_repete_anual']) {
            if ((int) $r['unico_ano'] !== $ano) {
                return false;
            }
        }
        return true;
    }

    /**
     * Retorna true se alguma exceção "cobre" o padrão dado
     * (mesma condição de dia_semana + nth_do_mes).
     */
    private function excecaoCobre(array $excecoes, array $padrao): bool
    {
        foreach ($excecoes as $e) {
            if ((int) $e['dia_semana'] === (int) $padrao['dia_semana']
                && (int) $e['nth_do_mes'] === (int) $padrao['nth_do_mes']
            ) {
                return true;
            }
        }
        return false;
    }

    /**
     * Retorna o dia do mês correspondente à Nª ocorrência de um dia da semana.
     * Ex: 1ª segunda de abril de 2025.
     */
    private function nthOcorrencia(int $ano, int $mes, int $diaSemana, int $nth): int
    {
        $count = 0;
        $total = (int) (new DateTimeImmutable("$ano-$mes-01"))->format('t');

        for ($d = 1; $d <= $total; $d++) {
            $ds = (int) (new DateTimeImmutable(sprintf('%04d-%02d-%02d', $ano, $mes, $d)))->format('w');
            if ($ds === $diaSemana) {
                $count++;
                if ($count === $nth) {
                    return $d;
                }
            }
        }

        return -1;
    }
}
