export function Modal({ children, onClose, wide }) {
  return (
    <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-5"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={'bg-tb-surface border border-tb-border rounded-2xl w-full overflow-hidden animate-fadeUp max-h-[90vh] overflow-y-auto ' + (wide ? 'max-w-[560px]' : 'max-w-[480px]')}>
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ titulo, subtitulo, onClose }) {
  return (
    <div className="px-6 py-5 border-b border-tb-border">
      <div className="flex justify-between items-start">
        <div>
          {subtitulo && <p className="text-[0.75rem] text-tb-muted mb-1">{subtitulo}</p>}
          <h3 className="font-bold text-[1.05rem] text-tb-text">{titulo}</h3>
        </div>
        <button onClick={onClose} className="bg-none border-none text-tb-muted text-[1.3rem] cursor-pointer leading-none p-1 rounded-lg hover:text-tb-text hover:bg-white/5 transition-colors">
          ×
        </button>
      </div>
    </div>
  );
}

export function ModalBody({ children }) {
  return <div className="px-6 py-5">{children}</div>;
}

export function ModalFooter({ children }) {
  return <div className="px-6 py-3.5 border-t border-tb-border flex gap-2.5 justify-end">{children}</div>;
}
