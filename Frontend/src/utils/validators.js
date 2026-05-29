import { onlyDigits } from './masks'

export function validateEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateCPF(cpf = '') {
  const digits = onlyDigits(cpf)
  if (digits.length !== 11 || /^([0-9])\1+$/.test(digits)) return false
  const calc = (base) => {
    let sum = 0
    for (let i = 0; i < base.length; i += 1) sum += Number(base[i]) * (base.length + 1 - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  const d1 = calc(digits.slice(0, 9))
  const d2 = calc(digits.slice(0, 9) + d1)
  return d1 === Number(digits[9]) && d2 === Number(digits[10])
}

export function validateCNPJ(cnpj = '') {
  const digits = onlyDigits(cnpj)
  if (digits.length !== 14 || /^([0-9])\1+$/.test(digits)) return false
  const calc = (base, weights) => {
    const sum = base.split('').reduce((acc, n, i) => acc + Number(n) * weights[i], 0)
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }
  const w1 = [5,4,3,2,9,8,7,6,5,4,3,2]
  const w2 = [6,5,4,3,2,9,8,7,6,5,4,3,2]
  const d1 = calc(digits.slice(0, 12), w1)
  const d2 = calc(digits.slice(0, 12) + d1, w2)
  return d1 === Number(digits[12]) && d2 === Number(digits[13])
}

export function validateDocumento(value = '') {
  const digits = onlyDigits(value)
  return digits.length === 11 ? validateCPF(digits) : digits.length === 14 ? validateCNPJ(digits) : false
}

export function validatePassword(password = '') {
  return String(password).length >= 6
}
