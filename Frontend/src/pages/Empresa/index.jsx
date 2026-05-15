import { useState, useMemo, useEffect } from "react";

// ─── PALETA & TEMA ────────────────────────────────────────────────────────────
const DARK_THEME = {
  bg:       "#080a0f",
  surface:  "#0e1118",
  surface2: "#141820",
  surface3: "#1b2030",
  border:   "#232840",
  border2:  "#2e3550",
  accent:   "#4f8cff",
  accentLo: "rgba(79,140,255,0.10)",
  gold:     "#f5c842",
  goldLo:   "rgba(245,200,66,0.12)",
  green:    "#22d48a",
  greenLo:  "rgba(34,212,138,0.12)",
  red:      "#ff5c7a",
  redLo:    "rgba(255,92,122,0.12)",
  amber:    "#ffa94d",
  amberLo:  "rgba(255,169,77,0.12)",
  purple:   "#a78bfa",
  purpleLo: "rgba(167,139,250,0.12)",
  text:     "#dde2f0",
  muted:    "#6b7294",
  radius:   12,
};

const LIGHT_THEME = {
  bg:       "#f0f2f8",
  surface:  "#ffffff",
  surface2: "#f5f7fc",
  surface3: "#eaecf4",
  border:   "#d1d5e8",
  border2:  "#b8bdd4",
  accent:   "#2563eb",
  accentLo: "rgba(37,99,235,0.10)",
  gold:     "#b45309",
  goldLo:   "rgba(180,83,9,0.10)",
  green:    "#15803d",
  greenLo:  "rgba(21,128,61,0.10)",
  red:      "#dc2626",
  redLo:    "rgba(220,38,38,0.10)",
  amber:    "#d97706",
  amberLo:  "rgba(217,119,6,0.10)",
  purple:   "#7c3aed",
  purpleLo: "rgba(124,58,237,0.10)",
  text:     "#1e2340",
  muted:    "#6b7280",
  radius:   12,
};

// T is set dynamically — components receive it via prop or use the global
let T = DARK_THEME;

// ─── CLASSIFICAÇÃO DE IDADE ───────────────────────────────────────────────────
const CLASSIFICACOES = [
  { val: "livre",  label: "Livre",  icon: "🟢", cor: T.green,  desc: "Para todas as idades" },
  { val: "10",     label: "+10",    icon: "🔵", cor: T.accent, desc: "A partir de 10 anos" },
  { val: "12",     label: "+12",    icon: "🟡", cor: T.gold,   desc: "A partir de 12 anos" },
  { val: "14",     label: "+14",    icon: "🟠", cor: T.amber,  desc: "A partir de 14 anos" },
  { val: "16",     label: "+16",    icon: "🔴", cor: T.red,    desc: "A partir de 16 anos" },
  { val: "18",     label: "+18",    icon: "🔞", cor: "#c084fc", desc: "Baladas, boates, casas de show — somente maiores de 18" },
];

function getClassif(val) {
  return CLASSIFICACOES.find(c => c.val === val) || CLASSIFICACOES[0];
}

// ─── DADOS MOCK ───────────────────────────────────────────────────────────────
const CIDADES = {
  SP: ["Indaiatuba","Campinas","São Paulo","Sorocaba","Santos"],
  RJ: ["Rio de Janeiro","Niterói","Petrópolis","Volta Redonda"],
  MG: ["Belo Horizonte","Uberlândia","Juiz de Fora","Montes Claros"],
  PR: ["Curitiba","Londrina","Maringá","Ponta Grossa"],
  RS: ["Porto Alegre","Caxias do Sul","Pelotas","Novo Hamburgo"],
};

const CLIENTES_MOCK = [
  { id:"c1", nome:"Ana Souza",      nascimento:"1995-06-15", cpf:"123.456.789-01", telefone:"(11) 98765-4321", cidade:"Indaiatuba", estado:"SP", score:94, historico:[] },
  { id:"c2", nome:"Bruno Lima",     nascimento:"1990-03-22", cpf:"234.567.890-12", telefone:"(11) 91234-5678", cidade:"Campinas",   estado:"SP", score:72, historico:["Cancelou com 18h de antecedência (−10pts)"] },
  { id:"c3", nome:"Carla Mendes",   nascimento:"2008-11-04", cpf:"345.678.901-23", telefone:"(21) 99876-5432", cidade:"Niterói",    estado:"RJ", score:38, historico:["Cancelou com 12h (−10pts)","Não compareceu (−10pts)","Cancelou com 20h (−10pts)"] },
  { id:"c4", nome:"Diego Rocha",    nascimento:"1988-07-30", cpf:"456.789.012-34", telefone:"(31) 97654-3210", cidade:"BH",         estado:"MG", score:88, historico:[] },
  { id:"c5", nome:"Eduarda Pinto",  nascimento:"2001-05-12", cpf:"567.890.123-45", telefone:"(11) 96543-2109", cidade:"São Paulo",  estado:"SP", score:55, historico:["Cancelou com 24h (−10pts)","Falta sem aviso (−10pts)"] },
];

// ID único e persistente — nunca reseta, nunca colide
function gerarNovoId() {
  const base = Date.now();
  try {
    const ultimo = parseInt(localStorage.getItem("trustbook_lastId") || "0", 10);
    const novo = Math.max(base, ultimo + 1);
    localStorage.setItem("trustbook_lastId", String(novo));
    return novo;
  } catch {
    return base;
  }
}
const EVENTOS_INICIAIS = [
  { id:1,  titulo:"Corte + Escova Premium",    tipo:"Salão",    estado:"SP", cidade:"Indaiatuba", desc:"Corte personalizado + escova modeladora com produtos importados de alta qualidade.", horarios:["09:00","11:00","14:00","16:30"], data:"2026-05-15", publico:false, lotacao:8,  modoAprov:"automatico", preco:120, prazoCancelamento:24, classificacao:"livre", reservasPorHorario:{}, filaEspera:{}, inscritos:[], pendentes:[], lat:-23.0912, lng:-47.2189 },
  { id:2,  titulo:"Workshop Bem-Estar Mental", tipo:"Clínica",  estado:"SP", cidade:"Indaiatuba", desc:"Palestra informativa gratuita sobre saúde mental e técnicas de mindfulness.",         horarios:["10:00"],                        data:"2026-05-20", publico:true,  lotacao:null,modoAprov:"automatico", preco:0, prazoCancelamento:24, classificacao:"livre", reservasPorHorario:{}, filaEspera:{}, inscritos:[], pendentes:[], lat:-23.0897, lng:-47.2208 },
  { id:3,  titulo:"Avaliação Física Completa", tipo:"Academia", estado:"SP", cidade:"Campinas",   desc:"Avaliação física completa com análise de composição corporal inclusa.",              horarios:["07:00","08:00","17:00","18:00"], data:"2026-05-28", publico:false, lotacao:10, modoAprov:"manual",     preco:80, prazoCancelamento:24, classificacao:"12",   reservasPorHorario:{}, filaEspera:{}, inscritos:[], pendentes:[
    { clienteId:"c2", horario:"08:00", solicitadoEm:"2026-04-25" },
    { clienteId:"c3", horario:"17:00", solicitadoEm:"2026-04-26" },
  ], lat:-22.9099, lng:-47.0626 },
  { id:4,  titulo:"Noite Eletrônica — Club Vibe", tipo:"Estúdio", estado:"SP", cidade:"São Paulo", desc:"A maior festa eletrônica do mês com DJs internacionais. Open bar incluso.",        horarios:["22:00","00:00"],                data:"2026-06-07", publico:false, lotacao:200,modoAprov:"automatico", preco:250, prazoCancelamento:24, classificacao:"18",   reservasPorHorario:{}, filaEspera:{}, inscritos:[], pendentes:[], lat:-23.5505, lng:-46.6333 },
];
const EMPRESA_INICIAL = {
  razaoSocial:"Lumière Serviços de Beleza Ltda.",
  nomeFantasia:"Salão Lumière",
  cnpj:"12.345.678/0001-90",
  email:"contato@salaolumiere.com.br",
  telefone:"(11) 4002-8922",
  endereco:"Rua das Flores, 120 - Centro, Indaiatuba/SP",
};
const PERFIL_PUBLICO_INICIAL = {
  fotoPerfil:"",
  fotosEmpresa:[],
  dadosPublicos:"Atendimento com hora marcada, ambiente climatizado e equipe especializada em experiências premium.",
  cores:{ primaria:"#4f8cff", secundaria:"#8b5cf6" },
};
const RESERVAS_INICIAL = {
  tiposMesa:[
    { id:"mesa4", descricao:"Mesa de 4 pessoas", capacidade:4, quantidade:4 },
    { id:"mesa8", descricao:"Mesa de 8 pessoas", capacidade:8, quantidade:2 },
  ],
  limiteFilaPorHorario:3,
};

