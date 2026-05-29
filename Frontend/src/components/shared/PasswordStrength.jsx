import React from 'react'
import { passwordStrength } from '../../utils/calculators'

export default function PasswordStrength({ value = '' }) {
  const strength = passwordStrength(value)
  const label = strength <= 2 ? 'Fraca' : strength === 3 ? 'Média' : strength === 4 ? 'Boa' : 'Forte'
  const tone = strength <= 2 ? 'bg-danger' : strength === 3 ? 'bg-warning' : 'bg-success'

  return (
    <div className="mt-2">
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>Força da senha</span>
        <span>{label}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${i < strength ? tone : 'bg-surface-alt'}`} />
        ))}
      </div>
    </div>
  )
}
