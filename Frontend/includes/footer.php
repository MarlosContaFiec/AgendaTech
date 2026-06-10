<?php if(!isset($root)) include __DIR__.'/init.php'; ?>

    </div>
  </div>
</div>

<!-- MODAL ACESSIBILIDADE -->
<div class="acc-overlay" id="acc-overlay">
  <div class="acc-modal">
    <div class="acc-header">
      <h2>⚙️ Configurações de Acessibilidade</h2>
      <button class="acc-close" onclick="closeAcessibilidade()">&times;</button>
    </div>
    <div class="acc-body">
      <div class="acc-section">
        <div class="acc-section-title">🎨 Aparência</div>
        <div class="acc-row">
          <div class="acc-label">
            <span class="acc-icon">🌙</span>
            <span class="acc-text">Modo Escuro</span>
          </div>
          <button class="tog on" id="acc-dark" onclick="toggleDark()"></button>
        </div>
        <div class="acc-row">
          <div class="acc-label">
            <span class="acc-icon">🔲</span>
            <span class="acc-text">Contraste Alto</span>
          </div>
          <button class="tog" id="acc-contrast" onclick="toggleContrast()"></button>
        </div>
      </div>

      <div class="acc-section">
        <div class="acc-section-title">📝 Texto</div>
        <div class="acc-slider-row">
          <div class="acc-slider-label">
            <span>🔤 Tamanho do Texto</span>
            <span class="acc-val" id="acc-font-val">16px</span>
          </div>
          <input type="range" class="acc-slider" id="acc-font" min="12" max="22" value="16" oninput="applyFont(this.value)">
        </div>
        <div class="acc-slider-row">
          <div class="acc-slider-label">
            <span>↔️ Espaço entre Palavras</span>
            <span class="acc-val" id="acc-word-val">0px</span>
          </div>
          <input type="range" class="acc-slider" id="acc-word" min="0" max="8" value="0" oninput="applyWordSpacing(this.value)">
        </div>
        <div class="acc-slider-row">
          <div class="acc-slider-label">
            <span>↕️ Espaço entre Linhas</span>
            <span class="acc-val" id="acc-line-val">1.5</span>
          </div>
          <input type="range" class="acc-slider" id="acc-line" min="12" max="28" value="15" step="1" oninput="applyLineHeight(this.value)">
        </div>
      </div>

      <div class="acc-section">
        <div class="acc-section-title">🖱️ Interação</div>
        <div class="acc-row">
          <div class="acc-label">
            <span class="acc-icon">👆</span>
            <span class="acc-text">Cursor Grande</span>
          </div>
          <button class="tog" id="acc-cursor" onclick="toggleCursor()"></button>
        </div>
        <div class="acc-row">
          <div class="acc-label">
            <span class="acc-icon">🚫</span>
            <span class="acc-text">Reduzir Animações</span>
          </div>
          <button class="tog" id="acc-motion" onclick="toggleMotion()"></button>
        </div>
      </div>

      <div class="acc-section">
        <div class="acc-section-title">🎨 Cores</div>
        <div class="acc-slider-row">
          <div class="acc-slider-label">
            <span>💧 Saturação</span>
            <span class="acc-val" id="acc-sat-val">100%</span>
          </div>
          <input type="range" class="acc-slider" id="acc-sat" min="0" max="100" value="100" oninput="applySaturation(this.value)">
        </div>
      </div>
    </div>
    <div class="acc-footer">
      <button class="btn btn-d" onclick="resetAcessibilidade()">Redefinir Padrão</button>
      <button class="btn btn-p" onclick="closeAcessibilidade()">Aplicar e Fechar</button>
    </div>
  </div>
</div>

<script src="<?= $root ?>assets/js/app.js"></script>
<script src="<?= $root ?>assets/js/chatbot.js"></script>

