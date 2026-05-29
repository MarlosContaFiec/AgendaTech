import { useState } from 'react';
import { sugerirMesas } from '../helpers';
import { TIPOS_MESA_PADRAO } from '../constants';

const S = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:   { background:"#13161e", border:"1px solid #2a2f42", borderRadius:16, width:"100%", maxWidth:560, overflow:"hidden", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" },
  btnPrimary: { padding:"9px 16px", borderRadius:8, cursor:"pointer", border:"none", fontWeight:700, fontSize:"0.82rem", background:"#5b6cff", color:"white", transition:"all .2s", flex:1 },
  btnGhost:   { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:"0.82rem", background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", transition:"all .2s" },
  select: { background:"#1a1e29", border:"1px solid #2a2f42", padding:"9px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", cursor:"pointer" },
  input: { width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"10px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" },
};

export default function ModalReservaRestaurante({ evento, onConfirm, onClose }) {
  const [numPessoas, setNumPessoas] = useState(2);
  const [sugestao, setSugestao] = useState(null);
  const [mesasSelecionadas, setMesasSelecionadas] = useState([]);
  const [nomeReservante, setNomeReservante] = useState("");
  const [etapa, setEtapa] = useState("selecao");
  const [horario, setHorario] = useState(evento.horarios[0]);
  const tiposMesa = evento.tiposMesa || TIPOS_MESA_PADRAO;

  function handleSugerir() {
    const sug = sugerirMesas(numPessoas, tiposMesa);
    const totalCapacidade = sug.reduce((acc, m) => acc + m.capacidade * m.qtd, 0);
    setSugestao(totalCapacidade >= numPessoas ? sug : []);
    setMesasSelecionadas([]);
  }

  function handleAceitarSugestao() {
    if (!sugestao || sugestao.length === 0) return;
    setMesasSelecionadas(sugestao);
    setEtapa("nome");
  }

  function handleConfirmar() {
    if (!nomeReservante.trim()) return;
    onConfirm({ horario, numPessoas, mesas: mesasSelecionadas, nomeReservante: nomeReservante.trim() });
  }

  const totalCapacidadeSel = mesasSelecionadas.reduce((acc, m) => acc + m.capacidade * m.qtd, 0);

  return (
    <div style={S.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #2a2f42" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:"0.75rem", color:"#7c819a", marginBottom:4 }}>Reserva de mesa em</p>
              <h3 style={{ fontWeight:700, fontSize:"1.05rem" }}>{evento.titulo}</h3>
              <p style={{ fontSize:"0.8rem", color:"#7c819a", marginTop:3 }}>{evento.estabelecimento} · {evento.cidade}</p>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#7c819a", fontSize:"1.3rem", cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
        </div>
        {etapa === "selecao" && (
          <div style={{ padding:"20px 24px" }}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:"0.72rem", color:"#7c819a", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Horário</label>
              <select value={horario} onChange={e => setHorario(e.target.value)} style={{ ...S.select, width:"100%" }}>
                {evento.horarios.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:"0.72rem", color:"#7c819a", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Número de pessoas</label>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <button style={{ ...S.btnGhost, padding:"8px 14px", fontSize:"1rem" }} onClick={() => { setNumPessoas(n => Math.max(1, n-1)); setSugestao(null); }}>−</button>
                <span style={{ fontSize:"1.2rem", fontWeight:700, minWidth:32, textAlign:"center" }}>{numPessoas}</span>
                <button style={{ ...S.btnGhost, padding:"8px 14px", fontSize:"1rem" }} onClick={() => { setNumPessoas(n => n+1); setSugestao(null); }}>+</button>
                <button style={{ ...S.btnPrimary, flex:"unset", padding:"8px 16px" }} onClick={handleSugerir}>🪄 Sugerir mesas</button>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:"0.72rem", color:"#7c819a", marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>Disponibilidade</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {tiposMesa.map((t, i) => (
                  <div key={i} style={{ background:"#1a1e29", border:"1px solid #2a2f42", borderRadius:8, padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontSize:"1rem" }}>🪑</span>
                      <span style={{ fontSize:"0.85rem" }}>Mesa para <strong>{t.capacidade}</strong> pessoas</span>
                    </div>
                    <span style={{ fontSize:"0.82rem", fontWeight:700, color: t.disponiveis > 0 ? "#22c55e" : "#f87171" }}>
                      {t.disponiveis}/{t.total} disponíveis
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {sugestao !== null && (
              <div style={{ marginBottom:16 }}>
                {sugestao.length === 0 ? (
                  <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"12px 14px", fontSize:"0.82rem", color:"#f87171" }}>
                    ❌ Não há mesas disponíveis suficientes para {numPessoas} pessoas no momento.
                  </div>
                ) : (
                  <div style={{ background:"rgba(91,108,255,0.08)", border:"1px solid rgba(91,108,255,0.25)", borderRadius:10, padding:"14px 16px" }}>
                    <p style={{ fontSize:"0.78rem", color:"#8b9eff", fontWeight:700, marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>
                      🪄 Sugestão para {numPessoas} pessoas
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
                      {sugestao.map((m, i) => (
                        <div key={i} style={{ display:"flex", gap:8, alignItems:"center", fontSize:"0.85rem" }}>
                          <span style={{ color:"#8b9eff" }}>•</span>
                          <span><strong>{m.qtd}</strong> mesa{m.qtd!==1?"s":""} de <strong>{m.capacidade}</strong> pessoas = {m.qtd * m.capacidade} lugares</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize:"0.78rem", color:"#7c819a", marginBottom:12 }}>
                      Total de lugares: {sugestao.reduce((acc, m) => acc + m.capacidade * m.qtd, 0)} para {numPessoas} pessoas.
                    </p>
                    <button style={{ ...S.btnPrimary, flex:"unset" }} onClick={handleAceitarSugestao}>✓ Aceitar sugestão</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {etapa === "nome" && (
          <div style={{ padding:"20px 24px" }}>
            <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
              <p style={{ fontSize:"0.8rem", color:"#22c55e", fontWeight:700, marginBottom:8 }}>✓ Mesas selecionadas</p>
              {mesasSelecionadas.map((m, i) => (
                <p key={i} style={{ fontSize:"0.82rem", color:"#a0a4ba" }}>
                  {m.qtd} mesa{m.qtd!==1?"s":""} de {m.capacidade} pessoas
                </p>
              ))}
              <p style={{ fontSize:"0.78rem", color:"#7c819a", marginTop:6 }}>
                {numPessoas} pessoas · {totalCapacidadeSel} lugares disponíveis · {horario}
              </p>
            </div>
            <div>
              <label style={{ display:"block", fontSize:"0.72rem", color:"#7c819a", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Nome do reservante</label>
              <input style={S.input} value={nomeReservante} onChange={e => setNomeReservante(e.target.value)} placeholder="Seu nome completo para a reserva" autoFocus />
            </div>
          </div>
        )}
        <div style={{ padding:"14px 24px", borderTop:"1px solid #2a2f42", display:"flex", gap:10, justifyContent:"flex-end" }}>
          {etapa === "nome" && <button style={S.btnGhost} onClick={() => setEtapa("selecao")}>Voltar</button>}
          <button style={S.btnGhost} onClick={onClose}>Cancelar</button>
          {etapa === "nome" && (
            <button style={{ ...S.btnPrimary, flex:"unset", padding:"9px 24px", opacity: nomeReservante.trim()?"1":"0.5", cursor: nomeReservante.trim()?"pointer":"not-allowed" }} onClick={handleConfirmar}>
              ✓ Confirmar Reserva
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
