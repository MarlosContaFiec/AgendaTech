import React from 'react'
import Button from '../ui/Button'

export default function SectionHeader({ title, subtitle, actionLabel, onAction, right, children }) {
  return (
    <div className="dashboard-toolbar animate-fade-up">
      <div>
        <h1 className="section-title">{title}</h1>
        {subtitle ? <div className="section-subtitle mt-1">{subtitle}</div> : null}
      </div>
      {right || (actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null)}
      {children}
    </div>
  )
}
