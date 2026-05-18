import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const C = {
  bg: "#080a0f",
  surface: "#0e1118",
  surface2: "#141820",
  surface3: "#1b2030",
  border: "#232840",
  border2: "#2e3550",
  accent: "#4f8cff",
  accentLo: "rgba(79,140,255,0.10)",
  accentMid: "rgba(79,140,255,0.18)",
  violet: "#a78bfa",
  violetLo: "rgba(167,139,250,0.12)",
  green: "#22d48a",
  greenLo: "rgba(34,212,138,0.12)",
  red: "#ff5c7a",
  redLo: "rgba(255,92,122,0.12)",
  amber: "#ffa94d",
  amberLo: "rgba(255,169,77,0.12)",
  neon: "#00d4ff",
  text: "#dde2f0",
  muted: "#6b7294",
  muted2: "#8890b0",
};

const GRAD_AZUL = "linear-gradient(135deg, #4f8cff, #6366f1)";
const GRAD_VIOLET = "linear-gradient(135deg, #a78bfa, #ec4899)";
const GRAD_BTN = "linear-gradient(135deg, #4f8cff 0%, #7c3aed 100%)";

function maskCPF(v) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskCNPJ(v) {
  return v.replace(/\D/g, "").slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
function isCPF(v) { return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v); }
function isCNPJ(v) { return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v); }

function Logo({ size = 34 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.3,
        background: GRAD_BTN,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 900, fontSize: size * 0.52, color: "#fff", flexShrink: 0,
        boxShadow: "0 4px 18px rgba(79,140,255,0.4)",
        fontFamily: "'Poppins', sans-serif",
      }}>T</div>
      <div>
        <div style={{ fontWeight: 900, fontSize: size * 0.56, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.1, fontFamily: "'Poppins', sans-serif" }}>
          TrustBook
        </div>
        <div style={{ fontSize: size * 0.3, color: C.muted, letterSpacing: "0.04em", marginTop: 1 }}>
          confiança em serviços
        </div>
      </div>
    </div>
  );
}

function Card({ children, maxW = 440 }) {
  return (
    <div style={{
      width: "100%", maxWidth: maxW,
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 20,
      padding: "36px 36px 32px",
      boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,140,255,0.06)",
      animation: "fadeUp .3s cubic-bezier(.22,1,.36,1)",
    }}>
      {children}
    </div>
  );
}

