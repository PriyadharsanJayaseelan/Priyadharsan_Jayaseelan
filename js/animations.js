/* animations.js — Typewriter, scroll progress, reveals, counters */

// ── SCROLL PROGRESS BAR ──
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
});

// ── TYPEWRITER on hero subtitle ──
const twEl = document.getElementById('typewriter');
const words = ['CS Student', 'Data Builder', 'ML Engineer', 'Problem Solver', 'Developer'];
let wi = 0, ci = 0, deleting = false, twTimer;

function typewriter() {
  if (!twEl) return;
  const word = words[wi];
  if (!deleting) {
    twEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; twTimer = setTimeout(typewriter, 1800); return; }
  } else {
    twEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi+1) % words.length; }
  }
  twTimer = setTimeout(typewriter, deleting ? 55 : 90);
}
typewriter();

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
document.body.classList.add('js-animate');
function showAll() { reveals.forEach(el=>{ el.style.transitionDelay='0s'; el.classList.add('visible'); }); }
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:0.08, rootMargin:'0px 0px -30px 0px'});
  reveals.forEach(el=>io.observe(el));
  setTimeout(showAll, 2200);
} else { showAll(); }

// ── COUNTERS ──
const cards = document.querySelectorAll('.stat-card');
function animCount(el) {
  const numEl=el.querySelector('.sc-num');
  const target=parseFloat(el.dataset.val);
  const suffix=el.dataset.suffix||'';
  const isFloat=el.dataset.float==='1';
  const dur=1800; let t0=null;
  function step(ts){
    if(!t0)t0=ts;
    const p=Math.min((ts-t0)/dur,1);
    const ease=1-Math.pow(1-p,3);
    numEl.textContent=(isFloat?(ease*target).toFixed(1):Math.floor(ease*target))+suffix;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const cio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animCount(e.target);cio.unobserve(e.target);}});
},{threshold:0.5});
cards.forEach(c=>cio.observe(c));

// ── SECTION NUMBER COUNTER (Mustafa style) ──
// highlight active nav section
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links-item');
const sio = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(l=>l.classList.remove('active'));
      const active = document.querySelector(`.nav-links-item[href="#${e.target.id}"]`);
      if(active) active.classList.add('active');
    }
  });
},{threshold:0.4});
sections.forEach(s=>sio.observe(s));