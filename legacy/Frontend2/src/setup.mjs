import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function W(filePath, content) {
  const full = path.join(__dirname, 'frontend', filePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.replace(/^\n/, ''), 'utf-8');
  console.log('  \x1b[32m✓\x1b[0m ' + filePath);
}

console.log('\n\x1b[36m═══ AgendaTech — Painel do Cliente com Acessibilidade ═══\x1b[0m\n');

// ─── STORE.JS ─────────────────────────────────────────────────────────────
W('src/pages/Dashboard/cliente/store.js', `
const STORE_KEY = "trustbook_shared_v1";

export function getShared() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setShared(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
}
`);

// ─── CONSTANTS.JS ─────────────────────────────────────────────────────────
W('src/pages/Dashboard/cliente/constants.js', `
export const CLIENT_ID = "c_local";

export const PERFIL_INICIAL = {
  nome: "",
  cpf: "",
  nascimento: "",
  estado: "",
  cidade: "",
  telefone: "",
};

export const CIDADES_POR_ESTADO = {
  SP: ["Indaiatuba", "Campinas", "São Paulo", "Sorocaba"],
  RJ: ["Rio de Janeiro", "Niterói", "Petrópolis"],
  MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora"],
};

export const POLITICA_CANCELAMENTO = {
  horasAntecedencia: 24,
  descricao: "Cancelamentos realizados com mais de 24 horas de antecedência recebem reembolso integral. Cancelamentos com menos de 24 horas resultam na perda do valor pago e dos pontos utilizados.",
};

export const TIPOS_MESA_PADRAO = [
  { capacidade: 4, total: 4, disponiveis: 4 },
  { capacidade: 8, total: 2, disponiveis: 2 },
];

export const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

export const CLASSIF_INFO = {
  livre: { label:"Livre",  icon:"🟢", cor:"#22c55e" },
  "10":  { label:"+10",   icon:"🔵", cor:"#4f8cff" },
  "12":  { label:"+12",   icon:"🟡", cor:"#f5c842" },
  "14":  { label:"+14",   icon:"🟠", cor:"#ffa94d" },
  "16":  { label:"+16",   icon:"🔴", cor:"#ff5c7a" },
  "18":  { label:"+18",   icon:"🔞", cor:"#c084fc" },
};

export const EVENTOS_FALLBACK = [
  { id:1, titulo:"Corte + Escova Premium", estabelecimento:"Salão Lumière", tipo:"Salão", estado:"SP", cidade:"Indaiatuba", desc:"Corte personalizado + escova modeladora com produtos importados de alta qualidade.", horarios:["09:00","11:00","14:00","16:30"], data:"2026-05-15", publico:false, lotacao:8, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0912, lng:-47.2189 },
  { id:2, titulo:"Workshop Bem-Estar Mental", estabelecimento:"Clínica Equilíbrio", tipo:"Clínica", estado:"SP", cidade:"Indaiatuba", desc:"Palestra informativa gratuita sobre saúde mental e técnicas de mindfulness.", horarios:["10:00"], data:"2026-05-20", publico:true, lotacao:null, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0897, lng:-47.2208 },
  { id:3, titulo:"Avaliação Física Completa", estabelecimento:"Academia Iron", tipo:"Academia", estado:"SP", cidade:"Campinas", desc:"Avaliação física completa com análise de composição corporal inclusa.", horarios:["07:00","08:00","17:00","18:00"], data:"2026-05-28", publico:false, lotacao:10, classificacao:"12", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-22.9099, lng:-47.0626 },
  { id:4, titulo:"Noite Eletrônica — Club Vibe", estabelecimento:"Club Vibe", tipo:"Estúdio", estado:"SP", cidade:"São Paulo", desc:"A maior festa eletrônica do mês com DJs internacionais. Open bar incluso.", horarios:["22:00","00:00"], data:"2026-06-07", publico:false, lotacao:200, classificacao:"18", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.5505, lng:-46.6333, preco:120.00 },
  { id:5, titulo:"Dia de Spa Completo", estabelecimento:"Spa Serenità", tipo:"Spa", estado:"SP", cidade:"Indaiatuba", desc:"Pacote completo: massagem relaxante + aromaterapia + esfoliação corporal.", horarios:["10:00","14:00"], data:"2026-05-22", publico:false, lotacao:4, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0912, lng:-47.2189, preco:280.00 },
  { id:6, titulo:"Aula Experimental de Yoga", estabelecimento:"Studio Zen Flow", tipo:"Academia", estado:"SP", cidade:"Indaiatuba", desc:"Experimente nossa metodologia única de yoga terapêutico. Aberto para iniciantes!", horarios:["07:00","08:00","18:30","20:00"], data:"2026-05-28", publico:false, lotacao:12, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0880, lng:-47.2210 },
  { id:7, titulo:"Jantar Especial Italiano", estabelecimento:"Ristorante Bella", tipo:"Restaurante", estado:"SP", cidade:"Indaiatuba", desc:"Jantar especial com menu degustação italiano. Reserva de mesa necessária.", horarios:["19:00","20:30"], data:"2026-06-14", publico:false, lotacao:null, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0900, lng:-47.2200, tipoReserva:"restaurante", tiposMesa: TIPOS_MESA_PADRAO },
];
`);

