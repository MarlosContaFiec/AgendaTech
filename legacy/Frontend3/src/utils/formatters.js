export function formatCurrency(v){var n=parseFloat(v);if(isNaN(n))return'R$ 0,00';return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
export function formatDate(d){if(!d)return'';return new Date(d+'T00:00:00').toLocaleDateString('pt-BR');}
export function formatTime(t){if(!t)return'';return t.substring(0,5);}
export function formatDateTime(d){if(!d)return'';var dt=new Date(d);return dt.toLocaleDateString('pt-BR')+' '+dt.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}