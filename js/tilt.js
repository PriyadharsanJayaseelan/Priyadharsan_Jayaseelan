(function() {
  const wrap = document.getElementById('profileTilt');
  if (!wrap) return;

  let tx=0,ty=0,cx=0,cy=0,isOver=false;
  function lerp(a,b,t){return a+(b-a)*t;}

  (function anim(){
    requestAnimationFrame(anim);
    cx=lerp(cx,tx,.1); cy=lerp(cy,ty,.1);
    const scale = isOver ? 1.09 : 1;
    wrap.style.transform=`perspective(800px) rotateX(${cy}deg) rotateY(${cx}deg) scale(${scale})`;
  })();

  wrap.addEventListener('mouseenter',()=>{ isOver=true; });
  wrap.addEventListener('mousemove',e=>{
    const r=wrap.getBoundingClientRect();
    tx=((e.clientX-r.left)/r.width-.5)*22;
    ty=-((e.clientY-r.top)/r.height-.5)*18;
  });
  wrap.addEventListener('mouseleave',()=>{
    isOver=false; tx=0; ty=0;
    wrap.style.transition='transform 0.7s cubic-bezier(0.23,1,0.32,1)';
    setTimeout(()=>wrap.style.transition='',700);
  });

  wrap.addEventListener('touchstart',()=>{ isOver=true; },{passive:true});
  wrap.addEventListener('touchmove',e=>{
    e.preventDefault();
    const t=e.touches[0],r=wrap.getBoundingClientRect();
    tx=((t.clientX-r.left)/r.width-.5)*18;
    ty=-((t.clientY-r.top)/r.height-.5)*14;
  },{passive:false});
  wrap.addEventListener('touchend',()=>{ isOver=false; tx=0; ty=0; });
})();