/* TOQUE PERFECTO  */

gsap.registerPlugin(ScrollTrigger); // Asegúrate de que GSAP y ScrollTrigger estén incluidos 


// 1. PAGE LOADER
const loader = document.getElementById('page-loader'); // Asegúrate de que el elemento con id "page-loader" exista en tu HTML
window.addEventListener('load', () => {
  gsap.to(loader, {
    opacity: 0, duration: 0.9, delay: 1.3, ease: 'power2.inOut',
    onComplete: () => { loader.classList.add('hidden'); initGSAPAnimations(); } // Inicia las animaciones de scroll después de ocultar el loader
  });
});


//  2. CURSOR 
const cursorEl   = document.getElementById('cursor'); // Asegúrate de que el elemento con id "cursor" exista enHTML
const followerEl = document.getElementById('cursor-follower'); // Asegúrate de que el elemento con id "cursor-follower" exista en tu HTML
let mouseX = 0, mouseY = 0, fX = 0, fY = 0; // mouseX/Y son las coordenadas reales del mouse, fX/Y son las coordenadas del seguidor

document.addEventListener('mousemove', e => {  // Actualiza las coordenadas del mouse
  mouseX = e.clientX; mouseY = e.clientY;   // Mueve el cursor principal directamente a la posición del mouse
  gsap.set(cursorEl, { x: mouseX - 4.5, y: mouseY - 4.5 }); // Ajusta por el tamaño del cursor (9px) para centrarlo
});

(function tickFollower() {  // Anima el seguidor con un retraso suave hacia la posición del mouse
  fX += (mouseX - fX - 15) * 0.10;  // tamaño 30px, por eso el -15 para centrarlo
  fY += (mouseY - fY - 15) * 0.10;  // Aplica la posición al seguidor
  gsap.set(followerEl, { x: fX, y: fY });  // Continúa el ciclo de animación
  requestAnimationFrame(tickFollower);  // Llama a tickFollower en el próximo frame
})();

// Hover magnético en interactivos ANIMACION
document.querySelectorAll('a, button, .product-card, .panini-card, .capsula').forEach(el => {  
  el.addEventListener('mouseenter', () => {  // Al entrar, el cursor se agranda y el seguidor se hace más pequeño y translúcido
    gsap.to(cursorEl,   { scale: 3.5,  duration: 0.3, ease: 'power2.out' }); // El cursor principal se agranda para crear un efecto de "halo"
    gsap.to(followerEl, { scale: 0.3, opacity: 0.25, duration: 0.3 });  // El seguidor se reduce y se vuelve más translúcido para enfatizar el hover
  });
  el.addEventListener('mouseleave', () => { // Al salir, el cursor vuelve a su tamaño normal y el seguidor recupera su tamaño y opacidad original
    gsap.to(cursorEl,   { scale: 1, duration: 0.4, ease: 'elastic.out(1,.5)' }); // El cursor principal vuelve a su tamaño normal con una animación elástica para un efecto más orgánico
    gsap.to(followerEl, { scale: 1, opacity: 0.65, duration: 0.4 }); // El seguidor vuelve a su tamaño y opacidad original con una animación suave para mantener la fluidez del efecto
  });
});


//  3. NAVBAR SCROLL 
const navbar = document.getElementById('navbar'); // Asegúrate de que el elemento con id "navbar" exista en tu HTML
window.addEventListener('scroll', () => {  // Agrega o quita la clase 'scrolled' al navbar según la posición de scroll
  navbar.classList.toggle('scrolled', window.scrollY > 60); // Cuando el scroll vertical es mayor a 60px, se añade la clase 'scrolled' para cambiar el estilo del navbar (fondo, sombra, etc.). Si el scroll es menor o igual a 60px, se quita la clase para volver al estilo original.
}, { passive: true });  // El { passive: true } mejora el rendimiento al indicar que el evento de scroll no va a llamar a preventDefault(), permitiendo que el navegador optimice el manejo del scroll.


//  4. SMOOTH SCROLL — navbar links 
// Mapeo explícito de secciones para cada link
const navMap = {
  '#nosotros':   '#nosotros',
  '#tendencias': '#tendencias',
  '#catalogo':   '#catalogo',
};

document.querySelectorAll('a[href^="#"]').forEach(link => { // Selecciona todos los enlaces que comienzan con "#" para aplicar el smooth scroll
  link.addEventListener('click', e => {  // Al hacer clic en un enlace, se obtiene el href y se determina el destino real usando el mapeo navMap. Esto permite tener enlaces que no coincidan exactamente con los IDs de las secciones pero que aún así funcionen correctamente.
    const href = link.getAttribute('href'); // Si el href no está en el mapeo, se usa el href directamente (esto permite enlaces que sí coincidan con los IDs de las secciones).
    const targetId = navMap[href] || href;  // Se obtiene el elemento objetivo usando el ID determinado. Si no se encuentra el elemento, se retorna sin hacer nada.
    const target = document.querySelector(targetId); // Si el elemento objetivo existe, se previene el comportamiento por defecto del enlace, se cierra el menú móvil (si está abierto) y se calcula la posición de scroll ajustada para tener en cuenta la altura del navbar. Luego, se anima el scroll hacia esa posición usando GSAP para un efecto suave.
    if (!target) return; // Si no se encuentra el elemento objetivo, se sale de la función sin hacer nada
    e.preventDefault();
    closeMobileMenu();
    const offset = navbar.offsetHeight + 16; // Se añade un pequeño margen adicional de 16px para que el contenido no quede justo debajo del navbar
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    gsap.to(window, { scrollTo: { y, autoKill: false }, duration: 1.3, ease: 'power4.inOut' }); // El autoKill: false evita que el scroll se detenga si el usuario intenta hacer scroll manualmente durante la animación, lo que mejora la experiencia de usuario al permitirles tomar el control si lo desean.
  });
});

