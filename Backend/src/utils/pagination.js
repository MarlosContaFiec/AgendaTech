'use strict';

const MAX_LIMIT = 100;

function parsePagination(query, defaults = {}) {
  let pagina = parseInt(query.pagina, 10);
  if (!Number.isFinite(pagina) || pagina < 1) pagina = defaults.pagina || 1;

  let limite = parseInt(query.limite, 10);
  if (!Number.isFinite(limite) || limite < 1) limite = defaults.limite || 20;
  if (limite > MAX_LIMIT) limite = MAX_LIMIT;

  const offset = (pagina - 1) * limite;
  return { pagina, limite, offset };
}

/**
 * Clamp a single integer to a safe range.
 * Returns `fallback` when the input is not a finite positive integer.
 */
function safeInt(value, fallback = 0, max = MAX_LIMIT) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.min(n, max);
}

module.exports = { parsePagination, safeInt, MAX_LIMIT };