// ─── HELPERS.JS ───────────────────────────────────────────────────────────
W('src/pages/Dashboard/cliente/helpers.js', `
export function calcIdade(nascimento) {
  if (!nascimento) return 99;
  const hoje = new Date();
  const nasc = new Date(nascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

export function idadeMinima(classificacao) {
  if (!classificacao || classificacao === "livre") return 0;
  return parseInt(classificacao) || 0;
}

export function calcDist(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function lotColor(pct) {
  if (pct >= 1) return "#ef4444";
  if (pct >= 0.7) return "#f59e0b";
  return "#22c55e";
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return \`\${d}/\${m}/\${y}\`;
}

export function timeAgo(isoStr) {
  if (!isoStr) return "";
  const diff = Date.now() - new Date(isoStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return \`\${min}min atrás\`;
  const h = Math.floor(min / 60);
  if (h < 24) return \`\${h}h atrás\`;
  return \`\${Math.floor(h/24)}d atrás\`;
}

export function sugerirMesas(numPessoas, tiposMesa) {
  if (!tiposMesa || tiposMesa.length === 0) return [];
  const tipos = [...tiposMesa].sort((a, b) => b.capacidade - a.capacidade);
  let restante = numPessoas;
  const sugestao = [];
  for (const t of tipos) {
    if (restante <= 0) break;
    const qtd = Math.min(Math.ceil(restante / t.capacidade), t.disponiveis);
    if (qtd > 0) {
      sugestao.push({ capacidade: t.capacidade, qtd });
      restante -= qtd * t.capacidade;
    }
  }
  return sugestao;
}
`);

// ─── COMPONENTS/ToastCliente.jsx ──────────────────────────────────────────
W('src/pages/Dashboard/cliente/components/ToastCliente.jsx', `
export default function ToastCliente({ msg, type }) {
  if (!msg) return null;
  const bg = type==="error"?"#2a1a1a":type==="info"?"#1a1e2a":"#1e2a1a";
  const border = type==="error"?"#ef4444":type==="info"?"#5b6cff":"#22c55e";
  const color = type==="error"?"#f87171":type==="info"?"#8b9eff":"#22c55e";
  return (
    <div style={{ position:"fixed", bottom:24, right:24, background:bg, border:\`1px solid \${border}\`, color, padding:"12px 18px", borderRadius:10, fontSize:"0.85rem", fontWeight:700, zIndex:300, animation:"slideIn .3s ease" }}>
      {msg}
    </div>
  );
}
`);

