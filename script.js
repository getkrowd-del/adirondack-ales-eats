(function(){try{
  var slug="lp-moh4fo3s-gnxcl";
  var SK='lp_access_'+slug;
  var map={access_token:'lp_pw_',allowlist_access_token:'lp_al_',pin_access_token:'lp_pin_',paywall_access_token:'lp_paid_'};
  var u=new URL(location.href);var found=null;var changed=false;
  Object.keys(map).forEach(function(p){var v=u.searchParams.get(p);if(v){found=v;try{localStorage.setItem(map[p]+slug,v);}catch(e){}u.searchParams.delete(p);changed=true;}});
  if(found){try{sessionStorage.setItem(SK,found);}catch(e){}}
  else{try{if(!sessionStorage.getItem(SK)){var t=localStorage.getItem('lp_pw_'+slug)||localStorage.getItem('lp_al_'+slug)||localStorage.getItem('lp_pin_'+slug)||localStorage.getItem('lp_paid_'+slug);if(t)sessionStorage.setItem(SK,t);}}catch(e){}}
  if(changed){try{history.replaceState(null,'',u.toString());}catch(e){}}

  // Auto-attach gate token to:
  //   1. sheet-rows writes (PATCH/POST/PUT/DELETE)
  //   2. LLM proxy calls (POST/GET) — /api/landing-pages/public/<slug>/llm/...
  //   3. landing-page LLM config probes (GET) — same prefix
  // So AI-generated pages don't have to know about the X-Landing-Page-Token header.
  function getTok(){try{return sessionStorage.getItem(SK)||localStorage.getItem('lp_pw_'+slug)||localStorage.getItem('lp_al_'+slug)||localStorage.getItem('lp_pin_'+slug)||localStorage.getItem('lp_paid_'+slug);}catch(e){return null;}}
  function needsToken(url,method){if(!url)return false;var s=String(url);var m=(method||'GET').toUpperCase();var isSheetWrite=(m==='POST'||m==='PATCH'||m==='PUT'||m==='DELETE')&&/\/sheet-rows(\/|$|\?)/.test(s);var isLlm=/\/api\/landing-pages\/public\/[^/]+\/(llm|llm-config)(\/|$|\?)/.test(s);return isSheetWrite||isLlm;}
  if(window.fetch){var _f=window.fetch;window.fetch=function(input,init){try{var url=typeof input==='string'?input:(input&&input.url)||'';var method=(init&&init.method)||(input&&input.method)||'GET';if(needsToken(url,method)){var tok=getTok();if(tok){init=init||{};var h=new Headers(init.headers||(typeof input!=='string'?input.headers:undefined)||{});if(!h.has('X-Landing-Page-Token'))h.set('X-Landing-Page-Token',tok);init.headers=h;}}}catch(e){}return _f.call(this,input,init);};}
  if(window.XMLHttpRequest){var _o=XMLHttpRequest.prototype.open;var _s=XMLHttpRequest.prototype.send;XMLHttpRequest.prototype.open=function(m,u){this.__lpM=m;this.__lpU=u;return _o.apply(this,arguments);};XMLHttpRequest.prototype.send=function(){try{if(needsToken(this.__lpU,this.__lpM)){var tok=getTok();if(tok)this.setRequestHeader('X-Landing-Page-Token',tok);}}catch(e){}return _s.apply(this,arguments);};}
}catch(e){}})();

