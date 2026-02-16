
(function(){
  const qs = new URLSearchParams(window.location.search);
  const total = Number(document.body.dataset.total || "1");
  const idx = Number(document.body.dataset.index || "1");
  const prog = document.querySelector('.progress > div');
  if(prog){ prog.style.width = ((idx-1)/(total-1 || 1))*100 + '%'; }

  // Keyboard navigation
  document.addEventListener('keydown', (e)=>{
    const prev = document.querySelector('[data-nav="prev"]');
    const next = document.querySelector('[data-nav="next"]');
    const start = document.querySelector('[data-nav="start"]');
    if(e.key === 'ArrowLeft' && prev && !prev.hasAttribute('aria-disabled')) window.location = prev.getAttribute('href');
    if(e.key === 'ArrowRight' && next && !next.hasAttribute('aria-disabled')) window.location = next.getAttribute('href');
    if(e.key === 'Home' && start) window.location = start.getAttribute('href');
    if(e.key === 'f' || e.key === 'F'){ toggleFullscreen(); }
  });

  // Fullscreen
  function toggleFullscreen(){
    const el = document.querySelector('.deck') || document.documentElement;
    if(!document.fullscreenElement){
      (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen).call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen).call(document);
    }
  }
  window.toggleFullscreen = toggleFullscreen;

  const fsBtn = document.getElementById('fsBtn');
  if(fsBtn){ fsBtn.addEventListener('click', toggleFullscreen); }

  // Update fs button label when state changes
  function onFsChange(){
    const inFs = !!document.fullscreenElement;
    if(fsBtn){ fsBtn.textContent = inFs ? "⤢ Exit Fullscreen" : "⤢ Fullscreen"; }
  }
  document.addEventListener('fullscreenchange', onFsChange);
})();


// ---- LUX UPGRADES ----
(function(){
  const total = Number(document.body.dataset.total || "1");
  const idx = Number(document.body.dataset.index || "1");
  const deck = document.querySelector('.deck');
  const next = document.querySelector('[data-nav="next"]');
  const prev = document.querySelector('[data-nav="prev"]');
  const start = document.querySelector('[data-nav="start"]');

  // Fade-out transition when navigating
  function go(href){
    if(!href || href === "#") return;
    if(deck){
      deck.style.animation = "none";
      deck.style.transition = "opacity .18s ease, transform .18s ease";
      deck.style.opacity = "0";
      deck.style.transform = "translateY(-6px)";
      setTimeout(()=>{ window.location = href; }, 160);
    }else{
      window.location = href;
    }
  }

  // Override click navigation for smoothness
  [next, prev, start].forEach(el=>{
    if(!el) return;
    el.addEventListener('click', (e)=>{
      const href = el.getAttribute('href');
      if(href && href !== "#"){
        e.preventDefault();
        go(href);
      }
    });
  });

  // Autoplay (toggle with A) – advances every 12s by default
  let autoplay = false;
  let timer = null;
  const intervalMs = 12000;

  function setAutoplay(on){
    autoplay = on;
    const btn = document.getElementById('autoBtn');
    if(btn) btn.textContent = autoplay ? "⏸ Autoplay" : "▶ Autoplay";
    if(timer){ clearInterval(timer); timer = null; }
    if(autoplay){
      timer = setInterval(()=>{
        if(next && !next.hasAttribute('aria-disabled')) go(next.getAttribute('href'));
      }, intervalMs);
    }
  }

  const autoBtn = document.getElementById('autoBtn');
  if(autoBtn){
    autoBtn.addEventListener('click', ()=> setAutoplay(!autoplay));
  }

  // Keyboard shortcuts: F fullscreen, A autoplay
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'a' || e.key === 'A'){ setAutoplay(!autoplay); }
  });

  // HUD
  const hud = document.getElementById('hud');
  if(hud){
    hud.textContent = `Slide ${idx} / ${total} • ← → • Home • F fullscreen • A autoplay`;
  }
})();
