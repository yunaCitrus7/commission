// Minimal JS (no i18n, no form)

// 1) Splide sliders
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

// 2) Sticky header (unchanged)
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const setOffset = () =>
    document.documentElement.style.setProperty('--sticky-offset', header.offsetHeight + 'px');
  setOffset();
  window.addEventListener('resize', setOffset);

  const onScroll = () => {
    const scrolled = window.scrollY > 4;
    header.classList.toggle('is-fixed', scrolled);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

// 3) Mobile nav toggle (unchanged)
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primaryNav');
  const btn = document.getElementById('navToggle');

  const setOffset = () =>
    document.documentElement.style.setProperty('--sticky-offset', (header?.offsetHeight || 64) + 'px');
  setOffset();
  window.addEventListener('resize', setOffset);

  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }
});

// === Popup Lightbox (vanilla) ===
document.addEventListener('DOMContentLoaded', () => {
  // Build the popup once
  const backdrop = document.createElement('div');
  backdrop.className = 'popup-backdrop';
  backdrop.innerHTML = `
    <div class="popup-dialog" role="dialog" aria-modal="true" aria-label="Image preview">
      <button class="popup-close" aria-label="Close preview">×</button>
      <img alt="">
    </div>`;
  document.body.appendChild(backdrop);

  const imgEl = backdrop.querySelector('img');
  const closeBtn = backdrop.querySelector('.popup-close');
  let scrollY = 0;

  function lockScroll() {
    scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.classList.add('lb-lock');
    document.body.style.top = `-${scrollY}px`;
  }
  function unlockScroll() {
    document.body.classList.remove('lb-lock');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function openPopup(src, alt = '') {
    if (!src) return;
    imgEl.src = src;
    imgEl.alt = alt || 'Preview';
    lockScroll();
    backdrop.classList.add('is-open');
    // focus close for a11y without moving the page
    closeBtn.focus({ preventScroll: true });
  }

  function closePopup() {
    backdrop.classList.remove('is-open');
    // free the src to release memory on mobile
    imgEl.src = '';
    unlockScroll();
  }

  // Close interactions
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePopup();
  });
  closeBtn.addEventListener('click', closePopup);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      e.preventDefault();
      closePopup();
    }
  });

  // Delegated trigger — works with anchors, buttons, or images
  document.addEventListener('click', (e) => {
    // 1) <a class="glightbox" href="..."><img ...></a>
    const a = e.target.closest('a.glightbox');
    if (a) {
      e.preventDefault(); // stop navigation (prevents jump)
      const img = a.querySelector('img');
      openPopup(a.getAttribute('href'), img?.alt || '');
      return;
    }
    // 2) <button class="glightbox-trigger|popup-trigger" data-src="..."><img ...></button>
    const btn = e.target.closest('.glightbox-trigger, .popup-trigger');
    if (btn) {
      const img = btn.querySelector('img');
      openPopup(btn.dataset.src || btn.dataset.popupSrc, img?.alt || '');
      return;
    }
    // 3) Fallback: plain <img class="price-thumb" data-full="...">
    const img = e.target.closest('img.price-thumb');
    if (img && img.dataset.full) {
      openPopup(img.dataset.full, img.alt || '');
    }
  }, false);
});
