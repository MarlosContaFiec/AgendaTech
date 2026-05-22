import { useState, useMemo } from 'react';
import { calcIdade, idadeMinima, calcDist } from '../helpers';
import { CIDADES_POR_ESTADO, CLIENT_ID } from '../constants';
import EventCard from '../components/EventCard';
import ModalDetalhes from '../modals/ModalDetalhes';
import ModalConfirmacao from '../modals/ModalConfirmacao';
import ModalCancelamento from '../modals/ModalCancelamento';
import ModalPoliticaCancelamento from '../modals/ModalPoliticaCancelamento';
import ModalReservaRestaurante from '../modals/ModalReservaRestaurante';

export default function SecaoServicos({ eventos, registrations, onInscrever, onCancelar, onEntrarFila, onSairFila, perfil }) {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const [estado, setEstado] = useState(perfil.estado);
  const [cidade, setCidade] = useState(perfil.cidade);
  const [distMax, setDistMax] = useState(50);
  const [userLoc, setUserLoc] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState(null);
  const [modalConfirmar, setModalConfirmar] = useState(null);
  const [modalCancelar, setModalCancelar] = useState(null);
  const [modalPolitica, setModalPolitica] = useState(null);
  const [modalReserva, setModalReserva] = useState(null);
  const [politicaAceita, setPoliticaAceita] = useState(false);

  const idadeCliente = calcIdade(perfil.nascimento);
  const cidades = estado ? (CIDADES_POR_ESTADO[estado] || []) : [];

  const filtrados = useMemo(() => {
    return eventos.filter(ev => {
      const min = idadeMinima(ev.classificacao);
      if (idadeCliente < min) return false;
      const q = busca.toLowerCase();
      if (q && !(ev.titulo||"").toLowerCase().includes(q) && !(ev.estabelecimento||"").toLowerCase().includes(q) && !(ev.desc||"").toLowerCase().includes(q)) return false;
      if (tipo && ev.tipo !== tipo) return false;
      if (estado && ev.estado !== estado) return false;
      if (cidade && ev.cidade !== cidade) return false;
      if (userLoc && ev.lat && ev.lng) {
        const d = calcDist(userLoc.lat, userLoc.lng, ev.lat, ev.lng);
        if (d > distMax) return false;
      }
      return true;
    });
  }, [eventos, busca, tipo, estado, cidade, distMax, userLoc, idadeCliente]);

  function handleGetLoc() {
    if (!navigator.geolocation) return;
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setLocLoading(false);
    }, () => setLocLoading(false));
  }

  function handleSolicitarInscricao(ev) {
    if (ev.tipoReserva === "restaurante") { setModalReserva(ev); return; }
    if (ev.preco && !politicaAceita) { setModalPolitica(ev); return; }
    setModalConfirmar(ev);
  }

  function handleAceitarPolitica(naoMostrarNovamente) {
    if (naoMostrarNovamente) setPoliticaAceita(true);
    setModalConfirmar(modalPolitica);
    setModalPolitica(null);
  }

  function handleConfirmInscricao(horarios, justificativa) {
    const ev = modalConfirmar;
    const jaTemInscricao = !!registrations[ev.id]?.inscrito;
    const precisaSolicitar = ev.modoAprov === "manual" || horarios.length === 2 || jaTemInscricao;
    onInscrever(ev, horarios, justificativa, precisaSolicitar);
    setModalConfirmar(null); setModalDetalhes(null);
  }

  function handleConfirmCancelamento(motivo) {
    onCancelar(modalCancelar, motivo);
    setModalCancelar(null); setModalDetalhes(null);
  }

  function handleConfirmReserva(dados) {
    onInscrever(modalReserva, [dados.horario], "", false, dados);
    setModalReserva(null); setModalDetalhes(null);
  }

  const tipos = [...new Set(eventos.map(e => e.tipo).filter(Boolean))];
  const eventosBlockedCount = eventos.filter(ev => idadeCliente < idadeMinima(ev.classificacao)).length;

  return (
    <div>
      {eventosBlockedCount > 0 && (
        <div style={{ background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)", borderRadius:10, padding:"10px 16px", marginBottom:16, display:"flex", gap:10, alignItems:"center", fontSize:"0.8rem", color:"#c084fc" }}>
          <span style={{ fontSize:"1.1rem" }}>🔞</span>
          <span>{eventosBlockedCount} evento{eventosBlockedCount!==1?"s":""} oculto{eventosBlockedCount!==1?"s":""} por classificação etária.</span>
        </div>
      )}
      <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:12, padding:16, marginBottom:20 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:10 }}>
          <div style={{ position:"relative", flex:1, minWidth:180 }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:13, color:"#7c819a" }}>🔍</span>
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por título, estabelecimento..."
              style={{ width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"10px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", boxSizing:"border-box", paddingLeft:32 }} />
          </div>
          <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ background:"#1a1e29", border:"1px solid #2a2f42", padding:"9px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", cursor:"pointer" }}>
            <option value="">Todos os tipos</option>
            {tipos.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={estado} onChange={e => { setEstado(e.target.value); setCidade(""); }} style={{ background:"#1a1e29", border:"1px solid #2a2f42", padding:"9px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", cursor:"pointer" }}>
            <option value="">Todos os estados</option>
            {["SP","RJ","MG"].map(e => <option key={e}>{e}</option>)}
          </select>
          <select value={cidade} onChange={e => setCidade(e.target.value)} style={{ background:"#1a1e29", border:"1px solid #2a2f42", padding:"9px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", cursor:"pointer" }}>
            <option value="">Todas as cidades</option>
            {cidades.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontSize:"0.78rem", color:"#7c819a" }}>📍 Distância:</span>
          <input type="range" min={1} max={100} value={distMax} step={1} onChange={e => setDistMax(+e.target.value)} style={{ flex:1, minWidth:100, maxWidth:180, accentColor:"#5b6cff" }} />
          <span style={{ fontSize:"0.82rem", color:"#5b6cff", fontWeight:700, minWidth:44 }}>{distMax}km</span>
          <button onClick={handleGetLoc} style={{ background:"#1a1e29", color: userLoc?"#22c55e":"#7c819a", border: userLoc?"1px solid #22c55e":"1px solid #2a2f42", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:"0.76rem", fontWeight:600 }}>
            {locLoading ? "Obtendo..." : userLoc ? "✓ Localização ativa" : "🎯 Usar localização"}
          </button>
        </div>
      </div>
      <p style={{ fontSize:"0.78rem", color:"#7c819a", marginBottom:14 }}>
        {filtrados.length} serviço{filtrados.length!==1?"s":""} encontrado{filtrados.length!==1?"s":""}
      </p>
      {filtrados.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 0", color:"#7c819a", fontSize:"0.9rem" }}>Nenhum serviço encontrado com os filtros selecionados.</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))", gap:18 }}>
          {filtrados.map(ev => {
            const reg = registrations[ev.id] || {};
            const filaPos = (ev.fila || []).findIndex(f => f.clienteId === CLIENT_ID);
            return (
              <EventCard key={ev.id} ev={ev}
                lotAtual={reg.count || (ev.inscritos?.length || 0)}
                inscrito={!!reg.inscrito} isPendente={!!reg.pendente}
                naFila={filaPos >= 0} posicaoFila={filaPos + 1}
                idadeCliente={idadeCliente}
                onVerDetalhes={ev => setModalDetalhes(ev)}
                onInscrever={ev => handleSolicitarInscricao(ev)}
                onCancelar={ev => setModalCancelar(ev)}
                onEntrarFila={ev => setModalDetalhes(ev)}
                onSairFila={ev => onSairFila(ev)}
              />
            );
          })}
        </div>
      )}
      {modalDetalhes && (
        <ModalDetalhes evento={modalDetalhes}
          lotAtual={registrations[modalDetalhes.id]?.count || (modalDetalhes.inscritos?.length || 0)}
          inscrito={!!registrations[modalDetalhes.id]?.inscrito}
          isPendente={!!registrations[modalDetalhes.id]?.pendente}
          isFull={modalDetalhes.lotacao!==null && (registrations[modalDetalhes.id]?.count||(modalDetalhes.inscritos?.length||0)) >= modalDetalhes.lotacao}
          naFila={(modalDetalhes.fila||[]).findIndex(f => f.clienteId === CLIENT_ID) >= 0}
          posicaoFila={(modalDetalhes.fila||[]).findIndex(f => f.clienteId === CLIENT_ID) + 1}
          idadeCliente={idadeCliente}
          onClose={() => setModalDetalhes(null)}
          onInscrever={() => { setModalDetalhes(null); handleSolicitarInscricao(modalDetalhes); }}
          onCancelar={() => { setModalDetalhes(null); setModalCancelar(modalDetalhes); }}
          onEntrarFila={(horario) => { setModalDetalhes(null); onEntrarFila(modalDetalhes, horario); }}
          onSairFila={() => { setModalDetalhes(null); onSairFila(modalDetalhes); }}
        />
      )}
      {modalPolitica && <ModalPoliticaCancelamento onAceitar={handleAceitarPolitica} onFechar={() => setModalPolitica(null)} mostrarNaoMostrarNovamente={true} />}
      {modalConfirmar && <ModalConfirmacao evento={modalConfirmar} jaTemInscricao={!!registrations[modalConfirmar.id]?.inscrito} onConfirm={handleConfirmInscricao} onClose={() => setModalConfirmar(null)} />}
      {modalCancelar && <ModalCancelamento evento={modalCancelar} onConfirm={handleConfirmCancelamento} onClose={() => setModalCancelar(null)} />}
      {modalReserva && <ModalReservaRestaurante evento={modalReserva} onConfirm={handleConfirmReserva} onClose={() => setModalReserva(null)} />}
    </div>
  );
}
