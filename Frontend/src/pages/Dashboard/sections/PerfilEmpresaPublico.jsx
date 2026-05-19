import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Input, Spinner, Toast } from "@/components/ui";
import { formatDate, formatMoney, formatHora } from "@/utils/formatters";
import api from "@/services/api";
import { FiCalendar, FiClock, FiStar, FiUser } from "react-icons/fi";

export default function PerfilEmpresaPublico() {
  const { id } = useParams();
  const { user } = useAuth();
  const [empresa, setEmpresa] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [servicoSel, setServicoSel] = useState("");
  const [dataSel, setDataSel] = useState("");
  const [slots, setSlots] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agendando, setAgendando] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  useEffect(() => {
    api("GET", "/api/empresas/" + id).then(res => {
      if (res.success) {
        setEmpresa(res.data);
        const servs = res.data.servicos || [];
        setServicos(servs);
        if (servs.length > 0) setServicoSel(String(servs[0].id));
      }
      setLoading(false);
    });
  }, [id]);

  async function buscarSlots() {
    if (!servicoSel || !dataSel) return;
    const res = await api("GET", "/api/empresas/" + id + "/disponibilidade?servico_id=" + servicoSel + "&data=" + dataSel);
    if (res.success) setSlots(res.data);
  }

  useEffect(() => { buscarSlots(); }, [servicoSel, dataSel]);

  async function agendar(hora) {
    setAgendando(true);
    const res = await api("POST", "/api/agendamentos", {
      servico_id: Number(servicoSel),
      empresa_id: Number(id),
      data_agendamento: dataSel,
      hora_inicio: hora,
    }, user.token);
    setAgendando(false);
    if (res.success) {
      showToast("Agendamento realizado!");
      buscarSlots();
    } else {
      showToast(res.message || "Erro ao agendar.", "error");
    }
  }

  if (loading) return <div className="flex justify-center py-10"><Spinner size={24} /></div>;
  if (!empresa) return <div className="text-center py-10 text-muted">Empresa não encontrada.</div>;

  return (
    <div className="max-w-[900px]">
      <Toast msg={toast.msg} type={toast.type} onDone={() => setToast({ msg: "" })} />

      <div className="bg-surface border border-line rounded-card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple to-neon flex items-center justify-center text-white font-black text-2xl shadow-[0_0_12px_rgba(108,92,231,0.5)] overflow-hidden">
            {empresa.logo_url
              ? <img src={empresa.logo_url} alt="" className="w-full h-full object-cover rounded-2xl" />
              : (empresa.nome_fantasia?.[0] || "?")}
          </div>
          <div>
            <h2 className="font-heading font-black text-xl">{empresa.nome_fantasia}</h2>
            <p className="text-muted text-[0.85rem]">{empresa.nicho}{empresa.sub_nicho ? " · " + empresa.sub_nicho : ""} · {empresa.cidade}, {empresa.estado}</p>
            {empresa.media_avaliacao > 0 && (
              <p className="text-gold text-[0.82rem] mt-1 flex items-center gap-1">
                <FiStar size={13} /> {empresa.media_avaliacao} ({empresa.total_avaliacoes} avaliações)
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-line rounded-card p-6 mb-6">
        <h3 className="font-heading font-bold text-lg mb-4">Serviços Disponíveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {servicos.map(s => (
            <div key={s.id} onClick={() => setServicoSel(String(s.id))}
              className={"p-4 rounded-card border cursor-pointer transition-all " +
                (servicoSel === String(s.id) ? "border-purple bg-purple/10" : "border-line bg-surface-alt hover:border-purple/40")}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-[0.9rem]">{s.nome}</span>
                <span className="text-purple font-bold text-[0.85rem]">{formatMoney(s.preco_base)}</span>
              </div>
              <p className="text-[0.78rem] text-muted mb-1">{s.descricao}</p>
              <div className="flex items-center gap-2 text-[0.72rem] text-muted">
                <span className="flex items-center gap-1"><FiClock size={11} />{s.duracao_minutos}min</span>
                <span>{formatHora(s.hora_inicio)} — {formatHora(s.hora_fim)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-line rounded-card p-6">
        <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
          <FiCalendar size={18} /> Agendar
        </h3>
        <Input label="Data" type="date" value={dataSel} onChange={e => setDataSel(e.target.value)} icon={<FiCalendar size={16} />} className="mb-4" />

        {slots && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[0.72rem] text-muted uppercase tracking-wider">Horários disponíveis</span>
              {!slots.disponivel && <span className="text-danger text-[0.78rem] font-bold">Fechado neste dia</span>}
            </div>
            {slots.disponivel && slots.slots?.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {slots.slots.map(s => (
                  <button key={s.hora_inicio}
                    disabled={!s.disponivel || agendando}
                    onClick={() => agendar(s.hora_inicio)}
                    className={"py-2.5 px-3 rounded-btn text-[0.82rem] font-bold transition-all border " +
                      (s.disponivel
                        ? "bg-surface-alt text-foreground border-line cursor-pointer hover:border-purple hover:bg-purple/10 hover:text-purple"
                        : "bg-surface text-muted/40 border-line/50 cursor-not-allowed line-through")}>
                    {formatHora(s.hora_inicio)}
                    {s.vagas_restantes_servico !== undefined && (
                      <div className="text-[0.6rem] font-normal mt-0.5">{s.vagas_restantes_servico} vagas</div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted text-[0.85rem] text-center py-6">Nenhum horário disponível nesta data.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
