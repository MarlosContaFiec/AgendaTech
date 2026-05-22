import { useState } from 'react';
import { formatDate } from '../helpers';

const S = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:   { background:"#13161e", border:"1px solid #2a2f42", borderRadius:16, width:"100%", maxWidth:480, overflow:"hidden", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" },
  btnPrimary: { padding:"9px 16px", borderRadius:8, cursor:"pointer", border:"none", fontWeight:700, fontSize:"0.82rem", background:"#5b6cff", color:"white", transition:"all .2s", flex:1 },
  btnGhost:   { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:"0.82rem", background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", transition:"all .2s" },
  input: { width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"10px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" },
};

export default function ModalConfirmacao({ evento, onConfirm, onClose, jaTemInscricao }) {
  const [horariosSel, setHorariosSel] = useState([evento.horarios[0]]);
  const [justificativa, setJustificativa] = useState("");
  const precisaJustificativa = jaTemInscricao || horariosSel.length === 2;

  function toggleHorario(h) {
    setHorariosSel(prev => {
      if (prev.includes(h)) { if (prev.length === 1) return prev; return prev.filter(x => x !== h); }
      if (prev.length >= 2) return prev;
      return [...prev, h];
    });
  }

  const podeConfirmar = horariosSel.length > 0 && (!precisaJustificativa || justificativa.trim().length >= 10);

  return (
    <div style={S.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #2a2f42" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:"0.75rem", color:"#7c819a", marginBottom:4 }}>Confirmar inscrição em</p>
              <h3 style={{ fontWeight:700, fontSize:"1.05rem" }}>{evento.titulo}</h3>
              <p style={{ fontSize:"0.8rem", color:"#7c819a", marginTop:3 }}>{evento.estabelecimento} · {evento.cidade}</p>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#7c819a", fontSize:"1.3rem", cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <div style={{ background:"#1a1e29", border:"1px solid #2a2f42", borderRadius:10, padding:"10px 14px", marginBottom:16, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:"0.78rem", color:"#7c819a" }}>Data</span>
            <span style={{ fontSize:"0.82rem", fontWeight:600 }}>{formatDate(evento.data)}</span>
          </div>
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:"0.78rem", color:"#7c819a", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>
              Horário{evento.horarios.length > 1 ? " (máx. 2)" : ""}
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {evento.horarios.map(h => {
                const sel = horariosSel.includes(h);
                const disabled = !sel && horariosSel.length >= 2;
                return (
                  <button key={h} onClick={() => !disabled && toggleHorario(h)}
                    style={{ padding:"8px 16px", borderRadius:8, border: sel?"1px solid #5b6cff":"1px solid #2a2f42", background: sel?"rgba(91,108,255,0.18)":"#1a1e29", color: sel?"#8b9eff":"#a0a4ba", fontWeight: sel?700:400, fontSize:"0.85rem", cursor: disabled?"not-allowed":"pointer", opacity: disabled?0.4:1, transition:"all .15s" }}>
                    🕐 {h}
                  </button>
                );
              })}
            </div>
            {horariosSel.length === 2 && (
              <div style={{ marginTop:8, background:"rgba(255,169,77,0.08)", border:"1px solid rgba(255,169,77,0.25)", borderRadius:8, padding:"8px 12px", fontSize:"0.78rem", color:"#ffa94d" }}>
                ⚠️ Você selecionou 2 horários — uma justificativa é obrigatória.
              </div>
            )}
            {jaTemInscricao && horariosSel.length < 2 && (
              <div style={{ marginTop:8, background:"rgba(255,169,77,0.08)", border:"1px solid rgba(255,169,77,0.25)", borderRadius:8, padding:"8px 12px", fontSize:"0.78rem", color:"#ffa94d" }}>
                ⚠️ Você já tem um horário agendado neste serviço — justifique para adicionar outro.
              </div>
            )}
          </div>
          {precisaJustificativa && (
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:"0.78rem", color:"#7c819a", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>
                Justificativa <span style={{ color:"#f87171" }}>*</span>
              </p>
              <textarea value={justificativa} onChange={e => setJustificativa(e.target.value)} placeholder="Explique o motivo de precisar de mais de um horário..." rows={3} style={{ ...S.input, resize:"vertical", fontFamily:"inherit" }} />
              <p style={{ fontSize:"0.7rem", color: justificativa.trim().length >= 10?"#22c55e":"#7c819a", marginTop:4 }}>
                {justificativa.trim().length}/10 caracteres mínimos
              </p>
            </div>
          )}
          {evento.modoAprov === "manual" || precisaJustificativa ? (
            <div style={{ background:"rgba(255,169,77,0.08)", border:"1px solid rgba(255,169,77,0.25)", borderRadius:8, padding:"10px 14px", fontSize:"0.8rem", color:"#ffa94d", lineHeight:1.5 }}>
              🔍 Sua solicitação ficará como <strong>Inscrição solicitada</strong> e será analisada. Você será notificado quando houver resposta.
            </div>
          ) : (
            <p style={{ fontSize:"0.82rem", color:"#7c819a", lineHeight:1.6 }}>
              Ao confirmar, este evento será adicionado ao seu <strong style={{ color:"#e8eaf2" }}>Calendário</strong>. Você pode cancelar a qualquer momento.
            </p>
          )}
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #2a2f42", display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Voltar</button>
          <button style={{ ...S.btnPrimary, flex:"unset", padding:"9px 24px", opacity: podeConfirmar?1:0.5, cursor: podeConfirmar?"pointer":"not-allowed" }} onClick={() => podeConfirmar && onConfirm(horariosSel, justificativa.trim())}>
            {(evento.modoAprov==="manual" || precisaJustificativa) ? "📤 Enviar Solicitação" : "✓ Confirmar Inscrição"}
          </button>
        </div>
      </div>
    </div>
  );
}
