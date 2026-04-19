/* tilt.js — 3D tilt + scale up on hover/touch */
(function() {
  const wrap = document.getElementById('profileTilt');
  if (!wrap) return;

  // ── MOUSE: tilt + slight scale up
  wrap.addEventListener('mousemove', e => {
    const r  = wrap.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height/2) / r.height) * -16;
    const ry = ((e.clientX - r.left - r.width/2)  / r.width)  *  16;
    // scale(1.08) = slightly bigger on hover
    wrap.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.08)`;
    wrap.style.transition = 'transform 0.08s ease';
  });

  wrap.addEventListener('mouseleave', () => {
    wrap.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    wrap.style.transition = 'transform 0.65s ease';
  });

  // ── TOUCH: tilt + scale up on mobile
  wrap.addEventListener('touchstart', () => {
    wrap.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1.06)';
    wrap.style.transition = 'transform 0.3s ease';
  }, { passive: true });

  wrap.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    const r = wrap.getBoundingClientRect();
    const rx = ((t.clientY - r.top  - r.height/2) / r.height) * -12;
    const ry = ((t.clientX - r.left - r.width/2)  / r.width)  *  12;
    // scale(1.08) = slightly bigger on touch too
    wrap.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.08)`;
    wrap.style.transition = 'transform 0.05s ease';
  }, { passive: false });

  wrap.addEventListener('touchend', () => {
    wrap.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    wrap.style.transition = 'transform 0.65s ease';
  });
})();