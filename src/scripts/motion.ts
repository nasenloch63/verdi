import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let activeLenis: Lenis | null = null;
let rafCallback: ((time: number) => void) | null = null;

export function destroyMotion() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  if (rafCallback) {
    gsap.ticker.remove(rafCallback);
    rafCallback = null;
  }
  if (activeLenis) {
    activeLenis.destroy();
    activeLenis = null;
  }
}

export function initMotion() {
  destroyMotion();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
      el.textContent = el.dataset.countDisplay || el.textContent;
    });
    return;
  }

  // 1. Silky Lenis Smooth Scrolling synced with GSAP ScrollTrigger
  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  activeLenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  rafCallback = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(rafCallback);
  gsap.ticker.lagSmoothing(0);

  // Smooth anchor scrolling with Lenis
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id) as HTMLElement | null;
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -72 });
      }
    });
  });

  // 2. Top Scroll Progress Ribbon
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
      },
    });
  }

  // 3. Hero Masked Headline & Staggered Entrance Choreography
  const heroLines = document.querySelectorAll('[data-hero-line]');
  if (heroLines.length) {
    gsap.fromTo(
      heroLines,
      { yPercent: 108, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.1,
        ease: 'power4.out',
        clearProps: 'transform,opacity',
      }
    );
  }

  const heroFades = document.querySelectorAll('[data-hero-fade]');
  if (heroFades.length) {
    gsap.fromTo(
      heroFades,
      { y: 22, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.18,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      }
    );
  }

  // 4. Scroll-Driven Kinetic Editorial Ticker
  document.querySelectorAll<HTMLElement>('[data-kinetic-ticker]').forEach((ticker) => {
    const dir = Number(ticker.dataset.direction || -1);
    gsap.to(ticker, {
      xPercent: dir * 14,
      ease: 'none',
      scrollTrigger: {
        trigger: ticker.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  });

  // 5. Multi-Layer Scrubbed Parallax (Hero cards + Über uns photo collage)
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 30);
    gsap.fromTo(
      el,
      { y: -amount * 0.5 },
      {
        y: amount,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
        },
      }
    );
  });

  // 6. Editorial Section Reveals (staggered upward glides)
  document.querySelectorAll<HTMLElement>('[data-stagger-group]').forEach((group) => {
    const children = group.querySelectorAll('[data-stagger-item]');
    if (!children.length) return;
    gsap.fromTo(
      children,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.72,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: group,
          start: 'top 86%',
          once: true,
        },
      }
    );
  });

  // 7. Gallery Editorial Clip-Path Wipes
  document.querySelectorAll<HTMLElement>('[data-clip-reveal]').forEach((card, i) => {
    gsap.fromTo(
      card,
      { clipPath: 'inset(10% 0% 0% 0% round 24px)', y: 24, opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0% round 24px)',
        y: 0,
        opacity: 1,
        duration: 0.82,
        delay: (i % 4) * 0.06,
        ease: 'power3.out',
        clearProps: 'clipPath,transform,opacity',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          once: true,
        },
      }
    );
  });

  // 8. Animated Count-Up Metrics
  document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo || 0);
    const decimals = Number(el.dataset.countDecimals || 0);
    const suffix = el.dataset.countSuffix || '';
    const counter = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: () => {
            const formatted =
              decimals > 0
                ? counter.val.toFixed(decimals).replace('.', ',')
                : Math.round(counter.val).toString();
            el.textContent = `${formatted}${suffix}`;
          },
        });
      },
    });
  });

  // 9. Magnetic Primary Buttons (Desktop pointer only)
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
      const strength = 0.22;
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        gsap.to(btn, { x, y, duration: 0.35, ease: 'power3.out' });
      });
      btn.addEventListener('pointerleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.45)' });
      });
    });

    // 10. 3D Perspective Tilt Cards with Specular Sheen
    document.querySelectorAll<HTMLElement>('[data-tilt-card]').forEach((card) => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotY = (px - 0.5) * 12;
        const rotX = (0.5 - py) * 12;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 900,
          duration: 0.35,
          ease: 'power2.out',
        });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power3.out',
        });
      });
    });
  }
}
