// EDITA ESTOS DATOS ANTES DE PUBLICAR
const CONTACTO = {
  email: 'patigil951@gmail.com',
  whatsapp: '584245319486', // código país + número, sin + ni espacios
  linkedin: '',  // URL completa del perfil, p. ej. 'https://www.linkedin.com/in/usuario' (vacío = se oculta el botón)
  cv: '',        // nombre del PDF guardado en el proyecto, p. ej. 'cv-angela.pdf' (vacío = se oculta el botón)
  formspree: ''  // ID del formulario creado en formspree.io, p. ej. 'xqkrabcd' (vacío = el formulario abre la app de correo)
};
// Certificaciones: se muestran en "Perfil" solo si hay al menos una. El enlace es la verificación oficial (p. ej. Credly).
const CERTIFICACIONES = [
  // { nombre: 'SAP Certified Associate - Implementation Consultant - SAP SuccessFactors Employee Central', emisor: 'SAP', anio: 2026, enlace: 'https://www.credly.com/badges/...' },
];

const $ = (selector) => document.querySelector(selector);
const body = document.body;
const toggle = $('#themeToggle');
const storedTheme = (() => { try { return localStorage.getItem('portfolio-theme'); } catch { return null; } })();
if (storedTheme !== 'dark') body.classList.add('light'); // El tema claro empresarial es el predeterminado
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
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b===button));document.querySelectorAll('.project-card').forEach(card=>{card.hidden=button.dataset.filter!=='todos'&&card.dataset.category!==button.dataset.filter;});}));
const portrait=$('#portrait'),placeholder=$('#photoPlaceholder');portrait.addEventListener('load',()=>{portrait.style.display='block';placeholder.style.display='none';});portrait.addEventListener('error',()=>{portrait.style.display='none';placeholder.style.display='flex';});if(portrait.complete&&portrait.naturalWidth){portrait.style.display='block';placeholder.style.display='none';}
$('#year').textContent=new Date().getFullYear();
const wa=$('#waLink');if(CONTACTO.whatsapp){wa.target='_blank';wa.rel='noopener noreferrer';}else wa.hidden=true;
document.querySelectorAll('.linkedin-link').forEach(a=>{if(CONTACTO.linkedin){a.href=CONTACTO.linkedin;a.hidden=false;}});
document.querySelectorAll('.cv-link').forEach(a=>{if(CONTACTO.cv){a.href=CONTACTO.cv;a.hidden=false;}});

// IDIOMA (español / inglés). El español sale del HTML y el inglés de i18n.js
const ES = {};
document.querySelectorAll('[data-i18n]').forEach(el => { ES[el.dataset.i18n] ??= el.innerHTML; });
const langBtn = $('#langToggle');
let lang = (() => { try { return localStorage.getItem('portfolio-lang'); } catch { return null; } })() || (navigator.language.startsWith('en') ? 'en' : 'es');
const t = clave => UI[lang][clave];
function renderCertificaciones(){
  const grid = $('#certGrid');
  if (!CERTIFICACIONES.length) return;
  $('#certificaciones').hidden = false;
  grid.replaceChildren(...CERTIFICACIONES.map(c => {
    const card = document.createElement('div'); card.className = 'glass cert-card';
    const icono = document.createElement('span'); icono.className = 'cert-icon'; icono.textContent = '✓';
    const nombre = document.createElement('strong'); nombre.textContent = c.nombre;
    const meta = document.createElement('small'); meta.textContent = [c.emisor, c.anio].filter(Boolean).join(' · ');
    card.append(icono, nombre, meta);
    if (c.enlace) { const a = document.createElement('a'); a.className = 'card-link'; a.href = c.enlace; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = t('verificar'); card.append(a); }
    return card;
  }));
}
function aplicarIdioma(){
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; el.innerHTML = lang === 'en' ? (EN[k] ?? ES[k]) : ES[k]; });
  document.documentElement.lang = lang;
  document.title = t('titulo');
  langBtn.textContent = t('idioma'); langBtn.title = t('idiomaTitle'); langBtn.setAttribute('aria-label', t('idiomaLabel'));
  if (CONTACTO.whatsapp) wa.href = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(t('whatsapp'))}`;
  renderCertificaciones();
  $('#formStatus').textContent = '';
}
langBtn.addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; try { localStorage.setItem('portfolio-lang', lang); } catch {} aplicarIdioma(); });
aplicarIdioma();

// FORMULARIO DE CONTACTO: envía con Formspree si está configurado; si no, abre la app de correo
const form = $('#contactForm'), formStatus = $('#formStatus');
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (form._gotcha.value) return; // spam
  const nombre = form.nombre.value.trim(), correo = form.correo.value.trim(), mensaje = form.mensaje.value.trim();
  if (!nombre || !mensaje || !form.correo.checkValidity() || !correo) { formStatus.textContent = t('faltan'); formStatus.dataset.tipo = 'error'; return; }
  if (!CONTACTO.formspree) {
    location.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(t('asunto'))}&body=${encodeURIComponent(`${mensaje}\n\n— ${nombre} (${correo})`)}`;
    formStatus.textContent = t('abriendoCorreo'); formStatus.dataset.tipo = 'ok'; return;
  }
  const boton = form.querySelector('button[type="submit"]'); boton.disabled = true;
  formStatus.textContent = t('enviando'); formStatus.dataset.tipo = '';
  try {
    const r = await fetch(`https://formspree.io/f/${CONTACTO.formspree}`, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
    if (!r.ok) throw new Error(r.status);
    form.reset(); formStatus.textContent = t('enviado'); formStatus.dataset.tipo = 'ok';
  } catch { formStatus.textContent = t('error'); formStatus.dataset.tipo = 'error'; }
  finally { boton.disabled = false; }
});