// ─── COMPONENTS/BadgeClassif.jsx ──────────────────────────────────────────
W('src/pages/Dashboard/cliente/components/BadgeClassif.jsx', `
import { CLASSIF_INFO } from '../constants';

export default function BadgeClassif({ val }) {
  const c = CLASSIF_INFO[val] || CLASSIF_INFO["livre"];
  return (
    <span style={{ fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:\`\${c.cor}22\`, color:c.cor, border:\`1px solid \${c.cor}44\` }}>
      {c.icon} {c.label}
    </span>
  );
}
`);

// ─── COMPONENTS/EventCard.jsx ─────────────────────────────────────────────
W('src/pages/Dashboard/cliente/components/EventCard.jsx', `
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
              <div style={{ height:"100%", width:\`\${Math.min(pct*100,100)}%\`, background:lotColor(pct), borderRadius:2, transition:"width .4s" }} />
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
          <button style={{ ...S.btnDisabled, flex:1 }} disabled title={\`Mínimo \${minIdade} anos\`}>🔞 Idade mínima {minIdade}+</button>
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
`);

// ─── MODALS/ModalPoliticaCancelamento.jsx ─────────────────────────────────
W('src/pages/Dashboard/cliente/modals/ModalPoliticaCancelamento.jsx', `
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
`);