// ─── SHARED STATE via localStorage ──────────────────────────────────────────
const STORE_KEY = "trustbook_shared_v1";
function getShared() {
  try { const raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function setShared(data) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch {}
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function scoreColor(s) {
  if (s >= 80) return T.green;
  if (s >= 50) return T.amber;
  return T.red;
}
function scoreLabel(s) {
  if (s >= 80) return "Excelente";
  if (s >= 50) return "Regular";
  return "Baixo";
}
function formatDate(d) {
  if (!d) return "";
  const [y,m,dd] = d.split("-");
  return `${dd}/${m}/${y}`;
}
function formatMoney(v) {
  if (!v || v === 0) return "Gratuito";
  return `R$ ${Number(v).toFixed(2).replace(".",",")}`;
}
function parseListaFotos(str) {
  if (!str) return [];
  return str.split("\n").map(s=>s.trim()).filter(Boolean);
}
function withAlpha(hex, alphaHex) {
  return hex + alphaHex;
}
function gerarIdentidadeVisual(cores) {
  const p = cores?.primaria || "#4f8cff";
  const s = cores?.secundaria || "#8b5cf6";
  function lerp(c1,c2,t) {
    const h2d = h => parseInt(h,16);
    const r1=h2d(c1.slice(1,3)),g1=h2d(c1.slice(3,5)),b1=h2d(c1.slice(5,7));
    const r2=h2d(c2.slice(1,3)),g2=h2d(c2.slice(3,5)),b2=h2d(c2.slice(5,7));
    const r=Math.round(r1+(r2-r1)*t).toString(16).padStart(2,"0");
    const g=Math.round(g1+(g2-g1)*t).toString(16).padStart(2,"0");
    const b=Math.round(b1+(b2-b1)*t).toString(16).padStart(2,"0");
    return `#${r}${g}${b}`;
  }
  return {
    primaria: p,
    secundaria: s,
    mistura25: lerp(p,s,0.25),
    mistura50: lerp(p,s,0.5),
    mistura75: lerp(p,s,0.75),
    gradiente: `linear-gradient(135deg,${p},${s})`,
    fundoSuave: `linear-gradient(135deg,${p}0a,${s}0a)`,
  };
}
function getMesaCounters(ev, reservasConfig) {
  if (!reservasConfig?.tiposMesa || ev.tipo !== "Restaurante") return [];
  return reservasConfig.tiposMesa.map(tipo=>{
    const porHorario = (ev.horarios||[]).map(h=>{
      const ocupadas = Object.values(ev.reservasPorHorario||{}).filter(r=>r.horario===h&&r.tipoMesaId===tipo.id).length;
      return { horario:h, total:tipo.quantidade, ocupadas };
    });
    return { ...tipo, porHorario };
  });
}
function getFilaCounters(ev, reservasConfig) {
  if (!reservasConfig) return [];
  return (ev.horarios||[]).map(h=>{
    const atual = (ev.filaEspera?.[h]||[]).length;
    return { horario:h, atual, limite:reservasConfig.limiteFilaPorHorario||0 };
  });
}

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const MESES_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DSEM = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function Badge({ type, children }) {
  const styles = {
    public:   { bg:"rgba(34,212,138,0.12)",  color:T.green },
    manual:   { bg:"rgba(245,200,66,0.12)",  color:T.gold  },
    auto:     { bg:"rgba(79,140,255,0.10)",  color:T.accent},
    full:     { bg:"rgba(255,92,122,0.12)",  color:T.red   },
    pending:  { bg:"rgba(255,169,77,0.12)",  color:T.amber },
    approved: { bg:"rgba(34,212,138,0.12)",  color:T.green },
    rejected: { bg:"rgba(255,92,122,0.12)",  color:T.red   },
    age18:    { bg:"rgba(167,139,250,0.15)", color:"#c084fc"},
    age16:    { bg:"rgba(255,92,122,0.12)",  color:T.red   },
    agelivre: { bg:"rgba(34,212,138,0.12)",  color:T.green },
  };
  const s = styles[type] || styles.auto;
  return (
    <span style={{ fontSize:"0.62rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.6, background:s.bg, color:s.color }}>
      {children}
    </span>
  );
}

function BadgeClassif({ val }) {
  const c = getClassif(val);
  return (
    <span style={{ fontSize:"0.62rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.6, background:`${c.cor}22`, color:c.cor, border:`1px solid ${c.cor}44` }}>
      {c.icon} {c.label}
    </span>
  );
}

function Btn({ variant="primary", onClick, disabled, children, style={} }) {
  const base = { padding:"9px 16px", borderRadius:8, cursor: disabled?"not-allowed":"pointer", border:"none", fontWeight:700, fontSize:"0.82rem", transition:"all .18s", fontFamily:"inherit", opacity: disabled?0.5:1 };
  const variants = {
    primary: { background:T.accent, color:"#fff" },
    ghost:   { background:T.surface2, color:T.text, border:`1px solid ${T.border}` },
    danger:  { background:T.redLo, color:T.red, border:`1px solid rgba(255,92,122,0.25)` },
    gold:    { background:T.goldLo, color:T.gold, border:`1px solid rgba(245,200,66,0.25)` },
    success: { background:T.greenLo, color:T.green, border:`1px solid rgba(34,212,138,0.25)` },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} onClick={disabled?undefined:onClick} disabled={disabled}>{children}</button>;
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", fontSize:"0.7rem", color:T.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>}
      <input {...props} style={{ width:"100%", background:T.surface3, border:`1px solid ${T.border}`, padding:"10px 13px", borderRadius:8, color:T.text, fontSize:"0.85rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box", ...props.style }} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", fontSize:"0.7rem", color:T.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>}
      <select {...props} style={{ width:"100%", background:T.surface3, border:`1px solid ${T.border}`, padding:"10px 13px", borderRadius:8, color:T.text, fontSize:"0.85rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box", cursor:"pointer", ...props.style }}>
        {children}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", fontSize:"0.7rem", color:T.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>}
      <textarea {...props} style={{ width:"100%", background:T.surface3, border:`1px solid ${T.border}`, padding:"10px 13px", borderRadius:8, color:T.text, fontSize:"0.85rem", outline:"none", fontFamily:"inherit", resize:"vertical", boxSizing:"border-box", ...props.style }} />
    </div>
  );
}

function Toast({ msg, type="success" }) {
  if (!msg) return null;
  const colors = { success:[T.greenLo,T.green], error:[T.redLo,T.red], info:[T.accentLo,T.accent] };
  const [bg,border] = colors[type]||colors.success;
  return (
    <div style={{ position:"fixed", bottom:24, right:24, background:bg, border:`1px solid ${border}`, color:border, padding:"12px 20px", borderRadius:10, fontSize:"0.85rem", fontWeight:700, zIndex:500, animation:"slideUp .3s ease" }}>
      {msg}
    </div>
  );
}

function ScoreRing({ score, size=60 }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = scoreColor(score);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border2} strokeWidth={size*0.08} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.08}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2+5} textAnchor="middle" fill={color} fontSize={size*0.22} fontWeight="800" fontFamily="inherit">{score}</text>
    </svg>
  );
}

function Modal({ onClose, children, maxWidth=520 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, width:"100%", maxWidth, overflow:"hidden", animation:"fadeUp .25s ease", maxHeight:"90vh", overflowY:"auto" }}>
        {children}
      </div>
    </div>
  );
}

