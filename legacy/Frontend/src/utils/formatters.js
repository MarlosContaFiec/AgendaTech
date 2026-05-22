export function formatDate(d) {
  if (!d) return "";
  const [y, m, dd] = d.split("-");
  return dd + "/" + m + "/" + y;
}

export function formatMoney(v) {
  if (!v || v === 0) return "Gratuito";
  return "R$ " + Number(v).toFixed(2).replace(".", ",");
}

export function timeAgo(iso) {
  if (!iso) return "";
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "agora";
  if (min < 60) return min + "min atrás";
  const h = Math.floor(min / 60);
  if (h < 24) return h + "h atrás";
  return Math.floor(h / 24) + "d atrás";
}

export function formatHora(t) {
  if (!t) return "";
  return t.slice(0, 5);
}
