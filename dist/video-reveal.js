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