// ─── MODAL CONFIRMAR EXCLUSÃO ────────────────────────────────────────────────
function ModalConfirmarExclusao({ evento, onConfirmar, onClose }) {
  const [confirmText, setConfirmText] = useState("");
  const nomeCorreto = confirmText.trim().toLowerCase() === evento.titulo.trim().toLowerCase();
  return (
    <Modal onClose={onClose} maxWidth={460}>
      <div style={{ padding:"22px 26px 16px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:"1.8rem", marginBottom:8 }}>⚠️</div>
            <h3 style={{ fontWeight:800, fontSize:"1rem", color:T.red }}>Excluir evento permanentemente?</h3>
            <p style={{ fontSize:"0.78rem", color:T.muted, marginTop:2 }}>Esta ação não pode ser desfeita.</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:T.muted, fontSize:"1.4rem", cursor:"pointer" }}>×</button>
        </div>
      </div>
      <div style={{ padding:"20px 26px" }}>
        <div style={{ background:T.redLo, border:`1px solid rgba(255,92,122,0.25)`, borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
          <p style={{ fontSize:"0.85rem", color:T.text, fontWeight:600, marginBottom:4 }}>{evento.titulo}</p>
          <p style={{ fontSize:"0.76rem", color:T.muted }}>
            {evento.inscritos?.length||0} inscrito{(evento.inscritos?.length||0)!==1?"s":""} · {evento.pendentes?.length||0} pendente{(evento.pendentes?.length||0)!==1?"s":""} · {formatDate(evento.data)}
          </p>
        </div>
        {(evento.inscritos?.length > 0 || evento.pendentes?.length > 0) && (
          <div style={{ background:T.amberLo, border:`1px solid rgba(255,169,77,0.25)`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:"0.78rem", color:T.amber, lineHeight:1.5 }}>
            ⚠️ Existem participantes inscritos. Ao excluir, todos serão notificados do cancelamento.
          </div>
        )}
        <div style={{ marginBottom:6 }}>
          <label style={{ display:"block", fontSize:"0.72rem", color:T.muted, marginBottom:6, lineHeight:1.5 }}>
            Para confirmar, digite o nome do evento:
            <span style={{ display:"block", fontWeight:700, color:T.text, marginTop:2 }}>"{evento.titulo}"</span>
          </label>
          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="Digite o nome do evento..."
            style={{ width:"100%", background:T.surface3, border:`1px solid ${nomeCorreto?T.red:T.border}`, padding:"10px 13px", borderRadius:8, color:T.text, fontSize:"0.85rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
        </div>
      </div>
      <div style={{ padding:"14px 26px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn variant="danger" disabled={!nomeCorreto} onClick={onConfirmar}>🗑 Sim, excluir evento</Btn>
      </div>
    </Modal>
  );
}

// ─── MODAL ANALISAR SOLICITAÇÃO ───────────────────────────────────────────────
function ModalSolicitacao({ evento, solicitacao, onAprovar, onRejeitar, onClose }) {
  const cliente = CLIENTES_MOCK.find(c=>c.id===solicitacao.clienteId);
  if (!cliente) return null;
  const score = cliente.score;
  const alertLevel = score < 50 ? "high" : score < 70 ? "medium" : "low";
  return (
    <Modal onClose={onClose} maxWidth={480}>
      <div style={{ padding:"20px 24px 14px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <Badge type="pending">Aguardando Revisão</Badge>
            <h3 style={{ fontWeight:800, fontSize:"1rem", marginTop:8 }}>Solicitação de Agendamento</h3>
            <p style={{ fontSize:"0.78rem", color:T.muted, marginTop:2 }}>{evento.titulo} · {solicitacao.horario}</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:T.muted, fontSize:"1.3rem", cursor:"pointer" }}>×</button>
        </div>
      </div>
      <div style={{ padding:"20px 24px" }}>
        <div style={{ background: alertLevel==="high"?T.redLo:alertLevel==="medium"?T.amberLo:T.greenLo, border:`1px solid ${alertLevel==="high"?"rgba(255,92,122,0.25)":alertLevel==="medium"?"rgba(255,169,77,0.25)":"rgba(34,212,138,0.25)"}`, borderRadius:12, padding:"16px 18px", marginBottom:16, display:"flex", gap:16, alignItems:"center" }}>
          <ScoreRing score={score} size={70} />
          <div>
            <div style={{ fontSize:"0.72rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:2 }}>Score TrustBook</div>
            <div style={{ fontSize:"1.3rem", fontWeight:800, color:scoreColor(score) }}>{scoreLabel(score)}</div>
            {alertLevel==="high" && <div style={{ fontSize:"0.75rem", color:T.red, marginTop:4 }}>⚠️ Este cliente possui histórico de cancelamentos tardios.</div>}
            {alertLevel==="medium" && <div style={{ fontSize:"0.75rem", color:T.amber, marginTop:4 }}>⚡ Score moderado — verifique o histórico abaixo.</div>}
            {alertLevel==="low" && <div style={{ fontSize:"0.75rem", color:T.green, marginTop:4 }}>✓ Cliente com bom histórico.</div>}
          </div>
        </div>
        <div style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px", marginBottom:14 }}>
          <div style={{ fontSize:"0.7rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 }}>
            Dados do Cliente <span style={{ color:T.accent, fontSize:"0.62rem" }}>· LGPD — somente dados essenciais</span>
          </div>
          {[["Nome", cliente.nome],["CPF (parcial)", cliente.cpf.replace(/(\d{3})\.\d{3}\.(\d{3})-\d{2}/, "$1.***.$2-**")],["Cidade / Estado", `${cliente.cidade} / ${cliente.estado}`]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:"0.78rem", color:T.muted }}>{k}</span>
              <span style={{ fontSize:"0.82rem", fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
        {cliente.historico.length > 0 && (
          <div style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px" }}>
            <div style={{ fontSize:"0.7rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Histórico de Ocorrências</div>
            {cliente.historico.slice(0,4).map((h,i)=>(
              <div key={i} style={{ fontSize:"0.78rem", color:T.red, marginBottom:4, display:"flex", gap:6 }}>
                <span>↘</span><span>{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding:"14px 24px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Fechar</Btn>
        <Btn variant="danger" onClick={()=>onRejeitar(evento,solicitacao)}>✕ Recusar</Btn>
        <Btn variant="success" onClick={()=>onAprovar(evento,solicitacao)}>✓ Aprovar</Btn>
      </div>
    </Modal>
  );
}

// ─── CARD DE EVENTO (compacto + modal detalhes) ───────────────────────────────
function EventoCard({ ev, onEditar, onGerenciar, onExcluir, identidadeVisual, reservasConfig }) {
  const [detalhes, setDetalhes] = useState(false);
  const pct = ev.lotacao ? ev.inscritos.length / ev.lotacao : 0;
  const isFull = ev.lotacao && ev.inscritos.length >= ev.lotacao;
  const pendentes = ev.pendentes?.length || 0;

  // Cores do card isoladas da marca — usam apenas bordas/gradiente da identidade
  // mas badges de classificação etária e status usam as cores do sistema, não da marca.
  const brand = identidadeVisual || gerarIdentidadeVisual();

  return (
    <>
    <div
      style={{ background:T.surface, border:`1px solid ${T.border2}`, borderRadius:12, overflow:"hidden", display:"flex", flexDirection:"column", transition:"border-color .2s, transform .2s" }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=brand.mistura50; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border2; e.currentTarget.style.transform="translateY(0)"; }}>
      {/* Faixa de cor da marca no topo */}
      <div style={{ height:4, background:brand.gradiente }} />

      {/* Cabeçalho compacto */}
      <div style={{ padding:"14px 16px 10px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
            {isFull ? <Badge type="full">Esgotado</Badge>
              : ev.publico ? <Badge type="public">Público</Badge>
              : <Badge type={ev.modoAprov==="manual"?"manual":"auto"}>{ev.modoAprov==="manual"?"🔍 Manual":"⚡ Auto"}</Badge>}
            {pendentes > 0 && <Badge type="pending">{pendentes} pend.</Badge>}
            <BadgeClassif val={ev.classificacao} />
          </div>
          <span style={{ fontSize:"0.72rem", color:T.muted, whiteSpace:"nowrap", marginLeft:6 }}>{formatDate(ev.data)}</span>
        </div>
        <div style={{ fontWeight:800, fontSize:"0.95rem", lineHeight:1.3, marginBottom:4 }}>{ev.titulo}</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:"0.72rem", color:T.muted }}>📍 {ev.cidade} · {ev.tipo}</div>
          <div style={{ fontSize:"0.85rem", fontWeight:800, color:T.accent }}>{formatMoney(ev.preco)}</div>
        </div>
      </div>

      {/* Barra de lotação (se houver) */}
      {ev.lotacao && (
        <div style={{ padding:"0 16px 10px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ fontSize:"0.69rem", color:T.muted }}>Inscrições</span>
            <span style={{ fontSize:"0.72rem", fontWeight:700, color:isFull?T.red:T.green }}>{ev.inscritos.length}/{ev.lotacao}</span>
          </div>
          <div style={{ height:3, background:T.border, borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${Math.min(pct*100,100)}%`, background:isFull?T.red:brand.gradiente, borderRadius:2 }} />
          </div>
        </div>
      )}

      {/* Horários (até 3) */}
      <div style={{ padding:"0 16px 12px", display:"flex", flexWrap:"wrap", gap:4 }}>
        {ev.horarios.slice(0,3).map(h=>(
          <span key={h} style={{ fontSize:"0.68rem", background:T.surface2, border:`1px solid ${T.border}`, padding:"2px 7px", borderRadius:5, color:T.muted }}>⏰ {h}</span>
        ))}
        {ev.horarios.length > 3 && <span style={{ fontSize:"0.68rem", color:T.muted, padding:"2px 4px" }}>+{ev.horarios.length-3}</span>}
      </div>

      {/* Ações */}
      <div style={{ padding:"10px 16px", borderTop:`1px solid ${T.border}`, display:"flex", gap:6 }}>
        <Btn variant="ghost" style={{padding:"6px 10px",fontSize:"0.75rem",flex:1}} onClick={()=>setDetalhes(true)}>📋 Detalhes</Btn>
        <Btn variant={pendentes>0?"gold":"ghost"} style={{padding:"6px 10px",fontSize:"0.75rem",flex:1}} onClick={()=>onGerenciar(ev)}>
          {pendentes>0?`🔔 (${pendentes})`:"👥 Inscritos"}
        </Btn>
        <Btn variant="ghost" style={{padding:"6px 10px",fontSize:"0.75rem"}} onClick={()=>onEditar(ev)}>✏️</Btn>
        <Btn variant="danger" style={{padding:"6px 10px",fontSize:"0.75rem"}} onClick={()=>onExcluir(ev)}>🗑</Btn>
      </div>
    </div>

    {/* Modal de detalhes */}
    {detalhes && (
      <Modal onClose={()=>setDetalhes(false)} maxWidth={500}>
        <div style={{ padding:"20px 24px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
              {isFull ? <Badge type="full">Esgotado</Badge>
                : ev.publico ? <Badge type="public">Público</Badge>
                : <Badge type={ev.modoAprov==="manual"?"manual":"auto"}>{ev.modoAprov==="manual"?"🔍 Manual":"⚡ Automático"}</Badge>}
              <BadgeClassif val={ev.classificacao} />
            </div>
            <h3 style={{ fontWeight:800, fontSize:"1.05rem" }}>{ev.titulo}</h3>
            <p style={{ fontSize:"0.78rem", color:T.muted, marginTop:2 }}>{ev.tipo} · {ev.cidade}, {ev.estado}</p>
          </div>
          <button onClick={()=>setDetalhes(false)} style={{ background:"none", border:"none", color:T.muted, fontSize:"1.4rem", cursor:"pointer" }}>×</button>
        </div>
        <div style={{ padding:"18px 24px" }}>
          <div style={{ height:4, background:brand.gradiente, borderRadius:2, marginBottom:16 }} />
          <p style={{ fontSize:"0.83rem", color:T.muted, lineHeight:1.6, marginBottom:16 }}>{ev.desc}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
            {[
              ["📅 Data", formatDate(ev.data)],
              ["💰 Preço", formatMoney(ev.preco)],
              ["👥 Lotação", ev.lotacao ? `${ev.inscritos.length}/${ev.lotacao}` : "Ilimitado"],
              ["⚙️ Aprovação", ev.modoAprov==="manual"?"Manual":"Automático"],
              ["⏱ Cancelamento", "24h (fixo)"],
              ["🔔 Pendentes", String(pendentes)],
            ].map(([k,v])=>(
              <div key={k} style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:"0.68rem", color:T.muted, marginBottom:3 }}>{k}</div>
                <div style={{ fontSize:"0.85rem", fontWeight:700 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:"0.7rem", color:T.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Horários</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {ev.horarios.map(h=>(
                <span key={h} style={{ fontSize:"0.75rem", background:T.surface2, border:`1px solid ${T.border}`, padding:"4px 10px", borderRadius:6 }}>{h}</span>
              ))}
            </div>
          </div>
          {ev.tipo==="Restaurante" && reservasConfig?.tiposMesa?.length > 0 && (
            <div style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", marginTop:12 }}>
              <div style={{ fontSize:"0.7rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Disponibilidade de mesas</div>
              {getMesaCounters(ev, reservasConfig).map(tipo=>(
                <div key={tipo.id} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:"0.76rem", fontWeight:700, marginBottom:4 }}>{tipo.descricao}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                    {tipo.porHorario.map(c=>(
                      <span key={`${tipo.id}-${c.horario}`} style={{ fontSize:"0.68rem", background:T.bg, border:`1px solid ${c.ocupadas>=c.total?T.red:T.border}`, color:c.ocupadas>=c.total?T.red:T.text, padding:"3px 7px", borderRadius:6 }}>{c.horario}: {c.ocupadas}/{c.total}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding:"12px 24px", borderTop:`1px solid ${T.border}`, display:"flex", gap:8, justifyContent:"flex-end" }}>
          <Btn variant="ghost" onClick={()=>setDetalhes(false)}>Fechar</Btn>
          <Btn variant="ghost" onClick={()=>{setDetalhes(false);onEditar(ev);}}>✏️ Editar</Btn>
          <Btn onClick={()=>{setDetalhes(false);onGerenciar(ev);}}>👥 {pendentes>0?`Revisar (${pendentes})`:"Ver Inscritos"}</Btn>
        </div>
      </Modal>
    )}
    </>
  );
}

// ─── MODAL GERENCIAR INSCRITOS ────────────────────────────────────────────────
function ModalGerenciar({ evento, onAprovar, onRejeitar, onClose }) {
  const [tab, setTab] = useState(evento.pendentes?.length>0?"pendentes":"inscritos");
  const [solSel, setSolSel] = useState(null);
  return (
    <>
    <Modal onClose={onClose} maxWidth={560}>
      <div style={{ padding:"20px 24px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <h3 style={{ fontWeight:800, fontSize:"1rem" }}>{evento.titulo}</h3>
          <p style={{ fontSize:"0.78rem", color:T.muted, marginTop:2 }}>Gerenciar participantes</p>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:T.muted, fontSize:"1.3rem", cursor:"pointer" }}>×</button>
      </div>
      <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, padding:"0 24px" }}>
        {[
          { id:"pendentes", label:"Pendentes", count: evento.pendentes?.length||0 },
          { id:"inscritos", label:"Aprovados", count: evento.inscritos?.length||0 },
        ].map(t=>(
          <div key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"12px 0", marginRight:24, fontSize:"0.85rem", fontWeight:700, cursor:"pointer", color:tab===t.id?T.accent:T.muted, borderBottom:tab===t.id?`2px solid ${T.accent}`:"2px solid transparent", transition:"all .15s", display:"flex", alignItems:"center", gap:6 }}>
            {t.label}
            {t.count>0&&<span style={{ background:T.surface3, color:tab===t.id?T.accent:T.muted, borderRadius:20, fontSize:"0.65rem", fontWeight:700, padding:"1px 7px" }}>{t.count}</span>}
          </div>
        ))}
      </div>
      <div style={{ padding:"16px 24px", minHeight:200 }}>
        {tab==="pendentes" && (
          evento.pendentes?.length===0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:T.muted, fontSize:"0.85rem" }}>Nenhuma solicitação pendente.</div>
          ) : evento.pendentes.map(sol=>{
            const c = CLIENTES_MOCK.find(x=>x.id===sol.clienteId);
            if (!c) return null;
            return (
              <div key={sol.clienteId+sol.horario} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                <ScoreRing score={c.score} size={46} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:"0.88rem" }}>{c.nome}</div>
                  <div style={{ fontSize:"0.75rem", color:T.muted }}>Horário: {sol.horario} · Solicitado em {formatDate(sol.solicitadoEm)}</div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn variant="ghost" style={{padding:"6px 10px",fontSize:"0.75rem"}} onClick={()=>setSolSel(sol)}>Ver ficha</Btn>
                  <Btn variant="danger" style={{padding:"6px 10px",fontSize:"0.75rem"}} onClick={()=>onRejeitar(evento,sol)}>✕</Btn>
                  <Btn variant="success" style={{padding:"6px 10px",fontSize:"0.75rem"}} onClick={()=>onAprovar(evento,sol)}>✓</Btn>
                </div>
              </div>
            );
          })
        )}
        {tab==="inscritos" && (
          evento.inscritos?.length===0 ? (
            <div style={{ textAlign:"center", padding:"30px 0", color:T.muted, fontSize:"0.85rem" }}>Nenhum inscrito ainda.</div>
          ) : evento.inscritos.map(ins=>{
            const c = CLIENTES_MOCK.find(x=>x.id===ins.clienteId);
            return (
              <div key={ins.clienteId} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                <ScoreRing score={c?.score||100} size={46} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:"0.88rem" }}>{c?.nome||"Cliente"}</div>
                  <div style={{ fontSize:"0.75rem", color:T.muted }}>🕐 {ins.horario} · <span style={{ color:T.green }}>✓ Aprovado</span></div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div style={{ padding:"12px 24px", borderTop:`1px solid ${T.border}`, display:"flex", justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Fechar</Btn>
      </div>
    </Modal>
    {solSel && (
      <ModalSolicitacao evento={evento} solicitacao={solSel}
        onAprovar={(ev,sol)=>{ onAprovar(ev,sol); setSolSel(null); }}
        onRejeitar={(ev,sol)=>{ onRejeitar(ev,sol); setSolSel(null); }}
        onClose={()=>setSolSel(null)} />
    )}
    </>
  );
}

// ─── MODAL CRIAR/EDITAR EVENTO ────────────────────────────────────────────────
const TIPOS = ["Restaurante","Salão","Clínica","Academia","Consultório","Spa","Escola","Estúdio","Outro"];

function ModalEvento({ evento, onSave, onClose, reservasGlobal, onSaveReservas }) {
  const editando = !!evento;
  const isRestaurante = (v) => v === "Restaurante";
  const [form, setForm] = useState(evento ? {...evento, horariosStr: evento.horarios.join(", ")} : {
    titulo:"", tipo:"Salão", estado:"SP", cidade:"Indaiatuba",
    desc:"", horariosStr:"", data:"", preco:"", publico:false,
    lotacao:"", modoAprov:"automatico", prazoCancelamento:24, classificacao:"livre",
  });
  const [estado, setEstado] = useState(form.estado||"SP");
  const [mesasConfig, setMesasConfig] = useState(reservasGlobal?.tiposMesa || [
    { id:"mesa4", descricao:"Mesa de 4 pessoas", capacidade:4, quantidade:4 },
  ]);
  const cidades = CIDADES[estado]||[];

  function set(k,v) { setForm(f=>({...f,[k]:v})); }

  function handleSave() {
    if (!form.titulo.trim() || !form.data) return;
    if (!isRestaurante(form.tipo) && !form.horariosStr.trim()) return;
    const horarios = isRestaurante(form.tipo) ? [] : form.horariosStr.split(",").map(h=>h.trim()).filter(Boolean);
    const eventoSalvo = {
      ...form,
      estado,
      horarios,
      preco: Number(form.preco) || 0,
      prazoCancelamento:24,
      reservasPorHorario: editando ? (evento.reservasPorHorario || {}) : {},
      filaEspera: editando ? (evento.filaEspera || {}) : {},
      lotacao: form.publico ? null : (parseInt(form.lotacao)||null),
      id: editando ? evento.id : gerarNovoId(),
      inscritos: editando ? evento.inscritos : [],
      pendentes: editando ? evento.pendentes : [],
    };
    onSave(eventoSalvo);
    if (isRestaurante(form.tipo)) {
      onSaveReservas({ ...reservasGlobal, tiposMesa: mesasConfig });
    }
    onClose();
  }

  function addMesa() {
    setMesasConfig(prev=>[...prev, { id:`mesa${Date.now()}`, descricao:"Nova mesa", capacidade:4, quantidade:1 }]);
  }
  function updateMesa(id,k,v) {
    setMesasConfig(prev=>prev.map(m=>m.id===id?{...m,[k]:v}:m));
  }
  function removeMesa(id) {
    setMesasConfig(prev=>prev.filter(m=>m.id!==id));
  }

  const classifAtual = getClassif(form.classificacao);

  return (
    <Modal onClose={onClose} maxWidth={620}>
      <div style={{ padding:"22px 26px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h3 style={{ fontWeight:800, fontSize:"1.05rem" }}>{editando?"Editar Evento":"Novo Evento"}</h3>
          <p style={{ fontSize:"0.78rem", color:T.muted, marginTop:2 }}>Preencha os dados do evento</p>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:T.muted, fontSize:"1.4rem", cursor:"pointer" }}>×</button>
      </div>
      <div style={{ padding:"20px 26px" }}>
        <Input label="Título do Evento" value={form.titulo} onChange={e=>set("titulo",e.target.value)} placeholder="Ex: Corte + Escova Premium" />
        <Textarea label="Descrição" value={form.desc} onChange={e=>set("desc",e.target.value)} placeholder="Descreva o evento..." rows={3} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Select label="Tipo de Estabelecimento" value={form.tipo} onChange={e=>set("tipo",e.target.value)}>
            {TIPOS.map(t=><option key={t}>{t}</option>)}
          </Select>
          <Input label="Data do Evento" type="date" value={form.data} onChange={e=>set("data",e.target.value)} />
          <Input label="Preço do Evento (R$)" type="number" min="0" step="0.01" value={form.preco} onChange={e=>set("preco",e.target.value)} placeholder="0 = gratuito" />
          <Select label="Estado" value={estado} onChange={e=>{ setEstado(e.target.value); set("cidade",""); }}>
            {Object.keys(CIDADES).map(e=><option key={e}>{e}</option>)}
          </Select>
          <Select label="Cidade" value={form.cidade} onChange={e=>set("cidade",e.target.value)}>
            <option value="">Selecione</option>
            {cidades.map(c=><option key={c}>{c}</option>)}
          </Select>
        </div>

        {/* Horários — oculto para restaurante */}
        {!isRestaurante(form.tipo) && (
          <Input label="Horários disponíveis (separados por vírgula)" value={form.horariosStr} onChange={e=>set("horariosStr",e.target.value)} placeholder="09:00, 11:00, 14:00, 16:30" />
        )}

        {/* Info restaurante sem horário fixo */}
        {isRestaurante(form.tipo) && (
          <div style={{ background:T.amberLo, border:`1px solid rgba(255,169,77,0.3)`, borderRadius:10, padding:"12px 14px", marginBottom:14, fontSize:"0.78rem", color:T.amber, lineHeight:1.5 }}>
            🍽 <strong>Reserva de Restaurante:</strong> o horário será escolhido pelo cliente no momento da reserva. Conflitos de agenda são verificados automaticamente.
          </div>
        )}

        {/* Configuração de mesas — apenas para restaurante */}
        {isRestaurante(form.tipo) && (
          <div style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 18px", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:"0.85rem", fontWeight:700 }}>🪑 Configuração de Mesas</div>
                <div style={{ fontSize:"0.72rem", color:T.muted, marginTop:2 }}>Defina os tipos de mesa e a quantidade disponível</div>
              </div>
              <Btn variant="ghost" style={{fontSize:"0.75rem",padding:"6px 12px"}} onClick={addMesa}>＋ Adicionar mesa</Btn>
            </div>
            {mesasConfig.map(mesa=>(
              <div key={mesa.id} style={{ display:"grid", gridTemplateColumns:"1.5fr 0.7fr 0.7fr auto", gap:10, alignItems:"flex-end", marginBottom:8 }}>
                <div>
                  <label style={{ display:"block", fontSize:"0.68rem", color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:0.4 }}>Tipo de mesa</label>
                  <input value={mesa.descricao} onChange={e=>updateMesa(mesa.id,"descricao",e.target.value)}
                    style={{ width:"100%", background:T.surface3, border:`1px solid ${T.border}`, padding:"8px 11px", borderRadius:7, color:T.text, fontSize:"0.82rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"0.68rem", color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:0.4 }}>Lugares</label>
                  <input type="number" min="1" value={mesa.capacidade} onChange={e=>updateMesa(mesa.id,"capacidade",Number(e.target.value))}
                    style={{ width:"100%", background:T.surface3, border:`1px solid ${T.border}`, padding:"8px 11px", borderRadius:7, color:T.text, fontSize:"0.82rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:"0.68rem", color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:0.4 }}>Qtd. disponível</label>
                  <input type="number" min="0" value={mesa.quantidade} onChange={e=>updateMesa(mesa.id,"quantidade",Number(e.target.value))}
                    style={{ width:"100%", background:T.surface3, border:`1px solid ${T.border}`, padding:"8px 11px", borderRadius:7, color:T.text, fontSize:"0.82rem", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }} />
                </div>
                <button onClick={()=>removeMesa(mesa.id)} style={{ background:T.redLo, border:"none", color:T.red, borderRadius:7, padding:"8px 10px", cursor:"pointer", fontSize:"0.78rem", fontFamily:"inherit" }}>✕</button>
              </div>
            ))}
            {mesasConfig.length === 0 && (
              <div style={{ textAlign:"center", padding:"12px 0", color:T.muted, fontSize:"0.8rem" }}>Nenhuma mesa configurada. Clique em "Adicionar mesa".</div>
            )}
          </div>
        )}

        {/* Classificação etária */}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:"0.7rem", color:T.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Classificação Etária</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {CLASSIFICACOES.map(cl=>(
              <div key={cl.val} onClick={()=>set("classificacao",cl.val)}
                style={{ padding:"10px 12px", borderRadius:10, cursor:"pointer", border: form.classificacao===cl.val?`1.5px solid ${cl.cor}`:`1px solid ${T.border}`, background: form.classificacao===cl.val?`${cl.cor}18`:T.surface2, transition:"all .15s" }}>
                <div style={{ fontSize:"1rem", marginBottom:2 }}>{cl.icon}</div>
                <div style={{ fontSize:"0.85rem", fontWeight:700, color:form.classificacao===cl.val?cl.cor:T.text }}>{cl.label}</div>
                <div style={{ fontSize:"0.68rem", color:T.muted, lineHeight:1.3, marginTop:2 }}>{cl.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lotação */}
        {!form.publico && !isRestaurante(form.tipo) && (
          <Input label="Lotação máxima (deixe vazio para ilimitado)" type="number" value={form.lotacao} onChange={e=>set("lotacao",e.target.value)} placeholder="Ex: 10" />
        )}

        {/* Modo de aprovação */}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:"block", fontSize:"0.7rem", color:T.muted, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Modo de Aprovação</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { val:"automatico", icon:"⚡", title:"Automático", desc:"Cliente inscrito na hora, sem revisão" },
              { val:"manual",     icon:"🔍", title:"Manual",     desc:"Você analisa o score antes de aprovar" },
            ].map(opt=>(
              <div key={opt.val} onClick={()=>set("modoAprov",opt.val)}
                style={{ padding:"14px", borderRadius:10, cursor:"pointer", border: form.modoAprov===opt.val?`1.5px solid ${T.accent}`:`1px solid ${T.border}`, background: form.modoAprov===opt.val?T.accentLo:T.surface2, transition:"all .15s" }}>
                <div style={{ fontSize:"1.2rem", marginBottom:4 }}>{opt.icon}</div>
                <div style={{ fontSize:"0.88rem", fontWeight:700 }}>{opt.title}</div>
                <div style={{ fontSize:"0.73rem", color:T.muted, marginTop:2, lineHeight:1.4 }}>{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Política de cancelamento — fixo */}
        <div style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
          <div style={{ fontSize:"0.7rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Política de cancelamento</div>
          <div style={{ fontSize:"0.88rem", fontWeight:700, color:T.text }}>⏱ Padrão fixo: 24 horas de antecedência</div>
          <div style={{ fontSize:"0.75rem", color:T.muted, marginTop:4, lineHeight:1.5 }}>Cancelamentos após esse prazo descontam <strong style={{color:T.red}}>10 pontos</strong> do score TrustBook do cliente.</div>
        </div>
      </div>
      <div style={{ padding:"14px 26px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={handleSave} disabled={!form.titulo.trim()||!form.data||(!isRestaurante(form.tipo)&&!form.horariosStr.trim())}>
          {editando?"💾 Salvar Alterações":"✦ Criar Evento"}
        </Btn>
      </div>
    </Modal>
  );
}

// ─── CALENDÁRIO EMPRESA (compacto) ────────────────────────────────────────────
function CalendarioEmpresa({ eventos }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSel, setDiaSel] = useState(null);

  const evByData = useMemo(()=>{
    const m={};
    eventos.forEach(ev=>{ if(!m[ev.data])m[ev.data]=[]; m[ev.data].push(ev); });
    return m;
  },[eventos]);

  const primeiroDia = new Date(ano,mes,1).getDay();
  const diasNoMes = new Date(ano,mes+1,0).getDate();
  const cells = Array(primeiroDia).fill(null).concat(Array.from({length:diasNoMes},(_,i)=>i+1));
  while(cells.length%7!==0) cells.push(null);

  function ds(d){ return `${ano}-${String(mes+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
  function navMes(dir){ let nm=mes+dir,na=ano; if(nm<0){nm=11;na--;} if(nm>11){nm=0;na++;} setMes(nm);setAno(na);setDiaSel(null); }

  const diaEvs = diaSel?(evByData[ds(diaSel)]||[]):[];

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontWeight:800, fontSize:"1.05rem" }}>Calendário de Eventos</h2>
        <p style={{ fontSize:"0.82rem", color:T.muted, marginTop:2 }}>{eventos.length} evento{eventos.length!==1?"s":""} cadastrado{eventos.length!==1?"s":""}</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"auto 280px", gap:16, alignItems:"start" }}>
        {/* Calendário compacto */}
        <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:16, maxWidth:360 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <button onClick={()=>navMes(-1)} style={{ background:"none", border:"none", color:T.muted, fontSize:"1.2rem", cursor:"pointer", padding:"4px 8px" }}>‹</button>
            <span style={{ fontWeight:800, fontSize:"0.9rem" }}>{MESES_FULL[mes]} {ano}</span>
            <button onClick={()=>navMes(1)} style={{ background:"none", border:"none", color:T.muted, fontSize:"1.2rem", cursor:"pointer", padding:"4px 8px" }}>›</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:6 }}>
            {DSEM.map(d=><div key={d} style={{ textAlign:"center", fontSize:"0.62rem", color:T.muted, fontWeight:700, padding:"3px 0" }}>{d}</div>)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {cells.map((dia,i)=>{
              if(!dia) return <div key={i}/>;
              const d=ds(dia);
              const evs=evByData[d]||[];
              const isHoje=dia===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear();
              const isSel=dia===diaSel;
              const hasPend=evs.some(e=>e.pendentes?.length>0);
              return(
                <div key={i} onClick={()=>setDiaSel(dia===diaSel?null:dia)}
                  style={{ aspectRatio:"1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", borderRadius:6, cursor:"pointer",
                    background:isSel?T.accent:isHoje?"rgba(79,140,255,0.2)":evs.length>0?"rgba(79,140,255,0.07)":"transparent",
                    border:isHoje&&!isSel?`1px solid rgba(79,140,255,0.4)`:"1px solid transparent", transition:"all .15s" }}>
                  <span style={{ fontSize:"0.75rem", fontWeight:isHoje||evs.length>0?700:400, color:isSel?"#fff":isHoje?T.accent:T.text }}>{dia}</span>
                  {evs.length>0&&<div style={{ width:4, height:4, borderRadius:"50%", background:isSel?"#fff":hasPend?T.amber:T.accent, marginTop:1 }}/>}
                </div>
              );
            })}
          </div>
          {/* Legenda compacta */}
          <div style={{ marginTop:12, display:"flex", gap:10, fontSize:"0.65rem", color:T.muted }}>
            <span><span style={{ color:T.accent }}>●</span> Com evento</span>
            <span><span style={{ color:T.amber }}>●</span> Pendências</span>
            <span style={{ background:"rgba(79,140,255,0.2)", padding:"1px 6px", borderRadius:4, color:T.accent }}>Hoje</span>
          </div>
        </div>

        {/* Painel lateral */}
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {diaSel?(
            <>
              <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px" }}>
                <p style={{ fontSize:"0.68rem", color:T.muted, marginBottom:2 }}>Eventos em</p>
                <p style={{ fontWeight:800, fontSize:"0.9rem" }}>{String(diaSel).padStart(2,"0")}/{String(mes+1).padStart(2,"0")}/{ano}</p>
              </div>
              {diaEvs.length===0?(
                <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:14, textAlign:"center", color:T.muted, fontSize:"0.82rem" }}>Nenhum evento neste dia.</div>
              ):diaEvs.map(ev=>(
                <div key={ev.id} style={{ background:T.surface, border:`1px solid ${ev.pendentes?.length>0?T.amber:T.border}`, borderRadius:10, padding:12, borderLeft:`3px solid ${ev.pendentes?.length>0?T.amber:T.accent}` }}>
                  <p style={{ fontWeight:700, fontSize:"0.85rem", marginBottom:4 }}>{ev.titulo}</p>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:5 }}>
                    <BadgeClassif val={ev.classificacao} />
                    {ev.pendentes?.length>0&&<Badge type="pending">{ev.pendentes.length} pend.</Badge>}
                  </div>
                  <p style={{ fontSize:"0.72rem", color:T.muted }}>{ev.tipo==="Restaurante"?"Reserva de mesa":ev.horarios.join(" · ")}</p>
                </div>
              ))}
            </>
          ):(
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:14 }}>
              <p style={{ fontSize:"0.73rem", color:T.muted, lineHeight:1.6, marginBottom:12 }}>
                Clique em um dia com ponto para ver os eventos.
              </p>
              <div style={{ fontSize:"0.7rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Próximos eventos</div>
              {eventos.slice(0,5).map(ev=>(
                <div key={ev.id} style={{ display:"flex", gap:8, marginBottom:8 }}>
                  <div style={{ background:T.accentLo, borderRadius:5, padding:"3px 6px", textAlign:"center", minWidth:32, flexShrink:0 }}>
                    <div style={{ fontSize:"0.58rem", color:T.muted }}>{MESES[parseInt(ev.data.split("-")[1])-1]}</div>
                    <div style={{ fontSize:"0.82rem", fontWeight:800, color:T.accent, lineHeight:1.1 }}>{ev.data.split("-")[2]}</div>
                  </div>
                  <div>
                    <p style={{ fontSize:"0.78rem", fontWeight:700, marginBottom:1 }}>{ev.titulo}</p>
                    <p style={{ fontSize:"0.68rem", color:T.muted }}>{ev.inscritos?.length||0} inscrito{ev.inscritos?.length!==1?"s":""}{ev.pendentes?.length>0?` · ${ev.pendentes.length} pendente${ev.pendentes.length!==1?"s":""}`:""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SEÇÃO SOLICITAÇÕES (Agendamentos + Fila) ─────────────────────────────────
function SecaoSolicitacoes({ eventos, onAprovar, onRejeitar, reservas, onSaveReservas }) {
  const [subAba, setSubAba] = useState("agendamentos"); // agendamentos | fila
  const [solSel, setSolSel] = useState(null);
  const [evSel, setEvSel] = useState(null);
  const [expandido, setExpandido] = useState({});
  const [limiteFilaEdit, setLimiteFilaEdit] = useState(reservas?.limiteFilaPorHorario || 3);

  const totalPendentes = eventos.reduce((a,ev)=>a+(ev.pendentes?.length||0),0);

  // Todos os clientes na fila de todos os eventos
  const eventosComFila = useMemo(()=>{
    return eventos.filter(ev=>{
      const temFila = ev.horarios?.some(h=>(ev.filaEspera?.[h]||[]).length>0);
      return temFila;
    });
  },[eventos]);

  const totalNaFila = eventosComFila.reduce((a,ev)=>a+ev.horarios?.reduce((b,h)=>b+(ev.filaEspera?.[h]||[]).length,0),0)||0;

  function toggleExpand(id) { setExpandido(prev=>({...prev,[id]:!prev[id]})); }

  function salvarLimiteFila() {
    onSaveReservas({ ...reservas, limiteFilaPorHorario: Number(limiteFilaEdit)||3 });
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h2 style={{ fontWeight:800, fontSize:"1.05rem" }}>Solicitações</h2>
          <p style={{ fontSize:"0.82rem", color:T.muted, marginTop:2 }}>Gerencie agendamentos e fila de espera</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {totalPendentes>0&&<Badge type="pending">{totalPendentes} pendente{totalPendentes!==1?"s":""}</Badge>}
          {totalNaFila>0&&<Badge type="manual">{totalNaFila} na fila</Badge>}
        </div>
      </div>

      {/* Slider Agendamentos / Fila */}
      <div style={{ display:"flex", background:T.surface2, border:`1px solid ${T.border}`, borderRadius:12, padding:4, alignSelf:"flex-start" }}>
        {[
          { id:"agendamentos", label:`📋 Agendamentos${totalPendentes>0?` (${totalPendentes})`:""}` },
          { id:"fila",         label:`⏳ Fila de Espera${totalNaFila>0?` (${totalNaFila})`:""}` },
        ].map(t=>(
          <div key={t.id} onClick={()=>setSubAba(t.id)}
            style={{ padding:"8px 20px", borderRadius:9, cursor:"pointer", fontWeight:700, fontSize:"0.85rem", transition:"all .2s",
              background:subAba===t.id?T.accent:"transparent",
              color:subAba===t.id?"#fff":T.muted }}>
            {t.label}
          </div>
        ))}
      </div>

      {/* ABA: Agendamentos */}
      {subAba==="agendamentos" && (
        totalPendentes===0 ? (
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"40px 0", textAlign:"center", color:T.muted }}>
            <div style={{ fontSize:"2rem", marginBottom:10 }}>✓</div>
            <p style={{ fontSize:"0.9rem" }}>Nenhuma solicitação pendente no momento.</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {eventos.filter(ev=>(ev.pendentes||[]).length>0).map(ev=>{
              const aberto = expandido[ev.id] !== false;
              return (
                <div key={ev.id} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
                  <div onClick={()=>toggleExpand(ev.id)}
                    style={{ padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", background:T.surface2, borderBottom:aberto?`1px solid ${T.border}`:"none" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:T.amber, flexShrink:0 }} />
                      <div>
                        <div style={{ fontWeight:700, fontSize:"0.92rem" }}>{ev.titulo}</div>
                        <div style={{ fontSize:"0.72rem", color:T.muted }}>📅 {formatDate(ev.data)} · {ev.tipo} · {ev.cidade}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <Badge type="pending">{ev.pendentes.length} pendente{ev.pendentes.length!==1?"s":""}</Badge>
                      <span style={{ fontSize:"0.8rem", color:T.muted }}>{aberto?"▲":"▼"}</span>
                    </div>
                  </div>
                  {aberto && (
                    <div>
                      {ev.pendentes.map((sol,i)=>{
                        const c=CLIENTES_MOCK.find(x=>x.id===sol.clienteId);
                        if(!c) return null;
                        return(
                          <div key={sol.clienteId+sol.horario} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderBottom:i<ev.pendentes.length-1?`1px solid ${T.border}`:"none" }}>
                            <ScoreRing score={c.score} size={50} />
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3 }}>
                                <span style={{ fontWeight:700, fontSize:"0.9rem" }}>{c.nome}</span>
                                <Badge type={c.score>=80?"approved":c.score>=50?"pending":"rejected"}>{scoreLabel(c.score)}</Badge>
                              </div>
                              <div style={{ fontSize:"0.75rem", color:T.muted }}>
                                {ev.tipo==="Restaurante"?"🍽 Reserva de mesa":`🕐 Horário: ${sol.horario}`} · 📅 {formatDate(sol.solicitadoEm)}
                              </div>
                            </div>
                            <div style={{ display:"flex", gap:6 }}>
                              <Btn variant="ghost" style={{fontSize:"0.76rem",padding:"6px 10px"}} onClick={()=>{setSolSel(sol);setEvSel(ev);}}>Ver ficha</Btn>
                              <Btn variant="danger" style={{fontSize:"0.76rem",padding:"6px 10px"}} onClick={()=>onRejeitar(ev,sol)}>✕</Btn>
                              <Btn variant="success" style={{fontSize:"0.76rem",padding:"6px 10px"}} onClick={()=>onAprovar(ev,sol)}>✓</Btn>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ABA: Fila de Espera */}
      {subAba==="fila" && (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Config de limite da fila */}
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:"0.9rem", marginBottom:3 }}>⚙️ Limite máximo de pessoas na fila por horário</div>
              <div style={{ fontSize:"0.76rem", color:T.muted }}>Quando um agendamento é cancelado, o 1º da fila é promovido automaticamente e a empresa pode aceitar ou recusar.</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input type="number" min="0" max="50" value={limiteFilaEdit} onChange={e=>setLimiteFilaEdit(e.target.value)}
                style={{ width:64, background:T.surface3, border:`1px solid ${T.border}`, padding:"8px 10px", borderRadius:8, color:T.text, fontSize:"0.9rem", fontWeight:700, textAlign:"center", outline:"none", fontFamily:"inherit" }} />
              <Btn onClick={salvarLimiteFila} style={{padding:"8px 14px"}}>Salvar</Btn>
            </div>
          </div>

          {totalNaFila===0 ? (
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"40px 0", textAlign:"center", color:T.muted }}>
              <div style={{ fontSize:"2rem", marginBottom:10 }}>⏳</div>
              <p style={{ fontSize:"0.9rem" }}>Nenhum cliente na fila de espera.</p>
            </div>
          ) : (
            eventosComFila.map(ev=>(
              <div key={ev.id} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
                <div style={{ padding:"14px 18px", background:T.surface2, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontWeight:700, fontSize:"0.92rem" }}>{ev.titulo}</div>
                  <div style={{ fontSize:"0.72rem", color:T.muted, marginTop:2 }}>📅 {formatDate(ev.data)} · {ev.tipo}</div>
                </div>
                {ev.horarios?.map(h=>{
                  const filah = ev.filaEspera?.[h]||[];
                  if(filah.length===0) return null;
                  const limite = reservas?.limiteFilaPorHorario||3;
                  return (
                    <div key={h} style={{ borderBottom:`1px solid ${T.border}` }}>
                      <div style={{ padding:"10px 18px", background:T.bg, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:"0.8rem", fontWeight:700, color:T.accent }}>⏰ {h}</span>
                        <span style={{ fontSize:"0.72rem", color:T.muted }}>{filah.length}/{limite} na fila</span>
                      </div>
                      {filah.map((item,pos)=>{
                        const c=CLIENTES_MOCK.find(x=>x.id===item.clienteId);
                        const isPrimeiro = pos===0;
                        return(
                          <div key={item.clienteId+pos} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px", borderTop:`1px solid ${T.border}`,
                            background:isPrimeiro?"rgba(79,140,255,0.05)":"transparent" }}>
                            <div style={{ width:26, height:26, borderRadius:6, background:isPrimeiro?T.accentLo:T.surface2, color:isPrimeiro?T.accent:T.muted, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.8rem", flexShrink:0 }}>{pos+1}º</div>
                            <ScoreRing score={c?.score||50} size={44} />
                            <div style={{ flex:1 }}>
                              <div style={{ fontWeight:700, fontSize:"0.88rem" }}>{c?.nome||"Cliente"}</div>
                              <div style={{ fontSize:"0.73rem", color:T.muted }}>Score: <span style={{ color:scoreColor(c?.score||50), fontWeight:700 }}>{c?.score||50}</span> · {scoreLabel(c?.score||50)}</div>
                            </div>
                            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                              {isPrimeiro && (
                                <span style={{ fontSize:"0.68rem", background:T.accentLo, color:T.accent, borderRadius:20, padding:"2px 8px", fontWeight:700 }}>Próximo</span>
                              )}
                              <Btn variant="ghost" style={{fontSize:"0.73rem",padding:"5px 9px"}} onClick={()=>{setSolSel({clienteId:item.clienteId,horario:h,solicitadoEm:item.solicitadoEm});setEvSel(ev);}}>Ver ficha</Btn>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}

      {solSel&&evSel&&(
        <ModalSolicitacao evento={evSel} solicitacao={solSel}
          onAprovar={(ev,sol)=>{onAprovar(ev,sol);setSolSel(null);setEvSel(null);}}
          onRejeitar={(ev,sol)=>{onRejeitar(ev,sol);setSolSel(null);setEvSel(null);}}
          onClose={()=>{setSolSel(null);setEvSel(null);}}/>
      )}
    </div>
  );
}



// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ eventos }) {
  const totalInscritos = eventos.reduce((a,e)=>a+(e.inscritos?.length||0),0);
  const totalPendentes = eventos.reduce((a,e)=>a+(e.pendentes?.length||0),0);
  const totalManuais = eventos.filter(e=>e.modoAprov==="manual").length;
  const totalRestaurante = eventos.filter(e=>e.tipo==="Restaurante").length;
  const stats = [
    { label:"Eventos Ativos", value:eventos.length, icon:"🗓", color:T.accent },
    { label:"Inscrições Confirmadas", value:totalInscritos, icon:"✓", color:T.green },
    { label:"Aguardando Revisão", value:totalPendentes, icon:"🔔", color:T.amber },
    { label:"Reservas de Restaurante", value:totalRestaurante, icon:"🍽", color:"#c084fc" },
  ];
  return(
    <div>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontWeight:800, fontSize:"1.05rem", marginBottom:4 }}>Visão Geral</h2>
        <p style={{ fontSize:"0.82rem", color:T.muted }}>Resumo das atividades da sua empresa</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {stats.map(s=>(
          <div key={s.label} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"18px 16px" }}>
            <div style={{ fontSize:"1.4rem", marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:"1.8rem", fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:"0.75rem", color:T.muted, marginTop:4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"18px 20px" }}>
        <div style={{ fontSize:"0.7rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:14 }}>Como funciona o TrustBook</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { icon:"⚡", title:"Aprovação Automática", desc:"O cliente é inscrito imediatamente ao solicitar. Ideal para eventos públicos ou de baixo risco." },
            { icon:"🔍", title:"Aprovação Manual", desc:"A empresa revisa o Score TrustBook do cliente antes de aprovar. Você vê nome, CPF parcial e histórico." },
            { icon:"🏆", title:"Score TrustBook", desc:"Vai de 0 a 100. Clientes com score alto têm histórico impecável. Você decide o mínimo para seus eventos." },
            { icon:"⏱", title:"Cancelamento 24h", desc:"Regra fixa de 24h. Cancelamentos tardios descontam 10 pontos do score do cliente automaticamente." },
          ].map(i=>(
            <div key={i.title} style={{ background:T.surface2, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 16px", display:"flex", gap:12 }}>
              <span style={{ fontSize:"1.3rem" }}>{i.icon}</span>
              <div>
                <div style={{ fontSize:"0.87rem", fontWeight:700, marginBottom:3 }}>{i.title}</div>
                <div style={{ fontSize:"0.78rem", color:T.muted, lineHeight:1.5 }}>{i.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PERFIL UNIFICADO (Dados Cadastrais ↔ Perfil Público) ────────────────────
function SecaoPerfil({ empresa, perfilPublico, onSaveEmpresa, onSavePerfilPublico }) {
  const [aba, setAba] = useState("cadastral"); // cadastral | publico
  const [formEmpresa, setFormEmpresa] = useState(empresa);
  const [formPublico, setFormPublico] = useState({ ...perfilPublico, fotosStr:(perfilPublico.fotosEmpresa||[]).join("\n") });
  const identidade = gerarIdentidadeVisual(formPublico.cores);

  function setEmp(k,v){ setFormEmpresa(f=>({...f,[k]:v})); }
  function setPub(k,v){ setFormPublico(f=>({...f,[k]:v})); }
  function setCor(k,v){ setFormPublico(f=>({...f, cores:{...f.cores,[k]:v}})); }
  function handleUpload(k,files){ const file=files?.[0]; if(file) setPub(k,URL.createObjectURL(file)); }
  function handleGaleria(files){ const urls=Array.from(files||[]).map(f=>URL.createObjectURL(f)); setFormPublico(f=>({...f,fotosEmpresa:[...(f.fotosEmpresa||[]),...urls],fotosStr:[...(f.fotosEmpresa||[]),...urls].join("\n")})); }
  function salvarPublico(){ onSavePerfilPublico({ fotoPerfil:formPublico.fotoPerfil, fotosEmpresa:parseListaFotos(formPublico.fotosStr), dadosPublicos:formPublico.dadosPublicos, cores:formPublico.cores }); }

  const fotos = parseListaFotos(formPublico.fotosStr);

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      {/* Slider de abas */}
      <div style={{ display:"flex", background:T.surface2, border:`1px solid ${T.border}`, borderRadius:12, padding:4, marginBottom:20, alignSelf:"flex-start" }}>
        {[
          { id:"cadastral", label:"📋 Dados Cadastrais" },
          { id:"publico",   label:"🌐 Perfil Público" },
        ].map(t=>(
          <div key={t.id} onClick={()=>setAba(t.id)}
            style={{ padding:"8px 20px", borderRadius:9, cursor:"pointer", fontWeight:700, fontSize:"0.85rem", transition:"all .2s",
              background:aba===t.id?T.accent:"transparent",
              color:aba===t.id?"#fff":T.muted }}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Aba: Dados Cadastrais — card ocupa largura e altura toda */}
      {aba==="cadastral" && (
        <div style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"28px 32px", display:"flex", flexDirection:"column" }}>
          <div style={{ marginBottom:22 }}>
            <h2 style={{ fontWeight:800, fontSize:"1.1rem", marginBottom:4 }}>Dados Cadastrais</h2>
            <p style={{ fontSize:"0.82rem", color:T.muted }}>Informações internas da empresa.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, flex:1, alignContent:"start" }}>
            <Input label="Razão Social" value={formEmpresa.razaoSocial} onChange={e=>setEmp("razaoSocial",e.target.value)} />
            <Input label="Nome Fantasia" value={formEmpresa.nomeFantasia} onChange={e=>setEmp("nomeFantasia",e.target.value)} />
            <Input label="CNPJ" value={formEmpresa.cnpj} onChange={e=>setEmp("cnpj",e.target.value)} />
            <Input label="Email" type="email" value={formEmpresa.email} onChange={e=>setEmp("email",e.target.value)} />
            <Input label="Telefone" value={formEmpresa.telefone} onChange={e=>setEmp("telefone",e.target.value)} />
            <Input label="Endereço" value={formEmpresa.endereco} onChange={e=>setEmp("endereco",e.target.value)} />
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:20 }}>
            <Btn onClick={()=>onSaveEmpresa(formEmpresa)}>💾 Salvar Dados</Btn>
          </div>
        </div>
      )}

      {/* Aba: Perfil Público — 1 card full width/height */}
      {aba==="publico" && (
        <div style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, padding:"28px 32px", display:"flex", flexDirection:"column", gap:20, overflowY:"auto" }}>
          <div>
            <h2 style={{ fontWeight:800, fontSize:"1.1rem", marginBottom:4 }}>Perfil Público</h2>
            <p style={{ fontSize:"0.82rem", color:T.muted }}>Como sua empresa aparece para os clientes.</p>
          </div>

          {/* Foto de perfil e identidade visual */}
          <div>
            <div style={{ fontSize:"0.7rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:12 }}>Foto de Perfil & Identidade Visual</div>
            <div style={{ display:"flex", gap:18, alignItems:"flex-start", marginBottom:16 }}>
              <div style={{ width:80, height:80, borderRadius:14, background:formPublico.fotoPerfil?`url(${formPublico.fotoPerfil}) center/cover`:identidade.gradiente, border:`2px solid ${T.border2}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"1.3rem", color:"#fff" }}>
                {!formPublico.fotoPerfil && (empresa.nomeFantasia?.[0]||"E")}
              </div>
              <div style={{ flex:1 }}>
                <Input label="URL da foto de perfil" value={formPublico.fotoPerfil} onChange={e=>setPub("fotoPerfil",e.target.value)} placeholder="https://..." />
                <input type="file" accept="image/*" onChange={e=>handleUpload("fotoPerfil",e.target.files)} style={{ color:T.muted, fontSize:"0.75rem", marginTop:-8 }} />
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:10 }}>
              <Input label="Cor principal 1" type="color" value={formPublico.cores.primaria} onChange={e=>setCor("primaria",e.target.value)} style={{ height:42, padding:6 }} />
              <Input label="Cor principal 2" type="color" value={formPublico.cores.secundaria} onChange={e=>setCor("secundaria",e.target.value)} style={{ height:42, padding:6 }} />
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:4 }}>
              {[identidade.primaria, identidade.mistura25, identidade.mistura50, identidade.mistura75, identidade.secundaria].map(c=><span key={c} style={{ background:c, width:46, height:24, borderRadius:6, border:`1px solid ${T.border2}`, display:"inline-block" }} />)}
            </div>
            <div style={{ fontSize:"0.68rem", color:T.muted, marginTop:4 }}>Variações geradas por interpolação</div>
          </div>

          {/* Descrição */}
          <Textarea label="Descrição pública da empresa" value={formPublico.dadosPublicos} onChange={e=>setPub("dadosPublicos",e.target.value)} rows={4} />

          {/* Fotos da empresa */}
          <div>
            <div style={{ fontSize:"0.7rem", color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:10 }}>Fotos da Empresa (galeria pública)</div>
            <input type="file" accept="image/*" multiple onChange={e=>handleGaleria(e.target.files)} style={{ color:T.muted, fontSize:"0.78rem", marginBottom:10 }} />
            <Textarea value={formPublico.fotosStr} onChange={e=>setPub("fotosStr",e.target.value)} placeholder="Uma URL de imagem por linha" rows={3} />
            {fotos.length>0 && (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:8, marginTop:12 }}>
                {fotos.map((foto,i)=>(
                  <div key={foto+i} style={{ height:70, borderRadius:9, background:`url(${foto}) center/cover, ${T.surface2}`, border:`1px solid ${T.border}` }} />
                ))}
              </div>
            )}
          </div>

          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"auto" }}>
            <Btn onClick={salvarPublico}>💾 Salvar Perfil Público</Btn>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── FORMA DE PAGAMENTO (removida) ───────────────────────────────────────────

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  // Abas principais: dashboard, eventos, calendario, solicitacoes, perfil
  const [aba, setAba] = useState("dashboard");
  const [tema, setTema] = useState("dark"); // dark | light
  T = tema === "dark" ? DARK_THEME : LIGHT_THEME;

  const [eventos, setEventos] = useState(() => {
    const shared = getShared();
    return (shared?.eventos || EVENTOS_INICIAIS).map(ev=>({ preco:0, reservasPorHorario:{}, filaEspera:{}, ...ev, prazoCancelamento:24 }));
  });
  const [modalEvento, setModalEvento] = useState(null);
  const [modalGerenciar, setModalGerenciar] = useState(null);
  const [modalExcluir, setModalExcluir] = useState(null);
  const [empresa, setEmpresa] = useState(() => getShared()?.empresa || EMPRESA_INICIAL);
  const [perfilPublico, setPerfilPublico] = useState(() => getShared()?.perfilPublico || PERFIL_PUBLICO_INICIAL);
  const [reservas, setReservas] = useState(() => getShared()?.reservas || RESERVAS_INICIAL);
  const [toast, setToast] = useState({msg:"",type:"success"});

  const totalPendentes = eventos.reduce((a,e)=>a+(e.pendentes?.length||0),0);

  useEffect(() => {
    // Único ponto de persistência — roda sempre que qualquer dado muda
    const shared = getShared() || {};
    const novoShared = { ...shared, eventos, empresa, perfilPublico, reservas };
    setShared(novoShared);
    // Dispara para outras abas/janelas abertas (ex: app do cliente)
    try {
      window.dispatchEvent(new StorageEvent("storage", { key: STORE_KEY, newValue: JSON.stringify(novoShared) }));
    } catch {}
  }, [eventos, empresa, perfilPublico, reservas]);

  useEffect(() => {
    // Escuta mudanças vindas de OUTRAS abas/janelas (o cliente, por exemplo)
    let _ignoreNext = false;
    function onStorage(e) {
      if (e.key !== STORE_KEY) return;
      if (_ignoreNext) { _ignoreNext = false; return; }
      const raw = e.newValue || localStorage.getItem(STORE_KEY);
      if (!raw) return;
      try {
        const shared = JSON.parse(raw);
        if (shared?.eventos) setEventos(shared.eventos);
        if (shared?.empresa) setEmpresa(shared.empresa);
        if (shared?.perfilPublico) setPerfilPublico(shared.perfilPublico);
        if (shared?.reservas) setReservas(shared.reservas);
      } catch {}
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function showToast(msg,type="success"){ setToast({msg,type}); setTimeout(()=>setToast({msg:"",type:"success"}),3000); }

  function handleSaveEvento(ev) {
    const normalizado = {
      ...ev,
      preco: Number(ev.preco) || 0,
      prazoCancelamento: 24,
      reservasPorHorario: ev.reservasPorHorario || {},
      filaEspera: ev.filaEspera || {},
      inscritos: ev.inscritos || [],
      pendentes: ev.pendentes || [],
    };
    setEventos(evs => {
      const isNew = !evs.some(e => String(e.id) === String(normalizado.id));
      const novosEvs = isNew ? [...evs, normalizado] : evs.map(e => String(e.id) === String(normalizado.id) ? normalizado : e);
      showToast(isNew ? `Evento "${normalizado.titulo}" criado!` : `Evento "${normalizado.titulo}" atualizado!`);
      return novosEvs;
    });
  }
  function handleSaveEmpresa(data) { setEmpresa(data); showToast("Perfil da empresa atualizado!"); }
  function handleSavePerfilPublico(data) { setPerfilPublico(data); showToast("Perfil público atualizado!"); }
  function handleSaveReservas(data) { setReservas(data); showToast("Configurações de reservas atualizadas!"); }

  function handleExcluir(evento) { setModalExcluir(evento); }

  function confirmarExclusao() {
    const ev = modalExcluir;
    const shared = getShared() || {};
    const notifs = shared.notificacoes || [];
    (ev.inscritos||[]).forEach(ins => {
      notifs.push({ id:Date.now()+Math.random(), clienteId:ins.clienteId, tipo:"evento_cancelado", eventoId:ev.id, eventoTitulo:ev.titulo, lida:false, criadaEm:new Date().toISOString() });
    });
    setShared({ ...shared, notificacoes: notifs });
    setEventos(evs=>evs.filter(e=>e.id!==ev.id));
    showToast("Evento excluído.", "error");
    setModalExcluir(null);
  }

  function handleAprovar(evento, sol) {
    const shared = getShared() || {};
    const notifs = shared.notificacoes || [];
    notifs.push({ id:Date.now()+Math.random(), clienteId:sol.clienteId, tipo:"solicitacao_aprovada", eventoId:evento.id, eventoTitulo:evento.titulo, horario:sol.horario, data:evento.data, lida:false, criadaEm:new Date().toISOString() });
    setShared({ ...shared, notificacoes: notifs });
    setEventos(evs=>evs.map(ev=>{
      if(ev.id!==evento.id) return ev;
      return { ...ev, pendentes:(ev.pendentes||[]).filter(p=>!(p.clienteId===sol.clienteId&&p.horario===sol.horario)), inscritos:[...(ev.inscritos||[]),{clienteId:sol.clienteId,horario:sol.horario}] };
    }));
    const c=CLIENTES_MOCK.find(x=>x.id===sol.clienteId);
    showToast(`${c?.nome} aprovado!`);
    if(modalGerenciar) setModalGerenciar(prev=>({ ...prev, pendentes:(prev.pendentes||[]).filter(p=>!(p.clienteId===sol.clienteId&&p.horario===sol.horario)), inscritos:[...(prev.inscritos||[]),{clienteId:sol.clienteId,horario:sol.horario}] }));
  }

  function handleRejeitar(evento, sol) {
    const shared = getShared() || {};
    const notifs = shared.notificacoes || [];
    notifs.push({ id:Date.now()+Math.random(), clienteId:sol.clienteId, tipo:"solicitacao_recusada", eventoId:evento.id, eventoTitulo:evento.titulo, lida:false, criadaEm:new Date().toISOString() });
    setShared({ ...shared, notificacoes: notifs });
    setEventos(evs=>evs.map(ev=>{
      if(ev.id!==evento.id) return ev;
      return { ...ev, pendentes:(ev.pendentes||[]).filter(p=>!(p.clienteId===sol.clienteId&&p.horario===sol.horario)) };
    }));
    const c=CLIENTES_MOCK.find(x=>x.id===sol.clienteId);
    showToast(`${c?.nome} recusado.`,"error");
    if(modalGerenciar) setModalGerenciar(prev=>({ ...prev, pendentes:(prev.pendentes||[]).filter(p=>!(p.clienteId===sol.clienteId&&p.horario===sol.horario)) }));
  }

  // Menu principal — 4 itens (sem Configurações)
  const NAV_MAIN = [
    { id:"dashboard",    label:"Dashboard",    icon:"📊" },
    { id:"eventos",      label:"Meus Eventos",  icon:"🗓" },
    { id:"calendario",   label:"Calendário",    icon:"📅" },
    { id:"solicitacoes", label:"Solicitações",  icon:"🔔", badge:totalPendentes },
  ];

  const tituloHeader = aba==="perfil"
    ? "Perfil da Empresa"
    : NAV_MAIN.find(n=>n.id===aba)?.label || "";

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bg, color:T.text, fontFamily:"'DM Sans',sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
        select option{background:${T.surface2}}
        input[type=date]::-webkit-calendar-picker-indicator{filter:${tema==="dark"?"invert(0.5)":"invert(0)"}}
        input::placeholder{color:${T.muted}}textarea::placeholder{color:${T.muted}}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{ width:220, background:T.surface, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", paddingTop:20, flexShrink:0 }}>
        {/* Logo */}
        <div style={{ padding:"0 18px 24px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:"linear-gradient(135deg,#4f8cff,#8b5cf6)", width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#fff" }}>T</div>
          <div>
            <div style={{ fontWeight:800, fontSize:"1rem", letterSpacing:"-0.5px" }}>TrustBook</div>
            <div style={{ fontSize:"0.65rem", color:T.muted, letterSpacing:0.3 }}>Painel Empresa</div>
          </div>
        </div>

        {/* Menu principal */}
        <div style={{ padding:"0 16px 8px", fontSize:"0.6rem", color:T.muted, textTransform:"uppercase", letterSpacing:1 }}>Menu</div>
        {NAV_MAIN.map(nav=>{
          const ativo = aba===nav.id;
          return (
            <div key={nav.id} onClick={()=>setAba(nav.id)}
              style={{ padding:"10px 18px", display:"flex", alignItems:"center", gap:10, color:ativo?T.accent:T.muted, cursor:"pointer", fontSize:"0.87rem", background:ativo?T.accentLo:"transparent", borderLeft:ativo?`3px solid ${T.accent}`:"3px solid transparent", transition:"all .2s", fontWeight:ativo?700:400 }}>
              <span>{nav.icon}</span>
              <span style={{flex:1}}>{nav.label}</span>
              {nav.badge>0&&<span style={{ background:"rgba(255,169,77,0.15)", color:T.amber, borderRadius:20, fontSize:"0.62rem", fontWeight:800, padding:"1px 6px" }}>{nav.badge}</span>}
            </div>
          );
        })}

        {/* Footer empresa — clicável para abrir Perfil */}
        <div style={{ marginTop:"auto", padding:14, borderTop:`1px solid ${T.border}` }}>
          {/* Botão de tema */}
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:10 }}>
            <button
              onClick={()=>setTema(t=>t==="dark"?"light":"dark")}
              title={tema==="dark"?"Mudar para Tema Claro":"Mudar para Tema Escuro"}
              style={{ background:T.surface2, border:`1px solid ${T.border}`, color:T.text, borderRadius:20, padding:"5px 12px", cursor:"pointer", fontSize:"0.75rem", fontWeight:700, display:"flex", alignItems:"center", gap:6, transition:"all .2s" }}>
              {tema==="dark" ? "☀️ Claro" : "🌙 Escuro"}
            </button>
          </div>
          <div
            onClick={()=>setAba("perfil")}
            style={{ display:"flex", alignItems:"center", gap:10, padding:8, borderRadius:10, cursor:"pointer", background:aba==="perfil"?T.accentLo:"transparent", border:aba==="perfil"?`1px solid ${T.accent}`:`1px solid transparent`, transition:"all .2s" }}>
            <div style={{ width:34, height:34, borderRadius:8, background:"linear-gradient(135deg,#4f8cff,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.9rem", color:"#fff", flexShrink:0 }}>
              {empresa.nomeFantasia?.[0]||"E"}
            </div>
            <div style={{ overflow:"hidden" }}>
              <div style={{ fontSize:"0.82rem", fontWeight:700, color:aba==="perfil"?T.accent:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Minha empresa</div>
              <div style={{ fontSize:"0.67rem", color:T.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{empresa.nomeFantasia}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Header */}
        <header style={{ height:60, padding:"0 26px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${T.border}`, background:T.surface, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ fontWeight:800, fontSize:"0.98rem" }}>{tituloHeader}</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            {aba==="eventos" && (
              <Btn onClick={()=>setModalEvento("novo")}>✦ Novo Evento</Btn>
            )}
          </div>
        </header>

        {/* Conteúdo */}
        <div style={{ flex:1, padding:"24px 26px", overflowY:"auto" }}>
          {aba==="dashboard" && <Dashboard eventos={eventos} />}
          {aba==="eventos" && (
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                <div>
                  <h2 style={{ fontWeight:800, fontSize:"1.05rem" }}>Meus Eventos</h2>
                  <p style={{ fontSize:"0.82rem", color:T.muted, marginTop:2 }}>{eventos.length} evento{eventos.length!==1?"s":""} cadastrado{eventos.length!==1?"s":""}</p>
                </div>
              </div>
              {eventos.length===0?(
                <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"50px 0", textAlign:"center" }}>
                  <div style={{ fontSize:"2.5rem", marginBottom:12 }}>🗓</div>
                  <p style={{ color:T.muted, marginBottom:16 }}>Nenhum evento criado ainda.</p>
                  <Btn onClick={()=>setModalEvento("novo")}>✦ Criar primeiro evento</Btn>
                </div>
              ):(
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:16 }}>
                  {eventos.map(ev=>(
                    <EventoCard key={ev.id} ev={ev}
                      identidadeVisual={gerarIdentidadeVisual(perfilPublico.cores)}
                      reservasConfig={reservas}
                      onEditar={ev=>setModalEvento(ev)}
                      onGerenciar={ev=>setModalGerenciar(ev)}
                      onExcluir={handleExcluir} />
                  ))}
                </div>
              )}
            </div>
          )}
          {aba==="calendario" && <CalendarioEmpresa eventos={eventos} />}
          {aba==="solicitacoes" && <SecaoSolicitacoes eventos={eventos} onAprovar={handleAprovar} onRejeitar={handleRejeitar} reservas={reservas} onSaveReservas={handleSaveReservas} />}
          {aba==="perfil" && <SecaoPerfil empresa={empresa} perfilPublico={perfilPublico} onSaveEmpresa={handleSaveEmpresa} onSavePerfilPublico={handleSavePerfilPublico} />}
        </div>
      </div>

      {/* MODALS */}
      {modalEvento && (
        <ModalEvento
          evento={modalEvento==="novo"?null:modalEvento}
          onSave={handleSaveEvento}
          onClose={()=>setModalEvento(null)}
          reservasGlobal={reservas}
          onSaveReservas={handleSaveReservas}
        />
      )}
      {modalGerenciar && (
        <ModalGerenciar evento={modalGerenciar} onAprovar={handleAprovar} onRejeitar={handleRejeitar} onClose={()=>setModalGerenciar(null)} />
      )}
      {modalExcluir && (
        <ModalConfirmarExclusao evento={modalExcluir} onConfirmar={confirmarExclusao} onClose={()=>setModalExcluir(null)} />
      )}

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}
