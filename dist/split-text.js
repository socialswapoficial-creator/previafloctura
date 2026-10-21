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
