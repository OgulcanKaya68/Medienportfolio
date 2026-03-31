/* ═══════════════════════════════════════════════
   main.js – Portfolio Interaktionen
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Typewriter Effekt ─────────────────────── */
  const twEl = document.getElementById('tw-text');
  if (twEl) {
    const phrases = [
      'Angehender Software Developer.',
      'Medieninformatik & Netzwerktechnik.',
      'Leidenschaftlich für sauberen Code.',
      'Auf der Suche nach meinem ersten Job.',
    ];
    let pi = 0, ci = 0, deleting = false;

    function tick() {
      const phrase = phrases[pi];
      if (deleting) {
        ci--;
        twEl.textContent = phrase.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 38);
      } else {
        ci++;
        twEl.textContent = phrase.slice(0, ci);
        if (ci === phrase.length) { deleting = true; setTimeout(tick, 2400); return; }
        setTimeout(tick, 62);
      }
    }
    setTimeout(tick, 900);
  }

  /* ── Tabs System ───────────────────────────── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const target = this.dataset.tab;

        // Alle deaktivieren
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

        // Aktiven setzen
        this.classList.add('active');
        const panel = document.getElementById('tab-' + target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ── Scroll Reveal ─────────────────────────── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  /* ── Stats Counter Animation ───────────────── */
  function animateCounter(el, target, duration) {
    let start = 0;
    const step = (target / duration) * 16;
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target + (el.dataset.suffix || ''); clearInterval(interval); return; }
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.target), 1200);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

});
