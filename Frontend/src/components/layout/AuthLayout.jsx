import React from 'react'
import Logo from '../shared/Logo'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <div className="auth-card animate-fade-up">
        <div className="mb-5 flex justify-center">
          <Logo />
        </div>
        {title ? <h1 className="auth-title">{title}</h1> : null}
        {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
        {children}
      </div>
    </div>
  )
}
