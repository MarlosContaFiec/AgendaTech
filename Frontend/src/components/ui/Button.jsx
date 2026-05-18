const base = "font-bold rounded-btn transition-all duration-200 font-body inline-flex items-center justify-center gap-2 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };

const variants = {
  primary: "bg-gradient-to-br from-purple to-neon text-white shadow-[0_0_12px_rgba(108,92,231,0.5)] hover:brightness-110",
  ghost: "bg-surface-alt text-foreground border border-line hover:border-purple/50 hover:text-purple",
  danger: "bg-danger/15 text-danger border border-danger/25 hover:bg-danger/25",
  warning: "bg-warning/15 text-warning border border-warning/25 hover:bg-warning/25",
  success: "bg-success/15 text-success border border-success/25 hover:bg-success/25",
  gold: "bg-gold/15 text-gold border border-gold/25 hover:bg-gold/25",
};

export default function Button({ variant = "primary", size = "md", disabled, children, className = "", ...props }) {
  return (
    <button className={[base, sizes[size], variants[variant], className].join(" ")} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
