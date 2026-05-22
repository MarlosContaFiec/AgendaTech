export const CLIENT_ID = "c_local";

export const PERFIL_INICIAL = {
  nome: "",
  cpf: "",
  nascimento: "",
  estado: "",
  cidade: "",
  telefone: "",
};

export const CIDADES_POR_ESTADO = {
  SP: ["Indaiatuba", "Campinas", "São Paulo", "Sorocaba"],
  RJ: ["Rio de Janeiro", "Niterói", "Petrópolis"],
  MG: ["Belo Horizonte", "Uberlândia", "Juiz de Fora"],
};

export const POLITICA_CANCELAMENTO = {
  horasAntecedencia: 24,
  descricao: "Cancelamentos realizados com mais de 24 horas de antecedência recebem reembolso integral. Cancelamentos com menos de 24 horas resultam na perda do valor pago e dos pontos utilizados.",
};

export const TIPOS_MESA_PADRAO = [
  { capacidade: 4, total: 4, disponiveis: 4 },
  { capacidade: 8, total: 2, disponiveis: 2 },
];

export const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
export const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

export const CLASSIF_INFO = {
  livre: { label:"Livre",  icon:"🟢", cor:"#22c55e" },
  "10":  { label:"+10",   icon:"🔵", cor:"#4f8cff" },
  "12":  { label:"+12",   icon:"🟡", cor:"#f5c842" },
  "14":  { label:"+14",   icon:"🟠", cor:"#ffa94d" },
  "16":  { label:"+16",   icon:"🔴", cor:"#ff5c7a" },
  "18":  { label:"+18",   icon:"🔞", cor:"#c084fc" },
};

export const EVENTOS_FALLBACK = [
  { id:1, titulo:"Corte + Escova Premium", estabelecimento:"Salão Lumière", tipo:"Salão", estado:"SP", cidade:"Indaiatuba", desc:"Corte personalizado + escova modeladora com produtos importados de alta qualidade.", horarios:["09:00","11:00","14:00","16:30"], data:"2026-05-15", publico:false, lotacao:8, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0912, lng:-47.2189 },
  { id:2, titulo:"Workshop Bem-Estar Mental", estabelecimento:"Clínica Equilíbrio", tipo:"Clínica", estado:"SP", cidade:"Indaiatuba", desc:"Palestra informativa gratuita sobre saúde mental e técnicas de mindfulness.", horarios:["10:00"], data:"2026-05-20", publico:true, lotacao:null, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0897, lng:-47.2208 },
  { id:3, titulo:"Avaliação Física Completa", estabelecimento:"Academia Iron", tipo:"Academia", estado:"SP", cidade:"Campinas", desc:"Avaliação física completa com análise de composição corporal inclusa.", horarios:["07:00","08:00","17:00","18:00"], data:"2026-05-28", publico:false, lotacao:10, classificacao:"12", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-22.9099, lng:-47.0626 },
  { id:4, titulo:"Noite Eletrônica — Club Vibe", estabelecimento:"Club Vibe", tipo:"Estúdio", estado:"SP", cidade:"São Paulo", desc:"A maior festa eletrônica do mês com DJs internacionais. Open bar incluso.", horarios:["22:00","00:00"], data:"2026-06-07", publico:false, lotacao:200, classificacao:"18", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.5505, lng:-46.6333, preco:120.00 },
  { id:5, titulo:"Dia de Spa Completo", estabelecimento:"Spa Serenità", tipo:"Spa", estado:"SP", cidade:"Indaiatuba", desc:"Pacote completo: massagem relaxante + aromaterapia + esfoliação corporal.", horarios:["10:00","14:00"], data:"2026-05-22", publico:false, lotacao:4, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0912, lng:-47.2189, preco:280.00 },
  { id:6, titulo:"Aula Experimental de Yoga", estabelecimento:"Studio Zen Flow", tipo:"Academia", estado:"SP", cidade:"Indaiatuba", desc:"Experimente nossa metodologia única de yoga terapêutico. Aberto para iniciantes!", horarios:["07:00","08:00","18:30","20:00"], data:"2026-05-28", publico:false, lotacao:12, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0880, lng:-47.2210 },
  { id:7, titulo:"Jantar Especial Italiano", estabelecimento:"Ristorante Bella", tipo:"Restaurante", estado:"SP", cidade:"Indaiatuba", desc:"Jantar especial com menu degustação italiano. Reserva de mesa necessária.", horarios:["19:00","20:30"], data:"2026-06-14", publico:false, lotacao:null, classificacao:"livre", inscritos:[], pendentes:[], fila:[], limFila:3, lat:-23.0900, lng:-47.2200, tipoReserva:"restaurante", tiposMesa: TIPOS_MESA_PADRAO },
];
