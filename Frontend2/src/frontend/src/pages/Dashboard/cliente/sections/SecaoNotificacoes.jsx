import { formatDate, timeAgo } from '../helpers';

export default function SecaoNotificacoes({ notificacoes, onMarcarLida, onMarcarTodasLidas, onAceitarFila, onRecusarFila }) {
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  function iconeNotif(tipo) {
    switch(tipo) {
      case "solicitacao_aprovada":    return { icon:"✅", cor:"#22d48a", bg:"rgba(34,212,138,0.10)", label:"Aprovado" };
      case "solicitacao_recusada":    return { icon:"❌", cor:"#ff5c7a", bg:"rgba(255,92,122,0.10)", label:"Recusado" };
      case "evento_cancelado":        return { icon:"🚫", cor:"#ffa94d", bg:"rgba(255,169,77,0.10)", label:"Cancelado" };
      case "lembrete":                return { icon:"🔔", cor:"#4f8cff", bg:"rgba(79,140,255,0.10)", label:"Lembrete" };
      case "fila_promovido":          return { icon:"🎉", cor:"#22c55e", bg:"rgba(34,197,94,0.10)", label:"Promovido" };
      case "fila_aguardando_aceite":  return { icon:"⏳", cor:"#f5c842", bg:"rgba(245,200,66,0.10)", label:"Vaga Disponível" };
      case "fila_entrada":            return { icon:"📋", cor:"#8b9eff", bg:"rgba(91,108,255,0.10)", label:"Na Fila" };
      default:                        return { icon:"📌", cor:"#7c819a", bg:"rgba(124,129,154,0.10)", label:"Info" };
    }
  }

  function textoNotif(n) {
    switch(n.tipo) {
      case "solicitacao_aprovada":
        return <>Sua solicitação para <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong> foi <strong style={{color:"#22d48a"}}>aprovada</strong>! {n.horario ? `Horário: ${n.horario}` : ""} {n.data ? `· ${formatDate(n.data)}` : ""}</>;
      case "solicitacao_recusada":
        return <>Sua solicitação para <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong> foi <strong style={{color:"#ff5c7a"}}>recusada</strong> pela empresa.</>;
      case "evento_cancelado":
        return <>O evento <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong> foi <strong style={{color:"#ffa94d"}}>cancelado</strong> pela empresa.</>;
      case "lembrete":
        return <>Lembrete: o evento <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong> está chegando! {n.data ? `📅 ${formatDate(n.data)}` : ""}</>;
      case "fila_promovido":
        return <>🎉 Você saiu da fila e foi <strong style={{color:"#22c55e"}}>agendado</strong> em <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong>! {n.horario ? `Horário: ${n.horario}` : ""}</>;
      case "fila_aguardando_aceite":
        return <>
          Uma vaga surgiu em <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong>!
          {n.horario && <> Horário: <strong style={{color:"#f5c842"}}>{n.horario}</strong></>}
          {n.data && <> · 📅 {formatDate(n.data)}</>}
          <div style={{marginTop:4, fontSize:"0.78rem", color:"#7c819a"}}>Aceite ou recuse antes que a vaga passe para o próximo da fila.</div>
        </>;
      case "fila_entrada":
        return <>Você entrou na fila de espera de <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong>.{n.horario ? ` Horário desejado: ${n.horario}` : ""} Você será notificado se surgir uma vaga.</>;
      default:
        return <>{n.eventoTitulo}</>;
    }
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ fontWeight:700, fontSize:"1.05rem" }}>Notificações</h2>
          <p style={{ fontSize:"0.82rem", color:"#7c819a", marginTop:3 }}>{naoLidas > 0 ? `${naoLidas} não lida${naoLidas!==1?"s":""}` : "Tudo em dia"}</p>
        </div>
        {naoLidas > 0 && (
          <button style={{ background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:"0.78rem", fontWeight:600 }} onClick={onMarcarTodasLidas}>
            ✓ Marcar todas como lidas
          </button>
        )}
      </div>
      {notificacoes.length === 0 ? (
        <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:12, padding:"50px 0", textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:12 }}>🔔</div>
          <p style={{ color:"#7c819a", fontSize:"0.9rem" }}>Nenhuma notificação ainda.</p>
          <p style={{ color:"#7c819a", fontSize:"0.78rem", marginTop:6 }}>Solicitações aprovadas e lembretes de eventos aparecerão aqui.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[...notificacoes].reverse().map(n => {
            const info = iconeNotif(n.tipo);
            const isAguardando = n.tipo === "fila_aguardando_aceite" && !n.aceito && !n.recusado;
            return (
              <div key={n.id} onClick={() => !n.lida && n.tipo !== "fila_aguardando_aceite" && onMarcarLida(n.id)}
                style={{ background:"#13161e", border:`1px solid ${isAguardando?"rgba(245,200,66,0.4)":n.lida?"#2a2f42":"rgba(91,108,255,0.25)"}`, borderRadius:12, padding:"14px 18px", display:"flex", gap:14, alignItems:"flex-start", cursor: (n.lida||isAguardando)?"default":"pointer", transition:"all .15s", opacity: (n.lida&&!isAguardando)?0.65:1,
                  boxShadow: isAguardando?"0 0 0 1px rgba(245,200,66,0.2), 0 4px 20px rgba(245,200,66,0.08)":"none" }}>
                <div style={{ width:38, height:38, borderRadius:10, background:info.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 }}>
                  {info.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                    <span style={{ fontSize:"0.62rem", padding:"2px 8px", borderRadius:20, fontWeight:700, background:`${info.cor}22`, color:info.cor, textTransform:"uppercase", letterSpacing:0.5 }}>
                      {info.label}
                    </span>
                    <span style={{ fontSize:"0.72rem", color:"#7c819a" }}>{timeAgo(n.criadaEm)}</span>
                  </div>
                  <p style={{ fontSize:"0.83rem", color:"#a0a4ba", lineHeight:1.55 }}>{textoNotif(n)}</p>
                  {isAguardando && (
                    <div style={{ display:"flex", gap:8, marginTop:12 }}>
                      <button onClick={e => { e.stopPropagation(); onAceitarFila(n); }}
                        style={{ padding:"8px 20px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.8rem", background:"rgba(34,197,94,0.2)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.35)" }}>
                        ✓ Aceitar Vaga
                      </button>
                      <button onClick={e => { e.stopPropagation(); onRecusarFila(n); }}
                        style={{ padding:"8px 20px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:"0.8rem", background:"rgba(239,68,68,0.12)", color:"#f87171", border:"1px solid rgba(239,68,68,0.25)" }}>
                        ✕ Recusar
                      </button>
                    </div>
                  )}
                  {n.aceito && <div style={{ marginTop:8, fontSize:"0.75rem", color:"#22c55e", fontWeight:600 }}>✓ Você aceitou esta vaga.</div>}
                  {n.recusado && <div style={{ marginTop:8, fontSize:"0.75rem", color:"#f87171", fontWeight:600 }}>✕ Você recusou esta vaga.</div>}
                </div>
                {!n.lida && !isAguardando && <div style={{ width:8, height:8, borderRadius:"50%", background:"#5b6cff", marginTop:4, flexShrink:0 }} />}
                {isAguardando && <div style={{ width:8, height:8, borderRadius:"50%", background:"#f5c842", marginTop:4, flexShrink:0, animation:"pulse 1.5s infinite" }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
