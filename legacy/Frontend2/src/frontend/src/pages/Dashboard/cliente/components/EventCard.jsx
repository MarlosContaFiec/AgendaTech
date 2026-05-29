import { useState } from 'react';
import { idadeMinima, lotColor, formatDate } from '../helpers';
import BadgeClassif from './BadgeClassif';

const S = {
  eventCard: (full) => ({ background:"#13161e", border:"1px solid #2a2f42", borderRadius:12, overflow:"hidden", display:"flex", flexDirection:"column", opacity: full?0.45:1, filter: full?"grayscale(0.4)":"none", transition:"all .2s" }),
  badgePublic:     { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(34,197,94,0.15)",  color:"#22c55e" },
  badgeInscricao:  { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(91,108,255,0.15)", color:"#8b9eff" },
  badgeFull:       { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(239,68,68,0.15)",  color:"#f87171" },
  badgeRegistered: { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(34,197,94,0.15)",  color:"#22c55e" },
  badgePendente:   { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(255,169,77,0.15)", color:"#ffa94d" },
  badgeFila:       { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(139,158,255,0.15)", color:"#8b9eff" },
  btnPrimary:  { padding:"9px 16px", borderRadius:8, cursor:"pointer", border:"none", fontWeight:700, fontSize:"0.82rem", background:"#5b6cff", color:"white", transition:"all .2s", flex:1 },
  btnGhost:    { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:"0.82rem", background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", transition:"all .2s" },
  btnDanger:   { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.82rem", background:"rgba(239,68,68,0.15)", color:"#f87171", border:"1px solid rgba(239,68,68,0.3)", transition:"all .2s" },
  btnDisabled: { padding:"9px 16px", borderRadius:8, cursor:"not-allowed", border:"none", fontWeight:600, fontSize:"0.82rem", background:"#222636", color:"#7c819a", flex:1 },
  btnWarning:  { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.82rem", background:"rgba(245,200,66,0.15)", color:"#f5c842", border:"1px solid rgba(245,200,66,0.3)", transition:"all .2s" },
};

export default function EventCard({ ev, lotAtual, inscrito, isPendente, naFila, posicaoFila, idadeCliente, onVerDetalhes, onInscrever, onCancelar, onEntrarFila, onSairFila }) {
  const isFull = ev.lotacao!==null && lotAtual >= ev.lotacao;
  const pct = ev.lotacao ? lotAtual / ev.lotacao : 0;
  const minIdade = idadeMinima(ev.classificacao);
  const bloqueado = idadeCliente < minIdade;
  const filaAtual = (ev.fila || []).length;
  const limFila = ev.limFila || 3;
  const filaCheia = filaAtual >= limFila;

  return (
    <div style={S.eventCard(isFull && !naFila)}>
      <div style={{ padding:"16px 16px 12px", borderBottom:"1px solid #2a2f42" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {isFull && !naFila ? <span style={S.badgeFull}>Esgotado</span>
              : isPendente ? <span style={S.badgePendente}>⏳ Pendente</span>
              : inscrito ? <span style={S.badgeRegistered}>✓ Inscrito</span>
              : naFila ? <span style={S.badgeFila}>⏳ Fila #{posicaoFila}</span>
              : ev.publico ? <span style={S.badgePublic}>Público</span>
              : <span style={S.badgeInscricao}>Inscrição</span>}
            <BadgeClassif val={ev.classificacao} />
          </div>
          <span style={{ fontSize:"0.73rem", color:"#7c819a" }}>{ev.cidade} · {ev.estado}</span>
        </div>
        <div style={{ fontWeight:700, fontSize:"0.95rem", marginBottom:4, lineHeight:1.3 }}>{ev.titulo}</div>
        <div style={{ fontSize:"0.76rem", color:"#7c819a" }}>📍 {ev.estabelecimento} · {ev.tipo}</div>
        {ev.preco && <div style={{ fontSize:"0.76rem", color:"#22c55e", fontWeight:700, marginTop:4 }}>💰 R$ {ev.preco.toFixed(2)}</div>}
      </div>
      <div style={{ padding:"14px 16px", flex:1 }}>
        <p style={{ fontSize:"0.81rem", color:"#7c819a", lineHeight:1.55, marginBottom:12, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {ev.desc}
        </p>
        <div style={{ fontSize:"0.7rem", color:"#7c819a", marginBottom:6 }}>📅 {formatDate(ev.data)} · Horários</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:ev.lotacao?12:0 }}>
          {ev.horarios.map(h => (
            <span key={h} style={{ fontSize:"0.73rem", background:"#1a1e29", border:"1px solid #2a2f42", padding:"3px 9px", borderRadius:6 }}>{h}</span>
          ))}
        </div>
        {ev.lotacao && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:"0.72rem", color:"#7c819a" }}>Lotação</span>
              <span style={{ fontSize:"0.76rem", fontWeight:700, color:lotColor(pct) }}>{lotAtual}/{ev.lotacao}</span>
            </div>
            <div style={{ height:4, background:"#2a2f42", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min(pct*100,100)}%`, background:lotColor(pct), borderRadius:2, transition:"width .4s" }} />
            </div>
            {isFull && !naFila && (
              <div style={{ fontSize:"0.7rem", color:"#8b9eff", marginTop:4 }}>
                Fila: {filaAtual}/{limFila}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ padding:"12px 16px", borderTop:"1px solid #2a2f42", display:"flex", gap:8 }}>
        <button style={S.btnGhost} onClick={() => onVerDetalhes(ev)}>Detalhes</button>
        {bloqueado ? (
          <button style={{ ...S.btnDisabled, flex:1 }} disabled title={`Mínimo ${minIdade} anos`}>🔞 Idade mínima {minIdade}+</button>
        ) : ev.publico ? (
          <button style={{ ...S.btnPrimary }} onClick={() => onVerDetalhes(ev)}>Ver Detalhes</button>
        ) : isPendente ? (
          <button style={{ ...S.btnDanger, flex:1 }} onClick={() => onCancelar(ev)}>Cancelar Sol.</button>
        ) : inscrito ? (
          <button style={{ ...S.btnDanger, flex:1 }} onClick={() => onCancelar(ev)}>Cancelar</button>
        ) : naFila ? (
          <button style={{ ...S.btnWarning, flex:1 }} onClick={() => onSairFila(ev)}>Sair da Fila</button>
        ) : isFull ? (
          filaCheia ? (
            <button style={S.btnDisabled} disabled>Fila cheia</button>
          ) : (
            <button style={{ ...S.btnWarning, flex:1 }} onClick={() => onEntrarFila(ev)}>⏳ Entrar na Fila</button>
          )
        ) : (
          <button style={{ ...S.btnPrimary }} onClick={() => onInscrever(ev)}>
            {ev.modoAprov==="manual" ? "📤 Solicitar" : "Inscrever-se"}
          </button>
        )}
      </div>
    </div>
  );
}
