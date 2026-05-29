import React from 'react'
import Badge from '../ui/Badge'

export default function BadgeClassif({ score = 0 }) {
  if (score >= 80) return <Badge variant="success">Excelente</Badge>
  if (score >= 60) return <Badge variant="warning">Bom</Badge>
  return <Badge variant="danger">Baixo</Badge>
}
