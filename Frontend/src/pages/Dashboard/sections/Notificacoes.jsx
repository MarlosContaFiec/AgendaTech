import { timeAgo } from "@/utils/formatters";

export default function Notificacoes({ notificacoes }) {
  if (!notificacoes || notificacoes.length === 0) {
    return (
      <div className="text-center py-16 bg-surface border border-line rounded-card">
        <div className="text-[2.5rem] mb-3">🔔</div>
        <p className="text-muted text-[0.9rem]">Nenhuma notificação.</p>
        <p className="text-muted text-[0.78rem] mt-1">Notificações de agendamentos e atualizações aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading font-black text-xl mb-1">Notificações</h2>
        <p className="text-muted text-[0.85rem]">{notificacoes.filter(n => !n.lida).length} não lidas</p>
      </div>
      <div className="flex flex-col gap-3">
        {[...notificacoes].reverse().map(n => (
          <div key={n.id} className={"bg-surface border rounded-card p-4 flex items-start gap-3 " + (n.lida ? "border-line opacity-60" : "border-purple/30")}>
            <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center text-lg flex-shrink-0">📌</div>
            <div className="flex-1">
              <p className="text-[0.85rem] text-muted-light">{n.mensagem || n.tipo}</p>
              <span className="text-[0.72rem] text-muted mt-1">{timeAgo(n.criadaEm || n.enviado_em)}</span>
            </div>
            {!n.lida && <div className="w-2 h-2 rounded-full bg-purple mt-2 flex-shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  );
}
