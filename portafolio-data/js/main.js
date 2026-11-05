// Idioma y tema (con try/catch por si el navegador bloquea localStorage)
(function(){
  const root = document.documentElement;
  const get = k => { try { return localStorage.getItem(k); } catch(e){ return null; } };
  const set = (k,v) => { try { localStorage.setItem(k,v); } catch(e){} };

  const lang = get('lang') || ((navigator.language||'es').startsWith('en') ? 'en' : 'es');
  root.dataset.lang = lang;
  const theme = get('theme'); if (theme) root.dataset.theme = theme;

  document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('langBtn');
    const themeBtn = document.getElementById('themeBtn');
    const paint = () => {
      if (langBtn) langBtn.textContent = root.dataset.lang === 'es' ? 'EN' : 'ES';
      const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      if (themeBtn) themeBtn.textContent = dark ? '☀' : '☾';
      document.dispatchEvent(new CustomEvent('ui-change'));
    };
    langBtn && langBtn.addEventListener('click', () => {
      root.dataset.lang = root.dataset.lang === 'es' ? 'en' : 'es'; set('lang', root.dataset.lang); paint();
    });
    themeBtn && themeBtn.addEventListener('click', () => {
      const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      root.dataset.theme = dark ? 'light' : 'dark'; set('theme', root.dataset.theme); paint();
    });
    const menu = document.getElementById('menuBtn');
    menu && menu.addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('open'));
    document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open')));

    // Filtros de proyectos
    document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.f;
      document.querySelectorAll('.card').forEach(c => c.classList.toggle('hide', f !== 'all' && !c.dataset.cat.includes(f)));
    }));

    // Foto: si no existe img/foto.jpg se muestran iniciales
    const img = document.querySelector('.avatar img');
    if (img) img.addEventListener('error', () => { img.outerHTML = '<div class="initials">JR</div>'; });

    paint();
  });
})();
