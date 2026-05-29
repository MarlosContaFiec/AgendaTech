export default function ToastCliente({ msg, type }) {
  if (!msg) return null;
  const bg = type==="error"?"#2a1a1a":type==="info"?"#1a1e2a":"#1e2a1a";
  const border = type==="error"?"#ef4444":type==="info"?"#5b6cff":"#22c55e";
  const color = type==="error"?"#f87171":type==="info"?"#8b9eff":"#22c55e";
  return (
    <div style={{ position:"fixed", bottom:24, right:24, background:bg, border:`1px solid ${border}`, color, padding:"12px 18px", borderRadius:10, fontSize:"0.85rem", fontWeight:700, zIndex:300, animation:"slideIn .3s ease" }}>
      {msg}
    </div>
  );
}
