import React from 'react'

export default function Select({ label, error, className = '', children, ...props }) {
  return (
    <label className="block">
      {label ? <span className="label">{label}</span> : null}
      <select className={`input ${error ? 'border-danger' : ''} ${className}`.trim()} {...props}>{children}</select>
      {error ? <div className="field-error">{error}</div> : null}
    </label>
  )
}
