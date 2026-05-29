import React from 'react'
import BadgeClassif from './BadgeClassif'

export default function ScoreBadge({ score = 0 }) {
  return <BadgeClassif score={score} />
}