// Hero CTA → catálogo
const heroCta = document.getElementById('hero-cta');// Asegúrate de que el elemento con id "hero-cta" exista en tu HTML
if (heroCta) {
  heroCta.addEventListener('click', e => { // Al hacer clic en el botón de llamada a la acción del hero, se previene el comportamiento por defecto, se calcula la posición de scroll hacia la sección del catálogo ajustada por la altura del navbar, y se anima el scroll hacia esa posición usando GSAP para un efecto suave.
    e.preventDefault();
    const target = document.getElementById('catalogo'); // Asegúrate de que el elemento con id "catalogo" exista en tu HTML
    if (!target) return;
    const offset = navbar.offsetHeight + 16;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    gsap.to(window, { scrollTo: { y, autoKill: false }, duration: 1.2, ease: 'power4.inOut' });// El autoKill: false permite que el usuario interrumpa la animación de scroll si intenta hacer scroll manualmente, lo que mejora la experiencia al darles control total sobre el desplazamiento si lo desean.
  });
}


// 5. MENÚ MÓVIL 
const navToggle  = document.getElementById('nav-toggle'); // Asegúrate de que el elemento con id "nav-toggle" exista en tu HTML
const mobileMenu = document.getElementById('mobile-menu'); // Asegúrate de que el elemento con id "mobile-menu" exista en tu HTML
const mobileClose = document.getElementById('mobile-menu-close'); // Asegúrate de que el elemento con id "mobile-menu-close" exista en tu HTML

navToggle.addEventListener('click', () => {  // Al hacer clic en el botón de menú, se alterna la clase 'open' en el menú móvil para mostrar u ocultar el menú. También se alterna la clase 'active' en el botón de menú para cambiar su apariencia (por ejemplo, a una "X" para cerrar). Además, se controla el desbordamiento del cuerpo para evitar que la página se desplace cuando el menú está abierto. Si el menú se abre, se anima la aparición de los enlaces del menú con un efecto de fade-in y slide-up usando GSAP.
  const open = mobileMenu.classList.toggle('open'); // La variable 'open' se establece en true si el menú se abrió y en false si se cerró, lo que permite controlar el estado del menú y aplicar las animaciones correspondientes.
  navToggle.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    gsap.fromTo('.mobile-nav-links li', { opacity: 0, y: 20 }, { // Al abrir el menú, se anima cada enlace de la lista con un efecto de aparición suave (fade-in) y deslizamiento hacia arriba (slide-up). La animación tiene una duración de 0.5 segundos, un retraso inicial de 0.1 segundos, y los enlaces aparecen uno tras otro con un intervalo de 0.08 segundos entre cada uno (stagger). La función de easing 'power3.out' se utiliza para crear una animación más natural y fluida.
      opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.1
    });
  }
});

if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu); // Al hacer clic en el botón de cerrar del menú móvil, se llama a la función closeMobileMenu para cerrar el menú y restablecer el estado del botón y el desbordamiento del cuerpo.

function closeMobileMenu() { // La función closeMobileMenu se encarga de cerrar el menú móvil al eliminar la clase 'open' del menú y la clase 'active' del botón de menú. También restablece el desbordamiento del cuerpo para permitir que la página se desplace nuevamente. Esta función se puede llamar desde diferentes eventos, como al hacer clic en el botón de cerrar o al hacer clic fuera del menú.
  mobileMenu.classList.remove('open');
  navToggle.classList.remove('active');
  document.body.style.overflow = '';
}
window.closeMobileMenu = closeMobileMenu;

mobileMenu.addEventListener('click', e => { if (e.target === mobileMenu) closeMobileMenu(); });


