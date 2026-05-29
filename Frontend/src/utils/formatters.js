export function currency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0))
}

export function dateBR(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
}

export function dateTimeBR(value) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

export function timeBR(value) {
  if (!value) return '-'
  return String(value).slice(0, 5)
}

export function firstLetter(value = '') {
  return String(value).trim().charAt(0).toUpperCase() || 'A'
}
