import React from 'react'

export default function EmptyState({ title, description, icon = '◌', action }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h3 className="text-3xl text-foreground">{title}</h3>
      <div className="mx-auto mt-2 max-w-lg text-sm text-muted">{description}</div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