// MIRADA QUE SIGUE AL CURSOR
// Coordenadas en píxeles de angela.jpg (853×1280). Si cambias la foto, ajusta estos valores.
// iris: centro (x, y) y radio r · esquinas: a (exterior/interior) y b · arriba/abajo: control de los párpados
// sclera: columnas donde se toma el color del blanco del ojo
const OJOS = [
  { x: 358.8, y: 398.6, r: 12.8, a: [329, 400], b: [389, 404], arriba: 379, abajo: 414, sclera: [338, 379] },
  { x: 501.9, y: 398, r: 13, a: [470, 403.5], b: [533, 399], arriba: 378.5, abajo: 414, sclera: [482, 522] }
];
const MAX_X = 7, MAX_Y = 2.8; // desplazamiento máximo del iris (px de la foto)
function iniciarMirada(){
  if (portrait.naturalWidth !== 853 || !matchMedia('(hover:hover) and (pointer:fine)').matches || reducedMotion.matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'portrait-eyes'; canvas.width = 853; canvas.height = 1280; canvas.setAttribute('aria-hidden', 'true');
  portrait.after(canvas);
  const ctx = canvas.getContext('2d');
  // Copia de la foto para leer píxeles y recortar el iris
  const base = document.createElement('canvas'); base.width = 853; base.height = 1280;
  const bctx = base.getContext('2d'); bctx.drawImage(portrait, 0, 0);
  let datos; try { datos = bctx.getImageData(0, 0, 853, 1280).data; } catch { canvas.remove(); return; }
  const pixel = (x, y) => { const i = (Math.round(y) * 853 + Math.round(x)) * 4; return [datos[i], datos[i+1], datos[i+2]]; };
  OJOS.forEach(ojo => {
    // Color del blanco del ojo fila por fila (el más claro de las dos columnas)
    ojo.filas = {};
    for (let y = Math.floor(ojo.y - ojo.r); y <= Math.ceil(ojo.y + ojo.r); y++) {
      const [c1, c2] = ojo.sclera.map(x => pixel(x, y));
      ojo.filas[y] = (c1[0]+c1[1]+c1[2] > c2[0]+c2[1]+c2[2] ? c1 : c2);
    }
    // Iris recortado con borde suave
    const d = Math.ceil(ojo.r * 2 + 6), iris = document.createElement('canvas'); iris.width = iris.height = d;
    const ictx = iris.getContext('2d');
    ictx.drawImage(base, ojo.x - d/2, ojo.y - d/2, d, d, 0, 0, d, d);
    const mascara = ictx.createRadialGradient(d/2, d/2, ojo.r - 1.5, d/2, d/2, ojo.r + 1.5);
    mascara.addColorStop(0, '#000'); mascara.addColorStop(1, 'rgba(0,0,0,0)');
    ictx.globalCompositeOperation = 'destination-in'; ictx.fillStyle = mascara; ictx.fillRect(0, 0, d, d);
    ojo.iris = iris;
    // Blanco del ojo que tapa el iris original, con los lados difuminados para que no se note el corte
    const w = Math.ceil(ojo.r * 2 + 12), y0 = Math.floor(ojo.y - ojo.r), fondo = document.createElement('canvas');
    fondo.width = w; fondo.height = Object.keys(ojo.filas).length;
    const fctx = fondo.getContext('2d');
    for (const y in ojo.filas) { const [r, g, b] = ojo.filas[y]; fctx.fillStyle = `rgb(${r},${g},${b})`; fctx.fillRect(0, y - y0, w, 1); }
    const lados = fctx.createLinearGradient(0, 0, w, 0), borde = (w / 2 - ojo.r - 5) / w, solido = (w / 2 - ojo.r - 1) / w;
    lados.addColorStop(borde, 'rgba(0,0,0,0)'); lados.addColorStop(solido, '#000'); lados.addColorStop(1 - solido, '#000'); lados.addColorStop(1 - borde, 'rgba(0,0,0,0)');
    fctx.globalCompositeOperation = 'destination-in'; fctx.fillStyle = lados; fctx.fillRect(0, 0, w, fondo.height);
    ojo.fondo = fondo; ojo.fondoX = ojo.x - w / 2; ojo.fondoY = y0 - .5;
  });
  const abertura = ojo => { const p = new Path2D(); p.moveTo(...ojo.a); p.quadraticCurveTo((ojo.a[0]+ojo.b[0])/2, ojo.arriba, ...ojo.b); p.quadraticCurveTo((ojo.a[0]+ojo.b[0])/2, ojo.abajo, ...ojo.a); return p; };
  OJOS.forEach(ojo => ojo.abertura = abertura(ojo));
  let objetivo = { x: 0, y: 0 }, actual = { x: 0, y: 0 }, animando = false;
  function dibujar(){
    ctx.clearRect(0, 0, 853, 1280);
    if (Math.abs(actual.x) < .05 && Math.abs(actual.y) < .05) return; // mirando al frente: la foto original
    OJOS.forEach(ojo => {
      ctx.save(); ctx.clip(ojo.abertura);
      // Tapa el iris original con el blanco del ojo y lo vuelve a dibujar desplazado
      ctx.drawImage(ojo.fondo, ojo.fondoX, ojo.fondoY);
      ctx.drawImage(ojo.iris, ojo.x - ojo.iris.width/2 + actual.x, ojo.y - ojo.iris.height/2 + actual.y);
      ctx.restore();
    });
  }
  function animar(){
    actual.x += (objetivo.x - actual.x) * .2; actual.y += (objetivo.y - actual.y) * .2;
    dibujar();
    if (Math.abs(objetivo.x - actual.x) > .02 || Math.abs(objetivo.y - actual.y) > .02) requestAnimationFrame(animar); else animando = false;
  }
  const mover = () => { if (!animando) { animando = true; requestAnimationFrame(animar); } };
  addEventListener('pointermove', e => {
    // Punto medio entre los ojos en pantalla (la foto usa object-fit: contain alineada abajo)
    const rect = portrait.getBoundingClientRect(), s = Math.min(rect.width / 853, rect.height / 1280);
    const cx = rect.left + (rect.width - 853 * s) / 2 + (OJOS[0].x + OJOS[1].x) / 2 * s;
    const cy = rect.top + (rect.height - 1280 * s) + OJOS[0].y * s;
    const dx = e.clientX - cx, dy = e.clientY - cy, dist = Math.hypot(dx, dy) || 1, fuerza = dist / (dist + 120);
    objetivo = { x: dx / dist * fuerza * MAX_X, y: dy / dist * fuerza * MAX_Y };
    mover();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { objetivo = { x: 0, y: 0 }; mover(); });
  dibujar();
}
if (portrait.complete && portrait.naturalWidth) iniciarMirada(); else portrait.addEventListener('load', iniciarMirada, { once: true });
