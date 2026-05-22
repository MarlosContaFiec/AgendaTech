const s = {
  public: "bg-success/12 text-success",
  manual: "bg-gold/12 text-gold",
  auto: "bg-purple/10 text-purple",
  full: "bg-danger/12 text-danger",
  pending: "bg-warning/12 text-warning",
  approved: "bg-success/12 text-success",
  rejected: "bg-danger/12 text-danger",
};

export default function Badge({ type = "auto", children }) {
  return <span className={"text-[0.62rem] px-2.5 py-[3px] rounded-badge font-bold uppercase tracking-wider " + (s[type] || s.auto)}>{children}</span>;
}
