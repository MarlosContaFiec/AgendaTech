import React from 'react'

export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label ? <span className="label">{label}</span> : null}
      <input className={`input ${error ? 'border-danger' : ''} ${className}`.trim()} {...props} />
      {error ? <div className="field-error">{error}</div> : null}
    </label>
  )
}
