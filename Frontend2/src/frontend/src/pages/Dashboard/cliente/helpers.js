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
  if (!classificacao || classificacao === "livre") return 0;
  return parseInt(classificacao) || 0;
}

export function calcDist(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function lotColor(pct) {
  if (pct >= 1) return "#ef4444";
  if (pct >= 0.7) return "#f59e0b";
  return "#22c55e";
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function timeAgo(isoStr) {
  if (!isoStr) return "";
  const diff = Date.now() - new Date(isoStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min atrás`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h/24)}d atrás`;
}

export function sugerirMesas(numPessoas, tiposMesa) {
  if (!tiposMesa || tiposMesa.length === 0) return [];
  const tipos = [...tiposMesa].sort((a, b) => b.capacidade - a.capacidade);
  let restante = numPessoas;
  const sugestao = [];
  for (const t of tipos) {
    if (restante <= 0) break;
    const qtd = Math.min(Math.ceil(restante / t.capacidade), t.disponiveis);
    if (qtd > 0) {
      sugestao.push({ capacidade: t.capacidade, qtd });
      restante -= qtd * t.capacidade;
    }
  }
  return sugestao;
}
