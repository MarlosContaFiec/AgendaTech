'use strict';
/**
 * Suite de testes end-to-end — sem framework externo.
 * Usa fetch nativo do Node 18+.
 * Roda em processo único com o servidor Express já no ar.
 */
require('dotenv').config();

const BASE = `http://localhost:${process.env.PORT || 3000}`;
let passed = 0, failed = 0;
const ctx  = {}; 



async function api(method, path, body, token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  const r = await fetch(`${BASE}${path}`, {
    method, headers: h,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await r.json().catch(() => ({}));
  return { status: r.status, body: json, data: json.data };
}

function ok(desc, cond, hint) {
  if (cond) { console.log(`  ✅  ${desc}`); passed++; }
  else { console.error(`  ❌  ${desc}${hint !== undefined ? '  →  ' + JSON.stringify(hint).slice(0,120) : ''}`); failed++; }
}
function section(n) { console.log(`\n${'─'.repeat(58)}\n  📦  ${n}\n${'─'.repeat(58)}`); }
async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }


function gerarCnpjValido() {
  
  const ts   = Date.now() % 1_000_000_000; 
  const base = `00${String(ts).padStart(9,'0')}0001`.slice(0,12);
  const w1   = [5,4,3,2,9,8,7,6,5,4,3,2];
  const w2   = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  const d1   = () => { let s=0; for(let i=0;i<12;i++) s+=parseInt(base[i])*w1[i]; const r=s%11; return r<2?0:11-r; };
  const d1v  = d1();
  const full = base + d1v;
  let s2=0; for(let i=0;i<13;i++) s2+=parseInt(full[i])*w2[i];
  const d2v = s2%11<2?0:11-s2%11;
  const raw  = full + d2v;
  return `${raw.slice(0,2)}.${raw.slice(2,5)}.${raw.slice(5,8)}/${raw.slice(8,12)}-${raw.slice(12)}`;
}


function gerarCpfValido() {
  const ts   = Date.now() % 1_000_000_000;
  const base = String(ts).padStart(9,'0').slice(0,9);
  const d1   = () => { let s=0; for(let i=0;i<9;i++) s+=parseInt(base[i])*(10-i); const r=(s*10)%11; return r>=10?0:r; };
  const d1v  = d1();
  const b2   = base + d1v;
  let s2=0; for(let i=0;i<10;i++) s2+=parseInt(b2[i])*(11-i);
  const d2v  = (s2*10)%11>=10?0:(s2*10)%11;
  const raw  = b2 + d2v;
  
  if (/^(\d)\1{10}$/.test(raw)) return gerarCpfValido();
  return `${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6,9)}-${raw.slice(9)}`;
}



function unitCpfCnpj() {
  section('UNITÁRIOS — CPF & CNPJ');
  const cpf_  = require('../utils/cpf');
  const cnpj_ = require('../utils/cnpj');

  ok('CPF 111.444.777-35 válido',        cpf_.validate('111.444.777-35'));
  ok('CPF 111.111.111-11 inválido',      !cpf_.validate('111.111.111-11'));
  ok('CPF 000.000.000-00 inválido',      !cpf_.validate('000.000.000-00'));
  ok('CPF format',                        cpf_.format('11144477735') === '111.444.777-35');
  ok('CNPJ 11.222.333/0001-81 válido',   cnpj_.validate('11.222.333/0001-81'));
  ok('CNPJ inválido rejeitado',           !cnpj_.validate('00.000.000/0000-00'));

  const cnpjDin = gerarCnpjValido();
  ok(`CNPJ dinâmico ${cnpjDin} válido`,  cnpj_.validate(cnpjDin));
  ctx.cnpj = cnpjDin;

  const cpfDin = gerarCpfValido();
  ok(`CPF dinâmico ${cpfDin} válido`,    cpf_.validate(cpfDin));
  ctx.cpf = cpfDin;
}

function unitTemplate() {
  section('UNITÁRIOS — Template Engine');
  const tpl = require('../utils/templateEngine');
  const msg = tpl.render(
    'Olá {nome_cliente}! {servico} dia {data} às {hora}. Total: {valor}.',
    { nome_cliente:'João', servico:'Corte', data:'2025-03-15', hora:'14:00:00', valor:50 }
  );
  ok('Substituiu {nome_cliente}',  msg.includes('João'));
  ok('Substituiu {data}',          msg.includes('15/03/2025'));
  ok('Substituiu {hora}',          msg.includes('14:00'));
  ok('Substituiu {valor}',         msg.includes('R$'));
  ok('Sem placeholders restantes', !msg.includes('{'));
  ok('availableVars >= 8',         tpl.availableVars().length >= 8);
}

function unitCalendar() {
  section('UNITÁRIOS — Calendar Engine');
  const { ruleMatchesDate } = require('../utils/calendarEngine');
  const dom  = {tipo:'padrao', dia_semana:0, qnd_ocorre:null, mes:null, unico_dia:null, unico_mes:null, unico_ano:null, unico_repete_anual:0};
  const natal = {tipo:'unico', dia_semana:null, qnd_ocorre:null, mes:null, unico_dia:25, unico_mes:12, unico_ano:null, unico_repete_anual:1};
  const unico = {tipo:'unico', dia_semana:null, qnd_ocorre:null, mes:null, unico_dia:14, unico_mes:2,  unico_ano:2025, unico_repete_anual:0};
  const exc   = {tipo:'excecao', dia_semana:1, qnd_ocorre:1, mes:9, unico_dia:null, unico_mes:null, unico_ano:null, unico_repete_anual:0};

  ok('Dom bate 2025-04-20',              ruleMatchesDate(dom,   '2025-04-20'));
  ok('Dom não bate 2025-04-21',          !ruleMatchesDate(dom,  '2025-04-21'));
  ok('Natal bate 2025-12-25',            ruleMatchesDate(natal, '2025-12-25'));
  ok('Natal bate 2026-12-25 (anual)',    ruleMatchesDate(natal, '2026-12-25'));
  ok('Natal não bate 2025-12-24',        !ruleMatchesDate(natal,'2025-12-24'));
  ok('Único 14/02/2025 bate',            ruleMatchesDate(unico, '2025-02-14'));
  ok('Único 14/02/2025 não bate 2026',   !ruleMatchesDate(unico,'2026-02-14'));
  ok('1ª seg set 2025 bate',             ruleMatchesDate(exc,   '2025-09-01'));
  ok('2ª seg set 2025 não bate',         !ruleMatchesDate(exc,  '2025-09-08'));
}



async function testHealth() {
  section('HEALTH CHECK');
  const r = await api('GET','/health');
  ok('GET /health → 200', r.status===200, r.body);
  ok('status: ok',        r.body.status==='ok');
  ok('tem timestamp',     !!r.body.timestamp);
}

async function testAuth() {
  section('AUTH — Registro & Login');
  const ts = Date.now();

  
  const rE = await api('POST','/api/auth/register/empresa', {
    email:`e${ts}@t.com`, senha:'Senha@1234',
    cnpj: ctx.cnpj, razao_social:`Empresa ${ts}`, nome_fantasia:`Fantasia ${ts}`,
    telefone:'(11) 91234-5678', cep:'13330-000',
  });
  ok('register/empresa → 201', rE.status===201, rE.body);
  ctx.tE=rE.data?.tokens?.access; ctx.refE=rE.data?.tokens?.refresh; ctx.eId=rE.data?.user?.id;
  ok('Token empresa',   !!ctx.tE);
  ok('empresaId',       !!ctx.eId);

  ok('CNPJ inválido → 400',
    (await api('POST','/api/auth/register/empresa',{
      email:`bad${ts}@t.com`, senha:'Senha@1234',
      cnpj:'00.000.000/0000-00', razao_social:'X', nome_fantasia:'X',
    })).status===400);

  
  const rC = await api('POST','/api/auth/register/cliente',{
    nome:`Cliente ${ts}`, email:`c${ts}@t.com`, senha:'Senha@1234', cpf: ctx.cpf,
  });
  ok('register/cliente → 201', rC.status===201, rC.body);
  ctx.tC=rC.data?.tokens?.access; ctx.cId=rC.data?.user?.id;
  ok('Token cliente',  !!ctx.tC);
  ok('clienteId',      !!ctx.cId);

  ok('CPF inválido → 400',
    (await api('POST','/api/auth/register/cliente',{
      nome:'X', email:`bad2${ts}@t.com`, senha:'Senha@1234', cpf:'111.111.111-11',
    })).status===400);

  ok('Email dup → 400',
    (await api('POST','/api/auth/register/cliente',{
      nome:'Y', email:`c${ts}@t.com`, senha:'Senha@1234',
    })).status===400);

  const rL = await api('POST','/api/auth/login',{email:`e${ts}@t.com`, senha:'Senha@1234'});
  ok('login → 200',           rL.status===200);
  ok('login retorna tokens',  !!rL.data?.tokens?.access);
  ok('senha errada → 401',    (await api('POST','/api/auth/login',{email:`e${ts}@t.com`,senha:'x'})).status===401);

  const rR = await api('POST','/api/auth/refresh',{refresh_token:ctx.refE});
  ok('refresh → 200',          rR.status===200, rR.body);
  ok('refresh retorna access', !!rR.data?.tokens?.access);

  const rMe = await api('GET','/api/auth/me',null,ctx.tE);
  ok('GET /me empresa → 200', rMe.status===200);
  ok('me tem cnpj',           !!rMe.data?.cnpj);

  const rMeC = await api('GET','/api/auth/me',null,ctx.tC);
  ok('GET /me cliente → 200', rMeC.status===200);
  ok('me cliente tem score',  rMeC.data?.score!==undefined);
}

async function testEmpresaPerfil() {
  section('EMPRESA — Perfil & Dashboard');
  const rP = await api('PUT','/api/empresa/perfil',{
    descricao:'Barbearia top!', cidade:'Indaiatuba', estado:'SP',
    nicho:'beleza', sub_nicho:'barbearia', cor_primaria:'#1a1a2e',
  },ctx.tE);
  ok('PUT /empresa/perfil → 200', rP.status===200, rP.body);

  const rG = await api('GET','/api/empresa/perfil',null,ctx.tE);
  ok('Cidade salva', rG.data?.cidade==='Indaiatuba');
  ok('Nicho salvo',  rG.data?.nicho==='beleza');

  const rD = await api('GET','/api/empresa/dashboard',null,ctx.tE);
  ok('dashboard → 200',             rD.status===200, rD.body);
  ok('dashboard tem total_clientes', rD.data?.total_clientes!==undefined);
  ok('dashboard tem por_servico',    Array.isArray(rD.data?.por_servico));

  ok('cliente → empresa → 403',
    (await api('GET','/api/empresa/perfil',null,ctx.tC)).status===403);
}

async function testServicos() {
  section('SERVIÇOS — CRUD');
  const rS = await api('POST','/api/servicos',{
    nome:'Corte Teste', descricao:'Descrição', duracao_minutos:30, preco_base:45.00,
    aceitamento_automatico:true, max_por_horario:3, hora_inicio:'09:00', hora_fim:'18:00',
    horarios:[
      {dia_semana:1,hora_inicio:'09:00',hora_fim:'18:00'},
      {dia_semana:2,hora_inicio:'09:00',hora_fim:'18:00'},
      {dia_semana:3,hora_inicio:'09:00',hora_fim:'18:00'},
      {dia_semana:4,hora_inicio:'09:00',hora_fim:'18:00'},
      {dia_semana:5,hora_inicio:'09:00',hora_fim:'18:00'},
      {dia_semana:6,hora_inicio:'09:00',hora_fim:'14:00'},
    ],
  },ctx.tE);
  ok('POST /servicos → 201', rS.status===201, rS.body);
  ctx.sId=rS.data?.id;
  ok('servicoId',        !!ctx.sId);
  ok('horários salvos',  rS.data?.horarios?.length>0);

  ok('GET /servicos não vazio',
    (await api('GET','/api/servicos',null,ctx.tE)).data?.length>0);

  const rU = await api('PUT',`/api/servicos/${ctx.sId}`,{
    nome:'Corte Atualizado',duracao_minutos:45,preco_base:55,
    aceitamento_automatico:true,max_por_horario:2,
  },ctx.tE);
  ok('PUT /servicos/:id → 200', rU.status===200, rU.body);
  ok('Nome atualizado',          rU.data?.nome==='Corte Atualizado');

  ok('Dados faltando → 400',
    (await api('POST','/api/servicos',{nome:'X'},ctx.tE)).status===400);
}

async function testTags() {
  section('TAGS — CRUD');
  const rT = await api('POST','/api/tags',{
    nome:'tag_teste', label:'Tag Teste', cor:'#3498db', aceita_agendamento:true,
  },ctx.tE);
  ok('POST /tags → 201', rT.status===201, rT.body);
  ctx.tagId=rT.data?.id;
  ok('tagId', !!ctx.tagId);

  const rU = await api('PUT',`/api/tags/${ctx.tagId}`,{label:'Atualizada',cor:'#e74c3c'},ctx.tE);
  ok('PUT /tags/:id → 200', rU.status===200, rU.body);
  ok('Label atualizado',     rU.data?.label==='Atualizada');

  ok('Tag dup → 400',
    (await api('POST','/api/tags',{nome:'tag_teste',label:'Dup',cor:'#000',aceita_agendamento:true},ctx.tE)).status===400);
}

async function testRegras() {
  section('REGRAS DE CALENDÁRIO');
  await api('PUT',`/api/tags/${ctx.tagId}`,{aceita_agendamento:true},ctx.tE);

  const rR = await api('POST','/api/regras',{
    tag_id:ctx.tagId, tipo:'padrao', dia_semana:1, prioridade:5,
  },ctx.tE);
  ok('POST /regras → 201',   rR.status===201, rR.body);
  ctx.regId=rR.data?.id;
  ok('regraId',              !!ctx.regId);
  ok('Regra tem tag_nome',   !!rR.data?.tag_nome);

  const now = new Date();
  const rC  = await api('GET',`/api/regras/calendario?ano=${now.getFullYear()}&mes=${now.getMonth()+1}`,null,ctx.tE);
  ok('GET /regras/calendario → 200', rC.status===200, rC.body);
  ok('Calendário tem datas',          Object.keys(rC.data||{}).length>0);

  const tom = new Date(); tom.setDate(tom.getDate()+1);
  const rD  = await api('GET',`/api/regras/dia?data=${tom.toISOString().split('T')[0]}`,null,ctx.tE);
  ok('GET /regras/dia → 200',     rD.status===200, rD.body);
  ok('dia.aberto é boolean',      typeof rD.data?.aberto==='boolean');
  ok('dia.tags é array',          Array.isArray(rD.data?.tags));
}

async function testRegraNegocio() {
  section('REGRAS DE NEGÓCIO');
  const rV = await api('GET','/api/regras-negocio/template/vars',null,ctx.tE);
  ok('GET /template/vars → 200', rV.status===200, rV.body);
  ok('vars é array',              Array.isArray(rV.data) && rV.data.length>=8);

  const rN = await api('POST','/api/regras-negocio',{
    tipo:'notificacao', nome:'Lembrete 12h',
    antecedencia_horas:12,
    mensagem_template:'Olá {nome_cliente}! Agendamento às {hora}.',
    tipo_notificacao:'lembrete',
  },ctx.tE);
  ok('POST regra notif → 201', rN.status===201, rN.body);
  ctx.rnId=rN.data?.id;
  ok('rnId', !!ctx.rnId);

  const rPrev = await api('GET',`/api/regras-negocio/${ctx.rnId}/preview`,null,ctx.tE);
  ok('GET preview → 200',           rPrev.status===200, rPrev.body);
  ok('Preview sem {nome_cliente}',  !rPrev.data?.preview?.includes('{nome_cliente}'));

  ok('POST regra cancelamento → 201',
    (await api('POST','/api/regras-negocio',{
      tipo:'cancelamento', nome:'Taxa 24h', limite_horas:24, taxa_percentual:30,
      tipo_notificacao:'cancelamento',
    },ctx.tE)).status===201);

  const rL = await api('GET','/api/regras-negocio?tipo=notificacao',null,ctx.tE);
  ok('GET ?tipo=notificacao → 200',    rL.status===200, rL.body);
  ok('Filtro só notificações',         Array.isArray(rL.data) && rL.data.every(r=>r.tipo==='notificacao'));
}

async function testCapacidade() {
  section('CAPACIDADE DE HORÁRIO');
  const rC = await api('POST','/api/empresa/capacidades',{
    hora_inicio:'09:00',hora_fim:'12:00',max_agendamentos:4,
  },ctx.tE);
  ok('POST /capacidades → 200', rC.status===200, rC.body);

  const rL = await api('GET','/api/empresa/capacidades',null,ctx.tE);
  ok('GET /capacidades → 200', rL.status===200);
  ok('array',                   Array.isArray(rL.data));

  const capId = rL.data?.find(c=>c.hora_inicio==='09:00:00')?.id;
  if(capId) ok('DELETE /capacidades/:id → 200',
    (await api('DELETE',`/api/empresa/capacidades/${capId}`,null,ctx.tE)).status===200);
}

async function testPublico() {
  section('ROTAS PÚBLICAS');
  ok('GET /empresas/destaques → 200',
    (await api('GET','/api/empresas/destaques')).status===200);
  ok('GET /empresas/nichos → 200',
    (await api('GET','/api/empresas/nichos')).status===200);

  const rL = await api('GET','/api/empresas?limite=10&pagina=1');
  ok('GET /empresas → 200',    rL.status===200, rL.body);
  ok('Retorna array',           Array.isArray(rL.data));

  const rP = await api('GET',`/api/empresas/${ctx.eId}`);
  ok(`GET /empresas/${ctx.eId} → 200`, rP.status===200, rP.body);
  ok('perfil tem servicos',            Array.isArray(rP.data?.servicos));

  ok('empresa inexistente → 404',
    (await api('GET','/api/empresas/999999')).status===404);

  const now=new Date();
  const rCal=await api('GET',`/api/empresas/${ctx.eId}/calendario?ano=${now.getFullYear()}&mes=${now.getMonth()+1}`);
  ok('GET /empresas/:id/calendario → 200', rCal.status===200);
}

async function testSlots() {
  section('SLOTS DE DISPONIBILIDADE');
  
  const d=new Date(); d.setDate(d.getDate()+((1+7-d.getDay())%7||7));
  ctx.dataAg=d.toISOString().split('T')[0];

  const rSl=await api('GET',
    `/api/agendamentos/slots?empresa_id=${ctx.eId}&servico_id=${ctx.sId}&data=${ctx.dataAg}`,
    null,ctx.tC);
  ok('GET /slots → 200',          rSl.status===200, rSl.body);
  ok('slots.disponivel booleano', typeof rSl.data?.disponivel==='boolean');
  ok('slots.slots é array',       Array.isArray(rSl.data?.slots));
  ctx.slots=rSl.data?.slots||[];
  ctx.slotLivre=ctx.slots.find(s=>s.disponivel);
  ok('Há slot disponível',        !!ctx.slotLivre,
    `${ctx.slots.length} slots, data: ${ctx.dataAg}`);
}

async function testAgendamento() {
  section('AGENDAMENTOS — Fluxo Completo');
  if(!ctx.slotLivre){
    console.log('  ⚠️  Sem slot disponível — sub-testes pulados.');
    return;
  }

  
  const rAg=await api('POST','/api/agendamentos',{
    servico_id:ctx.sId, empresa_id:ctx.eId,
    data_agendamento:ctx.dataAg,
    hora_inicio:ctx.slotLivre.hora_inicio,
    notas:'Teste automatizado',
  },ctx.tC);
  ok('POST /agendamentos → 201',      rAg.status===201, rAg.body);
  ctx.agId=rAg.data?.id;
  ok('agendamentoId',                 !!ctx.agId);
  ok('status=confirmado (auto)',      rAg.data?.status_agendamento==='confirmado');
  ok('empresa_id correto',            Number(rAg.data?.empresa_id)===Number(ctx.eId));

  ok('Duplo mesmo horário → 409',
    (await api('POST','/api/agendamentos',{
      servico_id:ctx.sId, empresa_id:ctx.eId,
      data_agendamento:ctx.dataAg, hora_inicio:ctx.slotLivre.hora_inicio,
    },ctx.tC)).status===409);

  
  const rLE=await api('GET','/api/agendamentos/empresa',null,ctx.tE);
  ok('lista empresa → 200',  rLE.status===200);
  ok('empresa vê ag.',       rLE.data?.some(a=>a.id===ctx.agId));

  const rLC=await api('GET','/api/agendamentos/cliente',null,ctx.tC);
  ok('lista cliente → 200',  rLC.status===200);
  ok('cliente vê ag.',       rLC.data?.some(a=>a.id===ctx.agId));

  
  const rGt=await api('GET',`/api/agendamentos/${ctx.agId}`,null,ctx.tC);
  ok('GET /agendamentos/:id → 200', rGt.status===200);
  ok('detalhe tem cliente_score',    rGt.data?.cliente_score!==undefined);

  
  
  const rConc=await api('PUT',`/api/agendamentos/${ctx.agId}/concluir`,null,ctx.tE);
  ok('PUT /concluir → 200',    rConc.status===200, rConc.body);
  ok('status=concluido',       rConc.data?.status_agendamento==='concluido');

  
  const rSM=await api('POST','/api/servicos',{
    nome:'Serviço Manual', duracao_minutos:30, preco_base:60,
    aceitamento_automatico:false, max_por_horario:1,
    horarios:[{dia_semana:null,hora_inicio:'09:00',hora_fim:'18:00'}],
  },ctx.tE);
  ok('Serviço manual criado', rSM.status===201);
  ctx.sManId=rSM.data?.id;

  if(ctx.sManId){
    const slotsManual=await api('GET',`/api/agendamentos/slots?empresa_id=${ctx.eId}&servico_id=${ctx.sManId}&data=${ctx.dataAg}`,null,ctx.tC);
    const slotAlt=slotsManual.data?.slots?.find(s=>s.disponivel);
    if(slotAlt){
      const rPend=await api('POST','/api/agendamentos',{
        servico_id:ctx.sManId, empresa_id:ctx.eId,
        data_agendamento:ctx.dataAg, hora_inicio:slotAlt.hora_inicio,
      },ctx.tC);
      ok('Ag pendente → 201',      rPend.status===201, rPend.body);
      ok('status=pendente',        rPend.data?.status_agendamento==='pendente');
      ctx.agPendId=rPend.data?.id;

      if(ctx.agPendId){
        const rAceit=await api('PUT',`/api/agendamentos/${ctx.agPendId}/aceitar`,null,ctx.tE);
        ok('PUT /aceitar → 200',         rAceit.status===200, rAceit.body);
        ok('status=confirmado (aceite)',  rAceit.data?.status_agendamento==='confirmado');
      }
    }
  }

  
  const slotsCancel=await api('GET',`/api/agendamentos/slots?empresa_id=${ctx.eId}&servico_id=${ctx.sId}&data=${ctx.dataAg}`,null,ctx.tC);
  const slotC=slotsCancel.data?.slots?.find(s=>s.disponivel);
  if(slotC){
    const rCrC=await api('POST','/api/agendamentos',{
      servico_id:ctx.sId, empresa_id:ctx.eId,
      data_agendamento:ctx.dataAg, hora_inicio:slotC.hora_inicio,
    },ctx.tC);
    if(rCrC.data?.id){
      const rCan=await api('PUT',`/api/agendamentos/${rCrC.data.id}/cancelar`,
        {motivo:'Teste de cancelamento'},ctx.tC);
      ok('PUT /cancelar → 200',  rCan.status===200, rCan.body);
      ok('status=cancelado',     rCan.data?.agendamento?.status_agendamento==='cancelado');
    }
  }

  
  const rSc=await api('GET','/api/cliente/score',null,ctx.tC);
  ok('GET /cliente/score → 200', rSc.status===200);
  ok('log tem variação +1',      rSc.data?.some(l=>parseFloat(l.variacao)>0));
}

async function testAvaliacao() {
  section('AVALIAÇÕES');
  if(!ctx.agId){ console.log('  ⚠️  Sem agendamento — pulando.'); return; }

  const rAv=await api('POST',`/api/avaliacoes/agendamento/${ctx.agId}`,
    {estrelas:5,feedback:'Excelente!'},ctx.tC);
  ok('POST avaliação → 201',   rAv.status===201, rAv.body);
  ctx.avalId=rAv.data?.id;
  ok('avaliacaoId',             !!ctx.avalId);

  ok('Avaliação dup → 409',
    (await api('POST',`/api/avaliacoes/agendamento/${ctx.agId}`,{estrelas:3},ctx.tC)).status===409);

  const rL=await api('GET','/api/avaliacoes',null,ctx.tE);
  ok('GET /avaliacoes → 200',    rL.status===200);
  ok('lista tem avaliação',      rL.data?.some(a=>a.id===ctx.avalId));

  const rSt=await api('GET','/api/avaliacoes/stats',null,ctx.tE);
  ok('GET /avaliacoes/stats → 200', rSt.status===200);
  ok('stats.media existe',          rSt.data?.media!==undefined);
  ok('stats.total >= 1',            Number(rSt.data?.total)>=1);

  if(ctx.avalId){
    const rRsp=await api('PUT',`/api/avaliacoes/${ctx.avalId}`,
      {resposta:'Obrigado! Até logo 😊'},ctx.tE);
    ok('PUT avaliação resposta → 200', rRsp.status===200, rRsp.body);
    ok('resposta salva',               !!rRsp.data?.resposta_empresa);
  }
}

async function testMensagem() {
  section('MENSAGENS & CHAT');

  
  const rM=await api('POST',`/api/mensagens/conversas/${ctx.cId}`,
    {mensagem:'Lembrando do agendamento!',tipo:'lembrete'},ctx.tE);
  ok('POST mensagens/conversas/:id → 201', rM.status===201, rM.body);

  const rCv=await api('GET','/api/mensagens/conversas',null,ctx.tE);
  ok('GET conversas → 200',        rCv.status===200);
  ok('lista é array',               Array.isArray(rCv.data));
  ok('conversa com cliente',        rCv.data?.some(c=>Number(c.cliente_id)===Number(ctx.cId)));

  const rHist=await api('GET',`/api/mensagens/conversas/${ctx.cId}`,null,ctx.tE);
  ok('GET conversas/:id → 200',    rHist.status===200, rHist.body);
  ok('histórico tem mensagens',     rHist.data?.length>0);

  
  const rMC=await api('POST',`/api/mensagens/empresa/${ctx.eId}`,
    {mensagem:'Confirmado!'},ctx.tC);
  ok('POST mensagens/empresa/:id → 201', rMC.status===201, rMC.body);

  
  const rCfg=await api('PUT','/api/mensagens/chat-config',
    {mensagem_abertura:'Olá! Como posso ajudar?',ativo:true},ctx.tE);
  ok('PUT chat-config → 200', rCfg.status===200, rCfg.body);

  const rFaq=await api('POST','/api/mensagens/chat-config/faq',
    {pergunta:'Horário?',resposta:'9h-18h',ordem:1},ctx.tE);
  ok('POST faq → 201', rFaq.status===201, rFaq.body);
  const faqId=rFaq.data?.id;
  if(faqId) ok('DELETE faq/:id → 200',
    (await api('DELETE',`/api/mensagens/chat-config/faq/${faqId}`,null,ctx.tE)).status===200);

  ok('GET faq público → 200',
    (await api('GET',`/api/mensagens/publico/${ctx.eId}/faq`)).status===200);
}

async function testCliente() {
  section('CLIENTE — Perfil, Docs, Cartões, Calendário');

  const rPf=await api('GET','/api/cliente/perfil',null,ctx.tC);
  ok('GET /cliente/perfil → 200', rPf.status===200, rPf.body);
  ok('perfil tem score',           rPf.data?.score!==undefined);

  const rUp=await api('PUT','/api/cliente/perfil',
    {nome:'Cliente Atualizado',telefone:'(11) 91234-5678'},ctx.tC);
  ok('PUT /cliente/perfil → 200', rUp.status===200, rUp.body);

  const rPf2=await api('GET','/api/cliente/perfil',null,ctx.tC);
  ok('Nome atualizado', rPf2.data?.nome==='Cliente Atualizado');

  const rDoc=await api('POST','/api/cliente/documentos',
    {tipo:'rg',arquivo_url:'/uploads/rg_fake.pdf'},ctx.tC);
  ok('POST documentos → 201', rDoc.status===201, rDoc.body);
  ok('status=pendente',        rDoc.data?.status==='pendente');

  ok('GET documentos → 200',
    (await api('GET','/api/cliente/documentos',null,ctx.tC)).status===200);

  const rCart=await api('POST','/api/cliente/cartoes',{
    token_referencia:'tok_test_xyz',ultimos_quatro:'4242',
    bandeira:'Visa',titular:'TESTE',principal:true,
  },ctx.tC);
  ok('POST cartoes → 201', rCart.status===201, rCart.body);
  const cartId=rCart.data?.id;

  ok('GET cartoes → 200',
    (await api('GET','/api/cliente/cartoes',null,ctx.tC)).status===200);

  if(cartId) ok('DELETE cartoes/:id → 200',
    (await api('DELETE',`/api/cliente/cartoes/${cartId}`,null,ctx.tC)).status===200);

  const rCal=await api('GET','/api/cliente/calendario',null,ctx.tC);
  ok('GET /cliente/calendario → 200', rCal.status===200);
  ok('calendário é array',             Array.isArray(rCal.data));
}

async function testSeguranca() {
  section('SEGURANÇA — JWT & Autorização');
  ok('Sem token → 401',
    (await api('GET','/api/empresa/perfil')).status===401);
  ok('Token inválido → 401',
    (await api('GET','/api/empresa/perfil',null,'tok.invalido')).status===401);
  ok('Cliente → empresa/dashboard → 403',
    (await api('GET','/api/empresa/dashboard',null,ctx.tC)).status===403);
  ok('Empresa → cliente/perfil → 403',
    (await api('GET','/api/cliente/perfil',null,ctx.tE)).status===403);
  ok('Rota inexistente → 404',
    (await api('GET','/api/nao_existe')).status===404);
}

async function testSoftDelete() {
  section('SOFT DELETE — Serviço');
  if(!ctx.sId) return;
  const rDel=await api('DELETE',`/api/servicos/${ctx.sId}`,null,ctx.tE);
  ok('DELETE /servicos/:id → 200', rDel.status===200, rDel.body);

  const rGet=await api('GET',`/api/servicos/${ctx.sId}`,null,ctx.tE);
  ok('Deletado não aparece ativo',
    rGet.status===404 || rGet.data?.ativo===false || rGet.data===null);
}



async function run() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║      AGENDAMENTO BACKEND — SUITE DE TESTES COMPLETA      ║');
  console.log(`╚══════════════════════════════════════════════════════════╝`);
  console.log(`  Base URL : ${BASE}\n`);

  
  for(let i=0;i<20;i++){
    try { await fetch(`${BASE}/health`); break; }
    catch { if(i===0) process.stdout.write('  Aguardando servidor'); process.stdout.write('.'); await wait(1000); }
  }
  console.log();

  
  unitCpfCnpj();
  unitTemplate();
  unitCalendar();

  
  await testHealth();
  await testAuth();
  await testEmpresaPerfil();
  await testServicos();
  await testTags();
  await testRegras();
  await testRegraNegocio();
  await testCapacidade();
  await testPublico();
  await testSlots();
  await testAgendamento();
  await testAvaliacao();
  await testMensagem();
  await testCliente();
  await testSeguranca();
  await testSoftDelete();

  const total=passed+failed;
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(('║  RESULTADO: '+passed+'/'+total+' testes passaram').padEnd(60)+'║');
  if(failed>0) console.log(('║  ❌ '+failed+' FALHA(S)').padEnd(60)+'║');
  else         console.log('║  🎉 TODOS OS TESTES PASSARAM!                            ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  process.exit(failed>0?1:0);
}

run().catch(e=>{console.error('\n💥',e.message);process.exit(1);});
