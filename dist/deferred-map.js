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
