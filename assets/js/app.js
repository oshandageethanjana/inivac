(() => {
  'use strict';

  const doc = document;
  const body = doc.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  body.classList.add('is-loading');

  const qs = (selector, scope = doc) => scope.querySelector(selector);
  const qsa = (selector, scope = doc) => [...scope.querySelectorAll(selector)];

  /* -----------------------------------------------------------
     Preloader — logo letters reveal from darkness into blue/white
  ----------------------------------------------------------- */
  const preloader = qs('#preloader');
  const loaderLetters = qsa('.preloader__brand span');

  const finishLoader = () => {
    if (!preloader) return;
    body.classList.remove('is-loading');

    if (window.gsap && !reducedMotion) {
      gsap.timeline()
        .to('.preloader__content', { y: -18, opacity: 0, duration: .55, ease: 'power3.in' })
        .to(preloader, { yPercent: -100, duration: .9, ease: 'power4.inOut' }, '-=.1')
        .set(preloader, { display: 'none' })
        .from('.site-header', { y: -30, opacity: 0, duration: .75, ease: 'power3.out' }, '-=.25')
        .from('.hero-title .title-line', { yPercent: 115, opacity: 0, duration: 1, stagger: .1, ease: 'power4.out' }, '-=.6')
        .from('.hero .eyebrow, .hero-lead, .hero-actions, .hero-stats', { y: 24, opacity: 0, duration: .75, stagger: .08, ease: 'power3.out' }, '-=.65');
    } else {
      preloader.style.display = 'none';
    }
  };

  const runLoader = () => {
    if (!preloader || reducedMotion) {
      finishLoader();
      return;
    }

    const duration = 1450;

    if (window.gsap) {
      gsap.to(loaderLetters, {
        color: '#fff',
        opacity: 1,
        y: 0,
        textShadow: '0 0 24px rgba(62,131,255,.72)',
        duration: .8,
        stagger: .1,
        ease: 'power3.out'
      });
    } else {
      loaderLetters.forEach((letter, index) => {
        setTimeout(() => {
          letter.style.color = '#fff';
          letter.style.opacity = '1';
          letter.style.transform = 'translateY(0)';
        }, index * 90);
      });
    }

    window.setTimeout(finishLoader, duration);
  };

  window.addEventListener('load', runLoader, { once: true });
  setTimeout(() => { if (body.classList.contains('is-loading')) finishLoader(); }, 2800);

  /* -----------------------------------------------------------
     Smooth scrolling + GSAP ScrollTrigger
  ----------------------------------------------------------- */
  const lenis = null;


  qsa('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = qs(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      if (body.classList.contains('menu-open')) closeMenu();
      const top = target.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    qsa('.reveal-up').forEach((el) => {
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: .82,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    qsa('.reveal-scale').forEach((el) => {
      gsap.from(el, {
        scale: .94,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      });
    });

    gsap.to('.about-visual__orb', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });

    gsap.to('.project--large .browser-frame', {
      yPercent: -8,
      rotateY: 2,
      ease: 'none',
      scrollTrigger: { trigger: '.project--large', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });

    const contactCta = qs('.contact-cta');
    if (contactCta) {
      gsap.fromTo(contactCta,
        { y: 130, clipPath: 'inset(100% 0 0 0 round 44px 44px 0 0)' },
        {
          y: 0,
          clipPath: 'inset(0% 0 0 0 round 44px 44px 0 0)',
          ease: 'none',
          scrollTrigger: { trigger: contactCta, start: 'top 96%', end: 'top 48%', scrub: 1.05 }
        }
      );
    }
  }

  /* -----------------------------------------------------------
     Header, scroll progress and active navigation
  ----------------------------------------------------------- */
  const header = qs('#siteHeader');
  const scrollProgress = qs('#scrollProgress');
  const navLinks = qsa('.desktop-nav a[href^="#"]');
  const sections = qsa('main section[id]');

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 28);

    const max = doc.documentElement.scrollHeight - window.innerHeight;
    const percentage = max > 0 ? (y / max) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${percentage}%`;

    let current = 'top';
    sections.forEach((section) => {
      if (y >= section.offsetTop - 160) current = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -----------------------------------------------------------
     Mobile menu
  ----------------------------------------------------------- */
  const menuToggle = qs('#menuToggle');
  const mobileMenu = qs('#mobileMenu');

  function openMenu() {
    body.classList.add('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    if (window.gsap) gsap.from('.mobile-menu__links a', { y: 35, opacity: 0, stagger: .06, duration: .55, ease: 'power3.out' });
  }

  function closeMenu() {
    body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  }

  menuToggle?.addEventListener('click', () => body.classList.contains('menu-open') ? closeMenu() : openMenu());
  qsa('.mobile-menu a').forEach((link) => link.addEventListener('click', closeMenu));

  /* -----------------------------------------------------------
     Premium services slider
  ----------------------------------------------------------- */
  if (window.Swiper) {
    new Swiper('.services-swiper', {
      slidesPerView: 1.12,
      spaceBetween: 16,
      speed: 850,
      grabCursor: true,
      centeredSlides: false,
      watchSlidesProgress: true,
      keyboard: { enabled: true },
      mousewheel: { forceToAxis: true, releaseOnEdges: true },
      navigation: { nextEl: '.services-next', prevEl: '.services-prev' },
      pagination: { el: '.services-pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 1.55, spaceBetween: 18 },
        920: { slidesPerView: 2.35, spaceBetween: 22 },
        1200: { slidesPerView: 3.15, spaceBetween: 24 }
      }
    });
  }

  /* -----------------------------------------------------------
     Animated counters
  ----------------------------------------------------------- */
  const counters = qsa('[data-count]');
  const animateCount = (el) => {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    const target = Number(el.dataset.count || 0);
    const duration = 1500;
    const start = performance.now();
    const update = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = Math.round(target * eased).toLocaleString();
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) animateCount(entry.target); });
  }, { threshold: .55 });
  counters.forEach((counter) => counterObserver.observe(counter));

  /* -----------------------------------------------------------
     Standard pointer interactions
  ----------------------------------------------------------- */

  /* -----------------------------------------------------------
     Hero WebGL wave — Three.js with graceful canvas fallback
  ----------------------------------------------------------- */
  const heroCanvas = qs('#heroWave');

  const createFallbackWave = (canvas, options = {}) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let rafId = 0;
    const lines = options.lines || 34;
    const amplitude = options.amplitude || 56;
    const color = options.color || '72,138,255';

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);
      const t = time * .00055;
      const startX = width * .38;
      const endX = width * 1.12;
      ctx.globalCompositeOperation = 'lighter';
      for (let row = 0; row < lines; row++) {
        const alpha = .05 + (row / lines) * .11;
        ctx.beginPath();
        for (let x = startX; x <= endX; x += 9) {
          const norm = (x - startX) / Math.max(1, endX - startX);
          const baseY = height * (.27 + row * .012);
          const y = baseY + Math.sin(norm * 9 + t + row * .18) * amplitude + Math.sin(norm * 3.3 - t * 1.4) * amplitude * .65;
          if (x === startX) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${color},${alpha})`;
        ctx.lineWidth = row % 6 === 0 ? 1.2 : .65;
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
      rafId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  };

  const initThreeWave = () => {
    if (!heroCanvas || !window.THREE || reducedMotion) {
      createFallbackWave(heroCanvas);
      return;
    }

    try {
      const THREE = window.THREE;
      const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
      camera.position.set(0, 1.35, 8.45);

      const cols = 116;
      const rows = 62;
      const count = cols * rows;
      const positions = new Float32Array(count * 3);
      const base = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const colorA = new THREE.Color('#2f70ff');
      const colorB = new THREE.Color('#8ddcff');
      let ptr = 0;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x / (cols - 1) - .5) * 13.8 + 1.8;
          const pz = (y / (rows - 1) - .5) * 8.7;
          const py = 0;
          positions[ptr] = base[ptr] = px;
          positions[ptr + 1] = base[ptr + 1] = py;
          positions[ptr + 2] = base[ptr + 2] = pz;
          const mix = x / cols;
          const c = colorA.clone().lerp(colorB, mix);
          colors[ptr] = c.r;
          colors[ptr + 1] = c.g;
          colors[ptr + 2] = c.b;
          ptr += 3;
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms: { uSize: { value: 3.0 * renderer.getPixelRatio() } },
        vertexShader: `
          uniform float uSize;
          varying vec3 vColor;
          varying float vAlpha;
          void main(){
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
            gl_PointSize = uSize * (9.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            vAlpha = smoothstep(-4.8, 1.2, position.x);
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main(){
            float d = distance(gl_PointCoord, vec2(.5));
            float a = smoothstep(.5, .05, d) * vAlpha;
            gl_FragColor = vec4(vColor, a);
          }
        `
      });

      const points = new THREE.Points(geometry, material);
      points.rotation.x = -.28;
      points.rotation.z = -.06;
      scene.add(points);

      const mouse = { x: 0, y: 0 };
      window.addEventListener('pointermove', (event) => {
        mouse.x = (event.clientX / window.innerWidth - .5) * .5;
        mouse.y = (event.clientY / window.innerHeight - .5) * .3;
      }, { passive: true });

      const resize = () => {
        const rect = heroCanvas.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / Math.max(1, rect.height);
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener('resize', resize, { passive: true });

      const clock = new THREE.Clock();
      const posAttr = geometry.getAttribute('position');
      const animate = () => {
        const t = clock.getElapsedTime();
        const array = posAttr.array;
        for (let i = 0; i < count; i++) {
          const ix = i * 3;
          const x = base[ix];
          const z = base[ix + 2];
          const envelope = .45 + Math.max(0, (x + 4) / 10) * .75;
          array[ix + 1] = Math.sin(x * .78 + t * 1.25) * .42 * envelope + Math.cos(z * .92 - t * .9) * .52 + Math.sin((x + z) * .38 + t) * .2;
        }
        posAttr.needsUpdate = true;
        points.rotation.y += (mouse.x - points.rotation.y) * .025;
        points.rotation.x += ((-.28 + mouse.y) - points.rotation.x) * .025;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();
    } catch (error) {
      console.warn('WebGL wave fallback activated:', error);
      createFallbackWave(heroCanvas);
    }
  };
  initThreeWave();

  /* CTA canvas wave */
  createFallbackWave(qs('#ctaWave'), { lines: 22, amplitude: 30, color: '177,217,255' });

  /* Pause marquee animation when the page is hidden */
  doc.addEventListener('visibilitychange', () => {
    qsa('.testimonial-track, .marquee__track').forEach((track) => {
      track.style.animationPlayState = doc.hidden ? 'paused' : '';
    });
  });
})();
