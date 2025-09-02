// Minimal JS (no i18n, no form)



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



// Mobile nav toggle + anchor offset reuse
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primaryNav');
  const btn = document.getElementById('navToggle');

  // Keep anchor links clear of the header height
  const setOffset = () =>
    document.documentElement.style.setProperty('--sticky-offset', (header?.offsetHeight || 64) + 'px');
  setOffset();
  window.addEventListener('resize', setOffset);

  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : ''; // lock scroll when menu open
    });
    // Close menu when a link is clicked
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
    // Close on Esc
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }
});

// GLightbox with scroll lock (prevents mobile jump-to-top)
document.addEventListener('DOMContentLoaded', () => {
  if (!window.GLightbox) return;

  let scrollY = 0;

  const lightbox = GLightbox({
    selector: '.glightbox',
    hash: false,            // don't change URL, avoids browser restoring to top
    openEffect: 'zoom',
    closeEffect: 'zoom',
    autoplayVideos: false,
  });

  const lockBody = () => {
    // remember current scroll
    scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    // lock the page in place
    document.body.classList.add('lb-lock');
    document.body.style.top = `-${scrollY}px`;
    // disable smooth scroll to avoid extra movement during open/close
    document.documentElement.style.scrollBehavior = 'auto';
  };

  const unlockBody = () => {
    document.body.classList.remove('lb-lock');
    document.body.style.top = '';
    // restore scroll
    window.scrollTo(0, scrollY);
    // re-enable smooth scroll if you use it elsewhere
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = '';
    });
  };

  lightbox.on('open', lockBody);
  lightbox.on('close', unlockBody);
});
