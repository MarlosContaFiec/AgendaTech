import React from 'react'

export default function StepIndicator({ steps = [], current = 0 }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => {
          const active = index === current
          const done = index < current
          return (
            <React.Fragment key={step}>
              <div className="flex flex-1 flex-col items-center gap-2">
                <div className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-bold ${
                  done ? 'border-success bg-success text-white' : active ? 'border-purple bg-purple text-white' : 'border-line bg-surface-alt text-muted'
                }`}>
                  {done ? '✓' : index + 1}
                </div>
                <span className={`text-[.72rem] ${active || done ? 'text-foreground' : 'text-muted'}`}>{step}</span>
              </div>
              {index < steps.length - 1 ? <div className={`mt-[-18px] h-[2px] flex-1 ${index < current ? 'bg-purple' : 'bg-line'}`} /> : null}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