// 6. FONDO 3D 
(function initThreeBG() { // Configuración del renderer
  const canvas = document.getElementById('bg-canvas'); // Asegúrate de que el elemento con id "bg-canvas" exista en tu HTML y tenga un tamaño adecuado (por ejemplo, width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; z-index: -1;) para cubrir toda la pantalla como fondo.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); // El alpha: true permite que el fondo sea transparente, mostrando el color de fondo del body o cualquier otro elemento detrás del canvas. Esto es ideal para un fondo 3D que se integre con el diseño general de la página.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limitar el pixel ratio a 1.5 para mejorar el rendimiento en dispositivos con pantallas de alta densidad sin sacrificar demasiada calidad visual.
  renderer.setSize(window.innerWidth, window.innerHeight);// Configura el tamaño del renderer para que coincida con el tamaño de la ventana, asegurando que el fondo 3D cubra toda la pantalla.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
// Escena y cámara
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 22);
// Ajuste responsivo
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, { passive: true });

  // Iluminación mejorada
  scene.add(new THREE.AmbientLight(0xfef5e4, 0.7));
  const key = new THREE.DirectionalLight(0xf1c166, 1.0);
  key.position.set(6, 10, 8); scene.add(key);
  const fill = new THREE.DirectionalLight(0x88b8ce, 0.5);
  fill.position.set(-8, -4, 4); scene.add(fill);
  const back = new THREE.PointLight(0xa13a1e, 0.4, 50);
  back.position.set(0, -10, -5); scene.add(back);

  // Materiales con mayor shininess, más presencia visual
  const mats = [
    new THREE.MeshPhongMaterial({ color: 0xb79858, transparent: true, opacity: 0.30, shininess: 140, specular: 0xf1c166 }),
    new THREE.MeshPhongMaterial({ color: 0xf1c166, transparent: true, opacity: 0.25, shininess: 160, specular: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xa13a1e, transparent: true, opacity: 0.22, shininess: 110, specular: 0xf1c166 }),
    new THREE.MeshPhongMaterial({ color: 0x88b8ce, transparent: true, opacity: 0.28, shininess: 130, specular: 0xffffff }),
    new THREE.MeshPhongMaterial({ color: 0xd4b87a, transparent: true, opacity: 0.22, shininess: 120, specular: 0xffffff }),
  ];

  // Geometrías más grandes y variadas
  const geos = [
    new THREE.BoxGeometry(1.8, 1.8, 0.22),       // Cuadro/portarretrato
    new THREE.BoxGeometry(1.5, 1.2, 1.2),          // Caja regalo
    new THREE.SphereGeometry(0.85, 24, 24),         // Alcancía
    new THREE.OctahedronGeometry(0.95),             // Diamante
    new THREE.BoxGeometry(1.4, 1.1, 0.08),          // Sobre / tarjeta
    new THREE.TorusGeometry(0.7, 0.22, 12, 48),     // Aro decorativo
    new THREE.CylinderGeometry(0, 1.0, 1.8, 4),     // Pirámide
    new THREE.BoxGeometry(1.6, 0.6, 0.6),          // Lápiz / vela
  ];
// Crear más geometrías con variaciones aleatorias
  const objects = [];
  const COUNT   = 26;
// Para cada objeto, se selecciona una geometría y un material de forma aleatoria, se crea un mesh, se le asigna una posición, rotación y escala aleatorias dentro de ciertos rangos para mantener la cohesión visual. Luego, se añaden propiedades personalizadas a cada objeto para controlar su animación (velocidades de rotación, oscilación vertical, deriva horizontal) y se agrega a la escena.
  for (let i = 0; i < COUNT; i++) {
    const geo  = geos[i % geos.length];
    const mat  = mats[Math.floor(Math.random() * mats.length)].clone();
    const mesh = new THREE.Mesh(geo, mat);
// Posición aleatoria dentro de un rango más amplio para una distribución más dinámica
    mesh.position.set(
      (Math.random() - 0.5) * 38,
      (Math.random() - 0.5) * 26,
      (Math.random() - 0.5) * 14
    );
    mesh.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    // Escala más generosa: 0.7 – 2.2
    const s = 0.7 + Math.random() * 1.5;
    mesh.scale.setScalar(s);
    scene.add(mesh);
// Se añaden propiedades personalizadas para la animación de cada objeto, incluyendo velocidades de rotación aleatorias, parámetros para la oscilación vertical (frecuencia, amplitud, fase), y una deriva horizontal lenta para crear un movimiento más orgánico y menos predecible. Estas propiedades se utilizarán en el ciclo de animación para actualizar la posición y rotación de cada objeto en cada frame.
    objects.push({
      mesh,
      rx: (Math.random() - 0.5) * 0.006,
      ry: (Math.random() - 0.5) * 0.007,
      rz: (Math.random() - 0.5) * 0.004,
      fOff:   Math.random() * Math.PI * 2,
      fSpeed: 0.25 + Math.random() * 0.45,
      fAmp:   0.18 + Math.random() * 0.45,
      baseY:  mesh.position.y,
      // drift horizontal lento
      driftX:  (Math.random() - 0.5) * 0.002,
      baseX:   mesh.position.x,
      driftOff:Math.random() * Math.PI * 2,
    });
  }
// Animación y control de cámara
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
// Al hacer clic en el fondo (canvas o body), se aplica una fuerza aleatoria a cada objeto para dispersarlos de manera caótica, creando un efecto visual dinámico y divertido. La animación utiliza GSAP para suavizar el movimiento con una función de easing elástica, lo que hace que los objetos reboten ligeramente antes de asentarse en su nueva posición.
  document.addEventListener('click', e => {
    if (e.target === document.body || e.target.id === 'bg-canvas') {
      objects.forEach(o => {
        gsap.to(o.mesh.position, {
          x: o.mesh.position.x + (Math.random() - 0.5) * 6,
          y: o.mesh.position.y + (Math.random() - 0.5) * 4,
          duration: 2.2, ease: 'elastic.out(1,.45)'
        });
      });
    }
  });
// El ciclo de animación se ejecuta en cada frame utilizando requestAnimationFrame. En cada frame, se actualizan las coordenadas de la cámara para crear un efecto de parallax basado en la posición del mouse, y se actualizan las rotaciones y posiciones de cada objeto según sus propiedades de animación (velocidades de rotación, oscilación vertical, deriva horizontal). Finalmente, se renderiza la escena desde la perspectiva de la cámara.
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    cx += (tx - cx) * 0.035;
    cy += (ty - cy) * 0.035;
    camera.position.x = cx * 2.2;
    camera.position.y = -cy * 1.6;
    camera.lookAt(scene.position);

    objects.forEach(o => {
      o.mesh.rotation.x += o.rx;
      o.mesh.rotation.y += o.ry;
      o.mesh.rotation.z += o.rz;
      o.mesh.position.y  = o.baseY  + Math.sin(t * o.fSpeed + o.fOff)   * o.fAmp;
      o.mesh.position.x  = o.baseX  + Math.sin(t * 0.12    + o.driftOff) * 0.8;
    });
    renderer.render(scene, camera);
  }
  animate();
})();


