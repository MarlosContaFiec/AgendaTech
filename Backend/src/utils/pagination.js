'use strict';

function parsePagination(query, defaults = {}) {
  const pagina = parseInt(query.pagina) || defaults.pagina || 1;
  const limite = parseInt(query.limite) || defaults.limite || 20;
  const offset = (pagina - 1) * limite;
  return { pagina, limite, offset };
}

module.exports = { parsePagination };
