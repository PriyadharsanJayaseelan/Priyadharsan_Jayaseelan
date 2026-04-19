/* cursor.js — Magnetic cursor with trail */
const dot=document.getElementById('cursor');
const ring=document.getElementById('cursor-follower');
let mx=0,my=0,fx=0,fy=0;

document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  dot.style.left=mx+'px'; dot.style.top=my+'px';
});

(function anim(){
  fx+=(mx-fx)*0.1; fy+=(my-fy)*0.1;
  ring.style.left=fx+'px'; ring.style.top=fy+'px';
  requestAnimationFrame(anim);
})();

// Magnetic pull on buttons/links
document.querySelectorAll('a,.btn-primary,.nav-cta,.proj-row,.mf-item,.stat-card,.contact-social a').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.classList.add('grow');ring.classList.add('grow');});
  el.addEventListener('mouseleave',()=>{dot.classList.remove('grow');ring.classList.remove('grow');});

  // Magnetic effect
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const cx=r.left+r.width/2, cy=r.top+r.height/2;
    const dx=e.clientX-cx, dy=e.clientY-cy;
    el.style.transform=`translate(${dx*0.12}px,${dy*0.12}px)`;
    el.style.transition='transform 0.1s ease';
  });
  el.addEventListener('mouseleave',()=>{
    el.style.transform='translate(0,0)';
    el.style.transition='transform 0.5s ease';
  });
});