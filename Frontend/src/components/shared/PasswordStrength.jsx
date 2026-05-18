export default function PasswordStrength({ senha }) {
  if (!senha) return null;
  const f = senha.length < 6 ? 1 : senha.length < 10 ? 2 : /[A-Z]/.test(senha) && /\d/.test(senha) ? 4 : 3;
  const labels = ["", "Muito fraca", "Fraca", "Boa", "Forte"];
  const colors = ["transparent", "#ff4757", "#ffa94d", "#6c5ce7", "#00e676"];
  return (
    <div className="-mt-0.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => <div key={i} className="flex-1 h-[3px] rounded-full transition-colors" style={{ background: f >= i ? colors[f] : "#2a2a52" }} />)}
      </div>
      <span className="text-[0.7rem] font-semibold" style={{ color: colors[f] }}>{labels[f]}</span>
    </div>
  );
}
