'use strict';

function strip(cnpj) {
  return String(cnpj).replace(/[^\d]/g, '');
}

/**
 * Valida CNPJ usando o algoritmo oficial.
 * Retorna true se o CNPJ for matematicamente válido.
 */
function validate(cnpj) {
  const c = strip(cnpj);
  if (c.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(c)) return false;

  const calc = (len) => {
    const weights = len === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < len; i++) sum += parseInt(c[i]) * weights[i];
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  };

  return calc(12) === parseInt(c[12]) && calc(13) === parseInt(c[13]);
}

/** Formata CNPJ com máscara 00.000.000/0000-00 */
function format(cnpj) {
  const c = strip(cnpj);
  return c.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

module.exports = { validate, format, strip };