// 7. GSAP SCROLL ANIMATIONS 
function initGSAPAnimations() {

  // Reveal genérico
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Hero parallax
  ScrollTrigger.create({
    trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.2,
    onUpdate: self => gsap.set('.hero-content', { y: self.progress * 90 })
  });

  // Nosotros: slide from sides
  gsap.fromTo('.nosotros-left',  { opacity:0, x:-55 }, { opacity:1, x:0, duration:1.2, ease:'power3.out', scrollTrigger:{ trigger:'#nosotros', start:'top 76%', once:true } });
  gsap.fromTo('.nosotros-right', { opacity:0, x: 55 }, { opacity:1, x:0, duration:1.2, ease:'power3.out', delay:.2, scrollTrigger:{ trigger:'#nosotros', start:'top 76%', once:true } });

  // Stats: scale up
  gsap.fromTo('.stat-item', { opacity:0, scale:.85 }, {
    opacity:1, scale:1, duration:.8, ease:'back.out(1.6)', stagger:.12,
    scrollTrigger:{ trigger:'.nosotros-stats', start:'top 85%', once:true }
  });

  // Slogan
  gsap.fromTo('.slogan-text',  { opacity:0, scale:.82, y:25 }, { opacity:1, scale:1, y:0, duration:1.5, ease:'power4.out', scrollTrigger:{ trigger:'.nosotros-slogan', start:'top 86%', once:true } });
  gsap.fromTo('.slogan-line',  { scaleX:0 }, { scaleX:1, duration:1.7, ease:'power3.inOut', scrollTrigger:{ trigger:'.nosotros-slogan', start:'top 86%', once:true } });

  // Panini featured card
  gsap.fromTo('.panini-solo .panini-card--featured', { opacity:0, y:70, scale:.95 }, {
    opacity:1, y:0, scale:1, duration:1.1, ease:'power4.out',
    scrollTrigger:{ trigger:'.panini-solo', start:'top 82%', once:true }
  });

  // Productos heading
  gsap.fromTo('#catalogo', { opacity:0 }, { opacity:1, duration:.6, ease:'power2.out', scrollTrigger:{ trigger:'#catalogo', start:'top 85%', once:true } });

  // Cápsulas
  gsap.fromTo('.capsula', { opacity:0, y:80, scale:.88 }, {
    opacity:1, y:0, scale:1, duration:1.1, ease:'back.out(1.4)', stagger:.18,
    scrollTrigger:{ trigger:'.capsulas-grid', start:'top 83%', once:true }
  });

  // Footer script
  gsap.fromTo('.footer-love-script', { opacity:0, y:30 }, {
    opacity:1, y:0, duration:1.3, ease:'power3.out',
    scrollTrigger:{ trigger:'.contacto-footer', start:'top 88%', once:true }
  });

  // Contadores animados
  document.querySelectorAll('.stat-number').forEach(el => {
    const raw = el.textContent.trim();
    if (!/^\d/.test(raw)) return;
    const num = parseInt(raw);
    const suf = raw.replace(/\d+/, '').trim();
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: num, duration: 1.8, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) + suf });
      }
    });
  });
}

// 8. TILT 3D EN TARJETAS 
function initProductTilt() { 
  document.querySelectorAll('.product-card').forEach(card => { // Asegúrate de que los elementos con la clase "product-card" existan en tu HTML
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();// Obtiene las dimensiones y posición del elemento para calcular el centro y la distancia del mouse
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      gsap.to(card, { rotateY: dx * 9, rotateX: -dy * 7, transformPerspective: 900, duration: .4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: .8, ease: 'elastic.out(1,.5)' });
    });
  });
}

// Tilt en card panini
document.querySelectorAll('.panini-card--featured').forEach(card => { // Asegúrate de que los elementos con la clase "panini-card--featured" existan en tu HTML 
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect(); // Obtiene las dimensiones y posición del elemento para calcular el centro y la distancia del mouse. Esto permite que el efecto de tilt se base en la posición del mouse relativa al centro de la tarjeta, creando una experiencia más interactiva y dinámica. 
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    gsap.to(card, { rotateY: dx * 5, rotateX: -dy * 4, transformPerspective: 1200, duration: .4, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: .9, ease: 'elastic.out(1,.5)' });
  });
});



//  9. FOTOS Y DATOS DE PRODUCTOS  

