/* particles.js — Neural network particle system with depth layers */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
const MOUSE = { x:-9999, y:-9999 };

function resize() { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }

class Particle {
  constructor(layer) {
    this.layer = layer;
    this.reset();
  }
  reset() {
    this.x = Math.random()*W; this.y = Math.random()*H;
    const spd = [0.12,0.25,0.4][this.layer];
    const a = Math.random()*Math.PI*2;
    this.vx = Math.cos(a)*spd; this.vy = Math.sin(a)*spd;
    this.baseR = [0.7,1.2,1.9][this.layer];
    this.r = this.baseR;
    this.po = Math.random()*Math.PI*2;
    const cols = ['200,255,0','59,130,246','34,211,238'];
    this.col = cols[Math.floor(Math.random()*cols.length)];
    this.baseA = [0.12,0.25,0.5][this.layer];
    this.alpha = this.baseA;
    this.isNode = this.layer===2 && Math.random()>0.72;
    this.orbit = this.layer===1 && Math.random()>0.6;
    if (this.orbit) {
      this.cx=Math.random()*W; this.cy=Math.random()*H;
      this.ang=Math.random()*Math.PI*2;
      this.rad=25+Math.random()*65;
      this.spd=(0.002+Math.random()*0.004)*(Math.random()>.5?1:-1);
    }
  }
  update(t) {
    if (this.orbit) {
      this.ang+=this.spd;
      this.x=this.cx+Math.cos(this.ang)*this.rad;
      this.y=this.cy+Math.sin(this.ang)*this.rad;
    } else {
      const dx=this.x-MOUSE.x, dy=this.y-MOUSE.y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if (this.layer===2&&d<130) { const f=(130-d)/130; this.x+=(dx/d)*f*2.2; this.y+=(dy/d)*f*2.2; }
      else if (this.layer===0&&d<180) { const f=(180-d)/180*0.25; this.x-=(dx/d)*f; this.y-=(dy/d)*f; }
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<-5)this.x=W+5; if(this.x>W+5)this.x=-5;
      if(this.y<-5)this.y=H+5; if(this.y>H+5)this.y=-5;
    }
    const pulse=Math.sin(t*0.0008+this.po);
    this.r = this.isNode ? this.baseR+pulse*1.8 : this.baseR+pulse*0.25;
    this.alpha = this.baseA + (this.isNode?pulse*0.18:0);
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x,this.y,Math.max(0.1,this.r),0,Math.PI*2);
    ctx.fillStyle=`rgba(${this.col},${this.alpha})`; ctx.fill();
    if(this.isNode){
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r*3.5,0,Math.PI*2);
      ctx.strokeStyle=`rgba(${this.col},${this.alpha*0.12})`; ctx.lineWidth=0.8; ctx.stroke();
    }
  }
}

function drawLines() {
  const max=125;
  for(let i=0;i<particles.length;i++){
    const p=particles[i];
    for(let j=i+1;j<particles.length;j++){
      const q=particles[j];
      if(Math.abs(p.layer-q.layer)>1) continue;
      const dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<max){
        const al=(1-d/max)*0.11;
        const col=p.layer===2?'200,255,0':'59,130,246';
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
        ctx.strokeStyle=`rgba(${col},${al})`; ctx.lineWidth=(1-d/max)*0.7; ctx.stroke();
      }
    }
  }
}

function loop(t) {
  ctx.clearRect(0,0,W,H);
  // faint grid
  ctx.strokeStyle='rgba(59,130,246,0.015)'; ctx.lineWidth=0.5;
  for(let x=0;x<W;x+=90){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=90){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  [0,1,2].forEach(l=>particles.filter(p=>p.layer===l).forEach(p=>{p.update(t);p.draw();}));
  drawLines();
  requestAnimationFrame(loop);
}

function init() {
  resize(); particles=[];
  for(let i=0;i<28;i++) particles.push(new Particle(0));
  for(let i=0;i<48;i++) particles.push(new Particle(1));
  for(let i=0;i<38;i++) particles.push(new Particle(2));
}

window.addEventListener('resize',()=>{resize();init();});
window.addEventListener('mousemove',e=>{MOUSE.x=e.clientX;MOUSE.y=e.clientY;});
window.addEventListener('mouseleave',()=>{MOUSE.x=-9999;MOUSE.y=-9999;});
init(); requestAnimationFrame(loop);