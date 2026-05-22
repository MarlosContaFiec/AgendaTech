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
                  {idade >= 18 ? " — Acesso liberado a todos os eventos, incluindo +18 🔓" : ` — Eventos classificados +18 estarão ocultos 🔞`}
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
