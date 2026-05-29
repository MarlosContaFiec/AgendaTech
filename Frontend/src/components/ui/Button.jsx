import React from 'react'

export default function Button({ as: Comp = 'button', variant = 'primary', className = '', children, ...props }) {
  const base = 'btn'
  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }
  return <Comp className={`${base} ${variants[variant] || variants.primary} ${className}`.trim()} {...props}>{children}</Comp>
}