// ─── MODALS/ModalConfirmacao.jsx ──────────────────────────────────────────
W('src/pages/Dashboard/cliente/modals/ModalConfirmacao.jsx', `
import { useState } from 'react';
import { formatDate } from '../helpers';

const S = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:   { background:"#13161e", border:"1px solid #2a2f42", borderRadius:16, width:"100%", maxWidth:480, overflow:"hidden", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" },
  btnPrimary: { padding:"9px 16px", borderRadius:8, cursor:"pointer", border:"none", fontWeight:700, fontSize:"0.82rem", background:"#5b6cff", color:"white", transition:"all .2s", flex:1 },
  btnGhost:   { padding:"9px 16px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:"0.82rem", background:"#1a1e29", color:"#e8eaf2", border:"1px solid #2a2f42", transition:"all .2s" },
  input: { width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"10px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" },
};

export default function ModalConfirmacao({ evento, onConfirm, onClose, jaTemInscricao }) {
  const [horariosSel, setHorariosSel] = useState([evento.horarios[0]]);
  const [justificativa, setJustificativa] = useState("");
  const precisaJustificativa = jaTemInscricao || horariosSel.length === 2;

  function toggleHorario(h) {
    setHorariosSel(prev => {
      if (prev.includes(h)) { if (prev.length === 1) return prev; return prev.filter(x => x !== h); }
      if (prev.length >= 2) return prev;
      return [...prev, h];
    });
  }

  const podeConfirmar = horariosSel.length > 0 && (!precisaJustificativa || justificativa.trim().length >= 10);

  return (
    <div style={S.overlay} onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid #2a2f42" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:"0.75rem", color:"#7c819a", marginBottom:4 }}>Confirmar inscrição em</p>
              <h3 style={{ fontWeight:700, fontSize:"1.05rem" }}>{evento.titulo}</h3>
              <p style={{ fontSize:"0.8rem", color:"#7c819a", marginTop:3 }}>{evento.estabelecimento} · {evento.cidade}</p>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", color:"#7c819a", fontSize:"1.3rem", cursor:"pointer", lineHeight:1 }}>×</button>
          </div>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <div style={{ background:"#1a1e29", border:"1px solid #2a2f42", borderRadius:10, padding:"10px 14px", marginBottom:16, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:"0.78rem", color:"#7c819a" }}>Data</span>
            <span style={{ fontSize:"0.82rem", fontWeight:600 }}>{formatDate(evento.data)}</span>
          </div>
          <div style={{ marginBottom:16 }}>
            <p style={{ fontSize:"0.78rem", color:"#7c819a", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>
              Horário{evento.horarios.length > 1 ? " (máx. 2)" : ""}
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {evento.horarios.map(h => {
                const sel = horariosSel.includes(h);
                const disabled = !sel && horariosSel.length >= 2;
                return (
                  <button key={h} onClick={() => !disabled && toggleHorario(h)}
                    style={{ padding:"8px 16px", borderRadius:8, border: sel?"1px solid #5b6cff":"1px solid #2a2f42", background: sel?"rgba(91,108,255,0.18)":"#1a1e29", color: sel?"#8b9eff":"#a0a4ba", fontWeight: sel?700:400, fontSize:"0.85rem", cursor: disabled?"not-allowed":"pointer", opacity: disabled?0.4:1, transition:"all .15s" }}>
                    🕐 {h}
                  </button>
                );
              })}
            </div>
            {horariosSel.length === 2 && (
              <div style={{ marginTop:8, background:"rgba(255,169,77,0.08)", border:"1px solid rgba(255,169,77,0.25)", borderRadius:8, padding:"8px 12px", fontSize:"0.78rem", color:"#ffa94d" }}>
                ⚠️ Você selecionou 2 horários — uma justificativa é obrigatória.
              </div>
            )}
            {jaTemInscricao && horariosSel.length < 2 && (
              <div style={{ marginTop:8, background:"rgba(255,169,77,0.08)", border:"1px solid rgba(255,169,77,0.25)", borderRadius:8, padding:"8px 12px", fontSize:"0.78rem", color:"#ffa94d" }}>
                ⚠️ Você já tem um horário agendado neste serviço — justifique para adicionar outro.
              </div>
            )}
          </div>
          {precisaJustificativa && (
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:"0.78rem", color:"#7c819a", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>
                Justificativa <span style={{ color:"#f87171" }}>*</span>
              </p>
              <textarea value={justificativa} onChange={e => setJustificativa(e.target.value)} placeholder="Explique o motivo de precisar de mais de um horário..." rows={3} style={{ ...S.input, resize:"vertical", fontFamily:"inherit" }} />
              <p style={{ fontSize:"0.7rem", color: justificativa.trim().length >= 10?"#22c55e":"#7c819a", marginTop:4 }}>
                {justificativa.trim().length}/10 caracteres mínimos
              </p>
            </div>
          )}
          {evento.modoAprov === "manual" || precisaJustificativa ? (
            <div style={{ background:"rgba(255,169,77,0.08)", border:"1px solid rgba(255,169,77,0.25)", borderRadius:8, padding:"10px 14px", fontSize:"0.8rem", color:"#ffa94d", lineHeight:1.5 }}>
              🔍 Sua solicitação ficará como <strong>Inscrição solicitada</strong> e será analisada. Você será notificado quando houver resposta.
            </div>
          ) : (
            <p style={{ fontSize:"0.82rem", color:"#7c819a", lineHeight:1.6 }}>
              Ao confirmar, este evento será adicionado ao seu <strong style={{ color:"#e8eaf2" }}>Calendário</strong>. Você pode cancelar a qualquer momento.
            </p>
          )}
        </div>
        <div style={{ padding:"14px 24px", borderTop:"1px solid #2a2f42", display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button style={S.btnGhost} onClick={onClose}>Voltar</button>
          <button style={{ ...S.btnPrimary, flex:"unset", padding:"9px 24px", opacity: podeConfirmar?1:0.5, cursor: podeConfirmar?"pointer":"not-allowed" }} onClick={() => podeConfirmar && onConfirm(horariosSel, justificativa.trim())}>
            {(evento.modoAprov==="manual" || precisaJustificativa) ? "📤 Enviar Solicitação" : "✓ Confirmar Inscrição"}
          </button>
        </div>
      </div>
    </div>
  );
}
`);

// ─── MODALS/ModalCancelamento.jsx ─────────────────────────────────────────
W('src/pages/Dashboard/cliente/modals/ModalCancelamento.jsx', `
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
`);

