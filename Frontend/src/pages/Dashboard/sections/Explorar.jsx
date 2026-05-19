import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Select, Spinner } from "@/components/ui";
import api from "@/services/api";
import { FiSearch, FiCalendar, FiStar, FiMapPin } from "react-icons/fi";

export default function Explorar() {
  const [empresas, setEmpresas] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [busca, setBusca] = useState("");
  const [nicho, setNicho] = useState("");
  const [cidade, setCidade] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [cidades, setCidades] = useState([]);

  useEffect(() => {
    Promise.all([
      api("GET", "/api/empresas/destaques"),
      api("GET", "/api/empresas?limite=20"),
      api("GET", "/api/empresas/cidades"),
    ]).then(([dRes, eRes, cRes]) => {
      if (dRes.success) setDestaques(dRes.data || []);
      if (eRes.success) setEmpresas(eRes.data || []);
      if (cRes.success) setCidades(cRes.data || []);
      setCarregando(false);
    });
  }, []);

  async function buscar() {
    setCarregando(true);
    const params = new URLSearchParams();
    if (busca) params.set("busca", busca);
    if (nicho) params.set("nicho", nicho);
    if (cidade) params.set("cidade", cidade);
    params.set("limite", "20");
    const res = await api("GET", "/api/empresas?" + params.toString());
    if (res.success) setEmpresas(res.data || []);
    setCarregando(false);
  }

  function CardEmpresa({ emp }) {
    return (
      <Link to={`/dashboard/empresa/${emp.id}`}
        className="bg-surface border border-line rounded-card p-4 transition-all hover:border-purple/40 hover:-translate-y-0.5 block no-underline text-foreground">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-surface-alt border border-line flex items-center justify-center overflow-hidden">
            {emp.logo_url
              ? <img src={emp.logo_url} alt="" className="w-full h-full object-cover rounded-xl" />
              : <span className="text-lg font-bold text-purple">{emp.nome_fantasia?.[0] || "?"}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[0.9rem] truncate">{emp.nome_fantasia}</div>
            <div className="text-[0.72rem] text-muted flex items-center gap-1">
              <FiMapPin size={11} />{emp.cidade}, {emp.estado}
            </div>
          </div>
        </div>
        <div className="text-[0.78rem] text-muted-light">{emp.nicho}{emp.sub_nicho ? " · " + emp.sub_nicho : ""}</div>
      </Link>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Encontre seu serviço</h2>
        <p className="text-muted text-[0.85rem]">Busque empresas e agende seus horários</p>
      </div>

      <div className="bg-surface border border-line rounded-card p-4 mb-6">
        <div className="flex gap-3 flex-wrap mb-3">
          <Input placeholder="Buscar por nome, serviço..." value={busca} onChange={e => setBusca(e.target.value)} icon={<FiSearch size={16} />} className="flex-1 min-w-[180px] mb-0" />
          <Select value={cidade} onChange={e => setCidade(e.target.value)}>
            <option value="">Todas as cidades</option>
            {cidades.map(c => (
              <option key={c.cidade + c.estado} value={c.cidade}>{c.cidade} - {c.estado} ({c.total})</option>
            ))}
          </Select>
        </div>
        <Button onClick={buscar} size="sm">Buscar</Button>
      </div>

      {destaques.length > 0 && (
        <div className="mb-8">
          <h3 className="font-heading font-bold text-[0.95rem] mb-3 flex items-center gap-2">
            <FiStar size={16} className="text-gold" /> Destaques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destaques.map(emp => (
              <Link key={emp.id} to={`/dashboard/empresa/${emp.id}`}
                className="bg-surface border border-line rounded-card p-4 transition-all hover:border-purple/40 hover:-translate-y-0.5 block no-underline text-foreground">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-neon flex items-center justify-center text-white font-black text-sm">
                    {emp.nome_fantasia?.[0] || "?"}
                  </div>
                  <div>
                    <div className="font-bold text-[0.9rem]">{emp.nome_fantasia}</div>
                    <div className="text-[0.72rem] text-muted">{emp.nicho} · {emp.cidade}</div>
                  </div>
                </div>
                <div className="flex justify-between text-[0.75rem] text-muted">
                  <span className="flex items-center gap-1"><FiCalendar size={12} />{emp.agendamentos_24h} agendamentos</span>
                  <span className="flex items-center gap-1 text-gold"><FiStar size={12} />{emp.media_avaliacao || "—"}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="text-muted text-[0.78rem] mb-3">{empresas.length} empresa{empresas.length !== 1 ? "s" : ""} encontrada{empresas.length !== 1 ? "s" : ""}</p>
        {carregando
          ? <div className="flex justify-center py-10"><Spinner size={24} /></div>
          : empresas.length === 0
            ? <div className="text-center py-10 text-muted">Nenhuma empresa encontrada.</div>
            : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {empresas.map(emp => <CardEmpresa key={emp.id} emp={emp} />)}
              </div>
            )}
      </div>
    </div>
  );
}