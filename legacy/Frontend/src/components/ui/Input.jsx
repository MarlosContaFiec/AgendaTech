import { useState } from "react";

export default function Input({ label, error, icon, suffix, required, className = "", style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={className}>
      {label && (
        <label className={"block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 " + (error ? "text-danger" : "text-muted")}>
          {label}{required && <span className="text-purple ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && <span className={"absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-colors " + (focused ? "text-purple" : "text-muted")}>{icon}</span>}
        <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          className={"w-full border rounded-input text-foreground text-[0.88rem] outline-none font-body transition-all py-3 " +
            (error ? "border-danger " : focused ? "border-purple bg-surface-hover " : "border-line-light bg-surface-alt ") +
            (icon ? "pl-10 " : "pl-3.5 ") + (suffix ? "pr-10 " : "pr-3.5 ") }
          style={style}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">{suffix}</span>}
      </div>
      {error && <p className="flex items-center gap-1 mt-1.5 text-[0.72rem] text-danger"><span>!</span>{error}</p>}
    </div>
  );
}
