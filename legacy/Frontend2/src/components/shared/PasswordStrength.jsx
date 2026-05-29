export default function PasswordStrength({ senha }) {
  const forca = !senha ? 0 : senha.length < 6 ? 1 : senha.length < 10 ? 2 : /[A-Z]/.test(senha) && /\d/.test(senha) ? 4 : 3;
  const rotulos = ['', 'Muito fraca', 'Fraca', 'Boa', 'Forte'];
  const cores = ['transparent', '#ff5c7a', '#ffa94d', '#4f8cff', '#22d48a'];
  if (!senha) return null;
  return (
    <div className="-mt-0.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} style={{ background: forca >= i ? cores[forca] : undefined }}
            className={'flex-1 h-[3px] rounded-[3px] transition-colors duration-300 ' + (forca < i ? 'bg-tb-border2' : '')} />
        ))}
      </div>
      <span style={{ color: cores[forca] }} className="text-[0.7rem] font-semibold">{rotulos[forca]}</span>
    </div>
  );
}
