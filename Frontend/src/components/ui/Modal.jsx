import { useEffect } from "react";

export default function Modal({ onClose, maxWidth = 520, children }) {
  useEffect(() => {
    const handler = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/85 z-[300] flex items-center justify-center p-5" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface border border-line rounded-modal w-full overflow-hidden animate-[fadeUp_.25s_ease] max-h-[90vh] overflow-y-auto" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
