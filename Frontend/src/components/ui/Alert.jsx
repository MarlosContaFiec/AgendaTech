import React from 'react'
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi'

const map = {
  info: { icon: FiInfo, className: 'pill-info' },
  success: { icon: FiCheckCircle, className: 'pill-success' },
  warning: { icon: FiAlertTriangle, className: 'pill-warning' },
  error: { icon: FiAlertCircle, className: 'pill-danger' },
}

export default function Alert({ variant = 'info', title, children }) {
  const cfg = map[variant] || map.info
  const Icon = cfg.icon
  return (
    <div className="card">
      <div className="flex gap-3">
        <Icon className={`mt-0.5 text-xl ${variant === 'success' ? 'text-success' : variant === 'warning' ? 'text-warning' : variant === 'error' ? 'text-danger' : 'text-purple'}`} />
        <div>
          {title ? <div className="mb-1 font-bold text-foreground">{title}</div> : null}
          <div className="text-sm text-[var(--text-muted)]">{children}</div>
        </div>
      </div>
    </div>
  )
}
