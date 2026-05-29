import { useState, useEffect } from 'react';
import { getShared, setShared } from './store';
import { PERFIL_INICIAL, EVENTOS_FALLBACK, CLIENT_ID } from './constants';
import ToastCliente from './components/ToastCliente';
import SecaoServicos from './sections/SecaoServicos';
import SecaoCalendario from './sections/SecaoCalendario';
import SecaoNotificacoes from './sections/SecaoNotificacoes';
import SecaoPerfil from './sections/SecaoPerfil';

export default function PainelCliente() {
  const [aba, setAba] = useState("servicos");
  const [perfil, setPerfil] = useState(PERFIL_INICIAL);
  const [registrations, setRegistrations] = useState({});
  const [toast, setToast] = useState({ msg:"", type:"success" });
  const [notificacoes, setNotificacoes] = useState([]);
  const [temaClaro, setTemaClaro] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState(1);
  const [cursorGrande, setCursorGrande] = useState(false);
  const [eventos, setEventos] = useState(() => {
    const shared = getShared();
    return shared?.eventos || EVENTOS_FALLBACK;
  });

  useEffect(() => {
    function sincronizar() {
      const shared = getShared();
      if (!shared) return;
      if (shared.eventos) setEventos(shared.eventos);
      const notifs = (shared.notificacoes || []).filter(n => n.clienteId === CLIENT_ID || !n.clienteId);
      setNotificacoes(notifs);
    }
    sincronizar();
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);

  function showToast(msg, type="success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"", type:"success" }), 3000);
  }

  function adicionarNotificacao(notif) {
    const shared = getShared() || {};
    const novaNotif = { ...notif, id: Date.now().toString(), criadaEm: new Date().toISOString(), lida: false, clienteId: CLIENT_ID };
    const notifs = [...(shared.notificacoes || []), novaNotif];
    setShared({ ...shared, notificacoes: notifs });
    setNotificacoes(notifs.filter(n => n.clienteId === CLIENT_ID || !n.clienteId));
  }

  function handleInscrever(ev, horarios, justificativa, forceSolicitar, dadosReserva) {
    const horariosArr = Array.isArray(horarios) ? horarios : [horarios];
    const horario = horariosArr[0];
    const lotAtual = registrations[ev.id]?.count || (ev.inscritos?.length || 0);
    if (ev.lotacao && lotAtual > ev.lotacao) { showToast("Vagas insuficientes!", "error"); return; }
    const deveSolicitar = forceSolicitar || ev.modoAprov === "manual";
    if (deveSolicitar) {
      const shared = getShared() || {};
      const eventosShared = (shared.eventos || eventos).map(e => {
        if (e.id !== ev.id) return e;
        const jaTemPendente = (e.pendentes||[]).some(p => p.clienteId === CLIENT_ID && p.horario === horario);
        if (jaTemPendente) return e;
        return { ...e, pendentes: [...(e.pendentes||[]), { clienteId:CLIENT_ID, horario, horarios: horariosArr, justificativa, solicitadoEm: new Date().toISOString().split("T")[0], nomeCliente: perfil.nome }] };
      });
      setShared({ ...shared, eventos: eventosShared });
      setEventos(eventosShared);
      setRegistrations(r => ({ ...r, [ev.id]: { pendente:true, count: lotAtual, horario } }));
      showToast(`Solicitação enviada para "${ev.titulo}" — aguarde aprovação`, "info");
    } else {
      const shared = getShared() || {};
      const eventosShared = (shared.eventos || eventos).map(e => {
        if (e.id !== ev.id) return e;
        return { ...e, inscritos: [...(e.inscritos||[]), { clienteId:CLIENT_ID, horario, horarios: horariosArr, nomeCliente: perfil.nome, dadosReserva }] };
      });
      setShared({ ...shared, eventos: eventosShared });
      setEventos(eventosShared);
      setRegistrations(r => ({ ...r, [ev.id]: { inscrito:true, count:(r[ev.id]?.count||0)+1, horario } }));
      if (dadosReserva) showToast(`Reserva confirmada em "${ev.titulo}" para ${dadosReserva.numPessoas} pessoas ✓`);
      else showToast(`Inscrição confirmada em "${ev.titulo}" ✓`);
    }
  }

  function handleCancelar(ev, motivo) {
    const shared = getShared() || {};
    const eventosShared = (shared.eventos || eventos).map(e => {
      if (e.id !== ev.id) return e;
      const novoInscritos = (e.inscritos||[]).filter(i => i.clienteId !== CLIENT_ID);
      const novoPendentes = (e.pendentes||[]).filter(p => p.clienteId !== CLIENT_ID);
      let novaFila = [...(e.fila||[])];
      if (novaFila.length > 0 && e.lotacao) {
        if (novoInscritos.length < e.lotacao) {
          const candidato = novaFila[0];
          const notifAguardando = {
            id: Date.now().toString() + "_fila_aceite",
            tipo: "fila_aguardando_aceite",
            eventoTitulo: e.titulo, eventoId: e.id,
            horario: candidato.horario, data: e.data,
            clienteId: candidato.clienteId,
            criadaEm: new Date().toISOString(), lida: false,
          };
          shared.notificacoes = [...(shared.notificacoes || []), notifAguardando];
          if (candidato.clienteId === CLIENT_ID) {
            setNotificacoes((shared.notificacoes).filter(n => n.clienteId === CLIENT_ID || !n.clienteId));
          }
        }
      }
      return { ...e, inscritos: novoInscritos, pendentes: novoPendentes, fila: novaFila };
    });
    setShared({ ...shared, eventos: eventosShared });
    setEventos(eventosShared);
    setRegistrations(r => ({ ...r, [ev.id]: { inscrito:false, pendente:false, count: Math.max(0,(r[ev.id]?.count||1)-1), horario:null } }));
    showToast(`Inscrição cancelada. Motivo: ${motivo}`);
  }

  function handleAceitarFila(notif) {
    const shared = getShared() || {};
    const eventosShared = (shared.eventos || eventos).map(e => {
      if (e.id !== notif.eventoId) return e;
      const fila = [...(e.fila||[])];
      const idx = fila.findIndex(f => f.clienteId === CLIENT_ID);
      if (idx === -1) return e;
      const promovido = fila.splice(idx, 1)[0];
      const novasInscritos = [...(e.inscritos||[]), { clienteId: CLIENT_ID, horario: promovido.horario, nomeCliente: promovido.nomeCliente, promovidoDaFila: true }];
      return { ...e, inscritos: novasInscritos, fila };
    });
    const notifs = (shared.notificacoes || []).map(n =>
      n.id === notif.id ? { ...n, lida: true, aceito: true } : n
    );
    shared.notificacoes = notifs;
    setShared({ ...shared, eventos: eventosShared });
    setEventos(eventosShared);
    setNotificacoes(notifs.filter(n => n.clienteId === CLIENT_ID || !n.clienteId));
    setRegistrations(r => ({ ...r, [notif.eventoId]: { inscrito:true, count:(r[notif.eventoId]?.count||0)+1, horario: notif.horario } }));
    showToast("Vaga aceita! Você foi inscrito ✓");
  }

  function handleRecusarFila(notif) {
    const shared = getShared() || {};
    const eventosShared = (shared.eventos || eventos).map(e => {
      if (e.id !== notif.eventoId) return e;
      const fila = [...(e.fila||[])];
      const idx = fila.findIndex(f => f.clienteId === CLIENT_ID);
      if (idx !== -1) fila.splice(idx, 1);
      return { ...e, fila };
    });
    const notifs = (shared.notificacoes || []).map(n =>
      n.id === notif.id ? { ...n, lida: true, recusado: true } : n
    );
    shared.notificacoes = notifs;
    setShared({ ...shared, eventos: eventosShared });
    setEventos(eventosShared);
    setNotificacoes(notifs.filter(n => n.clienteId === CLIENT_ID || !n.clienteId));
    showToast("Vaga recusada. Você saiu da fila.");
  }

  function handleEntrarFila(ev, horario) {
    const shared = getShared() || {};
    const eventosShared = (shared.eventos || eventos).map(e => {
      if (e.id !== ev.id) return e;
      const jaNaFila = (e.fila||[]).some(f => f.clienteId === CLIENT_ID);
      if (jaNaFila) return e;
      return { ...e, fila: [...(e.fila||[]), { clienteId:CLIENT_ID, horario, nomeCliente:perfil.nome, entradoEm: new Date().toISOString() }] };
    });
    setShared({ ...shared, eventos: eventosShared });
    setEventos(eventosShared);
    adicionarNotificacao({ tipo:"fila_entrada", eventoTitulo:ev.titulo, eventoId:ev.id, horario });
    showToast(`Você entrou na fila de "${ev.titulo}" para o horário ${horario}`, "info");
  }

  function handleSairFila(ev) {
    const shared = getShared() || {};
    const eventosShared = (shared.eventos || eventos).map(e => {
      if (e.id !== ev.id) return e;
      return { ...e, fila: (e.fila||[]).filter(f => f.clienteId !== CLIENT_ID) };
    });
    setShared({ ...shared, eventos: eventosShared });
    setEventos(eventosShared);
    showToast("Você saiu da fila.");
  }

  function handleMarcarLida(notifId) {
    const shared = getShared() || {};
    const notifs = (shared.notificacoes || []).map(n => n.id === notifId ? { ...n, lida:true } : n);
    shared.notificacoes = notifs;
    setShared(shared);
    setNotificacoes(notifs.filter(n => n.clienteId === CLIENT_ID || !n.clienteId));
  }

  function handleMarcarTodasLidas() {
    const shared = getShared() || {};
    const notifs = (shared.notificacoes || []).map(n =>
      (n.clienteId === CLIENT_ID || !n.clienteId) ? { ...n, lida:true } : n
    );
    shared.notificacoes = notifs;
    setShared(shared);
    setNotificacoes(notifs.filter(n => n.clienteId === CLIENT_ID || !n.clienteId));
  }

  const T = temaClaro ? {
    bg:"#e8eaf0", bgSidebar:"#d8dae5", bgCard:"#dfe1ec", bgInput:"#cfd1df", border:"#b8bcd0",
    text:"#1a1e2e", textMuted:"#5a5f78", accent:"#4050d0", accentBg:"rgba(64,80,208,0.12)",
  } : {
    bg:"#0d0f14", bgSidebar:"#13161e", bgCard:"#13161e", bgInput:"#1a1e29", border:"#2a2f42",
    text:"#e8eaf2", textMuted:"#7c819a", accent:"#5b6cff", accentBg:"rgba(91,108,255,0.12)",
  };

  const NAV = [
    { id:"servicos",     icon:"search",          texto:"Explorar" },
    { id:"calendario",   icon:"calendar_month",   texto:"Calendário" },
    { id:"notificacoes", icon:"notifications",    texto:"Notificações" },
    { id:"perfil",       icon:"person",           texto:"Meu Perfil" },
  ];

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bg, color:T.text, fontFamily:"'DM Sans',sans-serif", overflow:"hidden", fontSize:`${tamanhoFonte}rem`, cursor: cursorGrande ? "url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="M8,2 L8,26 L13,20 L18,30 L21,28.5 L16,18.5 L23,18.5 Z" fill="%23ffffff" stroke="%23000000" stroke-width="1.5"/></svg>') 4 2, auto" : "auto" }}>
      {/* SIDEBAR */}
      <div style={{ width:230, background:T.bgSidebar, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", paddingTop:20, flexShrink:0 }}>
        <div style={{ padding:"0 20px 20px", fontWeight:800, fontSize:"1.1rem", display:"flex", alignItems:"center", gap:10, color:T.text }}>
          <div style={{ background:`linear-gradient(135deg,${T.accent},#8b5cf6)`, width:28, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"white" }}>A</div>
          <div>
            <div>AgendaTech</div>
            <div style={{ fontSize:"0.6rem", color:T.textMuted, fontWeight:400 }}>área do cliente</div>
          </div>
        </div>
        <div style={{ padding:"0 20px 6px", fontSize:"0.62rem", color:T.textMuted, textTransform:"uppercase", letterSpacing:1 }}>Navegação</div>
        {NAV.map(item => (
          <div key={item.id} onClick={() => setAba(item.id)}
            style={{ padding:"11px 20px", display:"flex", alignItems:"center", gap:10, color: aba===item.id?T.accent:T.textMuted, cursor:"pointer", fontSize:"0.88rem", background: aba===item.id?T.accentBg:"transparent", borderLeft: aba===item.id?`3px solid ${T.accent}`:"3px solid transparent", transition:"all .2s", position:"relative" }}>
            <span className="material-icons-outlined" style={{ fontSize:20 }}>{item.icon}</span>
            {item.texto}
            {item.id === "notificacoes" && naoLidas > 0 && (
              <span style={{ position:"absolute", right:16, background:"#ef4444", color:"white", fontSize:"0.6rem", fontWeight:800, width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{naoLidas}</span>
            )}
          </div>
        ))}
        <div style={{ marginTop:"auto", padding:16, borderTop:`1px solid ${T.border}` }}>
          <div style={{ background:T.bgInput, border:`1px solid ${T.border}`, borderRadius:10, padding:12 }}>
            <p style={{ fontSize:"0.72rem", color:T.textMuted, marginBottom:8, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>⚙️ Acessibilidade</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:"0.78rem", color:T.textMuted }}>
                <input type="checkbox" checked={temaClaro} onChange={e => setTemaClaro(e.target.checked)} style={{ accentColor:T.accent }} /> Tema Claro
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", fontSize:"0.78rem", color:T.textMuted }}>
                <input type="checkbox" checked={cursorGrande} onChange={e => setCursorGrande(e.target.checked)} style={{ accentColor:T.accent }} /> Cursor Grande
              </label>
              <div>
                <p style={{ fontSize:"0.72rem", color:T.textMuted, marginBottom:4 }}>Fonte: {Math.round(tamanhoFonte*100)}%</p>
                <input type="range" min={0.8} max={1.5} step={0.05} value={tamanhoFonte} onChange={e => setTamanhoFonte(+e.target.value)} style={{ width:"100%", accentColor:T.accent }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* TOPBAR */}
        <div style={{ height:62, padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${T.border}`, background:T.bgSidebar, flexShrink:0 }}>
          <h2 style={{ fontWeight:700, fontSize:"1rem", color:T.text }}>
            {NAV.find(n => n.id === aba)?.texto || ""}
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span className="material-icons-outlined" style={{ fontSize:22, color:T.textMuted, cursor:"pointer", position:"relative" }} onClick={() => setAba("notificacoes")}>
              notifications
              {naoLidas > 0 && <span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"white", fontSize:"0.55rem", fontWeight:800, width:14, height:14, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{naoLidas}</span>}
            </span>
            <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${T.accent},#8b5cf6)`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.85rem", color:"white" }}>
              {(perfil.nome || "U").charAt(0)}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, padding:"24px 28px", overflowY:"auto" }}>
          {aba === "servicos" && <SecaoServicos eventos={eventos} registrations={registrations} onInscrever={handleInscrever} onCancelar={handleCancelar} onEntrarFila={handleEntrarFila} onSairFila={handleSairFila} perfil={perfil} />}
          {aba === "calendario" && <SecaoCalendario registrations={registrations} eventos={eventos} />}
          {aba === "notificacoes" && <SecaoNotificacoes notificacoes={notificacoes} onMarcarLida={handleMarcarLida} onMarcarTodasLidas={handleMarcarTodasLidas} onAceitarFila={handleAceitarFila} onRecusarFila={handleRecusarFila} />}
          {aba === "perfil" && <SecaoPerfil perfil={perfil} setPerfil={setPerfil} />}
        </div>
      </div>

      <ToastCliente msg={toast.msg} type={toast.type} />
    </div>
  );
}