<script>
(function(){
  const ACC_KEY = 'trustbook_acc';
  function getAcc(){try{const d=localStorage.getItem(ACC_KEY);return d?JSON.parse(d):{}}catch{return{}}}
  function saveAcc(d){try{localStorage.setItem(ACC_KEY,JSON.stringify(d))}catch{}}
  window.openAcessibilidade=function(){document.getElementById('acc-overlay').classList.add('show');document.body.style.overflow='hidden'};
  window.closeAcessibilidade=function(){document.getElementById('acc-overlay').classList.remove('show');document.body.style.overflow=''};
  document.getElementById('acc-overlay').addEventListener('click',function(e){if(e.target===this)closeAcessibilidade()});
  function setToggle(id,on){const btn=document.getElementById(id);if(btn)btn.classList.toggle('on',on)}
  window.toggleDark=function(){const a=getAcc();a.dark=!a.dark;saveAcc(a);applyAcc()};
  window.toggleContrast=function(){const a=getAcc();a.contrast=!a.contrast;saveAcc(a);applyAcc()};
  window.toggleCursor=function(){const a=getAcc();a.bigCursor=!a.bigCursor;saveAcc(a);applyAcc()};
  window.toggleMotion=function(){const a=getAcc();a.reduceMotion=!a.reduceMotion;saveAcc(a);applyAcc()};
  window.applyFont=function(v){const a=getAcc();a.fontSize=parseInt(v);saveAcc(a);applyAcc()};
  window.applyWordSpacing=function(v){const a=getAcc();a.wordSpacing=parseInt(v);saveAcc(a);applyAcc()};
  window.applyLineHeight=function(v){const a=getAcc();a.lineHeight=parseInt(v)/10;saveAcc(a);applyAcc()};
  window.applySaturation=function(v){const a=getAcc();a.saturation=parseInt(v);saveAcc(a);applyAcc()};
  window.resetAcessibilidade=function(){
    localStorage.removeItem(ACC_KEY);
    document.body.classList.remove('light-mode','high-contrast','big-cursor','reduce-motion');
    document.body.style.fontSize='';document.body.style.wordSpacing='';document.body.style.lineHeight='';document.body.style.filter='';
    document.getElementById('acc-font').value=16;document.getElementById('acc-word').value=0;document.getElementById('acc-line').value=15;document.getElementById('acc-sat').value=100;
    document.getElementById('acc-font-val').textContent='16px';document.getElementById('acc-word-val').textContent='0px';document.getElementById('acc-line-val').textContent='1.5';document.getElementById('acc-sat-val').textContent='100%';
    setToggle('acc-dark',true);setToggle('acc-contrast',false);setToggle('acc-cursor',false);setToggle('acc-motion',false);
    showToast('Configurações redefinidas.','i');
  };
  function applyAcc(){
    const a=getAcc();
    const isDark=a.dark!==false;
    document.body.classList.toggle('light-mode',!isDark);setToggle('acc-dark',isDark);
    document.body.classList.toggle('high-contrast',!!a.contrast);setToggle('acc-contrast',!!a.contrast);
    document.body.classList.toggle('big-cursor',!!a.bigCursor);setToggle('acc-cursor',!!a.bigCursor);
    document.body.classList.toggle('reduce-motion',!!a.reduceMotion);setToggle('acc-motion',!!a.reduceMotion);
    const fs=a.fontSize||16;document.body.style.fontSize=fs+'px';document.getElementById('acc-font').value=fs;document.getElementById('acc-font-val').textContent=fs+'px';
    const ws=a.wordSpacing||0;document.body.style.wordSpacing=ws+'px';document.getElementById('acc-word').value=ws;document.getElementById('acc-word-val').textContent=ws+'px';
    const lh=a.lineHeight||1.5;document.body.style.lineHeight=lh;document.getElementById('acc-line').value=Math.round(lh*10);document.getElementById('acc-line-val').textContent=lh.toFixed(1);
    const sat=a.saturation!=null?a.saturation:100;document.body.style.filter='saturate('+sat/100+')';document.getElementById('acc-sat').value=sat;document.getElementById('acc-sat-val').textContent=sat+'%';
  }
  applyAcc();
})();
</script>

</body>
</html>