const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open'); });
  mobileMenu.querySelectorAll('a').forEach(a => { a.addEventListener('click', () => { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); }); });
  const chatBtn = document.getElementById('custom-chat-btn');
  const chatPanel = document.getElementById('chat-panel');
  const chatIframe = document.getElementById('chat-iframe');
  const teaser = document.getElementById('chat-teaser');
  let chatLoaded = false, chatOpen = false;
  chatBtn.addEventListener('click', () => { chatOpen = !chatOpen; if (chatOpen) { if (!chatLoaded) { chatIframe.src = 'https://paymegpt.com/agents/46866772/embed'; chatLoaded = true; } chatPanel.classList.add('open'); teaser.classList.remove('visible'); teaser.classList.add('hidden'); } else { chatPanel.classList.remove('open'); } });
  document.addEventListener('click', e => { if (chatOpen && !chatPanel.contains(e.target) && e.target !== chatBtn && !chatBtn.contains(e.target)) { chatPanel.classList.remove('open'); chatOpen = false; } });
  setTimeout(() => teaser.classList.add('visible'), 2000);
  document.getElementById('teaser-close-btn').addEventListener('click', () => { teaser.classList.remove('visible'); teaser.classList.add('hidden'); });
  const heroSlides = document.getElementById('heroSlides');
  const heroDots = document.getElementById('heroDots');
  const heroCount = heroSlides.children.length;
  let heroIdx = 0, heroTimer;
  for (let i = 0; i < heroCount; i++) { const d = document.createElement('button'); d.className = 'hero-dot' + (i === 0 ? ' active' : ''); d.addEventListener('click', () => { heroGo(i); heroReset(); }); heroDots.appendChild(d); }
  function heroGo(n) { heroIdx = (n + heroCount) % heroCount; heroSlides.style.transform = `translateX(-${heroIdx * 100}%)`; document.querySelectorAll('.hero-dot').forEach((d,i) => d.classList.toggle('active', i === heroIdx)); }
  function heroReset() { clearInterval(heroTimer); heroTimer = setInterval(() => heroGo(heroIdx + 1), 5000); }
  document.getElementById('heroPrev').addEventListener('click', () => { heroGo(heroIdx - 1); heroReset(); });
  document.getElementById('heroNext').addEventListener('click', () => { heroGo(heroIdx + 1); heroReset(); });
  heroReset();
  let hTX = 0;
  heroSlides.addEventListener('touchstart', e => hTX = e.touches[0].clientX, { passive: true });
  heroSlides.addEventListener('touchend', e => { const d = hTX - e.changedTouches[0].clientX; if (Math.abs(d) > 50) { d > 0 ? heroGo(heroIdx+1) : heroGo(heroIdx-1); heroReset(); } });
  const track = document.getElementById('carouselTrack');
  const slides = track.querySelectorAll('.carousel-slide');
  const dotsC = document.getElementById('carouselDots');
  let cur = 0, autoT;
  const vis = () => window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 1 : 3;
  for (let i = 0; i < slides.length - 2; i++) { const d = document.createElement('button'); d.className = 'carousel-dot' + (i === 0 ? ' active' : ''); d.addEventListener('click', () => { goTo(i); resetAuto(); }); dotsC.appendChild(d); }
  function goTo(n) { cur = Math.max(0, Math.min(n, slides.length - vis())); track.style.transform = `translateX(-${cur * slides[0].offsetWidth}px)`; document.querySelectorAll('.carousel-dot').forEach((d,i) => d.classList.toggle('active', i === cur)); }
  function resetAuto() { clearInterval(autoT); autoT = setInterval(() => goTo(cur + 1 > slides.length - vis() ? 0 : cur + 1), 4000); }
  document.getElementById('carouselPrev').addEventListener('click', () => { goTo(cur - 1); resetAuto(); });
  document.getElementById('carouselNext').addEventListener('click', () => { goTo(cur + 1 > slides.length - vis() ? 0 : cur + 1); resetAuto(); });
  resetAuto();
  window.addEventListener('resize', () => goTo(0));
  let tX = 0;
  track.addEventListener('touchstart', e => tX = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => { const d = tX - e.changedTouches[0].clientX; if (Math.abs(d) > 50) { d > 0 ? goTo(cur+1) : goTo(cur-1); resetAuto(); } });
  document.querySelectorAll('a[href^="#"]').forEach(a => { a.addEventListener('click', e => { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); } }); });
  document.querySelectorAll('.menu-cat').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.menu-cat').forEach(b => b.classList.remove('active')); btn.classList.add('active'); }); });
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => { nav.style.background = window.scrollY > 60 ? 'rgba(14,10,5,0.98)' : 'rgba(14,10,5,0.92)'; });