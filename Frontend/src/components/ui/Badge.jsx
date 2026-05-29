import React from 'react'

const variants = {
  default: 'pill-default',
  success: 'pill-success',
  danger: 'pill-danger',
  warning: 'pill-warning',
  info: 'pill-info',
}

export default function Badge({ variant = 'default', className = '', children }) {
  return <span className={`pill ${variants[variant] || variants.default} ${className}`.trim()}>{children}</span>
}
