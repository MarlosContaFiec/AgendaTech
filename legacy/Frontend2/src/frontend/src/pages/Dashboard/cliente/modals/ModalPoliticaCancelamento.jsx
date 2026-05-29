import { useState } from 'react';
import { POLITICA_CANCELAMENTO } from '../constants';

const S = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:   { background:"#13161e", border:"1px solid #2a2f42", borderRadius:16, width:"100%", maxWidth:480, overflow:"hidden", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" },
  btnPrimary: { padding:"9px 16px", borderRadius:8, cursor:"pointer", border:"none", fontWeight:700, fontSize:"0.82rem", background:"#5b6cff", color:"white", transition:"all .2s", flex:1 },
  btnGhost:   { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:"0.82rem", background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", transition:"all .2s" },
};

export default function ModalPoliticaCancelamento({ onAceitar, onFechar, mostrarNaoMostrarNovamente }) {
  const [aceito, setAceito] = useState(false);
  const [naoMostrar, setNaoMostrar] = useState(false);

  return (
    <div style={S.overlay} onClick={e => e.target===e.currentTarget && onFechar()}>
      <div style={S.modal}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #2a2f42" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:"0.72rem", color:"#ffa94d", marginBottom:4, textTransform:"uppercase", letterSpacing:0.5 }}>⚠️ Política de Cancelamento</p>
              <h3 style={{ fontWeight:700, fontSize:"1.05rem" }}>Leia antes de confirmar</h3>
            </div>
            <button onClick={onFechar} style={{ background:"none", border:"none", color:"#7c819a", fontSize:"1.3rem", cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <div style={{ background:"rgba(255,169,77,0.08)", border:"1px solid rgba(255,169,77,0.25)", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
            <p style={{ fontSize:"0.82rem", color:"#ffa94d", fontWeight:700, marginBottom:8 }}>
              ⏰ Prazo: {POLITICA_CANCELAMENTO.horasAntecedencia} horas de antecedência
            </p>
            <p style={{ fontSize:"0.82rem", color:"#a0a4ba", lineHeight:1.65 }}>
              {POLITICA_CANCELAMENTO.descricao}
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:"1rem", marginTop:1 }}>✅</span>
              <div>
                <p style={{ fontSize:"0.8rem", fontWeight:700, color:"#22c55e", marginBottom:3 }}>Cancelamento com mais de 24h</p>
                <p style={{ fontSize:"0.78rem", color:"#a0a4ba" }}>Reembolso integral do valor pago. Pontos devolvidos.</p>
              </div>
            </div>
            <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-start" }}>
              <span style={{ fontSize:"1rem", marginTop:1 }}>❌</span>
              <div>
                <p style={{ fontSize:"0.8rem", fontWeight:700, color:"#f87171", marginBottom:3 }}>Cancelamento com menos de 24h</p>
                <p style={{ fontSize:"0.78rem", color:"#a0a4ba" }}>Sem reembolso. Pontos utilizados são perdidos.</p>
              </div>
            </div>
          </div>
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:10 }}>
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"10px 14px", background: aceito?"rgba(91,108,255,0.1)":"#1a1e29", border: aceito?"1px solid #5b6cff":"1px solid #2a2f42", borderRadius:8, fontSize:"0.85rem", transition:"all .15s" }}>
              <input type="checkbox" checked={aceito} onChange={e => setAceito(e.target.checked)} style={{ accentColor:"#5b6cff", width:16, height:16 }} />
              <span>Li e aceito a política de cancelamento</span>
            </label>
            {mostrarNaoMostrarNovamente && (
              <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", padding:"8px 14px", background:"transparent", fontSize:"0.8rem", color:"#7c819a" }}>
                <input type="checkbox" checked={naoMostrar} onChange={e => setNaoMostrar(e.target.checked)} style={{ accentColor:"#5b6cff", width:14, height:14 }} />
                <span>Não mostrar novamente para este tipo de evento</span>
              </label>
            )}
          </div>
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #2a2f42", display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={S.btnGhost} onClick={onFechar}>Voltar</button>
          <button style={{ ...S.btnPrimary, flex:"unset", padding:"9px 24px", opacity: aceito?1:0.5, cursor: aceito?"pointer":"not-allowed" }} onClick={() => aceito && onAceitar(naoMostrar)}>Continuar</button>
        </div>
      </div>
    </div>
  );
}
