import React, { useState } from 'react'
import { SectionHeader } from '../../components/shared'

export default function ConfiguracoesClientePage() {

  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  return (
    <div className="space-y-6">

      <SectionHeader
        title="Configurações"
        subtitle="Preferências e acessibilidade"
      />

      <div className="rounded-2xl border border-[#232838] bg-[#131720] p-6">

        <h2 className="mb-6 text-2xl font-bold text-white">
          Acessibilidade
        </h2>

        <div className="space-y-4">

          <label className="flex items-center justify-between rounded-xl border border-[#232838] bg-[#0f141c] p-4">

            <div>
              <div className="font-medium text-white">
                Alto contraste
              </div>

              <div className="text-sm text-gray-400">
                Melhora a visualização
              </div>
            </div>

            <input
              type="checkbox"
              checked={highContrast}
              onChange={() => setHighContrast(!highContrast)}
            />

          </label>

          <label className="flex items-center justify-between rounded-xl border border-[#232838] bg-[#0f141c] p-4">

            <div>
              <div className="font-medium text-white">
                Texto grande
              </div>

              <div className="text-sm text-gray-400">
                Aumenta o tamanho da fonte
              </div>
            </div>

            <input
              type="checkbox"
              checked={largeText}
              onChange={() => setLargeText(!largeText)}
            />

          </label>

          <label className="flex items-center justify-between rounded-xl border border-[#232838] bg-[#0f141c] p-4">

            <div>
              <div className="font-medium text-white">
                Reduzir animações
              </div>

              <div className="text-sm text-gray-400">
                Diminui efeitos visuais
              </div>
            </div>

            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={() => setReduceMotion(!reduceMotion)}
            />

          </label>

        </div>

      </div>

    </div>
  )
}