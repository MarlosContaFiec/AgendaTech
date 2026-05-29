import React, { createContext, useContext, useMemo, useState } from 'react'
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi'

const ToastContext = createContext(null)

const icons = {
  info: FiInfo,
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  error: FiAlertCircle,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function push(message, variant = 'info') {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, variant }])
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 4000)
  }

  const value = useMemo(() => ({ push }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[90] flex w-[min(92vw,380px)] flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = icons[toast.variant] || icons.info
          return (
            <div key={toast.id} className="animate-slide-right rounded-[12px] border border-line bg-surface px-4 py-3 shadow-2xl">
              <div className="flex gap-3">
                <Icon className={`mt-0.5 text-lg ${toast.variant === 'success' ? 'text-success' : toast.variant === 'warning' ? 'text-warning' : toast.variant === 'error' ? 'text-danger' : 'text-purple'}`} />
                <div className="text-sm text-foreground">{toast.message}</div>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return context
}
