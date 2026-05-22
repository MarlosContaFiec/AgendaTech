export default function Logo({ size = 34 }) {
  const fs = size * 0.52, fs2 = size * 0.56, fs3 = size * 0.3;
  return (
    <div className="flex items-center gap-2.5">
      <div className="bg-gradient-to-br from-purple to-neon flex items-center justify-center font-black text-white flex-shrink-0 shadow-[0_0_12px_rgba(108,92,231,0.5)] rounded-[10px]" style={{ width: size, height: size, fontSize: fs }}>T</div>
      <div>
        <div className="font-heading font-black tracking-tight leading-none" style={{ fontSize: fs2 }}>AgendaTech</div>
        <div className="text-muted mt-[1px]" style={{ fontSize: fs3 }}>confiança em serviços</div>
      </div>
    </div>
  );
}
