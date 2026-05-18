export function calcIdade(nasc) {
  if (!nasc) return 99;
  const h = new Date(), n = new Date(nasc);
  let i = h.getFullYear() - n.getFullYear();
  const m = h.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && h.getDate() < n.getDate())) i--;
  return i;
}

export function scoreColor(s) {
  if (s >= 80) return "#00e676";
  if (s >= 50) return "#ffa94d";
  return "#ff4757";
}

export function scoreLabel(s) {
  if (s >= 80) return "Excelente";
  if (s >= 50) return "Regular";
  return "Baixo";
}

export function statusColor(st) {
  const map = { confirmado:"#00e676", pendente:"#ffa94d", cancelado:"#ff4757", concluido:"#00d4ff" };
  return map[st] || "#6b7294";
}

export function statusLabel(st) {
  const map = { confirmado:"Confirmado", pendente:"Pendente", cancelado:"Cancelado", concluido:"Concluído" };
  return map[st] || st;
}