function Alerta({ tipo = "erro", children }) {
  const mapa = {
    erro: { bg: C.redLo, borda: "rgba(255,92,122,0.28)", cor: C.red, icone: "✕" },
    sucesso: { bg: C.greenLo, borda: "rgba(34,212,138,0.28)", cor: C.green, icone: "✓" },
    info: { bg: C.accentLo, borda: "rgba(79,140,255,0.28)", cor: C.accent, icone: "i" },
    aviso: { bg: C.amberLo, borda: "rgba(255,169,77,0.28)", cor: C.amber, icone: "!" },
  };
  const s = mapa[tipo];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.borda}`,
      borderRadius: 10, padding: "11px 14px",
      display: "flex", gap: 10, alignItems: "flex-start",
      animation: "fadeUp .2s ease",
    }}>
      <span style={{ color: s.cor, fontWeight: 900, fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>{s.icone}</span>
      <p style={{ fontSize: "0.81rem", color: s.cor, lineHeight: 1.6, margin: 0 }}>{children}</p>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      style={{ animation: "girar .75s linear infinite", display: "block" }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function BotaoPrimario({ children, loading, disabled, onClick, style: extraStyle = {} }) {
  return (
    <button onClick={onClick} disabled={loading || disabled} style={{
      width: "100%", padding: "13px 16px", borderRadius: 11,
      border: "none", background: GRAD_BTN,
      color: "#fff", fontWeight: 800, fontSize: "0.91rem",
      fontFamily: "'Poppins', sans-serif", cursor: (loading || disabled) ? "not-allowed" : "pointer",
      opacity: (loading || disabled) ? 0.6 : 1,
      transition: "all .2s", letterSpacing: "0.02em",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      boxShadow: "0 4px 20px rgba(79,140,255,0.3)",
      ...extraStyle,
    }}>
      {loading ? <><Spinner /> Aguarde...</> : children}
    </button>
  );
}

function BotaoGhost({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: `1.5px solid ${C.border2}`,
      color: C.muted2, fontWeight: 600, fontSize: "0.85rem",
      fontFamily: "'Poppins', sans-serif", cursor: "pointer", borderRadius: 11,
      padding: "11px 16px", width: "100%", transition: "all .2s",
    }}>
      {children}
    </button>
  );
}

function BotaoLink({ children, onClick, cor }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer",
      color: cor || C.muted, fontSize: "0.82rem", fontFamily: "'Poppins', sans-serif",
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: 0, fontWeight: 500,
    }}>
      {children}
    </button>
  );
}

function Label({ texto, erro, obrigatorio }) {
  if (!texto) return null;
  return (
    <div style={{
      fontSize: "0.7rem", fontWeight: 700,
      color: erro ? C.red : C.muted,
      textTransform: "uppercase", letterSpacing: "0.07em",
      marginBottom: 5,
    }}>
      {texto}{obrigatorio && <span style={{ color: C.accent, marginLeft: 2 }}>*</span>}
    </div>
  );
}

function ErroLabel({ texto }) {
  if (!texto) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, fontSize: "0.72rem", color: C.red }}>
      <span>!</span>{texto}
    </div>
  );
}

function Input({ label, erro, icone, sufixo, obrigatorio, style: extraStyle, ...props }) {
  const [foco, setFoco] = useState(false);
  return (
    <div>
      <Label texto={label} erro={erro} obrigatorio={obrigatorio} />
      <div style={{ position: "relative" }}>
        {icone && (
          <span style={{
            position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
            fontSize: "1rem", pointerEvents: "none",
            color: foco ? C.accent : C.muted, transition: "color .2s",
          }}>{icone}</span>
        )}
        <input
          {...props}
          onFocus={e => { setFoco(true); props.onFocus?.(e); }}
          onBlur={e => { setFoco(false); props.onBlur?.(e); }}
          style={{
            width: "100%", boxSizing: "border-box",
            background: foco ? C.surface3 : C.surface2,
            border: `1.5px solid ${erro ? C.red : foco ? C.accent : C.border2}`,
            borderRadius: 10,
            padding: icone ? "12px 14px 12px 40px" : "12px 14px",
            paddingRight: sufixo ? 44 : 14,
            color: C.text, fontSize: "0.88rem",
            outline: "none", fontFamily: "'Poppins', sans-serif", transition: "all .2s",
            ...(extraStyle || {}),
          }}
        />
        {sufixo && (
          <span style={{
            position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
            pointerEvents: "none", color: C.muted, fontSize: "0.9rem",
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
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
          fontSize: "1rem", pointerEvents: "none",
          color: foco ? C.accent : C.muted, transition: "color .2s",
        }}>🔒</span>
        <input
          type={ver ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFoco(true)}
          onBlur={() => setFoco(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: foco ? C.surface3 : C.surface2,
            border: `1.5px solid ${erro ? C.red : foco ? C.accent : C.border2}`,
            borderRadius: 10, padding: "12px 44px 12px 40px",
            color: C.text, fontSize: "0.88rem",
            outline: "none", fontFamily: "'Poppins', sans-serif", transition: "all .2s",
          }}
        />
        <button type="button" onClick={() => setVer(v => !v)} style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          color: C.muted, fontSize: "1rem", padding: 4, lineHeight: 1,
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
  const rotulos = ["", "Muito fraca", "Fraca", "Boa", "Forte"];
  const cores = ["transparent", C.red, C.amber, C.accent, C.green];
  if (!senha) return null;
  return (
    <div style={{ marginTop: -2 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 3,
            background: forca >= i ? cores[forca] : C.border2, transition: "background .3s"
          }} />
        ))}
      </div>
      <span style={{ fontSize: "0.7rem", color: cores[forca], fontWeight: 600 }}>{rotulos[forca]}</span>
    </div>
  );
}

function Divisor({ texto }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "2px 0" }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      {texto && <span style={{ fontSize: "0.72rem", color: C.muted, whiteSpace: "nowrap" }}>{texto}</span>}
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

function StepIndicator({ etapas, atual }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 26 }}>
      {etapas.map((e, i) => {
        const feito = i < atual;
        const ativo = i === atual;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < etapas.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: feito ? C.green : ativo ? GRAD_BTN : C.surface3,
                border: feito || ativo ? "none" : `1.5px solid ${C.border2}`,
                fontSize: "0.72rem", fontWeight: 800,
                color: (feito || ativo) ? "#fff" : C.muted,
                transition: "all .3s", flexShrink: 0,
                boxShadow: ativo ? "0 2px 12px rgba(79,140,255,0.4)" : "none",
              }}>
                {feito ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.05em",
                whiteSpace: "nowrap",
                color: ativo ? C.accent : feito ? C.green : C.muted,
                fontWeight: ativo ? 700 : 400,
              }}>{e}</span>
            </div>
            {i < etapas.length - 1 && (
              <div style={{ flex: 1, height: 1.5, background: feito ? C.green : C.border, margin: "0 6px", marginBottom: 14, transition: "background .4s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TelaLogin({ onCriarConta, onLoginOk }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoad] = useState(false);
  const [erro, setErro] = useState("");
  const { login } = useAuth();

  async function fazerLogin() {
    setErro("");
    if (!email.includes("@") || !email.includes(".")) { setErro("Informe um e-mail válido."); return; }
    if (!senha) { setErro("A senha é obrigatória."); return; }
    setLoad(true);
    try {
      const res = await api.post("/auth/login", { email: email.trim().toLowerCase(), senha });
      login(res.data);
      onLoginOk(res.data.user.tipo);
    } catch (err) {
      setErro(err.message || "E-mail ou senha incorretos.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <Card>
      <div style={{ marginBottom: 28 }}><Logo /></div>
      <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", marginBottom: 4 }}>
        Bem-vindo de volta
      </h2>
      <p style={{ fontSize: "0.83rem", color: C.muted2, marginBottom: 24, lineHeight: 1.55 }}>
        Entre com seu e-mail e senha para acessar o painel.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input
          label="E-mail"
          icone="✉️"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          obrigatorio
        />

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

function TelaEscolhaTipo({ onEscolher, onVoltar }) {
  const [hover, setHover] = useState(null);

  const opcoes = [
    { id: "cliente", icone: "👤", titulo: "Sou Cliente",
      desc: "Quero agendar serviços, acompanhar meus horários e gerenciar meu histórico.",
      grad: GRAD_AZUL, cor: C.accent, sombra: "rgba(79,140,255,0.25)" },
    { id: "empresa", icone: "🏢", titulo: "Sou Empresa",
      desc: "Quero gerenciar agendamentos, cadastrar serviços e atender meus clientes.",
      grad: GRAD_VIOLET, cor: C.violet, sombra: "rgba(167,139,250,0.25)" },
  ];

  return (
    <Card maxW={480}>
      <div style={{ marginBottom: 24 }}><Logo /></div>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", marginBottom: 4 }}>
        Criar nova conta
      </h2>
      <p style={{ fontSize: "0.83rem", color: C.muted2, marginBottom: 22, lineHeight: 1.55 }}>
        Como você vai usar o TrustBook?
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {opcoes.map(op => (
          <div key={op.id}
            onClick={() => onEscolher(op.id)}
            onMouseEnter={() => setHover(op.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              background: hover === op.id ? C.surface3 : C.surface2,
              border: `1.5px solid ${hover === op.id ? op.cor : C.border2}`,
              borderRadius: 14, padding: "18px 20px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 16,
              transition: "all .2s",
              boxShadow: hover === op.id ? `0 6px 28px ${op.sombra}` : "none",
            }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: op.grad,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
              boxShadow: `0 4px 18px ${op.sombra}`,
              transition: "transform .2s",
              transform: hover === op.id ? "scale(1.08)" : "scale(1)",
            }}>{op.icone}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "0.96rem", color: C.text, marginBottom: 3 }}>{op.titulo}</div>
              <div style={{ fontSize: "0.78rem", color: C.muted2, lineHeight: 1.55 }}>{op.desc}</div>
            </div>
            <span style={{
              color: hover === op.id ? op.cor : C.muted, fontSize: "1.2rem",
              transition: "all .2s", display: "inline-block",
              transform: hover === op.id ? "translateX(4px)" : "none"
            }}>›</span>
          </div>
        ))}
      </div>

      <BotaoLink onClick={onVoltar}>← Voltar para o login</BotaoLink>
    </Card>
  );
}

function TelaCadastroCliente({ onConcluir, onVoltar }) {
  const [f, setF] = useState({ nome: "", cpf: "", email: "", senha: "", confirma: "" });
  const [e, setE] = useState({});
  const [loading, setLoad] = useState(false);
  const [apiErro, setApiErro] = useState("");

  function upd(k, v) { setF(p => ({ ...p, [k]: v })); setE(p => ({ ...p, [k]: "" })); }

  function validar() {
    const er = {};
    const partes = f.nome.trim().split(/\s+/);
    if (partes.length < 2 || partes.some(p => p.length < 2)) er.nome = "Informe nome e sobrenome completos.";
    if (!isCPF(f.cpf)) er.cpf = "CPF inválido. Formato: 000.000.000-00";
    if (!f.email.includes("@") || !f.email.includes(".")) er.email = "E-mail inválido.";
    if (f.senha.length < 6) er.senha = "Mínimo de 6 caracteres.";
    if (f.senha !== f.confirma) er.confirma = "As senhas não coincidem.";
    return er;
  }

  async function submeter() {
    const er = validar();
    if (Object.keys(er).length) { setE(er); return; }
    setLoad(true); setApiErro("");
    try {
      await api.post("/auth/register/cliente", {
        nome: f.nome.trim(),
        cpf: f.cpf,
        email: f.email.trim().toLowerCase(),
        senha: f.senha,
      });
      onConcluir(f.email.trim().toLowerCase(), "cliente");
    } catch (err) {
      setApiErro(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <Card maxW={480}>
      <div style={{ marginBottom: 20 }}><Logo /></div>
      <StepIndicator etapas={["Dados", "Verificação", "Pronto"]} atual={0} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, background: GRAD_AZUL,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0
        }}>👤</div>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: C.text, letterSpacing: "-0.03em" }}>Criar conta — Cliente</h2>
          <p style={{ fontSize: "0.75rem", color: C.muted2 }}>Preencha seus dados pessoais</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <Input label="Nome Completo" icone="✏️" placeholder="Ex: Maria Silva Santos"
          value={f.nome} onChange={v => upd("nome", v.target.value)} erro={e.nome} obrigatorio />
        <Input label="CPF" icone="🪪" placeholder="000.000.000-00"
          value={f.cpf} onChange={v => upd("cpf", maskCPF(v.target.value))} erro={e.cpf} obrigatorio />
        <Input label="E-mail" icone="✉️" type="email" placeholder="seu@email.com"
          value={f.email} onChange={v => upd("email", v.target.value)} erro={e.email} obrigatorio />
        <InputSenha label="Senha" placeholder="Mínimo 6 caracteres"
          value={f.senha} onChange={v => upd("senha", v.target.value)} erro={e.senha} obrigatorio />
        <BarraForca senha={f.senha} />
        <InputSenha label="Confirmar Senha" placeholder="Repita a senha"
          value={f.confirma} onChange={v => upd("confirma", v.target.value)} erro={e.confirma} obrigatorio />

        {apiErro && <Alerta tipo="erro">{apiErro}</Alerta>}

        <BotaoPrimario loading={loading} onClick={submeter}>
          Criar Conta →
        </BotaoPrimario>
      </div>

      <div style={{ marginTop: 16 }}>
        <BotaoLink onClick={onVoltar}>← Voltar</BotaoLink>
      </div>
    </Card>
  );
}

function TelaCadastroEmpresa({ onConcluir, onVoltar }) {
  const [f, setF] = useState({ razao: "", fantasia: "", cnpj: "", email: "", senha: "", confirma: "" });
  const [e, setE] = useState({});
  const [loading, setLoad] = useState(false);
  const [apiErro, setApiErro] = useState("");

  function upd(k, v) { setF(p => ({ ...p, [k]: v })); setE(p => ({ ...p, [k]: "" })); }

  function validar() {
    const er = {};
    if (f.razao.trim().length < 3) er.razao = "Razão social obrigatória.";
    if (f.fantasia.trim().length < 2) er.fantasia = "Nome fantasia obrigatório.";
    if (!isCNPJ(f.cnpj)) er.cnpj = "CNPJ inválido. Formato: 00.000.000/0001-00";
    if (!f.email.includes("@")) er.email = "E-mail inválido.";
    if (f.senha.length < 6) er.senha = "Mínimo de 6 caracteres.";
    if (f.senha !== f.confirma) er.confirma = "As senhas não coincidem.";
    return er;
  }

  async function submeter() {
    const er = validar();
    if (Object.keys(er).length) { setE(er); return; }
    setLoad(true); setApiErro("");
    try {
      await api.post("/auth/register/empresa", {
        razao_social: f.razao.trim(),
        nome_fantasia: f.fantasia.trim(),
        cnpj: f.cnpj,
        email: f.email.trim().toLowerCase(),
        senha: f.senha,
      });
      onConcluir(f.email.trim().toLowerCase(), "empresa");
    } catch (err) {
      setApiErro(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <Card maxW={500}>
      <div style={{ marginBottom: 20 }}><Logo /></div>
      <StepIndicator etapas={["Dados", "Verificação", "Pronto"]} atual={0} />

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, background: GRAD_VIOLET,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0
        }}>🏢</div>
        <div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 900, color: C.text, letterSpacing: "-0.03em" }}>Criar conta — Empresa</h2>
          <p style={{ fontSize: "0.75rem", color: C.muted2 }}>Dados do seu estabelecimento</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Razão Social" placeholder="Empresa Ltda." value={f.razao}
            onChange={v => upd("razao", v.target.value)} erro={e.razao} obrigatorio />
          <Input label="Nome Fantasia" placeholder="Meu Negócio" value={f.fantasia}
            onChange={v => upd("fantasia", v.target.value)} erro={e.fantasia} obrigatorio />
        </div>
        <Input label="CNPJ" icone="🪪" placeholder="00.000.000/0001-00"
          value={f.cnpj} onChange={v => upd("cnpj", maskCNPJ(v.target.value))} erro={e.cnpj} obrigatorio />
        <Input label="E-mail" icone="✉️" type="email" placeholder="empresa@email.com"
          value={f.email} onChange={v => upd("email", v.target.value)} erro={e.email} obrigatorio />
        <InputSenha label="Senha" placeholder="Mínimo 6 caracteres"
          value={f.senha} onChange={v => upd("senha", v.target.value)} erro={e.senha} obrigatorio />
        <BarraForca senha={f.senha} />
        <InputSenha label="Confirmar Senha" placeholder="Repita a senha"
          value={f.confirma} onChange={v => upd("confirma", v.target.value)} erro={e.confirma} obrigatorio />

        {apiErro && <Alerta tipo="erro">{apiErro}</Alerta>}

        <BotaoPrimario loading={loading} onClick={submeter}>
          Criar Conta →
        </BotaoPrimario>
      </div>

      <div style={{ marginTop: 16 }}>
        <BotaoLink onClick={onVoltar}>← Voltar</BotaoLink>
      </div>
    </Card>
  );
}

function TelaVerifiqueEmail({ email, tipo, onVoltarLogin }) {
  const [podReenviar, setPod] = useState(false);
  const [contador, setCont] = useState(60);
  const [enviando, setEnv] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (contador <= 0) { setPod(true); return; }
    const t = setTimeout(() => setCont(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [contador]);

  async function reenviar() {
    setEnv(true); setMsg("");
    try {
      await api.post("/auth/reenviar-verificacao", { email });
      setMsg("E-mail de verificação reenviado!");
      setPod(false); setCont(60);
    } catch (err) {
      setMsg(err.message || "Erro ao reenviar.");
    } finally {
      setEnv(false);
    }
  }

  return (
    <Card>
      <div style={{ marginBottom: 20 }}><Logo /></div>
      <StepIndicator etapas={["Dados", "Verificação", "Pronto"]} atual={1} />

      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{
          width: 66, height: 66, borderRadius: 18,
          background: C.accentMid, border: `1.5px solid rgba(79,140,255,0.35)`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.9rem", marginBottom: 16,
          animation: "bounceIn .4s cubic-bezier(.22,1,.36,1)",
        }}>✉️</div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: C.text, letterSpacing: "-0.03em", marginBottom: 8 }}>
          Verifique seu e-mail
        </h2>
        <p style={{ fontSize: "0.82rem", color: C.muted2, lineHeight: 1.65 }}>
          Enviamos um link de confirmação para<br />
          <strong style={{ color: C.accent }}>{email}</strong>
        </p>
      </div>

      {msg && <div style={{ marginBottom: 12 }}><Alerta tipo={msg.includes("reenviado") ? "sucesso" : "erro"}>{msg}</Alerta></div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ textAlign: "center" }}>
          {podReenviar ? (
            <BotaoLink onClick={reenviar} cor={C.accent}>
              {enviando ? "Reenviando..." : "📨 Reenviar e-mail de verificação"}
            </BotaoLink>
          ) : (
            <span style={{ fontSize: "0.8rem", color: C.muted }}>
              Reenviar em <strong style={{ color: C.muted2 }}>{contador}s</strong>
            </span>
          )}
        </div>
      </div>

      <div style={{
        marginTop: 18, padding: "12px 14px",
        background: C.amberLo, border: `1px solid rgba(255,169,77,0.22)`, borderRadius: 10,
      }}>
        <p style={{ fontSize: "0.76rem", color: C.amber, lineHeight: 1.65, margin: 0 }}>
          💡 Verifique também a pasta de <strong>spam</strong>. O link expira em <strong>24 horas</strong>.
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <BotaoPrimario onClick={onVoltarLogin}>
          Ir para o Login →
        </BotaoPrimario>
      </div>

      <div style={{ marginTop: 14, textAlign: "center" }}>
        <BotaoLink onClick={onVoltarLogin}>← Voltar para o login</BotaoLink>
      </div>
    </Card>
  );
}

export default function Login() {
  const [tela, setTela] = useState("login");
  const [emailP, setEmailP] = useState("");
  const [tipoP, setTipoP] = useState("");
  const { isAuthenticated, user } = useAuth();

  function aoConcluirCadastro(email, tipo) {
    setEmailP(email);
    setTipoP(tipo);
    setTela("verificacao");
  }

  function aoLoginOk(tipo) {
    window.location.href = tipo === "empresa" ? "/empresa" : "/cliente";
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: C.bg,
      fontFamily: "'Poppins', 'Montserrat', sans-serif",
      padding: "24px 16px", boxSizing: "border-box",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700&display=swap');
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

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`,
        backgroundSize: "52px 52px",
        WebkitMaskImage: "radial-gradient(ellipse 80% 65% at 50% 50%,black,transparent)",
        maskImage: "radial-gradient(ellipse 80% 65% at 50% 50%,black,transparent)",
        opacity: 0.3,
      }} />

      <div style={{
        position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 450, borderRadius: "50%",
        background: "radial-gradient(ellipse,rgba(79,140,255,0.13) 0%,transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {tela === "login" && (
          <TelaLogin
            onCriarConta={() => setTela("escolha")}
            onLoginOk={aoLoginOk}
          />
        )}
        {tela === "escolha" && (
          <TelaEscolhaTipo
            onEscolher={tipo => setTela(`cadastro_${tipo}`)}
            onVoltar={() => setTela("login")}
          />
        )}
        {tela === "cadastro_cliente" && (
          <TelaCadastroCliente
            onConcluir={aoConcluirCadastro}
            onVoltar={() => setTela("escolha")}
          />
        )}
        {tela === "cadastro_empresa" && (
          <TelaCadastroEmpresa
            onConcluir={aoConcluirCadastro}
            onVoltar={() => setTela("escolha")}
          />
        )}
        {tela === "verificacao" && (
          <TelaVerifiqueEmail
            email={emailP}
            tipo={tipoP}
            onVoltarLogin={() => setTela("login")}
          />
        )}
      </div>
    </div>
  );
}
