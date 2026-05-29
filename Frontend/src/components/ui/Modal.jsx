import React, { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

export default function Modal({ open, onClose, title, children, size = 'max-w-2xl' }) {
  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose?.() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div className={`w-full ${size} animate-pop rounded-[20px] border border-line bg-surface shadow-2xl`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="text-2xl text-foreground">{title}</h3>
          <button className="rounded-full p-2 text-muted transition hover:bg-surface-alt hover:text-foreground" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
