import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui";
import api from "@/services/api";
import { FiMessageCircle, FiX, FiSend, FiHelpCircle } from "react-icons/fi";

export default function ChatBot() {
  const { user, isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [faq, setFaq] = useState([]);
  const [config, setConfig] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const empresaId = pathname.startsWith("/dashboard/empresa/") ? params.id : null;
  const isCliente = user?.tipo === "cliente";

  useEffect(() => {
    if (!open) return;
    if (!empresaId) { setFaq([]); setConfig(null); setMsgs([]); return; }
    setLoading(true);
    api("GET", `/api/mensagens/publico/${empresaId}/faq`).then(res => {
      if (res.success) {
        setConfig(res.data.config || null);
        setFaq(res.data.faq || []);
        const abertura = res.data.config?.mensagem_abertura;
        if (abertura) {
          setMsgs([{ id: 1, de: "empresa", texto: abertura, auto: true }]);
        }
      }
      setLoading(false);
    });
  }, [open, empresaId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs]);

  function clickFaq(pergunta, resposta) {
    setMsgs(p => [
      ...p,
      { id: Date.now(), de: "cliente", texto: pergunta, auto: false },
      { id: Date.now() + 1, de: "empresa", texto: resposta, auto: true },
    ]);
  }

  async function enviar() {
    if (!texto.trim() || !empresaId || !isCliente) return;
    const msg = texto.trim();
    setTexto("");
    setMsgs(p => [...p, { id: Date.now(), de: "cliente", texto: msg, auto: false }]);
    setEnviando(true);
    const res = await api("POST", `/api/mensagens/empresa/${empresaId}`, { mensagem: msg }, user.token);
    setEnviando(false);
    if (!res.success) {
      setMsgs(p => [...p, { id: Date.now(), de: "erro", texto: "Não foi possível enviar. Tente novamente.", auto: true }]);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label="Chat"
        className="fixed bottom-7 right-7 z-[9999] w-14 h-14 rounded-full bg-gradient-to-br from-purple to-neon border-none cursor-pointer flex items-center justify-center transition-transform hover:scale-110 shadow-[0_0_12px_rgba(108,92,231,0.5)]">
        {open ? <FiX size={20} color="white" /> : <FiMessageCircle size={22} color="white" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-7 z-[9998] w-[360px] max-h-[500px] bg-surface border border-line rounded-[20px] overflow-hidden shadow-2xl animate-[fadeUp_.25s_ease] flex flex-col">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-xl bg-purple/15 border border-purple/25 flex items-center justify-center">
                <FiMessageCircle size={18} className="text-purple" />
              </div>
              <div>
                <div className="font-body text-[0.9rem] font-bold">Chat</div>
                <div className="flex items-center gap-1 text-[0.7rem] text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />Online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="bg-none border-none cursor-pointer text-muted hover:text-foreground p-1 rounded-lg transition-colors">
              <FiX size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-2 min-h-[200px] max-h-[300px]">
            {!empresaId ? (
              <div className="text-center py-8">
                <FiHelpCircle size={32} className="text-muted mx-auto mb-3" />
                <p className="text-[0.82rem] text-muted mb-1">Navegue até uma empresa para iniciar uma conversa.</p>
                <p className="text-[0.72rem] text-muted-light">Use a aba Explorar para encontrar serviços.</p>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-8"><Spinner size={20} /></div>
            ) : (
              <>
                {msgs.map(m => (
                  <div key={m.id} className={"mb-2 flex " + (m.de === "cliente" ? "justify-end" : "justify-start")}>
                    <div className={"max-w-[80%] py-2.5 px-3.5 text-[0.82rem] leading-relaxed rounded-[14px] " +
                      (m.de === "cliente"
                        ? "bg-purple text-white rounded-tr-[4px]"
                        : m.de === "erro"
                          ? "bg-danger/12 border border-danger/25 text-danger rounded-tl-[4px]"
                          : "bg-white/4 border border-line text-muted-light rounded-tl-[4px]")}>
                      {m.texto}
                    </div>
                  </div>
                ))}
                {enviando && (
                  <div className="mb-2 flex justify-start">
                    <div className="bg-white/4 border border-line rounded-[14px] rounded-tl-[4px] py-2.5 px-3.5 text-[0.82rem] text-muted">
                      <span className="animate-pulse">Digitando...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {empresaId && faq.length > 0 && (
            <div className="px-4 pb-2">
              <div className="text-[0.66rem] text-muted uppercase tracking-widest mb-1.5 px-0.5">Perguntas frequentes</div>
              <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto">
                {faq.map(f => (
                  <button key={f.id} onClick={() => clickFaq(f.pergunta, f.resposta)}
                    className="bg-white/3 border border-line rounded-xl py-2 px-3 cursor-pointer flex items-center gap-2 transition-all hover:bg-purple/10 hover:border-purple/35 text-left w-full group">
                    <FiHelpCircle size={14} className="text-muted flex-shrink-0 group-hover:text-purple" />
                    <span className="text-[0.78rem] text-muted-light group-hover:text-foreground flex-1 truncate">{f.pergunta}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {empresaId && isCliente && (
            <div className="px-4 pb-4 pt-2 border-t border-line">
              <div className="flex gap-2">
                <input
                  value={texto}
                  onChange={e => setTexto(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && enviar()}
                  placeholder="Enviar mensagem..."
                  disabled={enviando}
                  className="flex-1 bg-surface-alt border border-line-light rounded-input text-foreground text-[0.82rem] outline-none font-body py-2.5 px-3 transition-colors focus:border-purple disabled:opacity-50"
                />
                <button onClick={enviar} disabled={!texto.trim() || enviando}
                  className="bg-purple text-white rounded-btn p-2.5 cursor-pointer transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed">
                  <FiSend size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