const productData = {

  // ALCANCÍAS
  'alcancías': [
    {
      id:    'alc-01',
      name:  'Alcancía Mi Próxima Meta',
      tag:   'Alcancías',
      badge: '✦ Único',
    
      price: '$40.000',
      desc:  'Una alcancía en madera con frente en acrílico transparente personalizable, diseñada para convertir cada ahorro en un paso más hacia tus metas, sueños y proyectos.',
      src:'',   
      wa:    'Hola!%20Quiero%20pedir%20la%20Alcancía%20Mi%20Próxima%20Meta%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Ahorros con propósito', ''],
        ['Metas que sí se cumplen', ''],
        ['Cada moneda cuenta', ''],
        ['Disciplina que inspira', ''],
        ['Fuerza de voluntad',''],
        ['Orgullo al lograr', ''],
      ],
    },
  ],

  //  PORTARETRATOS
  'portaretratos': [
    {
      id:    'port-01',
      name:  'Portarretrato Mini',
      tag:   'Portaretratos',
      badge: '⭐ Popular',
      price: '$30.000',
      desc:  'Portarretrato decorativo en madera natural tamaño 6x7.5 cm, perfecto para exhibir cartas coleccionables, fotos o recuerdos especiales.',
      src:   'Mini.jpeg',   
      wa:    'Hola!%20Quiero%20el%20Portarretrato%20Mini%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Convierte un recuerdo especial en una decoración.',''],
        ['Ideal para guardar esa carta, foto o momento especial.',''],
        ['Madera natural que transmite calidez.',''],
        ['Es un regalo pequeño, pero con un gran valor sentimental.',''],
        ['Hace que cualquier colección se vea más elegante y personalizada',''],
        ['Más que un marco, es una forma de conservar emociones y pasiones para siempre.', ''],
      ],
    },
    {
      id:    'port-02',
      name:  'Portarretrato Mediano',
      tag:   'Portaretratos',
      badge: '✦ Edición especial',
      price: '$40.000',
      desc:  'Porta retrato mediano de 13x8 cm en madera natural, ideal para conservar fotos, cartas o recuerdos especiales con un estilo elegante y minimalista.',
      src:   'Mediano.jpeg',   
      wa:    'Hola!%20Quiero%20el%20Portarretrato%20Mediano%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Guarda momentos que valen para siempre',''],
        ['Un recuerdo especial en un solo lugar.',''],
        ['Dale vida a tus mejores recuerdos.',''],
        ['Pequeño detalle, gran significado.',''],
        ['Diseño cálido y elegante para cualquier espacio.',''],
        ['Perfecto para conservar tus pasiones y momentos favoritos.', ''],
      ],
    },
    {
      id:    'port-03',
      name:  'Porta Retrato Normlal',
      tag:   'Portaretratos',
      badge: 'Artesanal',
      price: '$45.000',
      desc:  'Porta retrato grande de 20x13 cm en madera natural, diseñado para destacar tus fotos, cartas y recuerdos más especiales con un acabado elegante y moderno.',
      src:   'Mediano.jpeg',  
      wa:    'Hola!%20Quiero%20el%20Porta%20Retrato%20Normal%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Tus mejores recuerdos merecen destacar.',''],
        ['Conserva momentos que nunca se olvidan.',''],
        ['Dale un espacio especial a lo que amas.',''],
        ['Un detalle elegante con valor sentimental.',''],
        ['Diseño que combina calidez y estilo.',''],
        ['Convierte recuerdos en parte de tu decoración.',''],
      ],
    },
    {
      id:    'port-04',
      name:  'Portarretrato Vaivén Horizontal',
      tag:   'Portaretratos',
      badge: '✦ Nuevo',
      price: '$50.000',
      desc:  'Portarretratos vaivén horizontal con acabado en madera natural, perfecto para decorar y conservar esos momentos únicos que merecen ser recordados.',
      src:   '',  
      wa:    'Hola!%20Quiero%20el%20Portarretrato%20vaivén%20Horizontal%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Convierte recuerdos en decoración.',''],
        ['Momentos especiales siempre cerca de ti.',''],
        ['Resalta lo que más amas.','']
        ['Un regalo lleno de significado.',''],
        ['Diseño cálido y elegante.',''],
        ['Conserva historias que nunca pasan de moda.',''],
      ],
    },
    {
      id:    'port-05',
      name:  'Portarretrato Vaivén Vertical',
      tag:   'Portaretratos',
      badge: ' 🌟Popular',
      price: '$50.000',
      desc:  'Portarretratos vaivén vertical en madera natural, ideal para exhibir fotos y recuerdos especiales con un diseño moderno, elegante y lleno de estilo',
      src:   '',   
      wa:    'Hola!%20Quiero%20el%20Portaretratros%20Vaivén%20Vertical%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Tus recuerdos siempre en movimiento.',''],
        ['Dale vida a tus momentos favoritos.',''],
        ['Un detalle que transmite emociones.',''],
        ['Perfecto para regalar recuerdos especiales.',''],
        ['Elegancia natural para cualquier espacio.',''],
        ['Cada foto cuenta una historia.',''],
      ],
    },
     {
      id:    'port-06',
      name:  'Portarretrato libro ',
      tag:   'Portaretratos',
      badge: 'Lo mas Top',
      price: '$70.000',
      desc:  'Portarretratos tipo libro en madera natural, diseñado para exhibir dos fotos especiales en un formato elegante y creativo que se abre como un recuerdo lleno de historias. ',
      src:   '',   
      wa:    'Hola!%20Quiero%20el%20Portaretratos%20Libro%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Dos recuerdos, un solo lugar especial.',''],
        ['Guarda momentos que conectan corazones.',''],
        ['Cada lado cuenta una historia diferente.',''],
        ['Un detalle único para personas especiales.',''],
        ['Diseño elegante con un toque sentimental.',''],
        ['Revive tus mejores momentos al abrirlo.',''],
      ],
    },
  ],


  //  CUADROS DE MADERA
  'cuadros': [
    {
      id:    'cuad-01',
      name:  'Hablador Pequeño"',
      tag:   'Cuadros de Madera',
      badge: '⭐ Favorito',
      price: '$45.000',
      desc:  'Hablador pequeño de 8x10 cm en madera natural, con diseño tipo columpio que permite exhibir dos fotos o combinar una foto con un mensaje especial. Un detalle creativo, elegante y lleno de movimiento.',
      src:   '',
      wa:    'Hola!%20me%20Gustaria%20el%20Hablador%20Pequeño%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Tus recuerdos siempre en movimiento.',''],
        ['Una foto y un mensaje que lo dicen todo.',''],
        ['Dale vida a momentos inolvidables.',''],
        ['Un detalle pequeño con gran significado.',''],
        ['Diseño creativo que roba miradas.',''],
        ['Cada giro cuenta una historia.',''],
      ],
    },
    {
      id:    'cuad-02',
      name:  'Hablador Grande',
      tag:   'Cuadros de Madera',
      badge: '💛 Especial',
      price: '$50.000',
      desc:  'Hablador grande de 10x15 en madera natural con efecto vaivén, perfecto para mostrar dos fotos especiales o combinar imágenes y mensajes en una decoración única y elegante..',
      src:   '',
      wa:    'Hola!%20Quiero%20el%20Hablador%20Grande%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Recuerdos que se mueven contigo.',''],
        ['Conserva momentos llenos de emoción.',''],
        ['Más espacio para tus historias favoritas.',''],
        ['Un regalo diferente y especial.',''],
        ['Elegancia y creatividad en un solo detalle.',''],
        ['Haz que cada recuerdo destaque.',''],
      ],
    },
    {
      id:    'cuad-03',
      name:  'Giro de Recuerdos',
      tag:   'Cuadros de Madera',
      badge: '📍 Romántico',
      price: '$70.000',
      desc:  'Giro de Recuerdos en madera natural con base rectangular y diseño giratorio, ideal para exhibir dos fotos o combinar una foto con un mensaje especial. Un detalle elegante y creativo para conservar momentos únicos.',
      src:   'Giro.jpeg',
      wa:    'Hola!%20Quiero%20el%20Cuadro%20Giro%20de%20Recuerdos%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Haz girar tus mejores recuerdos.',''],
        ['Una foto y un mensaje que llegan al corazón.',''],
        ['Cada vuelta revive un momento especial.', ''],
        ['Un detalle diferente para sorprender.', ''],
        ['Diseño elegante con significado emocional.', ''],
        ['Tus historias merecen un lugar especial.',''],
      ],
    },
  ],


  //   QITS
  'kits': [
    {
      id:    'kit-01',
      name:  'kit "Deportista"',
      tag:   'kits',
      badge: 'Reciente',
      price: 'Arma tu kuit',
      desc:  'Giro de Recuerdos en madera natural con base rectangular y diseño giratorio, ideal para exhibir dos fotos o combinar una foto con un mensaje especial. Un detalle elegante y creativo para conservar momentos únicos.',
      src:   'kuit.jpeg',   
      wa:    'Hola!%20Quiero%20el%20Qit%20Para%20Siempre%20de%20Toque%20Perfecto%20Gracias.',
      emotional: [
        ['Sorpresa al abrir',  '100% porque si'],
        ['Personalización super premium',    'Incluida'],
        ['Madera colombiana',  'Sí o no te lo pierdas'],
        ['Grabado láser',      'Premium'],
        ['Ternura garantizada','Sí'],
        ['Envío con cariño',   '100/100'],
      ],
    },
  ],
};
  

