// EDITA ESTOS DATOS ANTES DE PUBLICAR
const CONTACTO = { email: 'tu-correo@ejemplo.com', whatsapp: '' }; // WhatsApp: código país + número, sin + ni espacios

const $ = (selector) => document.querySelector(selector);
const body = document.body;
const toggle = $('#themeToggle');
const storedTheme = (() => { try { return localStorage.getItem('portfolio-theme'); } catch { return null; } })();
if (storedTheme === 'light') body.classList.add('light');
function updateThemeIcon(){ toggle.textContent = body.classList.contains('light') ? '☾' : '☼'; }
updateThemeIcon();
toggle.addEventListener('click', () => {
  const change = () => { body.classList.toggle('light'); updateThemeIcon(); try { localStorage.setItem('portfolio-theme', body.classList.contains('light') ? 'light' : 'dark'); } catch {} };
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(change); else change();
});
const menuToggle = $('#menuToggle'), nav = $('#nav');
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.textContent = open ? '✕' : '☰'; });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.textContent='☰'; }));
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?scrollY/max*100:0)+'%';}
addEventListener('scroll',updateProgress,{passive:true});updateProgress();
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window){ const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.1}); reveals.forEach(el=>observer.observe(el)); } else reveals.forEach(el=>el.classList.add('visible'));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion.matches) document.querySelectorAll('.tilt').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`;});card.addEventListener('pointerleave',()=>card.style.transform='');});
// La foto se inclina hacia el cursor, como si volteara a mirarlo
const photoFrame=$('.photo-frame');
if (photoFrame && matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion.matches){let frame=0;addEventListener('pointermove',e=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=photoFrame.getBoundingClientRect();const x=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/(innerWidth/2))),y=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height/2))/(innerHeight/2)));photoFrame.style.transform=`perspective(1000px) rotateY(${x*12}deg) rotateX(${-y*8}deg) translate(${x*6}px,${y*4}px)`;});},{passive:true});document.documentElement.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);photoFrame.style.transform='';});}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='todos'&&card.dataset.category!==button.dataset.filter;});}));
const portrait=$('#portrait'),placeholder=$('#photoPlaceholder');portrait.addEventListener('load',()=>{portrait.style.display='block';placeholder.style.display='none';});portrait.addEventListener('error',()=>{portrait.style.display='none';placeholder.style.display='flex';});if(portrait.complete&&portrait.naturalWidth){portrait.style.display='block';placeholder.style.display='none';}
$('#year').textContent=new Date().getFullYear();
$('#emailLink').href=`mailto:${CONTACTO.email}?subject=${encodeURIComponent('Consulta desde mi portafolio')}`;
const wa=$('#waLink');if(CONTACTO.whatsapp){wa.href=`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent('Hola, vi tu portafolio y quisiera consultar sobre tus servicios.')}`;wa.target='_blank';wa.rel='noopener noreferrer';wa.removeAttribute('aria-label');}else{wa.addEventListener('click',e=>{e.preventDefault();alert('Configura tu número de WhatsApp en script.js para activar este botón.');});}
