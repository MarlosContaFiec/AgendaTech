const s = {
  error: "bg-danger/10 border-danger/28 text-danger",
  success: "bg-success/10 border-success/28 text-success",
  info: "bg-purple/10 border-purple/28 text-purple",
  warning: "bg-warning/10 border-warning/28 text-warning",
};
const icons = { error: "✕", success: "✓", info: "i", warning: "!" };

export default function Alert({ type = "error", children }) {
  return (
    <div className={"border rounded-[10px] py-3 px-3.5 flex gap-2.5 items-start animate-[fadeUp_.2s_ease] " + (s[type] || s.error)}>
      <span className="font-black text-[0.9rem] flex-shrink-0 mt-[1px]">{icons[type]}</span>
      <p className="text-[0.81rem] leading-relaxed">{children}</p>
    </div>
  );
}
