import React from 'react'

export default function Spinner({ size = 20, className = '' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-[3px] border-transparent border-r-purple ${className}`}
      style={{ width: size, height: size }}
      aria-label="Carregando"
    />
  )
}
