import { CLASSIF_INFO } from '../constants';

export default function BadgeClassif({ val }) {
  const c = CLASSIF_INFO[val] || CLASSIF_INFO["livre"];
  return (
    <span style={{ fontSize:"0.63rem", padding:"3px 9px", borderRadius:20, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, background:`${c.cor}22`, color:c.cor, border:`1px solid ${c.cor}44` }}>
      {c.icon} {c.label}
    </span>
  );
}
