import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export default function InputSenha({ label, placeholder, value, onChange, required }) {
  const [ver, setVer] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label className={"block text-[0.7rem] font-bold uppercase tracking-wider mb-1.5 " + (false ? "text-danger" : "text-muted")}>
          {label}{required && <span className="text-purple ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <FiLock size={16} className={"absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors " + (focused ? "text-purple" : "text-muted")} />
        <input
          type={ver ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={"w-full border rounded-input text-foreground text-[0.88rem] outline-none font-body transition-all py-3 pl-10 pr-11 " + (focused ? "border-purple bg-surface-hover" : "border-line-light bg-surface-alt")}
        />
        <button type="button" onClick={() => setVer(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-muted p-1 hover:text-foreground transition-colors">
          {ver ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
    </div>
  );
}
