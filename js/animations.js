/* ============================================
   ANIMATIONS.JS — Scroll reveal, counters,
                   hamburger menu
   ============================================ */

/* ---- SCROLL REVEAL ---- */
const reveals = document.querySelectorAll('.reveal');

// Add class to body so CSS can hide elements safely
// (if JS never runs, elements stay visible — safe fallback)
document.body.classList.add('js-animate');

function revealAll() {
  reveals.forEach(el => {
    el.style.transitionDelay = '0s';
    el.classList.add('visible');
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  reveals.forEach(el => observer.observe(el));

  // Hard fallback — after 2s, force everything visible no matter what
  setTimeout(revealAll, 2000);
} else {
  revealAll();
}

/* ---- COUNTER ANIMATION ---- */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target   = parseFloat(el.innerText);
    const suffix   = el.innerText.replace(/[\d.]/g, '');
    const isFloat  = el.innerText.includes('.');
    const duration = 1500;
    let startTime  = null;

    function update(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const val = isFloat
        ? (progress * target).toFixed(1)
        : Math.floor(progress * target);
      el.innerText = val + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateCounters();
    statsObserver.disconnect();
  }
}, { threshold: 0.5 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);

/* ---- HAMBURGER MENU ---- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuClose  = document.getElementById('menuClose');

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

menuClose.addEventListener('click', closeMenu);

document.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});