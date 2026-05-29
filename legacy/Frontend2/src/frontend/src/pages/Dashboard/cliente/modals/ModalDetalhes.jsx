import { useState } from 'react';
import { idadeMinima, lotColor, formatDate } from '../helpers';
import { CLASSIF_INFO } from '../constants';
import BadgeClassif from '../components/BadgeClassif';
import ModalEntrarFila from './ModalEntrarFila';

const S = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:   { background:"#13161e", border:"1px solid #2a2f42", borderRadius:16, width:"100%", maxWidth:480, overflow:"hidden", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" },
  badgePublic:     { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(34,197,94,0.15)",  color:"#22c55e" },
  badgeInscricao:  { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(91,108,255,0.15)", color:"#8b9eff" },
  badgeFull:       { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(239,68,68,0.15)",  color:"#f87171" },
  badgeRegistered: { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(34,197,94,0.15)",  color:"#22c55e" },
  badgePendente:   { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(255,169,77,0.15)", color:"#ffa94d" },
  badgeFila:       { fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:"rgba(139,158,255,0.15)", color:"#8b9eff" },
  btnPrimary:  { padding:"9px 16px", borderRadius:8, cursor:"pointer", border:"none", fontWeight:700, fontSize:"0.82rem", background:"#5b6cff", color:"white", transition:"all .2s", flex:1 },
  btnGhost:    { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:"0.82rem", background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", transition:"all .2s" },
  btnDanger:   { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.82rem", background:"rgba(239,68,68,0.15)", color:"#f87171", border:"1px solid rgba(239,68,68,0.3)", transition:"all .2s" },
  btnWarning:  { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.82rem", background:"rgba(245,200,66,0.15)", color:"#f5c842", border:"1px solid rgba(245,200,66,0.3)", transition:"all .2s" },
};

export default function ModalDetalhes({ evento, inscrito, isPendente, isFull, lotAtual, idadeCliente, naFila, posicaoFila, onClose, onInscrever, onCancelar, onEntrarFila, onSairFila }) {
  const [showModalFila, setShowModalFila] = useState(false);
  const pct = evento.lotacao ? lotAtual / evento.lotacao : 0;
  const minIdade = idadeMinima(evento.classificacao);
  const bloqueado = idadeCliente < minIdade;
  const classif = CLASSIF_INFO[evento.classificacao] || CLASSIF_INFO["livre"];
  const filaAtual = (evento.fila || []).length;
  const limFila = evento.limFila || 3;
  const filaCheia = filaAtual >= limFila;

  return (
    <>
    <div style={S.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #2a2f42" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
                {isFull && !naFila ? <span style={S.badgeFull}>Esgotado</span>
                  : isPendente ? <span style={S.badgePendente}>⏳ Aguardando aprovação</span>
                  : inscrito ? <span style={S.badgeRegistered}>✓ Inscrito</span>
                  : naFila ? <span style={S.badgeFila}>⏳ Na fila #{posicaoFila}</span>
                  : evento.publico ? <span style={S.badgePublic}>Público</span>
                  : <span style={S.badgeInscricao}>Inscrição</span>}
                <BadgeClassif val={evento.classificacao} />
                {evento.preco && <span style={{ fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, background:"rgba(34,197,94,0.15)", color:"#22c55e" }}>💰 R$ {evento.preco.toFixed(2)}</span>}
              </div>
              <h3 style={{ fontWeight:700, fontSize:"1.05rem" }}>{evento.titulo}</h3>
              <p style={{ fontSize:"0.8rem", color:"#7c819a", marginTop:3 }}>{evento.estabelecimento} · {evento.cidade}, {evento.estado}</p>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#7c819a", fontSize:"1.3rem", cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <p style={{ fontSize:"0.87rem", color:"#a0a4ba", lineHeight:1.65, marginBottom:16 }}>{evento.desc}</p>
          {[["🏢",`${evento.tipo} — ${evento.estabelecimento}`],["📅",`Data: ${formatDate(evento.data)}`],["🕐",`Horários: ${evento.horarios.join(" · ")}`],["📍",`${evento.cidade}, ${evento.estado}`]].map(([icon,text]) => (
            <div key={text} style={{ display:"flex", gap:8, marginBottom:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:14 }}>{icon}</span>
              <span style={{ fontSize:"0.85rem", color:"#a0a4ba" }}>{text}</span>
            </div>
          ))}
          {evento.preco && (
            <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:14 }}>💰</span>
              <span style={{ fontSize:"0.85rem", color:"#22c55e", fontWeight:700 }}>R$ {evento.preco.toFixed(2)} por pessoa</span>
            </div>
          )}
          {evento.lotacao && (
            <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #2a2f42" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:"0.78rem", color:"#7c819a" }}>Vagas preenchidas</span>
                <span style={{ fontSize:"0.85rem", fontWeight:700, color: lotColor(pct) }}>{lotAtual} / {evento.lotacao}</span>
              </div>
              <div style={{ height:7, background:"#2a2f42", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${Math.min(pct*100,100)}%`, background:lotColor(pct), borderRadius:3, transition:"width .4s" }} />
              </div>
              {isFull && (
                <div style={{ marginTop:10, fontSize:"0.78rem", color:"#8b9eff" }}>
                  Fila de espera: {filaAtual}/{limFila} {filaCheia ? "(cheia)" : ""}
                </div>
              )}
            </div>
          )}
          {bloqueado && (
            <div style={{ marginTop:14, background:"rgba(167,139,250,0.1)", border:"1px solid rgba(167,139,250,0.25)", borderRadius:8, padding:"10px 14px", fontSize:"0.8rem", color:"#c084fc" }}>
              {classif.icon} Este evento é classificado <strong>{classif.label}</strong>. Você precisa ter no mínimo {minIdade} anos para se inscrever.
            </div>
          )}
          {naFila && (
            <div style={{ marginTop:14, background:"rgba(91,108,255,0.08)", border:"1px solid rgba(91,108,255,0.25)", borderRadius:8, padding:"10px 14px", fontSize:"0.8rem", color:"#8b9eff" }}>
              ⏳ Você está na posição <strong>#{posicaoFila}</strong> da fila de espera. Você será notificado automaticamente caso uma vaga seja liberada.
            </div>
          )}
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #2a2f42", display:"flex", gap:10, justifyContent:"flex-end", flexWrap:"wrap" }}>
          <button style={S.btnGhost} onClick={onClose}>Fechar</button>
          {!evento.publico && !isFull && !inscrito && !isPendente && !bloqueado && !naFila && (
            <button style={{ ...S.btnPrimary, flex:"unset", padding:"9px 20px" }} onClick={onInscrever}>
              {evento.modoAprov==="manual" ? "📤 Solicitar Inscrição" : "Inscrever-se"}
            </button>
          )}
          {!evento.publico && !inscrito && !isPendente && !naFila && !bloqueado && !filaCheia && (
            <button style={{ ...S.btnWarning, flex:"unset", padding:"9px 20px" }} onClick={() => setShowModalFila(true)}>
              ⏳ Entrar na Fila
            </button>
          )}
          {naFila && (
            <button style={{ ...S.btnDanger, cursor:"pointer" }} onClick={onSairFila}>Sair da Fila</button>
          )}
          {isPendente && (
            <button style={{ ...S.btnDanger, cursor:"pointer" }} onClick={onCancelar}>Cancelar Solicitação</button>
          )}
          {inscrito && (
            <button style={{ ...S.btnDanger, cursor:"pointer" }} onClick={onCancelar}>Cancelar Inscrição</button>
          )}
        </div>
      </div>
    </div>
    {showModalFila && (
      <ModalEntrarFila
        evento={evento}
        onConfirm={(horario) => { setShowModalFila(false); onEntrarFila(horario); }}
        onClose={() => setShowModalFila(false)}
      />
    )}
    </>
  );
}
