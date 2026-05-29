export function scoreColor(score = 0) {
  if (score >= 80) return '#00b894'
  if (score >= 60) return '#fdcb6e'
  return '#ff6b6b'
}

export function scoreLabel(score = 0) {
  if (score >= 90) return 'Excelente'
  if (score >= 75) return 'Bom'
  if (score >= 60) return 'Regular'
  return 'Baixo'
}

export function passwordStrength(password = '') {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}
