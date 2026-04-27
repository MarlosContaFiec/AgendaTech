'use strict';

/** Remove máscara do CPF */
function strip(cpf) {
  return String(cpf).replace(/[^\d]/g, '');
}

/**
 * Valida CPF usando o algoritmo oficial da Receita Federal.
 * Retorna true se o CPF for matematicamente válido.
 */
function validate(cpf) {
  const c = strip(cpf);
  if (c.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(c)) return false; 

  const calc = (len) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(c[i]) * (len + 1 - i);
    const rem = (sum * 10) % 11;
    return rem === 10 || rem === 11 ? 0 : rem;
  };

  return calc(9) === parseInt(c[9]) && calc(10) === parseInt(c[10]);
}

/** Formata CPF com máscara 000.000.000-00 */
function format(cpf) {
  const c = strip(cpf);
  return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

module.exports = { validate, format, strip };
