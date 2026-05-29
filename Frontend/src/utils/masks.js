export function onlyDigits(value = '') {
  return String(value).replace(/\D/g, '')
}

export function maskCPF(value = '') {
  const d = onlyDigits(value).slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function maskCNPJ(value = '') {
  const d = onlyDigits(value).slice(0, 14)
  return d
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

export function maskPhone(value = '') {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d{1,4})$/, '$1-$2')
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{1,4})$/, '$1-$2')
}

export function maskCEP(value = '') {
  const d = onlyDigits(value).slice(0, 8)
  return d.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
}

export function maskCurrencyBR(value = '') {
  const digits = onlyDigits(value)
  const amount = Number(digits || 0) / 100
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

export function documentoMask(value = '') {
  const d = onlyDigits(value)
  return d.length > 11 ? maskCNPJ(d) : maskCPF(d)
}
