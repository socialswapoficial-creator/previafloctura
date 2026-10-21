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