// 10. RENDER DE PRODUCTOS
function renderProducts(cat) { // La función renderProducts se encarga de generar dinámicamente las tarjetas de productos para una categoría específica. Primero, verifica si el grid correspondiente a la categoría ya ha sido renderizado para evitar duplicados. Luego, itera sobre los datos de los productos de esa categoría y crea elementos HTML para cada producto, incluyendo la imagen (o un placeholder si no hay imagen), la información del producto, y un botón para ver detalles que abre un modal. Finalmente, se inicializan los efectos de tilt y reveal para las tarjetas recién creadas.
  const grid = document.getElementById(`grid-${cat}`);
  if (!grid || grid.dataset.rendered) return;
  grid.dataset.rendered = '1';

  const bgColors = ['#f0e8d8','#e8dcc8','#f5ede0','#eddfd0','#e5d5be','#ead8c5'];

  productData[cat].forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.style.transitionDelay = `${i * 0.07}s`;

    // Si p.src tiene nombre de foto, se muestra la imagen; si está vacío, se muestra el placeholder
    const hasPhoto = p.src && p.src.trim() !== '';

 // El contenido HTML de la tarjeta se construye utilizando template literals, donde se incluye una sección para la imagen (o el placeholder), la información del producto (categoría, nombre, descripción, precio), y un botón para ver detalles que llama a la función openModal con los parámetros de categoría e índice del producto. El fondo de la sección de imagen se asigna de manera cíclica utilizando un array de colores para darle variedad visual a las tarjetas.
    card.innerHTML = `
      <div class="product-img-wrap" style="background:${bgColors[i % bgColors.length]}">
        ${hasPhoto
          ? `<img src="${p.src}" alt="${p.name}" class="product-img">`
          : `<div class="product-mock"><div class="product-mock-label">Toque Perfecto · ${p.tag}</div></div>`
        }
        <div class="product-img-overlay">
          <button class="product-overlay-btn" onclick="openModal('${cat}',${i})">Ver detalles</button>
        </div>
        <div class="product-badge">${p.badge}</div>
      </div>
      <div class="product-info">
        <div class="product-category-tag">${p.tag}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price"><sup>COP </sup>${p.price.replace('$','')}</div>
          <button class="product-add" onclick="openModal('${cat}',${i})">+</button>
        </div>
      </div>`;

    grid.appendChild(card);
  });

  initProductTilt();
  initRevealObserver();
}

