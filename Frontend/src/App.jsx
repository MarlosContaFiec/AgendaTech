import { useState, useEffect, useRef } from "react";

// ─── API ──────────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000";

async function apiCall(method, path, body = null, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    return res.json();
  } catch {
    return { success: false, message: "Erro de conexão com o servidor. Verifique sua internet." };
  }
}

function salvarTokens(tipo, access, refresh) {
  try {
    const chave = tipo === "empresa" ? "tb_empresa" : "tb_cliente";
    localStorage.setItem(`${chave}_token`, access);
    localStorage.setItem(`${chave}_refresh`, refresh);
    localStorage.setItem("tb_tipo", tipo);
  } catch {}
}

// ─── PALETA (mesma dos painéis) ───────────────────────────────────────────────
const C = {
  bg:       "#080a0f",
  surface:  "#0e1118",
  surface2: "#141820",
  surface3: "#1b2030",
  border:   "#232840",
  border2:  "#2e3550",
  accent:   "#4f8cff",
  accentLo: "rgba(79,140,255,0.10)",
  accentMid:"rgba(79,140,255,0.18)",
  violet:   "#a78bfa",
  violetLo: "rgba(167,139,250,0.12)",
  green:    "#22d48a",
  greenLo:  "rgba(34,212,138,0.12)",
  red:      "#ff5c7a",
  redLo:    "rgba(255,92,122,0.12)",
  amber:    "#ffa94d",
  amberLo:  "rgba(255,169,77,0.12)",
  text:     "#dde2f0",
  muted:    "#6b7294",
  muted2:   "#8890b0",
};

const GRAD_AZUL   = "linear-gradient(135deg, #4f8cff, #6366f1)";
const GRAD_VIOLET = "linear-gradient(135deg, #a78bfa, #ec4899)";
const GRAD_BTN    = "linear-gradient(135deg, #4f8cff 0%, #7c3aed 100%)";

// ─── MÁSCARAS ─────────────────────────────────────────────────────────────────
function maskCPF(v) {
  return v.replace(/\D/g,"").slice(0,11)
    .replace(/(\d{3})(\d)/,"$1.$2")
    .replace(/(\d{3})(\d)/,"$1.$2")
    .replace(/(\d{3})(\d{1,2})$/,"$1-$2");
}
function maskCNPJ(v) {
  return v.replace(/\D/g,"").slice(0,14)
    .replace(/(\d{2})(\d)/,"$1.$2")
    .replace(/(\d{3})(\d)/,"$1.$2")
    .replace(/(\d{3})(\d)/,"$1/$2")
    .replace(/(\d{4})(\d{1,2})$/,"$1-$2");
}
function isCPF(v)  { return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v); }
function isCNPJ(v) { return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v); }

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function Logo({ size = 34 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{
        width:size, height:size, borderRadius:size*0.3,
        background: GRAD_BTN,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontWeight:900, fontSize:size*0.52, color:"#fff", flexShrink:0,
        boxShadow:"0 4px 18px rgba(79,140,255,0.4)",
        fontFamily:"inherit",
      }}>T</div>
      <div>
        <div style={{ fontWeight:900, fontSize:size*0.56, letterSpacing:"-0.03em", color:C.text, lineHeight:1.1, fontFamily:"inherit" }}>
          TrustBook
        </div>
        <div style={{ fontSize:size*0.3, color:C.muted, letterSpacing:"0.04em", marginTop:1 }}>
          confiança em serviços
        </div>
      </div>
    </div>
  );
}

function Card({ children, maxW = 440 }) {
  return (
    <div style={{
      width:"100%", maxWidth:maxW,
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius:20,
      padding:"36px 36px 32px",
      boxShadow:"0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,140,255,0.06)",
      animation:"fadeUp .3s cubic-bezier(.22,1,.36,1)",
    }}>
      {children}
    </div>
  );
}

