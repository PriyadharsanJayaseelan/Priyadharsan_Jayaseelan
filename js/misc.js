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