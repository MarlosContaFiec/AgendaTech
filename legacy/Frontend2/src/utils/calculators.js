export function calcIdade(nascimento) {
  if (!nascimento) return 99;
  const hoje = new Date();
  const nasc = new Date(nascimento);
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

export function idadeMinima(classificacao) {
  if (!classificacao || classificacao === 'livre') return 0;
  return parseInt(classificacao) || 0;
}

export function lotColorHex(pct) {
  if (pct >= 1) return '#ef4444';
  if (pct >= 0.7) return '#f59e0b';
  return '#22c55e';
}

export const CLASSIF_INFO = {
  livre: { label: 'Livre', icon: '🟢', cor: '#22c55e' },
  '10':  { label: '+10',  icon: '🔵', cor: '#4f8cff' },
  '12':  { label: '+12',  icon: '🟡', cor: '#f5c842' },
  '14':  { label: '+14',  icon: '🟠', cor: '#ffa94d' },
  '16':  { label: '+16',  icon: '🔴', cor: '#ff5c7a' },
  '18':  { label: '+18',  icon: '🔞', cor: '#c084fc' },
};