function Alerta({ tipo = "erro", children }) {
  const mapa = {
    erro:    { bg:C.redLo,    borda:"rgba(255,92,122,0.28)",  cor:C.red,    icone:"✕" },
    sucesso: { bg:C.greenLo,  borda:"rgba(34,212,138,0.28)",  cor:C.green,  icone:"✓" },
    info:    { bg:C.accentLo, borda:"rgba(79,140,255,0.28)",  cor:C.accent, icone:"i" },
    aviso:   { bg:C.amberLo,  borda:"rgba(255,169,77,0.28)",  cor:C.amber,  icone:"!" },
  };
  const s = mapa[tipo];
  return (
    <div style={{
      background:s.bg, border:`1px solid ${s.borda}`,
      borderRadius:10, padding:"11px 14px",
      display:"flex", gap:10, alignItems:"flex-start",
      animation:"fadeUp .2s ease",
    }}>
      <span style={{ color:s.cor, fontWeight:900, fontSize:"0.9rem", flexShrink:0, marginTop:1 }}>{s.icone}</span>
      <p style={{ fontSize:"0.81rem", color:s.cor, lineHeight:1.6, margin:0 }}>{children}</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      style={{ animation:"girar .75s linear infinite", display:"block" }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2"/>
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function BotaoPrimario({ children, loading, disabled, onClick, style: extraStyle = {} }) {
  return (
    <button onClick={onClick} disabled={loading || disabled} style={{
      width:"100%", padding:"13px 16px", borderRadius:11,
      border:"none", background: GRAD_BTN,
      color:"#fff", fontWeight:800, fontSize:"0.91rem",
      fontFamily:"inherit", cursor:(loading||disabled)?"not-allowed":"pointer",
      opacity:(loading||disabled)?0.6:1,
      transition:"all .2s", letterSpacing:"0.02em",
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      boxShadow:"0 4px 20px rgba(79,140,255,0.3)",
      ...extraStyle,
    }}>
      {loading ? <><Spinner /> Aguarde...</> : children}
    </button>
  );
}

function BotaoGhost({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background:"none", border:`1.5px solid ${C.border2}`,
      color:C.muted2, fontWeight:600, fontSize:"0.85rem",
      fontFamily:"inherit", cursor:"pointer", borderRadius:11,
      padding:"11px 16px", width:"100%", transition:"all .2s",
    }}>
      {children}
    </button>
  );
}

function BotaoLink({ children, onClick, cor }) {
  return (
    <button onClick={onClick} style={{
      background:"none", border:"none", cursor:"pointer",
      color: cor || C.muted, fontSize:"0.82rem", fontFamily:"inherit",
      display:"inline-flex", alignItems:"center", gap:5,
      padding:0, fontWeight:500,
    }}>
      {children}
    </button>
  );
}

function Label({ texto, erro, obrigatorio }) {
  if (!texto) return null;
  return (
    <div style={{
      fontSize:"0.7rem", fontWeight:700,
      color: erro ? C.red : C.muted,
      textTransform:"uppercase", letterSpacing:"0.07em",
      marginBottom:5,
    }}>
      {texto}{obrigatorio && <span style={{ color:C.accent, marginLeft:2 }}>*</span>}
    </div>
  );
}

function ErroLabel({ texto }) {
  if (!texto) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:5, fontSize:"0.72rem", color:C.red }}>
      <span>!</span>{texto}
    </div>
  );
}

function Input({ label, erro, icone, sufixo, obrigatorio, style: extraStyle, ...props }) {
  const [foco, setFoco] = useState(false);
  return (
    <div>
      <Label texto={label} erro={erro} obrigatorio={obrigatorio} />
      <div style={{ position:"relative" }}>
        {icone && (
          <span style={{
            position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
            fontSize:"1rem", pointerEvents:"none",
            color: foco ? C.accent : C.muted, transition:"color .2s",
          }}>{icone}</span>
        )}
        <input
          {...props}
          onFocus={e => { setFoco(true); props.onFocus?.(e); }}
          onBlur={e => { setFoco(false); props.onBlur?.(e); }}
          style={{
            width:"100%", boxSizing:"border-box",
            background: foco ? C.surface3 : C.surface2,
            border:`1.5px solid ${erro ? C.red : foco ? C.accent : C.border2}`,
            borderRadius:10,
            padding: icone ? "12px 14px 12px 40px" : "12px 14px",
            paddingRight: sufixo ? 44 : 14,
            color:C.text, fontSize:"0.88rem",
            outline:"none", fontFamily:"inherit", transition:"all .2s",
            ...(extraStyle||{}),
          }}
        />
        {sufixo && (
          <span style={{
            position:"absolute", right:13, top:"50%", transform:"translateY(-50%)",
            pointerEvents:"none", color:C.muted, fontSize:"0.9rem",
          }}>{sufixo}</span>
        )}
      </div>
      <ErroLabel texto={erro} />
    </div>
  );
}

function InputSenha({ label, erro, placeholder, value, onChange, obrigatorio }) {
  const [ver, setVer] = useState(false);
  const [foco, setFoco] = useState(false);
  return (
    <div>
      <Label texto={label} erro={erro} obrigatorio={obrigatorio} />
      <div style={{ position:"relative" }}>
        <span style={{
          position:"absolute", left:13, top:"50%", transform:"translateY(-50%)",
          fontSize:"1rem", pointerEvents:"none",
          color: foco ? C.accent : C.muted, transition:"color .2s",
        }}>🔒</span>
        <input
          type={ver ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFoco(true)}
          onBlur={() => setFoco(false)}
          style={{
            width:"100%", boxSizing:"border-box",
            background: foco ? C.surface3 : C.surface2,
            border:`1.5px solid ${erro ? C.red : foco ? C.accent : C.border2}`,
            borderRadius:10, padding:"12px 44px 12px 40px",
            color:C.text, fontSize:"0.88rem",
            outline:"none", fontFamily:"inherit", transition:"all .2s",
          }}
        />
        <button type="button" onClick={() => setVer(v=>!v)} style={{
          position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
          background:"none", border:"none", cursor:"pointer",
          color:C.muted, fontSize:"1rem", padding:4, lineHeight:1,
        }}>{ver ? "🙈" : "👁️"}</button>
      </div>
      <ErroLabel texto={erro} />
    </div>
  );
}