// ─── MODALS/ModalDetalhes.jsx ─────────────────────────────────────────────
W('src/pages/Dashboard/cliente/modals/ModalDetalhes.jsx', `
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
          {[["🏢",\`\${evento.tipo} — \${evento.estabelecimento}\`],["📅",\`Data: \${formatDate(evento.data)}\`],["🕐",\`Horários: \${evento.horarios.join(" · ")}\`],["📍",\`\${evento.cidade}, \${evento.estado}\`]].map(([icon,text]) => (
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
                <div style={{ height:"100%", width:\`\${Math.min(pct*100,100)}%\`, background:lotColor(pct), borderRadius:3, transition:"width .4s" }} />
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
`);

// ─── MODALS/ModalEntrarFila.jsx ───────────────────────────────────────────
W('src/pages/Dashboard/cliente/modals/ModalEntrarFila.jsx', `
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
                  <div style={{ height:"100%", width:\`\${Math.min((pessoasNaFila / limFila)*100, 100)}%\`, background: pessoasNaFila >= limFila?"#ef4444":"#5b6cff", borderRadius:3, transition:"width .4s" }} />
                </div>
                <p style={{ fontSize:"0.68rem", color: pessoasNaFila >= limFila?"#f87171":"#7c819a", marginTop:4 }}>
                  {pessoasNaFila >= limFila ? "Fila cheia para este horário" : \`\${limFila - pessoasNaFila} vaga\${limFila - pessoasNaFila !== 1 ? "s" : ""} restante\${limFila - pessoasNaFila !== 1 ? "s" : ""} na fila\`}
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
`);

// ─── MODALS/ModalReservaRestaurante.jsx ───────────────────────────────────
W('src/pages/Dashboard/cliente/modals/ModalReservaRestaurante.jsx', `
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
`);

// ─── SECTIONS/SecaoServicos.jsx ───────────────────────────────────────────
W('src/pages/Dashboard/cliente/sections/SecaoServicos.jsx', `
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
`);

// ─── SECTIONS/SecaoCalendario.jsx ─────────────────────────────────────────
W('src/pages/Dashboard/cliente/sections/SecaoCalendario.jsx', `
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
    return \`\${ano}-\${String(mes+1).padStart(2,"0")}-\${String(dia).padStart(2,"0")}\`;
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
`);

// ─── SECTIONS/SecaoNotificacoes.jsx ───────────────────────────────────────
W('src/pages/Dashboard/cliente/sections/SecaoNotificacoes.jsx', `
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
        return <>Sua solicitação para <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong> foi <strong style={{color:"#22d48a"}}>aprovada</strong>! {n.horario ? \`Horário: \${n.horario}\` : ""} {n.data ? \`· \${formatDate(n.data)}\` : ""}</>;
      case "solicitacao_recusada":
        return <>Sua solicitação para <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong> foi <strong style={{color:"#ff5c7a"}}>recusada</strong> pela empresa.</>;
      case "evento_cancelado":
        return <>O evento <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong> foi <strong style={{color:"#ffa94d"}}>cancelado</strong> pela empresa.</>;
      case "lembrete":
        return <>Lembrete: o evento <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong> está chegando! {n.data ? \`📅 \${formatDate(n.data)}\` : ""}</>;
      case "fila_promovido":
        return <>🎉 Você saiu da fila e foi <strong style={{color:"#22c55e"}}>agendado</strong> em <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong>! {n.horario ? \`Horário: \${n.horario}\` : ""}</>;
      case "fila_aguardando_aceite":
        return <>
          Uma vaga surgiu em <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong>!
          {n.horario && <> Horário: <strong style={{color:"#f5c842"}}>{n.horario}</strong></>}
          {n.data && <> · 📅 {formatDate(n.data)}</>}
          <div style={{marginTop:4, fontSize:"0.78rem", color:"#7c819a"}}>Aceite ou recuse antes que a vaga passe para o próximo da fila.</div>
        </>;
      case "fila_entrada":
        return <>Você entrou na fila de espera de <strong style={{color:"#e8eaf2"}}>{n.eventoTitulo}</strong>.{n.horario ? \` Horário desejado: \${n.horario}\` : ""} Você será notificado se surgir uma vaga.</>;
      default:
        return <>{n.eventoTitulo}</>;
    }
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ fontWeight:700, fontSize:"1.05rem" }}>Notificações</h2>
          <p style={{ fontSize:"0.82rem", color:"#7c819a", marginTop:3 }}>{naoLidas > 0 ? \`\${naoLidas} não lida\${naoLidas!==1?"s":""}\` : "Tudo em dia"}</p>
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
                style={{ background:"#13161e", border:\`1px solid \${isAguardando?"rgba(245,200,66,0.4)":n.lida?"#2a2f42":"rgba(91,108,255,0.25)"}\`, borderRadius:12, padding:"14px 18px", display:"flex", gap:14, alignItems:"flex-start", cursor: (n.lida||isAguardando)?"default":"pointer", transition:"all .15s", opacity: (n.lida&&!isAguardando)?0.65:1,
                  boxShadow: isAguardando?"0 0 0 1px rgba(245,200,66,0.2), 0 4px 20px rgba(245,200,66,0.08)":"none" }}>
                <div style={{ width:38, height:38, borderRadius:10, background:info.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 }}>
                  {info.icon}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                    <span style={{ fontSize:"0.62rem", padding:"2px 8px", borderRadius:20, fontWeight:700, background:\`\${info.cor}22\`, color:info.cor, textTransform:"uppercase", letterSpacing:0.5 }}>
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
`);

