<?php

class CPFService
{
    public static function validar(string $cpf): bool
    {
        $cpf = preg_replace('/\D/', '', $cpf);

        if (strlen($cpf) != 11) return false;
        if (preg_match('/(\d)\1{10}/', $cpf)) return false;

        for ($t = 9; $t < 11; $t++) {
            $soma = 0;
            for ($i = 0; $i < $t; $i++) {
                $soma += $cpf[$i] * (($t + 1) - $i);
            }
            $resto = ($soma * 10) % 11;
            if ($resto == 10) $resto = 0;
            if ($cpf[$t] != $resto) return false;
        }

        return true;
    }
}