(() => {
  const body = document.body;
  const preloader = document.getElementById('preloader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const siteHeader = document.getElementById('siteHeader');
  let previousScrollY = window.scrollY;
  let headerFrameRequested = false;

  const updateHeaderState = () => {
    const currentScrollY = Math.max(window.scrollY, 0);
    const delta = currentScrollY - previousScrollY;

    siteHeader?.classList.toggle('is-scrolled', currentScrollY > 18);

    if (body.classList.contains('menu-open') || currentScrollY < 96) {
      siteHeader?.classList.remove('is-hidden');
    } else if (delta > 7) {
      siteHeader?.classList.add('is-hidden');
    } else if (delta < -4) {
      siteHeader?.classList.remove('is-hidden');
    }

    previousScrollY = currentScrollY;
    headerFrameRequested = false;
  };

  const requestHeaderUpdate = () => {
    if (headerFrameRequested) return;
    headerFrameRequested = true;
    requestAnimationFrame(updateHeaderState);
  };

  updateHeaderState();
  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });

  body.classList.add('is-loading');

  const hideLoader = () => {
    window.setTimeout(() => {
      preloader?.classList.add('is-hidden');
      body.classList.remove('is-loading');
    }, 700);
  };

  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader, { once: true });

  menuToggle?.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    siteHeader?.classList.remove('is-hidden');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu?.setAttribute('aria-hidden', String(!isOpen));
  });

  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      body.classList.remove('menu-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
      mobileMenu?.setAttribute('aria-hidden', 'true');
    });
  });

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      const targetTop = target.getBoundingClientRect().top + window.scrollY - 18;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  const revealTargets = [
    '.hero-media',
    '.hero-copy > *',
    '.trusted-strip p',
    '.trusted-logos span',
    '.about-top > *',
    '.about-copy > *',
    '.metric-grid article',
    '.about-image',
    '.section-heading > *',
    '.case-row',
    '.case-image',
    '.case-content > *',
    '.expertise-row',
    '.expertise-copy > *',
    '.expertise-image',
    '.testimonial-heading > *',
    '.quote-card',
    '.testimonial-media',
    '.newsletter-inner > *',
    '.contact-heading > *',
    '.contact-form label',
    '.contact-form button',
    '.footer-statement > *',
    '.footer-links > div'
  ];

  revealTargets.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (!element.classList.contains('reveal')) {
        element.classList.add('reveal');
      }
      element.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
    });
  });

  const elements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    elements.forEach((element) => observer.observe(element));
  } else {
    elements.forEach((element) => element.classList.add('is-visible'));
  }
})();


(() => {
  const intro = document.querySelector('.about-intro');
  if (!intro) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateIntroProgress = () => {
    const rect = intro.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const progress = clamp(((vh * 0.92) - rect.top) / (vh + rect.height * 0.55), 0, 1);
    intro.style.setProperty('--intro-progress', `${(progress * 100).toFixed(1)}%`);
    intro.classList.toggle('is-active', progress > 0.04 && progress < 1);
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateIntroProgress();
      ticking = false;
    });
  };

  updateIntroProgress();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
})();


(() => {
  const slider = document.getElementById('storiesSlider');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.story-slide'));
  if (!slides.length) return;

  let current = 0;
  let timer;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
  };

  const nextSlide = () => showSlide(current + 1);
  const prevSlide = () => showSlide(current - 1);
  const restart = () => {
    clearInterval(timer);
    timer = setInterval(nextSlide, 5000);
  };

  slider.addEventListener('click', (event) => {
    const button = event.target.closest('.story-control');
    if (!button) return;
    if (button.classList.contains('story-control--next')) nextSlide();
    if (button.classList.contains('story-control--prev')) prevSlide();
    restart();
  });

  showSlide(0);
  restart();
})();
