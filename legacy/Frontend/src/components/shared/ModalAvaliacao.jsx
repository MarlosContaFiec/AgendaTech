import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Modal, Button, Textarea, Spinner, Toast } from "@/components/ui";
import api from "@/services/api";
import { FiStar, FiX } from "react-icons/fi";

export default function ModalAvaliacao({ agendamento, onClose, onConcluido }) {
  const { user } = useAuth();
  const [estrelas, setEstrelas] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  async function enviar() {
    if (estrelas === 0) return;
    setLoading(true);
    const res = await api("POST", `/api/avaliacoes/agendamento/${agendamento.id}`, {
      estrelas,
      feedback: feedback.trim() || null,
    }, user.token);
    setLoading(false);
    if (res.success) {
      onConcluido?.();
      onClose();
    } else {
      setToast({ msg: res.message || "Erro ao avaliar.", type: "error" });
    }
  }

  return (
    <Modal onClose={onClose} maxWidth={440}>
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "" })} />

      <div className="px-7 pt-7 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-black text-lg">Avaliar Atendimento</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors bg-none border-none cursor-pointer">
            <FiX size={18} />
          </button>
        </div>

        <div className="text-[0.82rem] text-muted mb-5">
          <span className="text-foreground font-semibold">{agendamento.servico_nome}</span>
          <span className="mx-1.5">·</span>
          <span>{agendamento.empresa_nome}</span>
        </div>

        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(i => (
            <button key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setEstrelas(i)}
              className="bg-none border-none cursor-pointer p-1 transition-transform hover:scale-110">
              <FiStar
                size={32}
                fill={(hover || estrelas) >= i ? "#ffd700" : "none"}
                stroke={(hover || estrelas) >= i ? "#ffd700" : "#2a2a52"}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>

        {estrelas > 0 && (
          <p className="text-center text-[0.78rem] text-muted mb-4">
            {estrelas === 1 && "Péssimo"}
            {estrelas === 2 && "Ruim"}
            {estrelas === 3 && "Razoável"}
            {estrelas === 4 && "Bom"}
            {estrelas === 5 && "Excelente"}
          </p>
        )}

        <Textarea
          label="Comentário (opcional)"
          placeholder="Conte como foi sua experiência..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={3}
          className="mb-5"
        />

        <div className="flex gap-3">
          <Button disabled={estrelas === 0 || loading} onClick={enviar} className="flex-1">
            {loading ? <><Spinner size={14} /> Enviando...</> : "Enviar Avaliação"}
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  );
}