renderProducts('alcancías');


//  11. CAMBIO DE CATEGORÍA 
// La función showCategory se encarga de mostrar los productos de una categoría específica cuando el usuario hace clic en un botón de categoría. Primero, oculta todas las grillas de productos y desactiva todos los botones. Luego, muestra la grilla correspondiente a la categoría seleccionada y activa el botón correspondiente. Después, llama a renderProducts para asegurarse de que los productos de esa categoría estén renderizados, y finalmente aplica una animación de entrada a las tarjetas de producto utilizando GSAP para mejorar la experiencia visual.
function showCategory(cat, btn) {
  document.querySelectorAll('.products-grid').forEach(g => g.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`grid-${cat}`).classList.add('active');
  btn.classList.add('active');
  renderProducts(cat);
  gsap.fromTo(`#grid-${cat} .product-card`, { opacity:0, y:35, scale:.97 }, { opacity:1, y:0, scale:1, duration:.65, ease:'power3.out', stagger:.07 });
}
window.showCategory = showCategory;

//  12. MODAL 
// La función openModal se encarga de mostrar un modal con los detalles de un producto específico cuando el usuario hace clic en el botón "Ver detalles" o el botón "+" en la tarjeta del producto. Primero, obtiene los datos del producto correspondiente a la categoría e índice proporcionados. Luego, actualiza el contenido del modal con la información del producto, incluyendo la imagen (o un placeholder si no hay imagen), el nombre, la descripción, la información emocional, el precio, y un enlace para personalizar el producto a través de WhatsApp. Finalmente, muestra el modal y aplica una animación de entrada utilizando GSAP para mejorar la experiencia visual.
function openModal(cat, idx) {
  const p       = productData[cat][idx];
  const modal   = document.getElementById('product-modal');
  const content = document.getElementById('modal-content');
  const imgEl   = document.getElementById('modal-img');
  const iconEl  = document.getElementById('modal-img-icon');
  const ph      = document.getElementById('modal-img-placeholder');

  iconEl.textContent = p.emoji;
  if (p.src && p.src.trim() !== '') {
    imgEl.src = p.src; imgEl.style.display = 'block'; ph.style.display = 'none';
  } else { imgEl.style.display = 'none'; ph.style.display = 'flex'; }

  const rows = p.emotional || [['Amor artesanal','100%'],['Personalización','Incluida'],['Madera colombiana','Sí'],['Grabado láser','Premium'],['Emoción garantizada','100%'],['Envío con cariño','∞']];
  content.innerHTML = `
    <div class="modal-product-tag">${p.tag}</div>
    <div class="modal-product-name">${p.name}</div>
    <div class="modal-product-desc">${p.desc}</div>
    <div class="modal-nutrition">
      <div class="modal-nutrition-title">Información Emocional</div>
      ${rows.map(([k,v])=>`<div class="nutrition-row"><span>${k}</span><span>${v}</span></div>`).join('')}
    </div>
    <div class="modal-price"><sup style="font-size:.95rem;font-family:var(--font-ui);font-weight:300">COP </sup>${p.price.replace('$','')}</div>
    <a href="https://wa.me/573142587574?text=Hola!%20Quiero%20personalizar:%20${encodeURIComponent(p.name)}%20Gracias." target="_blank" class="modal-btn">Personaliza ya →</a>`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  gsap.fromTo('.modal-box', { y:55, opacity:0, scale:.95 }, { y:0, opacity:1, scale:1, duration:.55, ease:'power4.out' });
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  gsap.to('.modal-box', {
    y:40, opacity:0, scale:.96, duration:.4, ease:'power3.in',
    onComplete: () => { modal.classList.remove('open'); document.body.style.overflow = ''; }
  });
}
document.getElementById('product-modal').addEventListener('click', e => { if (e.target.id === 'product-modal') closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
window.openModal  = openModal;
window.closeModal = closeModal;


// 13. REVEAL OBSERVER 
// La función initRevealObserver se encarga de crear un IntersectionObserver que observa los elementos con la clase "reveal" que aún no tienen la clase "visible". Cuando un elemento observado entra en el viewport (con un umbral del 10% y un margen inferior de -35px), se le agrega la clase "visible" para activar las animaciones CSS asociadas, y luego se deja de observar ese elemento para mejorar el rendimiento. Esta función se llama inicialmente para configurar el observer, y también se llama después de renderizar los productos para asegurarse de que las nuevas tarjetas también sean observadas.
function initRevealObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
  }, { threshold: 0.10, rootMargin: '0px 0px -35px 0px' });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}
initRevealObserver();

