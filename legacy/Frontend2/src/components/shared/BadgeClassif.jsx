import { CLASSIF_INFO } from '@/utils/calculators';

export default function BadgeClassif({ val }) {
  const c = CLASSIF_INFO[val] || CLASSIF_INFO['livre'];
  return (
    <span style={{ background: c.cor + '22', color: c.cor, borderColor: c.cor + '44' }}
      className="text-[0.63rem] py-[3px] px-[9px] rounded-[20px] font-bold uppercase tracking-[0.5px] border inline-flex items-center gap-1">
      {c.icon} {c.label}
    </span>
  );
}
