import { useState } from 'react';

const S = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:   { background:"#13161e", border:"1px solid #2a2f42", borderRadius:16, width:"100%", maxWidth:480, overflow:"hidden", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" },
  btnGhost:  { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:"0.82rem", background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", transition:"all .2s" },
  btnDanger: { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.82rem", background:"rgba(239,68,68,0.15)", color:"#f87171", border:"1px solid rgba(239,68,68,0.3)", transition:"all .2s" },
  input: { width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"10px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" },
};

export default function ModalCancelamento({ evento, onConfirm, onClose }) {
  const [motivo, setMotivo] = useState("");
  const [outro, setOutro] = useState("");
  const motivos = ["Conflito de horário","Motivo pessoal","Evento cancelado pelo estabelecimento","Mudança de planos","Outro"];

  return (
    <div style={S.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #2a2f42" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:"0.75rem", color:"#f87171", marginBottom:4 }}>Cancelar inscrição em</p>
              <h3 style={{ fontWeight:700, fontSize:"1.05rem" }}>{evento.titulo}</h3>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#7c819a", fontSize:"1.3rem", cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <p style={{ fontSize:"0.82rem", color:"#7c819a", marginBottom:14 }}>Por favor, informe o motivo do cancelamento:</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
            {motivos.map(m => (
              <label key={m} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"10px 14px", background:motivo===m?"rgba(91,108,255,0.1)":"#1a1e29", border:motivo===m?"1px solid #5b6cff":"1px solid #2a2f42", borderRadius:8, fontSize:"0.85rem", transition:"all .15s" }}>
                <input type="radio" name="motivo" value={m} checked={motivo===m} onChange={() => setMotivo(m)} style={{ accentColor:"#5b6cff" }} />
                {m}
              </label>
            ))}
          </div>
          {motivo==="Outro" && (
            <textarea value={outro} onChange={e => setOutro(e.target.value)} placeholder="Descreva o motivo..." rows={3} style={{ ...S.input, resize:"vertical", fontFamily:"inherit" }} />
          )}
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #2a2f42", display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Voltar</button>
          <button style={{ ...S.btnDanger, cursor:motivo?"pointer":"not-allowed", opacity:motivo?1:0.5 }} onClick={() => motivo && onConfirm(motivo==="Outro"?outro||"Outro":motivo)}>
            Cancelar Inscrição
          </button>
        </div>
      </div>
    </div>
  );
}
