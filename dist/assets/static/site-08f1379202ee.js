// Conteúdo real enviado pela empresa: fotos/vídeos dos clientes e avaliações.
// Não preencher com depoimentos ou identidades fictícios.
const guestContent = {"moments": [], "reviews": [{"author": "VILLELA DUBOIS", "text": "Achamos tudo bom. Confesso que não me pareceu um grande café colonial. Mas um excelente café da manhã servido em hotel top, com bastante variedade e fartura. Atendimento excelente desde o momento que chegamos, sempre muito solicitos. Ambiente muito aconchegante."}, {"author": "Cliente no Google Maps", "text": "Ambiente maravilhoso com uma estrutura bem aconchegante. O espaço fica bem localizado em Correas, então no meio do centro da cidade e de Itaipava, um ótimo lugar para encontrar os amigos. Amamos muito as opções de cardápio, fomos à noite e pegamos pizzas, que por sinal estavam uma delícia."}, {"author": "Cliente no Google Maps", "text": "Ambiente muito bonito e tranquilo. Destaque para as plantas. Comida e atendimento excelente. Muita variedade. Sucos, café, iogurte, pães, doces, frutas etc. Quase um almoço rs. Super recomendo."}, {"author": "Cliente no Google Maps", "text": "Comemorei meu aniversário lá e os atendentes foram atenciosos, a comida boa, bem servida e na temperatura ideal. Também encomendei a torta no próprio local. Recomendo!"}, {"author": "Cliente no Google Maps", "text": "Fui num grupo de 8, estavamos fazendo um pre checkin aqui antes de se hospedar. Foi otimo, deu pra trabalhar. E fomos muito bem antendidos. Muito bacana a cafeteria. Bem completo o menu. Tem varios sabores de Croissant e opcoes de bebidas para cafe."}, {"author": "Leandro Maia Cardoso", "text": "Atendimento excelente. Comida excelente. A pizza ficou pronta em poucos minutos. Chegamos próximo a hora de fechar (não sabíamos que estava prestes a fechar), e mesmo assim fomos muito bem atendidos. Voltaremos mais vezes!!"}, {"author": "Patrícia Silva", "text": "Adorei o lugar, fui para o café da manhã dia 13/06 (sábado) 08:30 tinha muita variedade, funcionários educados e atenciosos, ambiente gostoso e acolhedor, voltarei com certeza!!! Amei"}, {"author": "Samira Oliveira", "text": "Comemorei o aniversário da minha filha e saiu tudo perfeito. Voltaremos mais vezes, as meninas do atendimento são ótimas 🥰 Muito obrigada a cada um de vocês que nos atenderam e fizeram o dia dela mais que perfeito!!"}]};
function safeLink(value){if(typeof value!=='string'||!value.trim())return null;try{const url=new URL(value,location.href);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}}
function guestMedia(item){
  const figure=document.createElement('figure');
  const media=document.createElement(item.type==='video'?'video':'img');
  media.src=item.src;
  if(item.type==='video'){media.controls=true;media.preload='none';media.playsInline=true;if(item.poster)media.poster=item.poster;media.setAttribute('aria-label',item.alt||'Momento no Paraíso das Flores');}
  else{media.alt=item.alt||'Encontro no Paraíso das Flores';media.loading='lazy';media.decoding='async';}
  figure.append(media);
  if(item.caption){const caption=document.createElement('figcaption');caption.textContent=item.caption;figure.append(caption);}
  return figure;
}
const moments=document.querySelector('#guest-gallery');
if(moments&&guestContent.moments.length){moments.querySelector('[data-track]').append(...guestContent.moments.map(guestMedia));moments.hidden=false;}
const reviews=document.querySelector('#guest-reviews');
if(reviews&&guestContent.reviews.length){
  for(const [reviewIndex,item] of guestContent.reviews.entries()){
    const article=document.createElement('article'),quote=document.createElement('blockquote'),author=document.createElement('cite');
    if(reviewIndex>0)article.setAttribute('data-no-split','');
    const mark=document.createElement('span');mark.className='review-quote-mark';mark.textContent='“';mark.setAttribute('aria-hidden','true');
    quote.textContent=item.text;
    const identity=document.createElement('div');identity.className='review-identity';
    const monogram=document.createElement('span');monogram.className='review-monogram';monogram.setAttribute('aria-hidden','true');monogram.textContent=item.author==='Cliente no Google Maps'?'✳':item.author.split(' ').filter(Boolean).slice(0,2).map(part=>part[0]).join('');
    const byline=document.createElement('div');author.textContent=item.author;
    const source=document.createElement('span');source.className='review-source';source.textContent='Avaliação no Google Maps';byline.append(author,source);identity.append(monogram,byline);
    const stars=document.createElement('span');stars.className='review-stars';stars.textContent='★★★★★';stars.setAttribute('aria-label','5 de 5 estrelas');
    const expand=document.createElement('button');expand.type='button';expand.className='review-expand';expand.textContent='Ler comentário completo';expand.setAttribute('aria-expanded','false');
    expand.addEventListener('click',()=>{const open=article.classList.toggle('is-expanded');expand.setAttribute('aria-expanded',String(open));expand.textContent=open?'Recolher comentário':'Ler comentário completo';});
    article.append(identity,mark,stars,quote,expand);
    const href=safeLink(item.sourceUrl);if(href){const link=document.createElement('a');link.href=href;link.target='_blank';link.rel='noopener';link.textContent=item.sourceLabel||'Ver avaliação original';article.append(link);}
    reviews.querySelector('[data-track]').append(article);
  }
  reviews.hidden=false;
}
for(const carousel of document.querySelectorAll('[data-carousel]')){
  if(carousel.id==='guest-reviews')continue;
  const track=carousel.querySelector('[data-track]'),previous=carousel.querySelector('[data-prev]'),next=carousel.querySelector('[data-next]'),position=carousel.querySelector('.carousel-position');
  const items=[...track.children];if(!items.length)continue;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const index=()=>items.reduce((nearest,item,i)=>Math.abs(item.offsetLeft-items[0].offsetLeft-track.scrollLeft)<Math.abs(items[nearest].offsetLeft-items[0].offsetLeft-track.scrollLeft)?i:nearest,0);
  function update(){const current=index();position.textContent=`${String(current+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;previous.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;}
  function move(direction){const step=items[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||0);track.scrollBy({left:direction*step,behavior:reduced.matches?'instant':'smooth'});}
  previous.addEventListener('click',()=>move(-1));next?.addEventListener('click',()=>move(1));
  track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
  track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});update();
  track.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>track.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();})));
}

// Reprodução silenciosa somente quando o vídeo está visível.
const sectionVideos=[...document.querySelectorAll('video[data-video-src]')];
const videoMotion=matchMedia('(prefers-reduced-motion: reduce)');
function loadSectionVideo(video){if(!video.getAttribute('src')){video.src=video.dataset.videoSrc;video.preload='none';video.load();}}
function updateSectionVideo(video){
  if(video.dataset.visible==='true'&&!document.hidden&&!videoMotion.matches){
    loadSectionVideo(video);video.muted=true;video.play().catch(()=>{});
  }else video.pause();
}
sectionVideos.forEach(video=>{video.muted=true;video.controls=false;video.loop=true;});
if('IntersectionObserver' in window){
  const loadingObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){loadSectionVideo(target);loadingObserver.unobserve(target);}}),{rootMargin:navigator.connection?.saveData?'0px':'120px'});
  const playbackObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting,intersectionRatio})=>{target.dataset.visible=String(isIntersecting&&intersectionRatio>=.15);updateSectionVideo(target);}),{threshold:[0,.15]});
  sectionVideos.forEach(video=>{loadingObserver.observe(video);playbackObserver.observe(video);});
}else sectionVideos.forEach(video=>{video.dataset.visible='true';updateSectionVideo(video);});
document.addEventListener('visibilitychange',()=>sectionVideos.forEach(updateSectionVideo));
videoMotion.addEventListener('change',()=>sectionVideos.forEach(updateSectionVideo));

// Cards lado a lado, avançando um card por vez.
if(reviews&&guestContent.reviews.length){
  const track=reviews.querySelector('[data-track]'),items=[...track.children];
  const prev=reviews.querySelector('[data-prev]'),next=reviews.querySelector('[data-next]'),pause=reviews.querySelector('[data-review-pause]'),counter=reviews.querySelector('.carousel-position');
  const dots=document.createElement('div');dots.className='review-dots';dots.setAttribute('role','group');dots.setAttribute('aria-label','Posição dos depoimentos');counter.after(dots);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let selected=0,timer=0,visible=false,manualPause=false,focused=false,dragging=false;
  function maxIndex(){const step=items[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||0);return Math.max(0,items.length-Math.max(1,Math.round(track.clientWidth/step)));}
  function activeIndex(){return Math.min(maxIndex(),items.reduce((best,item,i)=>Math.abs(item.offsetLeft-items[0].offsetLeft-track.scrollLeft)<Math.abs(items[best].offsetLeft-items[0].offsetLeft-track.scrollLeft)?i:best,0));}
  function canRun(){return maxIndex()>0&&visible&&!manualPause&&!focused&&!dragging&&!document.hidden&&!reduced.matches&&!items.some(item=>item.classList.contains('is-expanded'));}
  function schedule(){clearTimeout(timer);if(canRun())timer=setTimeout(()=>go(selected+1),3500);}
  function indicators(){counter.textContent=`${String(selected+1).padStart(2,'0')} / ${String(maxIndex()+1).padStart(2,'0')}`;
    if(dots.children.length!==maxIndex()+1){dots.replaceChildren();for(let i=0;i<=maxIndex();i++){const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`Ver posição ${i+1} dos depoimentos`);button.addEventListener('click',()=>go(i));dots.append(button);}}
    [...dots.children].forEach((button,i)=>{button.setAttribute('aria-current',i===selected?'true':'false');});
  }
  function update(){selected=activeIndex();indicators();schedule();}
  function go(index){const positions=maxIndex()+1;selected=(index+positions)%positions;items.forEach(item=>{item.classList.remove('is-expanded');const button=item.querySelector('.review-expand');button.setAttribute('aria-expanded','false');button.textContent='Ler comentário completo';});
    track.scrollTo({left:items[selected].offsetLeft-items[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'});indicators();schedule();}
  prev?.addEventListener('click',()=>go(activeIndex()-1));next?.addEventListener('click',()=>go(activeIndex()+1));
  pause?.addEventListener('click',()=>{manualPause=!manualPause;pause.setAttribute('aria-pressed',String(manualPause));pause.textContent=manualPause?'Retomar':'Pausar';pause.setAttribute('aria-label',manualPause?'Retomar passagem automática dos depoimentos':'Pausar passagem automática dos depoimentos');schedule();});
  reviews.addEventListener('focusin',event=>{focused=event.target.matches(':focus-visible');schedule();});reviews.addEventListener('focusout',()=>{requestAnimationFrame(()=>{focused=reviews.contains(document.activeElement)&&document.activeElement.matches(':focus-visible');schedule();});});
  reviews.addEventListener('click',event=>{if(event.target.closest('.review-expand'))schedule();});
  track.addEventListener('pointerdown',()=>{dragging=true;schedule();});window.addEventListener('pointerup',()=>{if(dragging){dragging=false;schedule();}});window.addEventListener('pointercancel',()=>{dragging=false;schedule();});
  track.addEventListener('keydown',event=>{if(event.target!==track)return;if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();go(event.key==='Home'?0:event.key==='End'?maxIndex():activeIndex()+(event.key==='ArrowRight'?1:-1));}});
  let settle=0;track.addEventListener('scroll',()=>{clearTimeout(timer);clearTimeout(settle);settle=setTimeout(update,180);},{passive:true});
  window.addEventListener('resize',()=>{selected=Math.min(selected,maxIndex());track.scrollTo({left:items[selected].offsetLeft-items[0].offsetLeft,behavior:'instant'});indicators();schedule();});
  document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.1}).observe(reviews);else{visible=true;}
  update();
}

;
const tabs=[...document.querySelectorAll('[data-tab]')];
function selectTab(name,focus=false){tabs.forEach(tab=>{const active=tab.dataset.tab===name;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;if(active&&focus)tab.focus()})}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectTab(tab.dataset.tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectTab(tabs[next].dataset.tab,true)}})});
document.querySelectorAll('[data-select]').forEach(link=>link.addEventListener('click',()=>selectTab(link.dataset.select)));
document.getElementById('current-year').textContent=new Date().getFullYear();

// Preloaded image sheets keep forward and reverse scrubbing off the network.
const sequence=document.getElementById('hero-sequence');
if(sequence){
  const wrapper=document.querySelector('.scroll-hero');
  const stage=wrapper.querySelector('.ambient-hero');
  const content=wrapper.querySelector('.ambient-content');
  const shade=wrapper.querySelector('.ambient-shade');
  const hint=wrapper.querySelector('.ambient-scroll');
  const toggle=wrapper.querySelector('.ambient-playback');
  const ctx=sequence.getContext('2d',{alpha:false});
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const saveData=Boolean(navigator.connection?.saveData);
  const cacheRadius=(navigator.deviceMemory&&navigator.deviceMemory<=4)?0:1;
  let scrollFrame=0;
  const poster=document.getElementById('hero-poster');
  let posterReady=poster.complete;
  if(!posterReady)poster.addEventListener('load',()=>{posterReady=true;pump();},{once:true});
  const mobile=matchMedia('(max-width: 700px)').matches;
  const width=mobile?432:1280,height=mobile?768:720;
  const perSheet=16,columns=4,groupCount=mobile?12:7;
  const blobs=new Map(),decoding=new Set();
  sequence.width=width;sequence.height=height;
  const count=mobile?192:112,sheets=new Map(),pending=new Set(),failed=new Set();
  let target=0,current=0,paused=false,raf=0,lastDraw=-1,generation=0;
  function fail(){
    wrapper.classList.add('sequence-failed');if(toggle)toggle.hidden=true;
    [content,shade,hint].forEach(el=>{el.style.opacity='';el.style.visibility='';});content.inert=false;
  }
  function drawFrame(frame,alpha=1){
    const index=Math.min(count-1,Math.max(0,frame));
    const bitmap=sheets.get(Math.floor(index/perSheet));if(!bitmap)return false;
    const slot=index%perSheet;ctx.globalAlpha=alpha;
    ctx.drawImage(bitmap,(slot%columns)*width,Math.floor(slot/columns)*height,width,height,0,0,sequence.width,sequence.height);
    return true;
  }
  function paint(){
    let position=current;
    // While loading, keep the closest available part of the sequence visible.
    if(!sheets.has(Math.floor(position/perSheet))){
      if(!sheets.size)return;
      const group=[...sheets.keys()].sort((a,b)=>Math.abs(a*perSheet+perSheet/2-position)-Math.abs(b*perSheet+perSheet/2-position))[0];
      position=Math.max(group*perSheet,Math.min(group*perSheet+perSheet-1,position));
    }
    if(Math.abs(lastDraw-position)<.005)return;
    const low=Math.floor(position),high=Math.min(count-1,low+1),mix=position-low;
    if(drawFrame(low)){
      // Blend neighboring source frames for sub-frame scroll positions.
      if(mobile&&mix>.005)drawFrame(high,mix);
      ctx.globalAlpha=1;sequence.classList.add('is-ready');sequence.dataset.frame=position.toFixed(2);lastDraw=position;
    }
  }
  function render(){
    raf=0;if(motion.matches||paused||document.hidden)return;
    current=target;paint();
  }
  function schedule(){if(!raf&&!motion.matches&&!paused)raf=requestAnimationFrame(render);}
  async function decode(group){
    const epoch=generation;decoding.add(group);
    try{
      const bitmap=await createImageBitmap(blobs.get(group));
      if(epoch!==generation||motion.matches){bitmap.close();return;}
      sheets.set(group,bitmap);sequence.dataset.readySheets=String(sheets.size);lastDraw=-1;schedule();
    }catch(error){if(epoch===generation)failed.add(group);}
    finally{if(epoch===generation){decoding.delete(group);pump();}}
  }
  async function load(group){
    const epoch=generation;pending.add(group);
    try{
      const path=mobile?`assets/hero-mobile-closer/mobile-${String(group).padStart(2,'0')}.webp`:`assets/hero-desktop-hq/desktop-${String(group).padStart(2,'0')}.webp`;
      const response=await fetch(path,{cache:'force-cache'});
      if(!response.ok)throw Error('Image sheet unavailable');
      const blob=await response.blob();
      if(epoch===generation&&!motion.matches){blobs.set(group,blob);sequence.dataset.loadedSheets=String(blobs.size);}
    }catch(error){if(epoch===generation){failed.add(group);if(failed.size>=3)fail();}}
    finally{if(epoch===generation){pending.delete(group);pump();}}
  }
  function pump(){
    if(motion.matches||saveData||!posterReady||document.hidden||failed.size>=3)return;
    const focus=Math.floor(target/perSheet);
    // Keep full-resolution desktop decoding bounded near the visible frame.
    for(const [group,bitmap] of sheets){if(Math.abs(group-focus)>cacheRadius){bitmap.close();sheets.delete(group);}}
    const groups=Array.from({length:groupCount},(_,i)=>i).sort((a,b)=>Math.abs(a-focus)-Math.abs(b-focus));
    for(const group of groups){
      if(decoding.size>=1)break;
      if((Math.abs(group-focus)<=cacheRadius)&&blobs.has(group)&&!sheets.has(group)&&!decoding.has(group)&&!failed.has(group))decode(group);
    }
    for(const group of groups){
      if(pending.size>=2)break;
      if(Math.abs(group-focus)>1)continue;
      if(!blobs.has(group)&&!pending.has(group)&&!failed.has(group))load(group);
    }
  }
  function readScroll(){
    if(paused||motion.matches||failed.size>=3)return;
    const travel=wrapper.offsetHeight-stage.offsetHeight;
    const p=Math.max(0,Math.min(1,travel>0?-wrapper.getBoundingClientRect().top/travel:0));
    // Both videos now use their full, device-specific sequence.
    const endFrame=count-1;
    const desktopProgress=Math.min(1,p/.8);
    const desktopEase=desktopProgress*desktopProgress*(3-2*desktopProgress);
    target=(mobile?Math.min(1,p/.9):desktopEase)*endFrame;sequence.dataset.target=target.toFixed(2);
    const opacity=1-Math.min(1,p/.24);
    content.style.opacity=opacity;content.style.visibility=opacity===0?'hidden':'visible';content.inert=opacity===0;
    shade.style.opacity=opacity;
    hint.style.opacity=1-Math.min(1,p/.12);hint.style.visibility=p>=.12?'hidden':'visible';
    pump();schedule();
  }
  function onScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;readScroll();});}
  function configure(){
    wrapper.classList.toggle('is-reduced',motion.matches||saveData);
    if(toggle)toggle.hidden=motion.matches||failed.size>=3;
    if(motion.matches||saveData){
      generation++;pending.clear();decoding.clear();blobs.clear();failed.clear();
      sheets.forEach(bitmap=>bitmap.close());sheets.clear();
      sequence.classList.remove('is-ready');lastDraw=-1;
      [content,shade,hint].forEach(el=>{el.style.opacity='';el.style.visibility='';});content.inert=false;
    }else{readScroll();current=target;}
  }
  toggle?.addEventListener('click',()=>{
    paused=!paused;toggle.setAttribute('aria-pressed',String(paused));
    toggle.textContent=paused?'Ativar movimento':'Pausar movimento';
    if(!paused){readScroll();}
  });
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)onScroll();});
  motion.addEventListener('change',configure);
  if(!ctx||!window.createImageBitmap)fail();else configure();
}

;
(() => {
  'use strict';
  // Distância externa em px, força, limite por eixo e tempos de suavização em ms.
  const config = { radius: 70, strength: 0.18, max: 8, follow: 70, return: 110 };
  function mountMagneticButton(button) {
    const visual = button.querySelector('.magnetic-content');
    if (!visual || !window.requestAnimationFrame || !window.matchMedia) return () => {};
    const abort = new AbortController();
    const options = { signal: abort.signal, passive: true };
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, previous = 0, x = 0, y = 0, tx = 0, ty = 0;
    let pointer = null, keyboard = false, destroyed = false;
    const enabled = () => fine.matches && !reduced.matches && !keyboard && !document.hidden;
    const clamp = value => Math.max(-config.max, Math.min(config.max, value));
    function reset() {
      cancelAnimationFrame(frame); frame = 0; previous = 0;
      x = y = tx = ty = 0; pointer = null;
      visual.style.removeProperty('translate');
    }
    function schedule() { if (!frame && !destroyed) frame = requestAnimationFrame(tick); }
    function tick(now) {
      frame = 0;
      if (!enabled() || !button.isConnected) { reset(); return; }
      if (pointer) {
        // Leitura do alvo fixo, antes de escrever apenas no conteúdo interno.
        const rect = button.getBoundingClientRect();
        const dx = pointer.x - (rect.left + rect.width / 2);
        const dy = pointer.y - (rect.top + rect.height / 2);
        const outsideX = Math.max(0, Math.abs(dx) - rect.width / 2);
        const outsideY = Math.max(0, Math.abs(dy) - rect.height / 2);
        const distance = Math.hypot(outsideX, outsideY);
        const influence = Math.max(0, 1 - distance / config.radius);
        tx = clamp(dx * config.strength) * influence;
        ty = clamp(dy * config.strength) * influence;
        pointer = null;
      }
      const dt = previous ? Math.min(40, now - previous) : 16.67;
      previous = now;
      // Retorno exponencial amortecido: termina em zero, sem oscilação.
      const alpha = 1 - Math.exp(-dt / (tx || ty ? config.follow : config.return));
      x += (tx - x) * alpha; y += (ty - y) * alpha;
      if (Math.abs(tx - x) < 0.02 && Math.abs(ty - y) < 0.02) {
        x = tx; y = ty; previous = 0;
      } else schedule();
      visual.style.translate = `${x.toFixed(3)}px ${y.toFixed(3)}px`;
      if (!frame && x === 0 && y === 0) visual.style.removeProperty('translate');
    }
    function leave() { pointer = null; tx = ty = 0; schedule(); }
    document.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') { reset(); return; }
      keyboard = false;
      if (!enabled()) return;
      pointer = { x: event.clientX, y: event.clientY }; schedule();
    }, options);
    document.addEventListener('pointerout', event => { if (!event.relatedTarget) leave(); }, options);
    document.addEventListener('pointerdown', reset, options);
    document.addEventListener('keydown', () => { keyboard = true; reset(); }, options);
    window.addEventListener('blur', reset, options);
    window.addEventListener('scroll', reset, { ...options, capture: true });
    window.addEventListener('resize', reset, options);
    document.addEventListener('visibilitychange', reset, options);
    fine.addEventListener('change', reset, options);
    reduced.addEventListener('change', reset, options);
    return () => { destroyed = true; abort.abort(); reset(); };
  }
  let cleanups = [];
  function mount() {
    cleanups.forEach(cleanup => cleanup());
    cleanups = [...document.querySelectorAll('.ambient-button[data-magnetic]')].map(mountMagneticButton);
  }
  // Limpeza ao sair e remontagem ao restaurar a página pelo histórico (bfcache).
  window.addEventListener('pagehide', () => { cleanups.forEach(cleanup => cleanup()); cleanups = []; });
  window.addEventListener('pageshow', event => { if (event.persisted) mount(); });
  mount();
})();

;
(() => {
  'use strict';
  // Alvos semânticos: títulos, parágrafos, listas, links, botões e informações da casa.
  const selector = 'h1,h2,h3,p,li,a,button,summary,blockquote,cite,figcaption,dt,dd,address,.review-source,.reviews-intro>span,.footer-bottom,.brand small,.ambient-scroll small';
  const config = { duration: 600, stagger: 70, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', threshold: 0.08 };
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let dispose = () => {};
  function mount() {
    dispose();
    if (motion.matches || !window.IntersectionObserver || !Element.prototype.animate) return;
    const abort = new AbortController(), records = [], running = new Set();
    function prepare(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
          acceptNode: node => node.textContent.trim() && !node.parentElement.closest('[aria-hidden="true"],script,style,.split-copy,.split-original,[data-no-split]') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        });
        const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
        const words = [], replacements = [];
        for (const node of nodes) {
          const original = document.createElement('span'); original.className = 'split-original';
          original.textContent = node.textContent;
          const copy = document.createElement('span'); copy.className = 'split-copy'; copy.setAttribute('aria-hidden', 'true');
          for (const token of node.textContent.split(/(\s+)/u)) {
            if (!token) continue;
            if (/^\s+$/u.test(token)) { copy.append(document.createTextNode(token)); continue; }
            const mask = document.createElement('span'); mask.className = 'split-mask';
            const word = document.createElement('span'); word.className = 'split-word'; word.textContent = token;
            mask.append(word); copy.append(mask); words.push(word);
          }
          const parent = node.parentNode;
          parent.insertBefore(original, node); parent.replaceChild(copy, node);
          replacements.push({ node, original, copy });
        }
        if (!words.length) return null;
        const record={ element, words, replacements, played:false }; records.push(record); return record;
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        let record; try { record=prepare(entry.target); } catch { continue; }
        if (!record || record.played) continue;
        record.played = true; record.remaining=record.words.length;
        // O estado natural fica sempre visível; só a animação ativa tem estado inicial oculto.
        try {
          record.words.forEach((word, index) => {
            const animation = word.animate([
              { transform: 'translateY(100%)', opacity: 0 },
              { transform: 'translateY(0)', opacity: 1 }
            ], { duration: config.duration, delay: index * config.stagger, easing: config.easing, fill: 'backwards' });
            running.add(animation);
            let settled=false;
            const clear = () => {
              if(settled)return;settled=true;record.remaining--;
              running.delete(animation);
              if(records.includes(record)&&record.remaining===0) {
                const selection=window.getSelection();
                if(!selection || selection.isCollapsed || !record.element.contains(selection.anchorNode)) {
                  record.replacements.forEach(({node,original,copy})=>{if(copy.isConnected)copy.replaceWith(node);original.remove();});
                  records.splice(records.indexOf(record),1);
                }
              }
            };
            animation.onfinish = clear; animation.oncancel = clear;
          });
        } catch { running.forEach(animation => animation.cancel()); running.clear(); }
      }
    }, { threshold: config.threshold });
    try {
      const roots = [...document.querySelectorAll(selector)].filter(element =>
        !element.closest('[aria-hidden="true"],iframe,[data-no-split]') &&
        !element.parentElement?.closest(selector));
      for (const element of roots) {
        observer.observe(element);
      }
    } catch {
      observer.disconnect();
      records.forEach(record => record.replacements.forEach(({ node, original, copy }) => {
        if (copy.isConnected) copy.replaceWith(node); original.remove();
      }));
      return;
    }
    // Clavier et clic : montrer immédiatement tout contenu interactif concerné.
    function finishInteractive(event) {
      const record = records.find(item => item.element.contains(event.target));
      if (record) { observer.unobserve(record.element); record.played = true;
        record.words.forEach(word => word.getAnimations().forEach(animation => animation.finish()));
      }
    }
    document.addEventListener('focusin', finishInteractive, { signal: abort.signal });
    document.addEventListener('pointerdown', finishInteractive, { signal: abort.signal, passive: true });
    dispose = () => {
      observer.disconnect(); abort.abort(); running.forEach(animation => animation.cancel()); running.clear();
      records.forEach(record => record.replacements.forEach(({ node, original, copy }) => {
        if (copy.isConnected) copy.replaceWith(node); original.remove();
      }));
      dispose = () => {};
    };
  }
  motion.addEventListener('change', mount);
  window.addEventListener('pagehide', () => { dispose(); motion.removeEventListener('change', mount); });
  window.addEventListener('pageshow', event => { if (event.persisted) { motion.addEventListener('change', mount); mount(); } });
  mount();
})();

;
(() => {
  'use strict';
  const selector = 'main video.section-video';
  const config = { duration: 750, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', threshold: 0.12 };
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let dispose = () => {};
  function mount() {
    dispose();
    // Sem suporte ou com movimento reduzido, mantém o vídeo no estado natural visível.
    if (motion.matches || !window.IntersectionObserver || !Element.prototype.animate ||
        !window.CSS?.supports('clip-path', 'inset(0 100% 0 0)')) return;
    const abort = new AbortController(), animations = new Map(), seen = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting || seen.has(target)) continue;
        observer.unobserve(target); seen.add(target);
        // Nada muda na geometria, no áudio ou nos observadores de reprodução existentes.
        try {
          const animation = target.animate([
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)' }
          ], { duration: config.duration, easing: config.easing, fill: 'none' });
          animations.set(target, animation);
          const clear = () => animations.delete(target);
          animation.onfinish = clear; animation.oncancel = clear;
        } catch { /* Fallback: vídeo totalmente visível, sem recorte aplicado. */ }
      }
    }, { threshold: config.threshold });
    const videos = [...document.querySelectorAll(selector)].filter(video => !video.closest('.scroll-hero,[data-no-reveal]'));
    videos.forEach(video => {
      observer.observe(video);
      const finish = () => {
        observer.unobserve(video); seen.add(video);
        animations.get(video)?.finish();
      };
      video.addEventListener('focus', finish, { signal: abort.signal });
      video.addEventListener('pointerdown', finish, { signal: abort.signal, passive: true });
    });
    dispose = () => {
      observer.disconnect(); abort.abort();
      animations.forEach(animation => animation.cancel()); animations.clear();
      dispose = () => {};
    };
  }
  motion.addEventListener('change', mount);
  window.addEventListener('pagehide', () => { dispose(); motion.removeEventListener('change', mount); });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { motion.addEventListener('change', mount); mount(); }
  });
  mount();
})();

;
(() => {
  const map = document.querySelector('iframe[data-src]');
  if (!map) return;
  let observer;
  const load = () => { if (!map.src) map.src = map.dataset.src; observer?.disconnect(); };
  if (!window.IntersectionObserver) { load(); return; }
  observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) load(); }, { rootMargin: '250px' });
  observer.observe(map);
  window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
  window.addEventListener('pageshow', event => { if (event.persisted && !map.src) observer.observe(map); });
})();
