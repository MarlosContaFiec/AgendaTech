import { useState } from "react";

export default function InputSenha({ label, placeholder, value, onChange }) {
  const [ver, setVer] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label className="block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 text-muted">{label}</label>}
      <div className="relative">
        <span className={"absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none transition-colors " + (focused ? "text-purple" : "text-muted")}>🔒</span>
        <input
          type={ver ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={"w-full border rounded-input text-foreground text-[0.88rem] outline-none font-body transition-all py-3 pl-10 pr-11 " + (focused ? "border-purple bg-surface-hover" : "border-line-light bg-surface-alt")}
        />
        <button type="button" onClick={() => setVer(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-muted text-base p-1">{ver ? "🙈" : "👁️"}</button>
      </div>
    </div>
  );
}
