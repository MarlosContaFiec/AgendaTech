import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui";
import { scoreColor } from "@/utils/calculators";
import { formatDate, formatHora } from "@/utils/formatters";
import api from "@/services/api";
import { FiUsers, FiCalendar, FiCheckCircle, FiBell, FiXCircle, FiDollar, FiStar } from "react-icons/fi";

export default function VisaoGeral() {
  const { user } = useAuth();
  const [dash, setDash] = useState(null);

  useEffect(() => {
    api("GET", "/api/empresa/dashboard", null, user.token).then(res => {
      if (res.success) setDash(res.data);
    });
  }, [user]);

  if (!dash) return <div className="flex justify-center py-10"><Spinner size={24} /></div>;

  const stats = [
    { label: "Clientes", value: dash.total_clientes, Icon: FiUsers, color: "text-purple" },
    { label: "Agendamentos", value: dash.total_agendamentos, Icon: FiCalendar, color: "text-neon" },
    { label: "Concluídos", value: dash.concluidos, Icon: FiCheckCircle, color: "text-success" },
    { label: "Pendentes", value: dash.pendentes, Icon: FiBell, color: "text-warning" },
    { label: "Cancelados", value: dash.cancelados, Icon: FiXCircle, color: "text-danger" },
    { label: "Receita", value: "R$ " + (dash.receita_total || 0).toFixed(2), Icon: FiDollar, color: "text-gold" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Visão Geral</h2>
        <p className="text-muted text-[0.85rem]">Resumo das atividades da sua empresa</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-surface border border-line rounded-card p-4">
            <s.Icon size={20} className={"mb-2 " + s.color} />
            <div className={"text-2xl font-black " + s.color}>{s.value}</div>
            <div className="text-[0.72rem] text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {dash.media_avaliacao > 0 && (
        <div className="bg-surface border border-line rounded-card p-5 mb-6 flex items-center gap-4">
          <FiStar size={24} className="text-gold" />
          <div>
            <div className="text-[0.72rem] text-muted uppercase tracking-wider">Média de Avaliações</div>
            <div className="text-2xl font-black text-gold">{dash.media_avaliacao}</div>
          </div>
        </div>
      )}

      {dash.ultimos?.length > 0 && (
        <div className="bg-surface border border-line rounded-card p-5">
          <h3 className="font-heading font-bold text-[0.95rem] mb-4">Últimos Agendamentos</h3>
          <div className="flex flex-col gap-3">
            {dash.ultimos.map(ag => (
              <div key={ag.id} className="flex items-center gap-3 py-2 border-b border-line last:border-0">
                <div className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center text-purple text-sm font-bold">{ag.cliente_nome?.[0] || "?"}</div>
                <div className="flex-1">
                  <span className="font-semibold text-[0.85rem]">{ag.cliente_nome}</span>
                  <span className="text-muted text-[0.78rem] ml-2">{ag.servico_nome}</span>
                </div>
                <span className="flex items-center gap-1 text-[0.75rem] text-muted">
                  <FiCalendar size={11} />{formatDate(ag.data_agendamento)} {formatHora(ag.hora_inicio)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