function BarraForca({ senha }) {
  const forca = !senha ? 0
    : senha.length < 6 ? 1
    : senha.length < 10 ? 2
    : /[A-Z]/.test(senha) && /\d/.test(senha) ? 4 : 3;
  const rotulos = ["","Muito fraca","Fraca","Boa","Forte"];
  const cores   = ["transparent", C.red, C.amber, C.accent, C.green];
  if (!senha) return null;
  return (
    <div style={{ marginTop:-2 }}>
      <div style={{ display:"flex", gap:4, marginBottom:4 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex:1, height:3, borderRadius:3,
            background: forca>=i ? cores[forca] : C.border2, transition:"background .3s" }}/>
        ))}
      </div>
      <span style={{ fontSize:"0.7rem", color:cores[forca], fontWeight:600 }}>{rotulos[forca]}</span>
    </div>
  );
}

function Divisor({ texto }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"2px 0" }}>
      <div style={{ flex:1, height:1, background:C.border }}/>
      {texto && <span style={{ fontSize:"0.72rem", color:C.muted, whiteSpace:"nowrap" }}>{texto}</span>}
      <div style={{ flex:1, height:1, background:C.border }}/>
    </div>
  );
}

function StepIndicator({ etapas, atual }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:26 }}>
      {etapas.map((e, i) => {
        const feito = i < atual;
        const ativo = i === atual;
        return (
          <div key={i} style={{ display:"flex", alignItems:"center", flex: i<etapas.length-1?1:"none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{
                width:28, height:28, borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
                background: feito ? C.green : ativo ? GRAD_BTN : C.surface3,
                border: feito||ativo ? "none" : `1.5px solid ${C.border2}`,
                fontSize:"0.72rem", fontWeight:800,
                color: (feito||ativo) ? "#fff" : C.muted,
                transition:"all .3s", flexShrink:0,
                boxShadow: ativo ? "0 2px 12px rgba(79,140,255,0.4)" : "none",
              }}>
                {feito ? "✓" : i+1}
              </div>
              <span style={{
                fontSize:"0.58rem", textTransform:"uppercase", letterSpacing:"0.05em",
                whiteSpace:"nowrap",
                color: ativo ? C.accent : feito ? C.green : C.muted,
                fontWeight: ativo ? 700 : 400,
              }}>{e}</span>
            </div>
            {i < etapas.length-1 && (
              <div style={{ flex:1, height:1.5, background: feito?C.green:C.border, margin:"0 6px", marginBottom:14, transition:"background .4s" }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TELA 1 — LOGIN
// ════════════════════════════════════════════════════════════════════════════════
function TelaLogin({ onCriarConta, onLoginOk }) {
  const [doc, setDoc]      = useState("");
  const [senha, setSenha]  = useState("");
  const [loading, setLoad] = useState(false);
  const [erro, setErro]    = useState("");

  const tipoDetect = isCNPJ(doc) ? "empresa" : isCPF(doc) ? "cliente" : null;

  function aoDigitarDoc(e) {
    const raw = e.target.value.replace(/\D/g,"");
    if (raw.length <= 11) setDoc(maskCPF(raw));
    else setDoc(maskCNPJ(raw));
  }

  async function fazerLogin() {
    setErro("");
    if (!tipoDetect) { setErro("Informe um CPF válido (cliente) ou CNPJ válido (empresa)."); return; }
    if (!senha)      { setErro("A senha é obrigatória."); return; }
    setLoad(true);
    const res = await apiCall("POST", "/api/auth/login", {
      cpf_cnpj: doc.replace(/\D/g,""),
      senha,
    });
    setLoad(false);
    if (res.success) {
      const tipo = res.data?.user?.tipo || tipoDetect;
      salvarTokens(tipo, res.data.tokens.access, res.data.tokens.refresh);
      onLoginOk(tipo);
    } else {
      setErro(res.message || "CPF/CNPJ ou senha incorretos. Tente novamente.");
    }
  }

  return (
    <Card>
      <div style={{ marginBottom:28 }}><Logo /></div>
      <h2 style={{ fontSize:"1.3rem", fontWeight:900, color:C.text, letterSpacing:"-0.03em", marginBottom:4 }}>
        Bem-vindo de volta
      </h2>
      <p style={{ fontSize:"0.83rem", color:C.muted2, marginBottom:24, lineHeight:1.55 }}>
        Entre com seu CPF ou CNPJ para acessar o painel.
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <Input
          label="CPF ou CNPJ"
          icone="🪪"
          placeholder="000.000.000-00  ou  00.000.000/0001-00"
          value={doc}
          onChange={aoDigitarDoc}
          obrigatorio
          sufixo={tipoDetect==="empresa" ? "🏢" : tipoDetect==="cliente" ? "👤" : null}
        />

        {tipoDetect && (
          <div style={{
            display:"flex", alignItems:"center", gap:8, padding:"8px 12px",
            background: tipoDetect==="empresa" ? C.violetLo : C.accentLo,
            border:`1px solid ${tipoDetect==="empresa" ? "rgba(167,139,250,0.3)" : "rgba(79,140,255,0.3)"}`,
            borderRadius:9, animation:"fadeUp .2s ease",
          }}>
            <span style={{ fontSize:"0.88rem" }}>{tipoDetect==="empresa" ? "🏢" : "👤"}</span>
            <span style={{ fontSize:"0.79rem", color:tipoDetect==="empresa"?C.violet:C.accent, fontWeight:600 }}>
              {tipoDetect==="empresa" ? "Entrando como Empresa" : "Entrando como Cliente"}
            </span>
          </div>
        )}

        <InputSenha
          label="Senha"
          placeholder="Sua senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          obrigatorio
        />

        {erro && <Alerta tipo="erro">{erro}</Alerta>}

        <BotaoPrimario loading={loading} onClick={fazerLogin}>
          Entrar →
        </BotaoPrimario>

        <Divisor texto="não tem conta?" />

        <BotaoGhost onClick={onCriarConta}>
          Criar uma conta
        </BotaoGhost>
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TELA 2 — ESCOLHER TIPO DE CONTA
// ════════════════════════════════════════════════════════════════════════════════
function TelaEscolhaTipo({ onEscolher, onVoltar }) {
  const [hover, setHover] = useState(null);

  const opcoes = [
    { id:"cliente", icone:"👤", titulo:"Sou Cliente",
      desc:"Quero agendar serviços, acompanhar meus horários e gerenciar meu histórico.",
      grad:GRAD_AZUL, cor:C.accent, sombra:"rgba(79,140,255,0.25)" },
    { id:"empresa", icone:"🏢", titulo:"Sou Empresa",
      desc:"Quero gerenciar agendamentos, cadastrar serviços e atender meus clientes.",
      grad:GRAD_VIOLET, cor:C.violet, sombra:"rgba(167,139,250,0.25)" },
  ];

  return (
    <Card maxW={480}>
      <div style={{ marginBottom:24 }}><Logo /></div>
      <h2 style={{ fontSize:"1.25rem", fontWeight:900, color:C.text, letterSpacing:"-0.03em", marginBottom:4 }}>
        Criar nova conta
      </h2>
      <p style={{ fontSize:"0.83rem", color:C.muted2, marginBottom:22, lineHeight:1.55 }}>
        Como você vai usar o TrustBook?
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
        {opcoes.map(op => (
          <div key={op.id}
            onClick={() => onEscolher(op.id)}
            onMouseEnter={() => setHover(op.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              background: hover===op.id ? C.surface3 : C.surface2,
              border:`1.5px solid ${hover===op.id ? op.cor : C.border2}`,
              borderRadius:14, padding:"18px 20px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:16,
              transition:"all .2s",
              boxShadow: hover===op.id ? `0 6px 28px ${op.sombra}` : "none",
            }}>
            <div style={{
              width:52, height:52, borderRadius:14, flexShrink:0,
              background:op.grad,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem",
              boxShadow:`0 4px 18px ${op.sombra}`,
              transition:"transform .2s",
              transform: hover===op.id ? "scale(1.08)" : "scale(1)",
            }}>{op.icone}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:"0.96rem", color:C.text, marginBottom:3 }}>{op.titulo}</div>
              <div style={{ fontSize:"0.78rem", color:C.muted2, lineHeight:1.55 }}>{op.desc}</div>
            </div>
            <span style={{ color:hover===op.id?op.cor:C.muted, fontSize:"1.2rem",
              transition:"all .2s", display:"inline-block",
              transform:hover===op.id?"translateX(4px)":"none" }}>›</span>
          </div>
        ))}
      </div>

      <BotaoLink onClick={onVoltar}>← Voltar para o login</BotaoLink>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TELA 3A — CADASTRO CLIENTE
// ════════════════════════════════════════════════════════════════════════════════
function TelaCadastroCliente({ onConcluir, onVoltar }) {
  const [f, setF] = useState({ nome:"", cpf:"", email:"", senha:"", confirma:"" });
  const [e, setE] = useState({});
  const [loading, setLoad] = useState(false);
  const [apiErro, setApiErro] = useState("");

  function upd(k,v) { setF(p=>({...p,[k]:v})); setE(p=>({...p,[k]:""})); }

  function validar() {
    const er = {};
    const partes = f.nome.trim().split(/\s+/);
    if (partes.length < 2 || partes.some(p=>p.length<2)) er.nome = "Informe nome e sobrenome completos.";
    if (!isCPF(f.cpf)) er.cpf = "CPF inválido. Formato: 000.000.000-00";
    if (!f.email.includes("@") || !f.email.includes(".")) er.email = "E-mail inválido.";
    if (f.senha.length < 8) er.senha = "Mínimo de 8 caracteres.";
    if (f.senha !== f.confirma) er.confirma = "As senhas não coincidem.";
    return er;
  }

  async function submeter() {
    const er = validar();
    if (Object.keys(er).length) { setE(er); return; }
    setLoad(true); setApiErro("");
    const res = await apiCall("POST", "/api/auth/register/cliente", {
      nome:  f.nome.trim(),
      cpf:   f.cpf,
      email: f.email.trim().toLowerCase(),
      senha: f.senha,
    });
    setLoad(false);
    if (res.success) {
      onConcluir(f.email.trim().toLowerCase(), "cliente");
    } else {
      setApiErro(res.message || "Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <Card maxW={480}>
      <div style={{ marginBottom:20 }}><Logo /></div>
      <StepIndicator etapas={["Dados","Verificação","Pronto"]} atual={0} />

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:GRAD_AZUL,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 }}>👤</div>
        <div>
          <h2 style={{ fontSize:"1.1rem", fontWeight:900, color:C.text, letterSpacing:"-0.03em" }}>Criar conta — Cliente</h2>
          <p style={{ fontSize:"0.75rem", color:C.muted2 }}>Preencha seus dados pessoais</p>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        <Input label="Nome Completo" icone="✏️" placeholder="Ex: Maria Silva Santos"
          value={f.nome} onChange={v=>upd("nome",v.target.value)} erro={e.nome} obrigatorio />
        <Input label="CPF" icone="🪪" placeholder="000.000.000-00"
          value={f.cpf} onChange={v=>upd("cpf",maskCPF(v.target.value))} erro={e.cpf} obrigatorio />
        <Input label="E-mail" icone="✉️" type="email" placeholder="seu@email.com"
          value={f.email} onChange={v=>upd("email",v.target.value)} erro={e.email} obrigatorio />
        <InputSenha label="Senha" placeholder="Mínimo 8 caracteres"
          value={f.senha} onChange={v=>upd("senha",v.target.value)} erro={e.senha} obrigatorio />
        <BarraForca senha={f.senha} />
        <InputSenha label="Confirmar Senha" placeholder="Repita a senha"
          value={f.confirma} onChange={v=>upd("confirma",v.target.value)} erro={e.confirma} obrigatorio />

        {apiErro && <Alerta tipo="erro">{apiErro}</Alerta>}

        <BotaoPrimario loading={loading} onClick={submeter}>
          Criar Conta e Verificar E-mail →
        </BotaoPrimario>
      </div>

      <div style={{ marginTop:16 }}>
        <BotaoLink onClick={onVoltar}>← Voltar</BotaoLink>
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TELA 3B — CADASTRO EMPRESA
// ════════════════════════════════════════════════════════════════════════════════
function TelaCadastroEmpresa({ onConcluir, onVoltar }) {
  const [f, setF] = useState({ razao:"", fantasia:"", cnpj:"", email:"", senha:"", confirma:"" });
  const [e, setE] = useState({});
  const [loading, setLoad] = useState(false);
  const [apiErro, setApiErro] = useState("");

  function upd(k,v) { setF(p=>({...p,[k]:v})); setE(p=>({...p,[k]:""})); }

  function validar() {
    const er = {};
    if (f.razao.trim().length < 3)    er.razao    = "Razão social obrigatória.";
    if (f.fantasia.trim().length < 2)  er.fantasia = "Nome fantasia obrigatório.";
    if (!isCNPJ(f.cnpj))               er.cnpj     = "CNPJ inválido. Formato: 00.000.000/0001-00";
    if (!f.email.includes("@"))         er.email    = "E-mail inválido.";
    if (f.senha.length < 8)             er.senha    = "Mínimo de 8 caracteres.";
    if (f.senha !== f.confirma)          er.confirma = "As senhas não coincidem.";
    return er;
  }

  async function submeter() {
    const er = validar();
    if (Object.keys(er).length) { setE(er); return; }
    setLoad(true); setApiErro("");
    const res = await apiCall("POST", "/api/auth/register/empresa", {
      razao_social:  f.razao.trim(),
      nome_fantasia: f.fantasia.trim(),
      cnpj:  f.cnpj,
      email: f.email.trim().toLowerCase(),
      senha: f.senha,
    });
    setLoad(false);
    if (res.success) {
      onConcluir(f.email.trim().toLowerCase(), "empresa");
    } else {
      setApiErro(res.message || "Erro ao criar conta. Tente novamente.");
    }
  }

  return (
    <Card maxW={500}>
      <div style={{ marginBottom:20 }}><Logo /></div>
      <StepIndicator etapas={["Dados","Verificação","Pronto"]} atual={0} />

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:22 }}>
        <div style={{ width:34, height:34, borderRadius:10, background:GRAD_VIOLET,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem", flexShrink:0 }}>🏢</div>
        <div>
          <h2 style={{ fontSize:"1.1rem", fontWeight:900, color:C.text, letterSpacing:"-0.03em" }}>Criar conta — Empresa</h2>
          <p style={{ fontSize:"0.75rem", color:C.muted2 }}>Dados do seu estabelecimento</p>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Input label="Razão Social" placeholder="Empresa Ltda." value={f.razao}
            onChange={v=>upd("razao",v.target.value)} erro={e.razao} obrigatorio />
          <Input label="Nome Fantasia" placeholder="Meu Negócio" value={f.fantasia}
            onChange={v=>upd("fantasia",v.target.value)} erro={e.fantasia} obrigatorio />
        </div>
        <Input label="CNPJ" icone="🪪" placeholder="00.000.000/0001-00"
          value={f.cnpj} onChange={v=>upd("cnpj",maskCNPJ(v.target.value))} erro={e.cnpj} obrigatorio />
        <Input label="E-mail" icone="✉️" type="email" placeholder="empresa@email.com"
          value={f.email} onChange={v=>upd("email",v.target.value)} erro={e.email} obrigatorio />
        <InputSenha label="Senha" placeholder="Mínimo 8 caracteres"
          value={f.senha} onChange={v=>upd("senha",v.target.value)} erro={e.senha} obrigatorio />
        <BarraForca senha={f.senha} />
        <InputSenha label="Confirmar Senha" placeholder="Repita a senha"
          value={f.confirma} onChange={v=>upd("confirma",v.target.value)} erro={e.confirma} obrigatorio />

        {apiErro && <Alerta tipo="erro">{apiErro}</Alerta>}

        <BotaoPrimario loading={loading} onClick={submeter}>
          Criar Conta e Verificar E-mail →
        </BotaoPrimario>
      </div>

      <div style={{ marginTop:16 }}>
        <BotaoLink onClick={onVoltar}>← Voltar</BotaoLink>
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TELA 4 — VERIFICAÇÃO DE CÓDIGO POR E-MAIL
// ════════════════════════════════════════════════════════════════════════════════
function TelaVerificacao({ email, tipo, onVerificado, onTrocarEmail }) {
  const [digitos, setDigitos] = useState(["","","","","",""]);
  const [loading, setLoad]    = useState(false);
  const [erro, setErro]       = useState("");
  const [podReenviar, setPod] = useState(false);
  const [contador, setCont]   = useState(60);
  const [enviando, setEnv]    = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (contador <= 0) { setPod(true); return; }
    const t = setTimeout(() => setCont(c=>c-1), 1000);
    return () => clearTimeout(t);
  }, [contador]);

  function aoDigitar(i, val) {
    const d = val.replace(/\D/g,"").slice(-1);
    const novo = [...digitos];
    novo[i] = d;
    setDigitos(novo);
    setErro("");
    if (d && i<5) refs.current[i+1]?.focus();
    if (!d && i>0) refs.current[i-1]?.focus();
  }

  function aoTeclado(i, ev) {
    if (ev.key==="Backspace" && !digitos[i] && i>0) refs.current[i-1]?.focus();
  }

  function aoColar(ev) {
    const txt = ev.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (txt.length===6) { setDigitos(txt.split("")); refs.current[5]?.focus(); }
  }

  async function verificar() {
    const cod = digitos.join("");
    if (cod.length < 6) { setErro("Digite todos os 6 dígitos do código."); return; }
    setLoad(true); setErro("");
    const res = await apiCall("POST", "/api/auth/verificar-email", { email, codigo: cod, tipo });
    setLoad(false);
    if (res.success) {
      onVerificado();
    } else {
      setErro(res.message || "Código incorreto ou expirado.");
      setDigitos(["","","","","",""]);
      setTimeout(() => refs.current[0]?.focus(), 50);
    }
  }

  async function reenviar() {
    setEnv(true);
    await apiCall("POST", "/api/auth/reenviar-codigo", { email, tipo });
    setEnv(false); setPod(false); setCont(60); setErro("");
  }

  const completo = digitos.every(d=>d!=="");

  return (
    <Card>
      <div style={{ marginBottom:20 }}><Logo /></div>
      <StepIndicator etapas={["Dados","Verificação","Pronto"]} atual={1} />

      <div style={{ textAlign:"center", marginBottom:22 }}>
        <div style={{
          width:66, height:66, borderRadius:18,
          background:C.accentMid, border:`1.5px solid rgba(79,140,255,0.35)`,
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          fontSize:"1.9rem", marginBottom:16,
          animation:"bounceIn .4s cubic-bezier(.22,1,.36,1)",
        }}>✉️</div>
        <h2 style={{ fontSize:"1.2rem", fontWeight:900, color:C.text, letterSpacing:"-0.03em", marginBottom:8 }}>
          Verifique seu e-mail
        </h2>
        <p style={{ fontSize:"0.82rem", color:C.muted2, lineHeight:1.65 }}>
          Enviamos um código de 6 dígitos para<br/>
          <strong style={{ color:C.accent }}>{email}</strong>
        </p>
      </div>

      <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:20 }} onPaste={aoColar}>
        {digitos.map((d,i) => (
          <input key={i}
            ref={el => refs.current[i]=el}
            value={d}
            onChange={ev => aoDigitar(i, ev.target.value)}
            onKeyDown={ev => aoTeclado(i, ev)}
            maxLength={2}
            inputMode="numeric"
            autoFocus={i===0}
            style={{
              width:46, height:56, textAlign:"center",
              background: d ? C.surface3 : C.surface2,
              border:`2px solid ${d ? C.accent : erro ? C.red : C.border2}`,
              borderRadius:12, color:C.text, fontSize:"1.35rem", fontWeight:800,
              outline:"none", fontFamily:"inherit", transition:"all .2s",
              caretColor: C.accent,
            }}
          />
        ))}
      </div>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:erro?12:0 }}>
        <BotaoPrimario loading={loading} disabled={!completo} onClick={verificar}>
          Confirmar Código ✓
        </BotaoPrimario>

        <div style={{ textAlign:"center" }}>
          {podReenviar ? (
            <BotaoLink onClick={reenviar} cor={C.accent}>
              {enviando ? "Reenviando..." : "📨 Reenviar código"}
            </BotaoLink>
          ) : (
            <span style={{ fontSize:"0.8rem", color:C.muted }}>
              Reenviar em <strong style={{ color:C.muted2 }}>{contador}s</strong>
            </span>
          )}
        </div>
      </div>

      <div style={{
        marginTop:18, padding:"12px 14px",
        background:C.amberLo, border:`1px solid rgba(255,169,77,0.22)`, borderRadius:10,
      }}>
        <p style={{ fontSize:"0.76rem", color:C.amber, lineHeight:1.65, margin:0 }}>
          💡 Verifique também a pasta de <strong>spam</strong>. O código expira em <strong>10 minutos</strong>.
        </p>
      </div>

      <div style={{ marginTop:16 }}>
        <BotaoLink onClick={onTrocarEmail}>← Usar outro e-mail</BotaoLink>
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// TELA 5 — CONTA CRIADA COM SUCESSO
// ════════════════════════════════════════════════════════════════════════════════
function TelaSucesso({ tipo, onIrLogin }) {
  const [seg, setSeg] = useState(5);

  useEffect(() => {
    if (seg <= 0) { onIrLogin(); return; }
    const t = setTimeout(() => setSeg(s=>s-1), 1000);
    return () => clearTimeout(t);
  }, [seg]);

  return (
    <Card>
      <div style={{ marginBottom:20 }}><Logo /></div>
      <StepIndicator etapas={["Dados","Verificação","Pronto"]} atual={2} />

      <div style={{ textAlign:"center", padding:"8px 0 20px" }}>
        <div style={{
          width:72, height:72, borderRadius:"50%",
          background:C.greenLo, border:`2px solid ${C.green}`,
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          marginBottom:20, animation:"bounceIn .5s cubic-bezier(.22,1,.36,1)",
        }}>
          <span style={{ fontSize:"2rem", color:C.green }}>✓</span>
        </div>

        <h2 style={{ fontSize:"1.3rem", fontWeight:900, color:C.green, letterSpacing:"-0.03em", marginBottom:8 }}>
          Conta criada com sucesso!
        </h2>
        <p style={{ fontSize:"0.84rem", color:C.muted2, lineHeight:1.65, marginBottom:22 }}>
          Seu e-mail foi verificado com sucesso.{" "}
          {tipo==="empresa"
            ? "Agora você pode acessar o painel e gerenciar seus serviços."
            : "Agora você pode fazer login e começar a agendar serviços."}
        </p>

        <div style={{
          display:"inline-flex", alignItems:"center", gap:10,
          background:C.surface2, border:`1px solid ${C.border2}`,
          borderRadius:12, padding:"12px 18px", marginBottom:24,
        }}>
          <span style={{ fontSize:"1.3rem" }}>{tipo==="empresa" ? "🏢" : "👤"}</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontSize:"0.68rem", color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:2 }}>
              Tipo de acesso
            </div>
            <div style={{ fontSize:"0.88rem", fontWeight:700, color:C.text }}>
              {tipo==="empresa" ? "Empresa — Painel TrustBook" : "Cliente — Área do Cliente"}
            </div>
          </div>
        </div>

        <BotaoPrimario onClick={onIrLogin}>
          Ir para o Login →
        </BotaoPrimario>

        <p style={{ fontSize:"0.75rem", color:C.muted, marginTop:14 }}>
          Redirecionando em <strong style={{ color:C.muted2 }}>{seg}s</strong>
        </p>
      </div>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENTE RAIZ — EXPORTADO
// ════════════════════════════════════════════════════════════════════════════════
/*
  USO:
    import TrustBookAuth from "./trustbook-auth";

    <TrustBookAuth
      onLoginSucesso={(tipo) => {
        if (tipo === "empresa") navigate("/empresa");
        else navigate("/cliente");
      }}
    />

  O prop `onLoginSucesso` recebe "cliente" ou "empresa" e você faz o redirect.
  Se não passar o prop, o componente usa window.location.href como fallback.
*/
export default function TrustBookAuth({ onLoginSucesso }) {
  const [tela, setTela]    = useState("login");
  const [emailP, setEmailP] = useState("");
  const [tipoP, setTipoP]  = useState("");

  function aoConcluirCadastro(email, tipo) {
    setEmailP(email);
    setTipoP(tipo);
    setTela("verificacao");
  }

  function aoLoginOk(tipo) {
    if (onLoginSucesso) onLoginSucesso(tipo);
    else window.location.href = tipo==="empresa" ? "/empresa" : "/cliente";
  }

  return (
    <div style={{
      minHeight:"100vh",
      display:"flex", alignItems:"center", justifyContent:"center",
      background:C.bg,
      fontFamily:"'DM Sans', 'Segoe UI', system-ui, sans-serif",
      padding:"24px 16px", boxSizing:"border-box",
      position:"relative",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        input:-webkit-autofill {
          -webkit-box-shadow:0 0 0 1000px ${C.surface3} inset !important;
          -webkit-text-fill-color:${C.text} !important;
          caret-color:${C.accent};
        }
        input::placeholder { color:${C.muted}; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes girar {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes bounceIn {
          0%   { opacity:0; transform:scale(0.55); }
          65%  { transform:scale(1.1); }
          100% { opacity:1; transform:scale(1); }
        }
      `}</style>

      {/* Grade de fundo */}
      <div style={{
        position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        backgroundImage:`linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
        backgroundSize:"52px 52px",
        WebkitMaskImage:"radial-gradient(ellipse 80% 65% at 50% 50%,black,transparent)",
        maskImage:"radial-gradient(ellipse 80% 65% at 50% 50%,black,transparent)",
        opacity:0.3,
      }}/>

      {/* Glow azul */}
      <div style={{
        position:"fixed", top:-200, left:"50%", transform:"translateX(-50%)",
        width:800, height:450, borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(79,140,255,0.13) 0%,transparent 70%)",
        pointerEvents:"none", zIndex:0,
      }}/>

      {/* Conteúdo */}
      <div style={{ position:"relative", zIndex:1, width:"100%", display:"flex", flexDirection:"column", alignItems:"center" }}>

        {tela==="login" && (
          <TelaLogin
            onCriarConta={() => setTela("escolha")}
            onLoginOk={aoLoginOk}
          />
        )}
        {tela==="escolha" && (
          <TelaEscolhaTipo
            onEscolher={tipo => setTela(`cadastro_${tipo}`)}
            onVoltar={() => setTela("login")}
          />
        )}
        {tela==="cadastro_cliente" && (
          <TelaCadastroCliente
            onConcluir={aoConcluirCadastro}
            onVoltar={() => setTela("escolha")}
          />
        )}
        {tela==="cadastro_empresa" && (
          <TelaCadastroEmpresa
            onConcluir={aoConcluirCadastro}
            onVoltar={() => setTela("escolha")}
          />
        )}
        {tela==="verificacao" && (
          <TelaVerificacao
            email={emailP}
            tipo={tipoP}
            onVerificado={() => setTela("sucesso")}
            onTrocarEmail={() => setTela(`cadastro_${tipoP}`)}
          />
        )}
        {tela==="sucesso" && (
          <TelaSucesso
            tipo={tipoP}
            onIrLogin={() => setTela("login")}
          />
        )}

      </div>
    </div>
  );
}
