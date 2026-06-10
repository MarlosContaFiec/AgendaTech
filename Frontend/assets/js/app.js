/* ═══════════════════════════════════════════════════════════════
   TRUSTBOOK — MOTOR COMPLETO
   ═══════════════════════════════════════════════════════════════ */

// ─── CONSTANTES ────────────────────────────────────────────────
const STORE_KEY = "trustbook_php_v1";
const CLIENT_ID = "c_local";

const CIDADES = {
  SP:["Indaiatuba","Campinas","São Paulo","Sorocaba"],
  RJ:["Rio de Janeiro","Niterói","Petrópolis"],
  MG:["Belo Horizonte","Uberlândia","Juiz de Fora"]
};

const POLITICA = {
  horas: 24,
  desc: "Cancelamentos com mais de 24h de antecedência recebem reembolso integral. Menos de 24h resultam na perda do valor pago e dos pontos."
};

const MESAS_TIPO = [
  {cap:4,total:4,disp:4},
  {cap:8,total:2,disp:2}
];

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

const CLASSIF = {
  livre:{lb:"Livre",ic:"🟢",c:"#22c55e"},
  "10":{lb:"+10",ic:"🔵",c:"#4f8cff"},
  "12":{lb:"+12",ic:"🟡",c:"#f5c842"},
  "14":{lb:"+14",ic:"🟠",c:"#ffa94d"},
  "16":{lb:"+16",ic:"🔴",c:"#ff5c7a"},
  "18":{lb:"+18",ic:"🔞",c:"#c084fc"}
};

const MOTIVOS_CANC = ["Conflito de horário","Motivo pessoal","Evento cancelado pelo estabelecimento","Mudança de planos","Outro"];

// ─── EVENTOS FALLBACK ──────────────────────────────────────────
const EVENTOS = [
  {id:1,titulo:"Corte + Escova Premium",estab:"Salão Lumière",tipo:"Salão",estado:"SP",cidade:"Indaiatuba",desc:"Corte personalizado + escova modeladora com produtos importados de alta qualidade.",horarios:["09:00","11:00","14:00","16:30"],data:"2026-05-15",publico:false,lotacao:8,clf:"livre",inscritos:[],fila:[],limFila:3,lat:-23.0912,lng:-47.2189},
  {id:2,titulo:"Workshop Bem-Estar Mental",estab:"Clínica Equilíbrio",tipo:"Clínica",estado:"SP",cidade:"Indaiatuba",desc:"Palestra informativa gratuita sobre saúde mental e técnicas de mindfulness.",horarios:["10:00"],data:"2026-05-20",publico:true,lotacao:null,clf:"livre",inscritos:[],fila:[],limFila:3,lat:-23.0897,lng:-47.2208},
  {id:3,titulo:"Avaliação Física Completa",estab:"Academia Iron",tipo:"Academia",estado:"SP",cidade:"Campinas",desc:"Avaliação física completa com análise de composição corporal inclusa.",horarios:["07:00","08:00","17:00","18:00"],data:"2026-05-28",publico:false,lotacao:10,clf:"12",inscritos:[],fila:[],limFila:3,lat:-22.9099,lng:-47.0626},
  {id:4,titulo:"Noite Eletrônica — Club Vibe",estab:"Club Vibe",tipo:"Estúdio",estado:"SP",cidade:"São Paulo",desc:"A maior festa eletrônica do mês com DJs internacionais. Open bar incluso.",horarios:["22:00","00:00"],data:"2026-06-07",publico:false,lotacao:200,clf:"18",inscritos:[],fila:[],limFila:3,lat:-23.5505,lng:-46.6333,preco:120},
  {id:5,titulo:"Dia de Spa Completo",estab:"Spa Serenità",tipo:"Spa",estado:"SP",cidade:"Indaiatuba",desc:"Pacote completo: massagem relaxante + aromaterapia + esfoliação corporal.",horarios:["10:00","14:00"],data:"2026-05-22",publico:false,lotacao:4,clf:"livre",inscritos:[],fila:[],limFila:3,lat:-23.0912,lng:-47.2189,preco:280},
  {id:6,titulo:"Aula Experimental de Yoga",estab:"Studio Zen Flow",tipo:"Academia",estado:"SP",cidade:"Indaiatuba",desc:"Experimente nossa metodologia única de yoga terapêutico.",horarios:["07:00","08:00","18:30","20:00"],data:"2026-05-28",publico:false,lotacao:12,clf:"livre",inscritos:[],fila:[],limFila:3,lat:-23.0880,lng:-47.2210},
  {id:7,titulo:"Jantar Especial Italiano",estab:"Ristorante Bella",tipo:"Restaurante",estado:"SP",cidade:"Indaiatuba",desc:"Jantar especial com menu degustação italiano.",horarios:["19:00","20:30"],data:"2026-06-14",publico:false,lotacao:null,clf:"livre",inscritos:[],fila:[],limFila:3,lat:-23.0900,lng:-47.2200}
];