// ─── SECTIONS/SecaoPerfil.jsx ─────────────────────────────────────────────
W('src/pages/Dashboard/cliente/sections/SecaoPerfil.jsx', `
import { useState } from 'react';
import { calcIdade } from '../helpers';
import { CIDADES_POR_ESTADO } from '../constants';

export default function SecaoPerfil({ perfil, setPerfil }) {
  const [form, setForm] = useState(perfil);
  const cidades = form.estado ? (CIDADES_POR_ESTADO[form.estado] || []) : [];
  const idade = calcIdade(form.nascimento);

  function set(k, v) { setForm(f => ({...f, [k]: v})); }
  function salvar() { setPerfil(form); }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ fontWeight:700, fontSize:"1.05rem" }}>Meu Perfil</h2>
          <p style={{ fontSize:"0.82rem", color:"#7c819a", marginTop:3 }}>Gerencie seus dados pessoais</p>
        </div>
        <button style={{ padding:"9px 20px", borderRadius:8, cursor:"pointer", border:"none", fontWeight:700, fontSize:"0.82rem", background:"#5b6cff", color:"white" }} onClick={salvar}>💾 Salvar</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:20 }}>
        <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:12, padding:20 }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:"0.72rem", color:"#7c819a", marginBottom:5 }}>Nome Completo</label>
            <input style={{ width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"10px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }} value={form.nome} onChange={e => set("nome", e.target.value)} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[["CPF","cpf","000.000.000-00"],["Telefone","telefone","(11) 00000-0000"]].map(([label,key,ph]) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:"0.72rem", color:"#7c819a", marginBottom:5 }}>{label}</label>
                <input style={{ width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"10px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }} value={form[key]} placeholder={ph} onChange={e => set(key, e.target.value)} />
              </div>
            ))}
            <div style={{ marginBottom:14, gridColumn:"1 / -1" }}>
              <label style={{ display:"block", fontSize:"0.72rem", color:"#7c819a", marginBottom:5 }}>Data de Nascimento</label>
              <input type="date" style={{ width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"10px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", boxSizing:"border-box" }} value={form.nascimento} onChange={e => set("nascimento", e.target.value)} />
              {form.nascimento && (
                <p style={{ fontSize:"0.72rem", color:"#7c819a", marginTop:5 }}>
                  Idade: <strong style={{ color: idade >= 18?"#22c55e":"#ffa94d" }}>{idade} anos</strong>
                  {idade >= 18 ? " — Acesso liberado a todos os eventos, incluindo +18 🔓" : \` — Eventos classificados +18 estarão ocultos 🔞\`}
                </p>
              )}
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:"0.72rem", color:"#7c819a", marginBottom:5 }}>Estado</label>
              <select value={form.estado} onChange={e => { set("estado", e.target.value); set("cidade",""); }} style={{ width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"9px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", cursor:"pointer" }}>
                <option value="">Selecione</option>
                {["SP","RJ","MG"].map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:"0.72rem", color:"#7c819a", marginBottom:5 }}>Cidade</label>
              <select value={form.cidade} onChange={e => set("cidade", e.target.value)} style={{ width:"100%", background:"#1a1e29", border:"1px solid #2a2f42", padding:"9px 12px", borderRadius:8, color:"#e8eaf2", fontSize:"0.85rem", outline:"none", cursor:"pointer" }}>
                <option value="">Selecione</option>
                {cidades.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:12, padding:20, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10 }}>
            <p style={{ fontSize:"0.82rem", color:"#7c819a" }}>Sua Avaliação</p>
            <svg width="140" height="85" viewBox="0 0 200 120">
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#2a2f42" strokeWidth="12" strokeLinecap="round"/>
              <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="0"/>
              <text x="100" y="88" textAnchor="middle" fill="#e8eaf2" fontSize="32" fontWeight="bold">100</text>
            </svg>
            <p style={{ fontSize:"0.75rem", color:"#22c55e", fontWeight:700 }}>Excelente reputação</p>
          </div>
          <div style={{ background:"#13161e", border:"1px solid #2a2f42", borderRadius:12, padding:20 }}>
            <p style={{ fontSize:"0.72rem", color:"#7c819a", marginBottom:10, textTransform:"uppercase", letterSpacing:0.5 }}>Classificação etária</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { val:"livre", label:"Livre", icon:"🟢" },
                { val:"10",   label:"+10",   icon:"🔵" },
                { val:"12",   label:"+12",   icon:"🟡" },
                { val:"14",   label:"+14",   icon:"🟠" },
                { val:"16",   label:"+16",   icon:"🔴" },
                { val:"18",   label:"+18",   icon:"🔞" },
              ].map(cl => {
                const min = cl.val === "livre" ? 0 : parseInt(cl.val);
                const liberado = idade >= min;
                return (
                  <div key={cl.val} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"0.78rem", padding:"4px 0" }}>
                    <span>{cl.icon} {cl.label}</span>
                    <span style={{ color: liberado?"#22c55e":"#f87171", fontSize:"0.7rem" }}>{liberado?"✓ Liberado":"🔒 Bloqueado"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// ─── INDEX.JSX (App Principal do Cliente) ─────────────────────────────────
W('src/pages/Dashboard/cliente/index.jsx', `
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
      showToast(\`Solicitação enviada para "\${ev.titulo}" — aguarde aprovação\`, "info");
    } else {
      const shared = getShared() || {};
      const eventosShared = (shared.eventos || eventos).map(e => {
        if (e.id !== ev.id) return e;
        return { ...e, inscritos: [...(e.inscritos||[]), { clienteId:CLIENT_ID, horario, horarios: horariosArr, nomeCliente: perfil.nome, dadosReserva }] };
      });
      setShared({ ...shared, eventos: eventosShared });
      setEventos(eventosShared);
      setRegistrations(r => ({ ...r, [ev.id]: { inscrito:true, count:(r[ev.id]?.count||0)+1, horario } }));
      if (dadosReserva) showToast(\`Reserva confirmada em "\${ev.titulo}" para \${dadosReserva.numPessoas} pessoas ✓\`);
      else showToast(\`Inscrição confirmada em "\${ev.titulo}" ✓\`);
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
    showToast(\`Inscrição cancelada. Motivo: \${motivo}\`);
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
    showToast(\`Você entrou na fila de "\${ev.titulo}" para o horário \${horario}\`, "info");
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
    <div style={{ display:"flex", height:"100vh", background:T.bg, color:T.text, fontFamily:"'DM Sans',sans-serif", overflow:"hidden", fontSize:\`\${tamanhoFonte}rem\`, cursor: cursorGrande ? "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><path d=\"M8,2 L8,26 L13,20 L18,30 L21,28.5 L16,18.5 L23,18.5 Z\" fill=\"%23ffffff\" stroke=\"%23000000\" stroke-width=\"1.5\"/></svg>') 4 2, auto" : "auto" }}>
      {/* SIDEBAR */}
      <div style={{ width:230, background:T.bgSidebar, borderRight:\`1px solid \${T.border}\`, display:"flex", flexDirection:"column", paddingTop:20, flexShrink:0 }}>
        <div style={{ padding:"0 20px 20px", fontWeight:800, fontSize:"1.1rem", display:"flex", alignItems:"center", gap:10, color:T.text }}>
          <div style={{ background:\`linear-gradient(135deg,\${T.accent},#8b5cf6)\`, width:28, height:28, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"white" }}>A</div>
          <div>
            <div>AgendaTech</div>
            <div style={{ fontSize:"0.6rem", color:T.textMuted, fontWeight:400 }}>área do cliente</div>
          </div>
        </div>
        <div style={{ padding:"0 20px 6px", fontSize:"0.62rem", color:T.textMuted, textTransform:"uppercase", letterSpacing:1 }}>Navegação</div>
        {NAV.map(item => (
          <div key={item.id} onClick={() => setAba(item.id)}
            style={{ padding:"11px 20px", display:"flex", alignItems:"center", gap:10, color: aba===item.id?T.accent:T.textMuted, cursor:"pointer", fontSize:"0.88rem", background: aba===item.id?T.accentBg:"transparent", borderLeft: aba===item.id?\`3px solid \${T.accent}\`:"3px solid transparent", transition:"all .2s", position:"relative" }}>
            <span className="material-icons-outlined" style={{ fontSize:20 }}>{item.icon}</span>
            {item.texto}
            {item.id === "notificacoes" && naoLidas > 0 && (
              <span style={{ position:"absolute", right:16, background:"#ef4444", color:"white", fontSize:"0.6rem", fontWeight:800, width:18, height:18, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{naoLidas}</span>
            )}
          </div>
        ))}
        <div style={{ marginTop:"auto", padding:16, borderTop:\`1px solid \${T.border}\` }}>
          <div style={{ background:T.bgInput, border:\`1px solid \${T.border}\`, borderRadius:10, padding:12 }}>
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
        <div style={{ height:62, padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:\`1px solid \${T.border}\`, background:T.bgSidebar, flexShrink:0 }}>
          <h2 style={{ fontWeight:700, fontSize:"1rem", color:T.text }}>
            {NAV.find(n => n.id === aba)?.texto || ""}
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span className="material-icons-outlined" style={{ fontSize:22, color:T.textMuted, cursor:"pointer", position:"relative" }} onClick={() => setAba("notificacoes")}>
              notifications
              {naoLidas > 0 && <span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"white", fontSize:"0.55rem", fontWeight:800, width:14, height:14, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{naoLidas}</span>}
            </span>
            <div style={{ width:32, height:32, borderRadius:"50%", background:\`linear-gradient(135deg,\${T.accent},#8b5cf6)\`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.85rem", color:"white" }}>
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
`);

console.log('\n\x1b[36m══════════════════════════════════════════════════════\x1b[0m');
console.log('\x1b[32m✅✅✅ Painel do Cliente com Acessibilidade instalado! ✅✅✅\x1b[0m');
console.log('\x1b[36m══════════════════════════════════════════════════════\x1b[0m\n');
console.log('\x1b[33m   Arquivo principal:\x1b[0m src/pages/Dashboard/cliente/index.jsx\n');
console.log('\x1b[33m   Para usar no App.jsx:\x1b[0m');
console.log('   import PainelCliente from "@/pages/Dashboard/cliente";\n');
