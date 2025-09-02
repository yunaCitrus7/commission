// Minimal JS (no i18n, no form)



(function(){
  function applyTheme(t){ document.documentElement.setAttribute('data-theme', t); }
  const themeToggle = document.getElementById('themeToggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');
  const savedTheme = localStorage.getItem('theme');
  const theme = savedTheme || (prefersLight.matches ? 'light' : 'dark');
  applyTheme(theme);
  if (themeToggle){
    themeToggle.setAttribute('aria-pressed', theme === 'light');
    themeToggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'light' ? 'dark' : 'light';
      applyTheme(next);
      themeToggle.setAttribute('aria-pressed', next === 'light');
      localStorage.setItem('theme', next);
    });
  }
  // Footer year
  const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();
  // Lightbox
  if (window.GLightbox) GLightbox({ selector: '.glightbox' });
})();


document.addEventListener('DOMContentLoaded', function () {
  if (!window.Splide) return;
  document.querySelectorAll('.splide.mini-splide').forEach(function (el) {
    new Splide(el, {
      type: 'loop',
      perPage: 1,
      arrows: true,
      pagination: true,
      autoplay: true,
      interval: 4000,
      pauseOnHover: true,
      speed: 600,
      rewind: true,
    }).mount();
  });
});



// Robust sticky header: add fixed fallback + anchor offset
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  // Keep anchor links clear of the header height
  const setOffset = () =>
    document.documentElement.style.setProperty('--sticky-offset', header.offsetHeight + 'px');
  setOffset();
  window.addEventListener('resize', setOffset);

  // Fixed fallback once you scroll a tiny bit
  const onScroll = () => {
    const scrolled = window.scrollY > 4;
    header.classList.toggle('is-fixed', scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});