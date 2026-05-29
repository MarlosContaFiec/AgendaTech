import React, { useEffect, useMemo, useState } from 'react'
import { FiMessageCircle, FiX } from 'react-icons/fi'
import { getPublicFaq } from '../../services/public'
import Spinner from '../ui/Spinner'

export default function ChatBot({ empresaId = null }) {
  const [open, setOpen] = useState(false)
  const [faq, setFaq] = useState({ config: null, faqs: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    if (!open || !empresaId) return
    setLoading(true)
    getPublicFaq(empresaId).then((res) => {
      if (!active) return
      const data = res?.data || res
      setFaq(data || { config: null, faqs: [] })
      setLoading(false)
    }).catch(() => {
      if (!active) return
      setLoading(false)
    })
    return () => { active = false }
  }, [open, empresaId])

  const quick = useMemo(() => {
    const items = faq?.faqs?.slice(0, 3) || []
    return items.length ? items : ['Horário?', 'Preços?', 'Localização?']
  }, [faq])

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-2xl transition hover:scale-110"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>
      {open ? (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[92vw] rounded-[20px] border border-line bg-surface p-4 shadow-2xl">
          <div className="mb-4">
            <div className="font-heading text-4xl text-foreground">Olá!</div>
            <div className="text-sm text-muted">Como posso ajudar?</div>
          </div>
          {loading ? <div className="py-6 text-center"><Spinner size={28} /></div> : null}
          <div className="mb-4 flex flex-wrap gap-2">
            {quick.map((item) => (
              <button key={typeof item === 'string' ? item : item.pergunta} className="rounded-full bg-surface-alt px-4 py-2 text-sm text-foreground hover:bg-[rgba(108,92,231,.12)] hover:text-purple">
                {typeof item === 'string' ? item : item.pergunta}
              </button>
            ))}
          </div>
          <div className="rounded-[12px] border border-line bg-surface-alt px-4 py-3 text-sm text-muted">
            {faq?.config?.mensagem_abertura || 'Digite sua pergunta pelo chat interno ou use as perguntas frequentes.'}
          </div>
        </div>
      ) : null}
    </>
  )
}
