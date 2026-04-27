/* ─────────────────────────────── BOOT ─── */
(function() {
  const lines = [0,1,2,3,4,5,6].map(i => document.getElementById('bl'+i));
  const bar   = document.getElementById('boot-bar');
  const boot  = document.getElementById('boot');
  let idx = 0, pct = 0;

  function nextLine() {
    if (idx < lines.length) {
      lines[idx].classList.add('show');
      idx++;
      setTimeout(nextLine, idx < 5 ? 280 : 380);
    }
  }

  function fillBar() {
    if (pct < 100) {
      pct += 1.8;
      bar.style.width = Math.min(pct, 100) + '%';
      setTimeout(fillBar, 22);
    } else {
      setTimeout(() => {
        boot.classList.add('fade-out');
        setTimeout(() => boot.remove(), 700);
      }, 300);
    }
  }

  nextLine();
  setTimeout(fillBar, 200);
})();

/* ─────────────────────────────── CURSOR ─── */
const dot = document.getElementById('c-dot');
let mx=0, my=0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx+'px'; dot.style.top = my+'px';
});

document.querySelectorAll('a,button,.proj-card,.sk-card,.edu-card,.term').forEach(el => {
  el.addEventListener('mouseenter', () => dot.style.transform = 'translate(-50%,-50%) scale(1.6)');
  el.addEventListener('mouseleave', () => dot.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ─────────────────────────────── PARTICLES ─── */
const cv  = document.getElementById('bgc');
const ctx = cv.getContext('2d');
let W, H, pts = [];
const N = 90, D = 120;

function resize() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
addEventListener('resize', resize); resize();

class P {
  constructor() {
    this.x  = Math.random()*W;
    this.y  = Math.random()*H;
    this.vx = (Math.random()-.5)*.35;
    this.vy = (Math.random()-.5)*.35;
    this.r  = Math.random()*1.3+.4;
    this.a  = Math.random()*.45+.15;
  }
  step() {
    this.x+=this.vx; this.y+=this.vy;
    if(this.x<0||this.x>W) this.vx*=-1;
    if(this.y<0||this.y>H) this.vy*=-1;
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(0,255,65,${this.a})`; ctx.fill();
  }
}

for(let i=0;i<N;i++) pts.push(new P());

(function loop() {
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<pts.length;i++) {
    pts[i].step(); pts[i].draw();
    for(let j=i+1;j<pts.length;j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<D) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle=`rgba(0,200,255,${(1-d/D)*.13})`;
        ctx.lineWidth=.5; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(loop);
})();

/* ─────────────────────────────── TYPING ─── */
const phrases = [
  'Fruita, CO  //  (970) 985-1059',
  'Dual-enrolled CS student at CMU',
  'Published cybersecurity researcher',
  'Presented at MobiSec 2025',
  'Building ML threat-detection pipelines',
  'Automated QA across Android, web & TV',
  'Presidential List · Dean\'s List · 4.0 GPA',
];
let pi=0, ci=0, del=false;
const tout = document.getElementById('type-out');

function type() {
  const ph = phrases[pi];
  if(!del) {
    tout.textContent = ph.slice(0,ci++);
    if(ci>ph.length) { del=true; setTimeout(type,2100); return; }
  } else {
    tout.textContent = ph.slice(0,ci--);
    if(ci<0) { del=false; pi=(pi+1)%phrases.length; ci=0; }
  }
  setTimeout(type, del ? 32 : 52);
}
setTimeout(type, 1400);

/* ─────────────────────────────── NAV ─── */
const nav  = document.getElementById('nav');
const nls  = document.querySelectorAll('.nav-links a');
const secs = document.querySelectorAll('section[id]');

addEventListener('scroll', () => {
  nav.classList.toggle('solid', scrollY > 40);
  let cur = '';
  secs.forEach(s => { if(scrollY >= s.offsetTop-110) cur=s.id; });
  nls.forEach(a => a.classList.toggle('act', a.getAttribute('href')==='#'+cur));
});

/* ─────────────────────────────── OBSERVER ─── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    e.target.classList.add('vis');
    e.target.querySelectorAll('.sk-fill').forEach(f => f.style.width = f.dataset.w+'%');
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.rv,.tl-item,.edu-card,.proj-card,.pub-card,.aw-card,.sk-card').forEach(el => io.observe(el));

/* stagger delays */
document.querySelectorAll('.proj-grid .proj-card').forEach((c,i) => c.style.transitionDelay = i*.07+'s');
document.querySelectorAll('.aw-grid .aw-card').forEach((c,i)     => c.style.transitionDelay = i*.065+'s');
document.querySelectorAll('.edu-grid .edu-card').forEach((c,i)   => c.style.transitionDelay = i*.09+'s');
document.querySelectorAll('.tl-item').forEach((c,i)               => c.style.transitionDelay = i*.08+'s');

/* ─────────────────────────────── CARD TILT ─── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    card.style.transform = `perspective(560px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateZ(8px)`;
    card.style.boxShadow = `${-x*18}px ${-y*18}px 40px rgba(0,255,65,.09)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});
