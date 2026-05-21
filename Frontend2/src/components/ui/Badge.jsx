import { CLASSIF_INFO } from '@/utils/calculators';

export function BadgeClassif({ val }) {
  const c = CLASSIF_INFO[val] || CLASSIF_INFO['livre'];
  return (
    <span style={{ background: c.cor + '22', color: c.cor, borderColor: c.cor + '44' }}
      className="text-[0.63rem] py-[3px] px-[9px] rounded-[20px] font-bold uppercase tracking-[0.5px] border inline-flex items-center gap-1">
      {c.icon} {c.label}
    </span>
  );
}

export function BadgePublico() {
  return <span className="text-[0.63rem] py-[3px] px-[9px] rounded-[20px] font-bold uppercase tracking-[0.5px] bg-green-500/15 text-green-400">Público</span>;
}

export function BadgeInscricao() {
  return <span className="text-[0.63rem] py-[3px] px-[9px] rounded-[20px] font-bold uppercase tracking-[0.5px] bg-blue-500/15 text-blue-300">Inscrição</span>;
}

export function BadgeFull() {
  return <span className="text-[0.63rem] py-[3px] px-[9px] rounded-[20px] font-bold uppercase tracking-[0.5px] bg-red-500/15 text-red-400">Esgotado</span>;
}

export function BadgePendente() {
  return <span className="text-[0.63rem] py-[3px] px-[9px] rounded-[20px] font-bold uppercase tracking-[0.5px] bg-amber-500/15 text-amber-400">⏳ Pendente</span>;
}
