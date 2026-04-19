/* bgswitch.js */
const secs=document.querySelectorAll('section[data-bg]');
const bio=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){document.body.style.background=e.target.dataset.bg;document.body.style.transition='background 0.9s ease';}});
},{threshold:0.35});
secs.forEach(s=>bio.observe(s));
let lastY=0;const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{const y=window.scrollY;nav.style.transform=(y>lastY&&y>120)?'translateY(-110%)':'translateY(0)';lastY=y;});

/* projects.js */
document.querySelectorAll('.proj-row').forEach(row=>{
  const img=row.querySelector('.proj-hover-img');if(!img)return;
  row.addEventListener('mousemove',e=>{const r=row.getBoundingClientRect();img.style.top=(e.clientY-r.top-img.offsetHeight/2)+'px';});
});

/* manifesto.js */
document.querySelectorAll('.mf-item').forEach(item=>{
  item.querySelector('.mf-top').addEventListener('click',()=>{
    const open=item.classList.contains('open');
    document.querySelectorAll('.mf-item').forEach(i=>i.classList.remove('open'));
    if(!open)item.classList.add('open');
  });
});

/* nav.js */
const hbg=document.getElementById('hamburger'),menu=document.getElementById('mobileMenu'),cls=document.getElementById('menuClose');
function closeMenu(){hbg.classList.remove('open');menu.classList.remove('open');}
if(hbg){hbg.addEventListener('click',()=>{hbg.classList.toggle('open');menu.classList.toggle('open');});}
if(cls)cls.addEventListener('click',closeMenu);
document.querySelectorAll('.ml').forEach(a=>a.addEventListener('click',closeMenu));

/* ── CERTIFICATE 3D TILT ── */
(function(){
  const card = document.getElementById('certCardInner');
  if (!card) return;
  let cx=0,cy=0,tx=0,ty=0,raf;

  function lerp(a,b,t){return a+(b-a)*t;}
  function anim(){
    raf=requestAnimationFrame(anim);
    cx=lerp(cx,tx,.1); cy=lerp(cy,ty,.1);
    card.style.transform=`perspective(1000px) rotateX(${cy}deg) rotateY(${cx}deg) scale(1.04)`;
    card.style.boxShadow=`0 ${20+Math.abs(cy)}px ${60+Math.abs(cx)*2}px rgba(0,0,0,0.7), 0 0 ${40+Math.abs(cx)}px rgba(255,165,0,0.12)`;
  }

  card.addEventListener('mouseenter',()=>{cancelAnimationFrame(raf);anim();});
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    tx=((e.clientX-r.left)/r.width-.5)*22;
    ty=-((e.clientY-r.top)/r.height-.5)*18;
  });
  card.addEventListener('mouseleave',()=>{
    tx=0;ty=0;
    setTimeout(()=>cancelAnimationFrame(raf),600);
    card.style.transform='perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    card.style.transition='transform 0.7s cubic-bezier(0.23,1,0.32,1), box-shadow 0.7s ease';
    setTimeout(()=>card.style.transition='',700);
  });

  // Touch
  card.addEventListener('touchmove',e=>{
    e.preventDefault();
    const t=e.touches[0],r=card.getBoundingClientRect();
    tx=((t.clientX-r.left)/r.width-.5)*16;
    ty=-((t.clientY-r.top)/r.height-.5)*14;
  },{passive:false});
  card.addEventListener('touchend',()=>{tx=0;ty=0;});
})();