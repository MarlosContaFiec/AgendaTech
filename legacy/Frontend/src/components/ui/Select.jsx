export default function Select({ label, children, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <label className="block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 text-muted">{label}</label>}
      <select {...props} className="w-full bg-surface-alt border border-line-light rounded-input text-foreground text-[0.85rem] outline-none font-body cursor-pointer py-3 px-3.5 transition-colors focus:border-purple">
        {children}
      </select>
    </div>
  );
}
