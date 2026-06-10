<?php if(!isset($root)) include __DIR__.'/init.php'; ?>

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
