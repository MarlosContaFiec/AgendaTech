import { useEffect, useState } from "react";

export default function Toast({ msg, type = "success", onDone }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!msg) return;
    setShow(true);
    const t = setTimeout(() => { setShow(false); onDone?.(); }, 3000);
    return () => clearTimeout(t);
  }, [msg]);

  if (!msg || !show) return null;
  const c = { success: "border-success bg-success/12 text-success", error: "border-danger bg-danger/12 text-danger", info: "border-purple bg-purple/12 text-purple" };
  return <div className={"fixed bottom-6 right-6 border px-5 py-3 rounded-xl text-[0.85rem] font-bold z-[500] animate-[fadeUp_.3s_ease] " + (c[type] || c.success)}>{msg}</div>;
}
