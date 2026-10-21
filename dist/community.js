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