// 14. HOVER 3D EN CÁPSULAS 
// Este código agrega un efecto de hover 3D a los elementos con la clase "capsula". Al mover el mouse sobre una cápsula, se calcula la posición del mouse relativa al centro de la cápsula para determinar los ángulos de rotación en los ejes X e Y. Luego, se utiliza GSAP para animar la rotación de la cápsula con una perspectiva y una duración específicas. Cuando el mouse sale de la cápsula, se anima de vuelta a su posición original con un efecto elástico.
document.querySelectorAll('.capsula').forEach(cap => {
  cap.addEventListener('mousemove', e => {
    const r  = cap.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    gsap.to(cap, { rotateY: dx*14, rotateX:-dy*9, transformPerspective:700, duration:.35, ease:'power2.out', overwrite:'auto' });
  });
  cap.addEventListener('mouseleave', () => {
    gsap.to(cap, { rotateY:0, rotateX:0, duration:.8, ease:'elastic.out(1,.5)' });
  });
});

//  15. LOGO FALLBACK 
// Este código selecciona todas las imágenes que tienen un ID que termina con "-logo-img" o que tienen la clase "loader-logo". Para cada una de estas imágenes, se agrega un event listener para el evento "error". Si la imagen no se carga correctamente (por ejemplo, si el archivo de imagen no existe), se ejecuta la función que establece el atributo "src" de la imagen a un SVG codificado en línea que muestra un diseño alternativo del logo de "Toque Perfecto". Esto garantiza que siempre haya una representación visual del logo, incluso si las imágenes originales no están disponibles.
document.querySelectorAll('[id$="-logo-img"], .loader-logo').forEach(img => {
  img.addEventListener('error', function() {
    this.src = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"><rect width="200" height="80" fill="#fef5e4" rx="4"/><text x="100" y="28" font-family="serif" font-size="20" font-weight="900" fill="#3d1c0a" text-anchor="middle">Toque</text><text x="100" y="52" font-family="serif" font-size="20" font-weight="900" fill="#3d1c0a" text-anchor="middle">Perfecto</text><text x="100" y="70" font-family="sans-serif" font-size="9" fill="#b79858" text-anchor="middle" letter-spacing="3">detalles</text></svg>')}`;
  });
});

//  16. EASTER EGG 
// Este código implementa un easter egg que se activa al ingresar la famosa secuencia de teclas "Konami Code" (arriba, arriba, abajo, abajo, izquierda, derecha, izquierda, derecha, B, A). Se define un array con los códigos de las teclas correspondientes a esta secuencia y se mantiene un índice para rastrear el progreso del usuario. Al escuchar el evento "keydown", se verifica si la tecla presionada coincide con el siguiente código en la secuencia. Si el usuario completa la secuencia correctamente, se aplica un filtro de hue-rotate a todo el cuerpo del documento para crear un efecto visual divertido, y luego se revierte después de unos segundos. Si el usuario presiona una tecla incorrecta en cualquier momento, el índice se reinicia.
const KC = [38,38,40,40,37,39,37,39,66,65]; let ki = 0;
document.addEventListener('keydown', e => {
  if (e.keyCode === KC[ki]) { ki++; if (ki === KC.length) { gsap.to('body',{filter:'hue-rotate(180deg)',duration:.5}); gsap.to('body',{filter:'hue-rotate(0deg)',duration:.5,delay:3}); ki=0; } }
  else ki = 0;
});

// 17. SOPORTE TÁCTIL (TOUCH) — móvil
// En dispositivos táctiles, desactivar el cursor personalizado y habilitar
// el efecto hover/tilt en tarjetas y cápsulas al deslizar el dedo.
(function initTouch() {
  const isTouch = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (!isTouch()) return;

  // --- Deshabilitar cursor personalizado en touch ---
  if (cursorEl)   cursorEl.style.display   = 'none';
  if (followerEl) followerEl.style.display = 'none';
  document.body.style.cursor = 'auto';

  // --- Touch tilt en .product-card ---
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const r = card.getBoundingClientRect();
      const dx = (t.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (t.clientY - r.top  - r.height / 2) / (r.height / 2);
      gsap.to(card, { rotateY: dx * 10, rotateX: -dy * 7, transformPerspective: 700, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    }, { passive: true });

    card.addEventListener('touchend', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,.5)' });
    }, { passive: true });
  });

  // --- Touch tilt en .capsula ---
  document.querySelectorAll('.capsula').forEach(cap => {
    cap.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const r = cap.getBoundingClientRect();
      const dx = (t.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (t.clientY - r.top  - r.height / 2) / (r.height / 2);
      gsap.to(cap, { rotateY: dx * 14, rotateX: -dy * 9, transformPerspective: 700, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    }, { passive: true });

    cap.addEventListener('touchend', () => {
      gsap.to(cap, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1,.5)' });
    }, { passive: true });
  });

  // --- Touch tilt en .panini-card --featured ---
  document.querySelectorAll('.panini-card--featured').forEach(card => {
    card.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const r = card.getBoundingClientRect();
      const dx = (t.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (t.clientY - r.top  - r.height / 2) / (r.height / 2);
      gsap.to(card, { rotateY: dx * 8, rotateX: -dy * 6, transformPerspective: 900, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    }, { passive: true });

    card.addEventListener('touchend', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1,.5)' });
    }, { passive: true });
  });
})();

console.log('%c✦ Toque Perfecto — Hecho con amor ✦', 'color:#b79858;font-family:serif;font-size:16px;font-style:italic');

