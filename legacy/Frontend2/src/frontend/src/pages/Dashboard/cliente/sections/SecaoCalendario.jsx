import { useState, useMemo } from 'react';
import { MESES, DIAS_SEMANA } from '../constants';

export default function SecaoCalendario({ registrations, eventos }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSel, setDiaSel] = useState(null);

  const eventosInscritos = useMemo(() => {
    return eventos.filter(ev => registrations[ev.id]?.inscrito || registrations[ev.id]?.pendente);
  }, [registrations, eventos]);

  const eventosPorData = useMemo(() => {
    const map = {};
    eventosInscritos.forEach(ev => { if (!map[ev.data]) map[ev.data] = []; map[ev.data].push(ev); });
    return map;
  }, [eventosInscritos]);

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes+1, 0).getDate();
  const cells = Array(primeiroDia).fill(null).concat(Array.from({length:diasNoMes},(_,i)=>i+1));
  while (cells.length % 7 !== 0) cells.push(null);

  function navMes(dir) {
    let nm = mes+dir, na = ano;
    if (nm < 0) { nm=11; na--; }
    if (nm > 11) { nm=0; na++; }
    setMes(nm); setAno(na); setDiaSel(null);
  }

  function dataStr(dia) {
    return `${ano}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
  }

  const diaSelEventos = diaSel ? (eventosPorData[dataStr(diaSel)] || []) : [];
  const proximosEventos = [...eventosInscritos].sort((a,b) => a.data.localeCompare(b.data));

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ fontWeight:700, fontSize:"1.05rem" }}>Meu Calendário</h2>
        <span style={{ fontSize:"0.8rem", color:"#7c819a" }}>{eventosInscritos.length} agendamento{eventosInscritos.length!==1?"s":""}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:18, alignItems:"start" }}>
        <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:12, padding:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <button onClick={() => navMes(-1)} style={{ background:"none", border:"none", color:"#7c819a", cursor:"pointer", fontSize:"1.1rem", padding:"2px 8px", borderRadius:6, lineHeight:1 }}>‹</button>
            <span style={{ fontWeight:700, fontSize:"0.9rem", color:"#e8eaf2" }}>{MESES[mes]} {ano}</span>
            <button onClick={() => navMes(1)} style={{ background:"none", border:"none", color:"#7c819a", cursor:"pointer", fontSize:"1.1rem", padding:"2px 8px", borderRadius:6, lineHeight:1 }}>›</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
            {DIAS_SEMANA.map(d => (
              <div key={d} style={{ textAlign:"center", fontSize:"0.65rem", color:"#7c819a", fontWeight:700, padding:"3px 0" }}>{d}</div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {cells.map((dia, i) => {
              if (!dia) return <div key={i} />;
              const ds = dataStr(dia);
              const temEvento = !!eventosPorData[ds];
              const qtdEventos = temEvento ? eventosPorData[ds].length : 0;
              const isHoje = dia===hoje.getDate() && mes===hoje.getMonth() && ano===hoje.getFullYear();
              const isSel = dia===diaSel;
              return (
                <div key={i} onClick={() => setDiaSel(dia===diaSel?null:dia)}
                  style={{ aspectRatio:"1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", borderRadius:6, cursor:"pointer",
                    background: isSel?"#5b6cff": isHoje?"rgba(91,108,255,0.18)": temEvento?"rgba(91,108,255,0.07)":"transparent",
                    border: isHoje&&!isSel?"1px solid rgba(91,108,255,0.45)":"1px solid transparent", transition:"all .15s" }}>
                  <span style={{ fontSize:"0.78rem", fontWeight: isHoje||temEvento?700:400, color: isSel?"white": isHoje?"#8b9eff":"#c8cce0", lineHeight:1 }}>{dia}</span>
                  {temEvento && (
                    <div style={{ display:"flex", gap:2, marginTop:2 }}>
                      {Array.from({length:Math.min(qtdEventos,3)}).map((_,idx) => (
                        <div key={idx} style={{ width:4, height:4, borderRadius:"50%", background: isSel?"white":"#5b6cff" }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:12, paddingTop:10, borderTop:"1px solid #2a2f42", display:"flex", gap:12, fontSize:"0.68rem", color:"#7c819a" }}>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:8, height:8, borderRadius:"50%", background:"#5b6cff" }} /> Evento</span>
            <span style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:8, height:8, borderRadius:2, background:"rgba(91,108,255,0.18)", border:"1px solid rgba(91,108,255,0.45)" }} /> Hoje</span>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {diaSel ? (
            <>
              <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:10, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><p style={{ fontSize:"0.68rem", color:"#7c819a", marginBottom:2 }}>Selecionado</p><p style={{ fontWeight:700, fontSize:"0.92rem" }}>{String(diaSel).padStart(2,"0")}/{String(mes+1).padStart(2,"0")}/{ano}</p></div>
                <button onClick={() => setDiaSel(null)} style={{ background:"none", border:"none", color:"#7c819a", cursor:"pointer", fontSize:"1rem" }}>×</button>
              </div>
              {diaSelEventos.length===0 ? (
                <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:10, padding:"20px 16px", textAlign:"center" }}><p style={{ color:"#7c819a", fontSize:"0.83rem" }}>Nenhum evento neste dia.</p></div>
              ) : diaSelEventos.map(ev => (
                <div key={ev.id} style={{ background:"#13161e", border:"1px solid rgba(91,108,255,0.35)", borderRadius:10, padding:14, borderLeft:"3px solid #5b6cff" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                    <p style={{ fontWeight:700, fontSize:"0.88rem" }}>{ev.titulo}</p>
                    {registrations[ev.id]?.pendente && <span style={{ fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, background:"rgba(255,169,77,0.15)", color:"#ffa94d" }}>⏳ Pendente</span>}
                  </div>
                  <p style={{ fontSize:"0.74rem", color:"#7c819a", marginBottom:8 }}>{ev.estabelecimento}</p>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {registrations[ev.id]?.horario
                      ? <span style={{ fontSize:"0.72rem", background:"rgba(91,108,255,0.15)", color:"#8b9eff", padding:"2px 8px", borderRadius:4 }}>🕐 {registrations[ev.id].horario}</span>
                      : ev.horarios.map(h => <span key={h} style={{ fontSize:"0.72rem", background:"#1a1e29", border:"1px solid #2a2f42", padding:"2px 8px", borderRadius:4 }}>{h}</span>)
                    }
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {proximosEventos.length === 0 ? (
                <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:10, padding:"32px 0", textAlign:"center" }}>
                  <div style={{ fontSize:"2rem", marginBottom:8 }}>📅</div>
                  <p style={{ color:"#7c819a", fontSize:"0.85rem" }}>Nenhum agendamento ainda.</p>
                  <p style={{ color:"#7c819a", fontSize:"0.75rem", marginTop:4 }}>Inscreva-se em serviços para vê-los aqui.</p>
                </div>
              ) : (
                <>
                  <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:10, padding:"10px 14px" }}>
                    <p style={{ fontSize:"0.68rem", color:"#7c819a", textTransform:"uppercase", letterSpacing:0.5 }}>Clique em um dia marcado para ver detalhes</p>
                  </div>
                  {proximosEventos.map(ev => (
                    <div key={ev.id} style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:10, padding:12, display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ background:"rgba(91,108,255,0.15)", borderRadius:8, padding:"5px 8px", textAlign:"center", minWidth:36, flexShrink:0 }}>
                        <div style={{ fontSize:"0.6rem", color:"#7c819a", lineHeight:1 }}>{MESES[parseInt(ev.data.split("-")[1])-1].slice(0,3).toUpperCase()}</div>
                        <div style={{ fontSize:"1rem", fontWeight:700, color:"#8b9eff", lineHeight:1.2 }}>{ev.data.split("-")[2]}</div>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:"0.85rem", fontWeight:600, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{ev.titulo}</p>
                        <p style={{ fontSize:"0.72rem", color:"#7c819a", marginBottom:5 }}>{ev.estabelecimento}</p>
                        <span style={{ fontSize:"0.7rem", background:"rgba(91,108,255,0.12)", color:"#8b9eff", padding:"2px 7px", borderRadius:4 }}>
                          🕐 {registrations[ev.id]?.horario || ev.horarios[0]}
                        </span>
                        {registrations[ev.id]?.pendente && <span style={{ fontSize:"0.65rem", color:"#ffa94d", marginLeft:6 }}>⏳ Pendente</span>}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
