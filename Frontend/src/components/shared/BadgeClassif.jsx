const MAP = {
  livre: { label: "Livre", icon: "🟢", cor: "#00e676" },
  "10": { label: "+10", icon: "🔵", cor: "#4f8cff" },
  "12": { label: "+12", icon: "🟡", cor: "#ffd700" },
  "14": { label: "+14", icon: "🟠", cor: "#ffa94d" },
  "16": { label: "+16", icon: "🔴", cor: "#ff4757" },
  "18": { label: "+18", icon: "🔞", cor: "#c084fc" },
};

export default function BadgeClassif({ val }) {
  const c = MAP[val] || MAP.livre;
  return (
    <span className="text-[0.62rem] px-2.5 py-[3px] rounded-badge font-bold uppercase tracking-wider border" style={{ background: c.cor + "22", color: c.cor, borderColor: c.cor + "44" }}>
      {c.icon} {c.label}
    </span>
  );
}