// ─── STORAGE ───────────────────────────────────────────────────
function getData(){try{const d=localStorage.getItem(STORE_KEY);return d?JSON.parse(d):{}}catch{return{}}}
function saveData(d){try{localStorage.setItem(STORE_KEY,JSON.stringify(d))}catch{}}
function getRegs(){return getData().regs||{}}
function saveRegs(r){const d=getData();d.regs=r;saveData(d)}
function getPerfil(){return getData().perfil||{nome:"",cpf:"",nascimento:"",estado:"",cidade:"",telefone:""}}
function savePerfil(p){const d=getData();d.perfil=p;saveData(d)}
function getNotifs(){return getData().notifs||[]}
function saveNotifs(n){const d=getData();d.notifs=n;saveData(d)}

// ─── HELPERS ───────────────────────────────────────────────────
function calcIdade(n){if(!n)return 99;const h=new Date(),d=new Date(n);let i=h.getFullYear()-d.getFullYear();const m=h.getMonth()-d.getMonth();if(m<0||(m===0&&h.getDate()<d.getDate()))i--;return i}
function formatDate(s){if(!s)return"";const[y,m,d]=s.split("-");return d+"/"+m+"/"+y}
function lotColor(p){if(p>=1)return"#ef4444";if(p>=0.7)return"#f59e0b";return"#22c55e"}
function calcDist(a,b,c,d){const R=6371,p=Math.PI/180;const x=Math.sin(((c-a)*p)/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(((d-b)*p)/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
function timeAgo(iso){if(!iso)return"";const min=Math.floor((Date.now()-new Date(iso).getTime())/60000);if(min<1)return"agora";if(min<60)return min+"min atrás";const h=Math.floor(min/60);if(h<24)return h+"h atrás";return Math.floor(h/24)+"d atrás"}
function sugerirMesas(num,tipos){if(!tipos||!tipos.length)return[];const t=[...tipos].sort((a,b)=>b.cap-a.cap);let r=num;const s=[];for(const x of t){if(r<=0)break;const q=Math.min(Math.ceil(r/x.cap),x.disp);if(q>0){s.push({cap:x.cap,qtd:q});r-=q*x.cap}}return s}
function maskCPF(v){return v.replace(/\D/g,"").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})/,"$1-$2").replace(/(-\d{2})\d+?$/,"$1")}
function maskPhone(v){return v.replace(/\D/g,"").replace(/(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d)/,"$1-$2").replace(/(-\d{4})\d+?$/,"$1")}

// ─── SIDEBAR ───────────────────────────────────────────────────
function initSidebar(){
  const h=document.querySelector('.hamburger'),s=document.querySelector('.sidebar'),o=document.querySelector('.sidebar-overlay');
  if(!h)return;
  h.addEventListener('click',()=>{s.classList.toggle('open');o.classList.toggle('show')});
  if(o)o.addEventListener('click',()=>{s.classList.remove('open');o.classList.remove('show')});
}

// ─── TOAST ─────────────────────────────────────────────────────
function showToast(msg,type='i'){
  const old=document.querySelector('.toast');if(old)old.remove();
  const t=document.createElement('div');
  t.className='toast toast-'+type;t.textContent=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),3000);
}

// ─── MODAL ─────────────────────────────────────────────────────
function openModal(id){const m=document.getElementById(id);if(m){m.classList.add('show');document.body.style.overflow='hidden'}}
function closeModal(id){const m=document.getElementById(id);if(m){m.classList.remove('show');document.body.style.overflow=''}}

// ─── BADGE CLASSIFICAÇÃO ───────────────────────────────────────
function badgeClassif(val){
  const c=CLASSIF[val]||CLASSIF.livre;
  return '<span class="bdg" style="background:'+c.c+'22;color:'+c.c+';border:1px solid '+c.c+'44">'+c.ic+' '+c.lb+'</span>';
}

// ─── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{initSidebar()});
