export function isCPF(v) {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v);
}

export function isCNPJ(v) {
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v);
}

export function isEmailValido(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
