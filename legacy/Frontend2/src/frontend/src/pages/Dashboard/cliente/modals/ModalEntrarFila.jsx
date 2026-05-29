import { useState } from 'react';

const S = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:   { background:"#13161e", border:"1px solid #2a2f42", borderRadius:16, width:"100%", maxWidth:480, overflow:"hidden", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" },
  btnGhost:   { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:"0.82rem", background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", transition:"all .2s" },
  btnWarning: { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.82rem", background:"rgba(245,200,66,0.15)", color:"#f5c842", border:"1px solid rgba(245,200,66,0.3)", transition:"all .2s" },
};

export default function ModalEntrarFila({ evento, onConfirm, onClose }) {
  const inscritos = evento.inscritos || [];
  const fila = evento.fila || [];
  const limFila = evento.limFila || 3;
  const horariosOcupados = evento.horarios.filter(h => inscritos.some(i => i.horario === h));
  const horariosParaFila = horariosOcupados.length > 0 ? horariosOcupados : evento.horarios;
  const [horarioSel, setHorarioSel] = useState(horariosParaFila[0] || "");
  const pessoasNaFila = fila.filter(f => f.horario === horarioSel).length;
  const filaCheia = fila.length >= limFila;

  return (
    <div style={S.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #2a2f42" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:"0.72rem", color:"#8b9eff", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>⏳ Entrar na Fila de Espera</p>
              <h3 style={{ fontWeight:700, fontSize:"1.05rem" }}>{evento.titulo}</h3>
              <p style={{ fontSize:"0.8rem", color:"#7c819a", marginTop:3 }}>{evento.estabelecimento} · {evento.cidade}</p>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#7c819a", fontSize:"1.3rem", cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <div style={{ background:"rgba(91,108,255,0.08)", border:"1px solid rgba(91,108,255,0.25)", borderRadius:10, padding:"12px 16px", marginBottom:18 }}>
            <p style={{ fontSize:"0.78rem", color:"#8b9eff", fontWeight:700, marginBottom:6 }}>ℹ️ Como funciona a fila?</p>
            <p style={{ fontSize:"0.78rem", color:"#a0a4ba", lineHeight:1.6 }}>
              Caso alguém cancele o agendamento, você receberá uma notificação e terá a oportunidade de aceitar a vaga antes que ela passe para o próximo da fila.
            </p>
          </div>
          <div style={{ marginBottom:18 }}>
            <p style={{ fontSize:"0.72rem", color:"#7c819a", marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>
              Horário com agendamento <span style={{ color:"#f87171", marginLeft:4 }}>(já ocupado)</span>
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {horariosParaFila.map(h => {
                const sel = horarioSel === h;
                return (
                  <button key={h} onClick={() => setHorarioSel(h)}
                    style={{ padding:"10px 16px", borderRadius:8, cursor:"pointer", border: sel?"1px solid #5b6cff":"1px solid #f87171", background: sel?"rgba(91,108,255,0.18)":"rgba(239,68,68,0.08)", color: sel?"#8b9eff":"#f87171", fontWeight: sel?700:500, fontSize:"0.85rem", transition:"all .15s", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                    <span>🕐 {h}</span>
                    <span style={{ fontSize:"0.65rem", opacity:0.8 }}>
                      {inscritos.filter(i => i.horario === h).length} inscrito{inscritos.filter(i => i.horario === h).length !== 1 ? "s" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          {horarioSel && (
            <div style={{ background:"#1a1e29", border:"1px solid #2a2f42", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
              <p style={{ fontSize:"0.75rem", color:"#7c819a", marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>
                Status da fila — {horarioSel}
              </p>
              <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:"0.72rem", color:"#7c819a", marginBottom:4 }}>Pessoas na fila</p>
                  <p style={{ fontSize:"1.4rem", fontWeight:800, color: pessoasNaFila >= limFila?"#f87171":"#8b9eff" }}>
                    {pessoasNaFila}<span style={{ fontSize:"0.75rem", color:"#7c819a", fontWeight:400 }}>/{limFila}</span>
                  </p>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:"0.72rem", color:"#7c819a", marginBottom:4 }}>Lotação da fila</p>
                  <p style={{ fontSize:"1.4rem", fontWeight:800, color:"#e8eaf2" }}>{limFila}</p>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:"0.72rem", color:"#7c819a", marginBottom:4 }}>Sua posição</p>
                  <p style={{ fontSize:"1.4rem", fontWeight:800, color:"#22c55e" }}>#{pessoasNaFila + 1}</p>
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <div style={{ height:6, background:"#2a2f42", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.min((pessoasNaFila / limFila)*100, 100)}%`, background: pessoasNaFila >= limFila?"#ef4444":"#5b6cff", borderRadius:3, transition:"width .4s" }} />
                </div>
                <p style={{ fontSize:"0.68rem", color: pessoasNaFila >= limFila?"#f87171":"#7c819a", marginTop:4 }}>
                  {pessoasNaFila >= limFila ? "Fila cheia para este horário" : `${limFila - pessoasNaFila} vaga${limFila - pessoasNaFila !== 1 ? "s" : ""} restante${limFila - pessoasNaFila !== 1 ? "s" : ""} na fila`}
                </p>
              </div>
            </div>
          )}
          <div style={{ background:"rgba(245,200,66,0.08)", border:"1px solid rgba(245,200,66,0.25)", borderRadius:8, padding:"10px 14px", fontSize:"0.78rem", color:"#f5c842", lineHeight:1.55 }}>
            ⚠️ Ao entrar na fila, você será notificado se uma vaga surgir. Você poderá <strong>aceitar ou recusar</strong> o agendamento antes que ele passe para o próximo.
          </div>
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #2a2f42", display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          <button style={{ ...S.btnWarning, cursor: (filaCheia || !horarioSel)?"not-allowed":"pointer", opacity: (filaCheia || !horarioSel)?0.5:1, flex:"unset", padding:"9px 24px" }}
            onClick={() => !filaCheia && horarioSel && onConfirm(horarioSel)}>
            ⏳ Ficar na Fila
          </button>
        </div>
      </div>
    </div>
  );
}
