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
