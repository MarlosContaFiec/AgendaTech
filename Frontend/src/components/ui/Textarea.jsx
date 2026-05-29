import React from 'react'

export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <label className="block">
      {label ? <span className="label">{label}</span> : null}
      <textarea className={`input min-h-[120px] resize-y ${error ? 'border-danger' : ''} ${className}`.trim()} {...props} />
      {error ? <div className="field-error">{error}</div> : null}
    </label>
  )
}
