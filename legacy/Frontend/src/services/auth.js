export function salvarTokens(access, refresh) {
  localStorage.setItem("tb_access", access);
  localStorage.setItem("tb_refresh", refresh);
}

export function getAccessToken() {
  return localStorage.getItem("tb_access");
}

export function getRefreshToken() {
  return localStorage.getItem("tb_refresh");
}

export function salvarTipo(tipo) {
  localStorage.setItem("tb_tipo", tipo);
}

export function getTipo() {
  return localStorage.getItem("tb_tipo");
}

export function limparAuth() {
  localStorage.removeItem("tb_access");
  localStorage.removeItem("tb_refresh");
  localStorage.removeItem("tb_tipo");
}
