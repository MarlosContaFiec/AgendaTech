(function(){
  var R={"como funciona":"O TrustBook é plataforma de agendamento. Explore serviços, inscreva-se e gerencie pelo calendário!","preços":"Eventos pagos exibem valor nos detalhes. Muitos são gratuitos!","cancelar":"Acesse Meus Agendamentos e clique em Cancelar.","fila":"Quando lotado, entre na fila. Se alguém cancelar, você recebe notificação.","calendário":"Acesse a aba Calendário no menu.","eventos":"Salões, clínicas, academias, spas, restaurantes.","inscrição":"Clique em Inscrever-se no evento.","perfil":"Edite em Perfil no menu lateral."};
  var S=["olá","oi","ola","hey","hello","bom dia","boa tarde","boa noite"];
  function norm(t){return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim()}
  function resp(m){var n=norm(m);for(var i=0;i<S.length;i++)if(n.includes(S[i]))return"Olá! 👋 Bem-vindo ao TrustBook!\n\n• Explorar eventos\n• Reservas\n• Fila de espera\n• Cancelamentos\n\nO que deseja saber?";for(var k in R)if(n.includes(norm(k)))return R[k];return"Não entendi. Pergunte sobre: eventos, preços, fila, cancelamento ou calendário."}

  var isOpen=false;

  var fab=document.createElement('button');
  fab.style.cssText='position:fixed;bottom:28px;right:28px;z-index:99999;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#5b6cff,#8b5cf6);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(91,108,255,.4);transition:transform .2s';
  fab.innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  fab.onmouseenter=function(){fab.style.transform='scale(1.1)'};
  fab.onmouseleave=function(){fab.style.transform='scale(1)'};
  document.body.appendChild(fab);

  var win=document.createElement('div');
  var bg=getComputedStyle(document.documentElement).getPropertyValue('--bg2').trim()||'#13161e';
  var brd=getComputedStyle(document.documentElement).getPropertyValue('--brd').trim()||'#2a2f42';
  var t1=getComputedStyle(document.documentElement).getPropertyValue('--t1').trim()||'#e8eaf2';
  var t2=getComputedStyle(document.documentElement).getPropertyValue('--t2').trim()||'#a0a4ba';
  var t3=getComputedStyle(document.documentElement).getPropertyValue('--t3').trim()||'#7c819a';
  var t4=getComputedStyle(document.documentElement).getPropertyValue('--t4').trim()||'#3d4259';
  var ac=getComputedStyle(document.documentElement).getPropertyValue('--ac').trim()||'#5b6cff';
  var bg3=getComputedStyle(document.documentElement).getPropertyValue('--bg3').trim()||'#1a1e29';
  var ok=getComputedStyle(document.documentElement).getPropertyValue('--ok').trim()||'#22c55e';
  var acg=getComputedStyle(document.documentElement).getPropertyValue('--acg').trim()||'rgba(91,108,255,0.1)';

  win.style.cssText='display:none;position:fixed;bottom:96px;right:28px;z-index:99998;width:380px;max-width:calc(100vw - 56px);background:'+bg+';border:1px solid '+brd+';border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.5);flex-direction:column;max-height:min(520px,calc(100vh - 140px))';

  var now=new Date();
  var timeStr=now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');

  win.innerHTML=
    '<div style="padding:16px 20px;border-bottom:1px solid '+brd+';display:flex;align-items:center;justify-content:space-between;flex-shrink:0">'+
      '<div style="display:flex;align-items:center;gap:12px">'+
        '<div style="width:38px;height:38px;border-radius:12px;background:'+acg+';border:1px solid rgba(91,108,255,.25);display:flex;align-items:center;justify-content:center;font-size:18px">💬</div>'+
        '<div>'+
          '<div style="font-size:14px;font-weight:700;color:'+t1+'">Assistente Virtual</div>'+
          '<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:'+t3+'"><span style="width:6px;height:6px;border-radius:50%;background:'+ok+';display:inline-block"></span>Online agora</div>'+
        '</div>'+
      '</div>'+
      '<button id="chatbot-close-btn" style="background:none;border:none;color:'+t3+';cursor:pointer;padding:4px;font-size:18px">✕</button>'+
    '</div>'+
    '<div id="chatbot-msgs" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;min-height:200px">'+
      '<div style="display:flex;justify-content:flex-start"><div>'+
        '<div style="max-width:85%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.5;background:rgba(255,255,255,.04);border:1px solid '+brd+';color:'+t2+';border-bottom-left-radius:6px">Olá! Sou o assistente do <strong style="color:'+t1+'">TrustBook</strong>. Como posso te ajudar?</div>'+
        '<div style="font-size:10px;margin-top:6px;color:'+t4+'">'+timeStr+'</div>'+
      '</div></div>'+
    '</div>'+
    '<div style="padding:0 16px 8px;flex-shrink:0">'+
      '<div style="font-size:10px;color:'+t3+';text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Perguntas frequentes</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">'+
        '<button class="chatbot-qb" data-t="Como funciona o site?" style="background:rgba(255,255,255,.03);border:1px solid '+brd+';border-radius:12px;padding:8px 12px;text-align:left;display:flex;align-items:center;gap:8px;cursor:pointer;font-family:inherit;color:'+t2+';font-size:12px">🔍 Como funciona?</button>'+
        '<button class="chatbot-qb" data-t="Quais são os preços?" style="background:rgba(255,255,255,.03);border:1px solid '+brd+';border-radius:12px;padding:8px 12px;text-align:left;display:flex;align-items:center;gap:8px;cursor:pointer;font-family:inherit;color:'+t2+';font-size:12px">💰 Preços</button>'+
        '<button class="chatbot-qb" data-t="Como cancelar inscrição?" style="background:rgba(255,255,255,.03);border:1px solid '+brd+';border-radius:12px;padding:8px 12px;text-align:left;display:flex;align-items:center;gap:8px;cursor:pointer;font-family:inherit;color:'+t2+';font-size:12px">📬 Cancelar</button>'+
        '<button class="chatbot-qb" data-t="Como entrar na fila?" style="background:rgba(255,255,255,.03);border:1px solid '+brd+';border-radius:12px;padding:8px 12px;text-align:left;display:flex;align-items:center;gap:8px;cursor:pointer;font-family:inherit;color:'+t2+';font-size:12px">⏳ Fila</button>'+
      '</div>'+
    '</div>'+
    '<div style="padding:12px 16px;border-top:1px solid #1e2130;display:flex;gap:8px;align-items:flex-end;flex-shrink:0">'+
      '<input type="text" id="chatbot-input" placeholder="Digite sua mensagem..." style="flex:1;background:'+bg3+';border:1px solid '+brd+';border-radius:12px;padding:10px 14px;font-size:14px;color:'+t1+';outline:none;font-family:inherit">'+
      '<button id="chatbot-send-btn" style="width:40px;height:40px;border-radius:12px;background:'+ac+';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'+
      '</button>'+
    '</div>'+
    '<div style="text-align:center;padding:0 16px 10px;font-size:11px;color:'+t4+';flex-shrink:0">Respostas em segundos · <span style="color:'+ac+'">TrustBook</span></div>';

  document.body.appendChild(win);

  fab.onclick=function(){
    isOpen=!isOpen;
    win.style.display=isOpen?'flex':'none';
    if(isOpen)document.getElementById('chatbot-input').focus();
  };

  document.getElementById('chatbot-close-btn').onclick=function(){
    isOpen=false;
    win.style.display='none';
  };

  function addMsg(t,f){
    var msgs=document.getElementById('chatbot-msgs');
    var d=document.createElement('div');
    d.style.cssText='display:flex;justify-content:'+(f==='user'?'flex-end':'flex-start');
    var tm=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    var fmt=t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
    var bgm=f==='user'?ac:'rgba(255,255,255,.04)';
    var brdm=f==='user'?'none':'1px solid '+brd;
    var clrm=f==='user'?'#fff':t2;
    var rbrm=f==='user'?'border-bottom-right-radius:6px':'border-bottom-left-radius:6px';
    d.innerHTML='<div><div style="max-width:85%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.5;background:'+bgm+';border:'+brdm+';color:'+clrm+';'+rbrm+'">'+fmt+'</div><div style="font-size:10px;margin-top:6px;color:'+(f==='user'?'rgba(255,255,255,.5)':t4)+';text-align:'+(f==='user'?'right':'left')+'">'+tm+'</div></div>';
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
  }

  function addTyping(){
    var msgs=document.getElementById('chatbot-msgs');
    var d=document.createElement('div');
    d.id='chatbot-typing';
    d.style.cssText='display:flex;justify-content:flex-start';
    d.innerHTML='<div style="display:flex;gap:6px;padding:12px 16px;background:rgba(255,255,255,.04);border:1px solid '+brd+';border-radius:16px;border-bottom-left-radius:6px;width:fit-content">'+
      '<div style="width:8px;height:8px;border-radius:50%;background:'+ac+';animation:chatbot-bounce 1.4s infinite"></div>'+
      '<div style="width:8px;height:8px;border-radius:50%;background:'+ac+';animation:chatbot-bounce 1.4s infinite .15s"></div>'+
      '<div style="width:8px;height:8px;border-radius:50%;background:'+ac+';animation:chatbot-bounce 1.4s infinite .3s"></div>'+
    '</div>';
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
  }

  function removeTyping(){var t=document.getElementById('chatbot-typing');if(t)t.remove()}

  function sendMsg(text){
    var input=document.getElementById('chatbot-input');
    var m=text||input.value.trim();
    if(!m)return;
    input.value='';
    addMsg(m,'user');
    addTyping();
    setTimeout(function(){removeTyping();addMsg(resp(m),'bot')},500+Math.random()*700);
  }

  document.getElementById('chatbot-send-btn').onclick=function(){sendMsg()};
  document.getElementById('chatbot-input').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();sendMsg()}};
  var qbs=document.querySelectorAll('.chatbot-qb');
  for(var i=0;i<qbs.length;i++){qbs[i].onclick=function(){sendMsg(this.dataset.t)}}

  var style=document.createElement('style');
  style.textContent='@keyframes chatbot-bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}';
  document.head.appendChild(style);
})();
