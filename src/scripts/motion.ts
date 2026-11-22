import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let activeLenis: Lenis | null = null;
let cleanups: Array<() => void> = [];

export function destroyMotion() {
  ScrollTrigger.getAll().forEach((st) => st.kill());
  cleanups.forEach((fn) => fn());
  cleanups = [];
  if (activeLenis) {
    activeLenis.destroy();
    activeLenis = null;
  }
  (window as any).__lenis = null;
}

/** Wraps every word of an element in a clipping mask and returns the moving inner spans. */
function splitWords(root: HTMLElement): HTMLElement[] {
  const inner: HTMLElement[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.parentElement?.closest('svg')) continue;
    if (node.textContent && node.textContent.trim()) textNodes.push(node);
  }
  textNodes.forEach((node) => {
    const frag = document.createDocumentFragment();
    (node.textContent || '').split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(' '));
        return;
      }
      const mask = document.createElement('span');
      mask.className = 'sw';
      const word = document.createElement('span');
      word.textContent = part;
      mask.appendChild(word);
      frag.appendChild(mask);
      inner.push(word);
    });
    node.replaceWith(frag);
  });
  return inner;
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

  const finePointer = window.matchMedia('(pointer: fine)').matches;

  // 1. Lenis smooth scrolling in step with ScrollTrigger
  const lenis = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  activeLenis = lenis;
  (window as any).__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  cleanups.push(() => gsap.ticker.remove(raf));

  const onLayout = () => ScrollTrigger.refresh();
  window.addEventListener('verdi:layout', onLayout);
  cleanups.push(() => window.removeEventListener('verdi:layout', onLayout));

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

  // 2. Scroll progress in the Italian colours
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.15 },
    });
  }

  // 3. Hero entrance: photo settles, headline rises word by word, snapshot drops in
  const heroImage = document.querySelector<HTMLElement>('[data-hero-image]');
  if (heroImage) {
    gsap.fromTo(heroImage, { scale: 1.16 }, { scale: 1, duration: 2.2, ease: 'power3.out' });
  }

  const heroTitle = document.querySelector<HTMLElement>('[data-split-hero]');
  if (heroTitle) {
    const words = splitWords(heroTitle);
    gsap.fromTo(
      words,
      { yPercent: 125, rotate: 4 },
      { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.085, delay: 0.15, ease: 'power4.out' }
    );
    const underline = heroTitle.querySelector<SVGPathElement>('[data-draw]');
    if (underline) {
      gsap.fromTo(
        underline,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.9, delay: 1.0, ease: 'power2.inOut' }
      );
    }
  }

  const heroFades = document.querySelectorAll('[data-hero-fade]');
  if (heroFades.length) {
    gsap.fromTo(
      heroFades,
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger: 0.09, delay: 0.3, ease: 'power3.out', clearProps: 'opacity' }
    );
  }

  const heroSnap = document.querySelector<HTMLElement>('[data-hero-snap]');
  if (heroSnap) {
    gsap.fromTo(
      heroSnap,
      { y: -70, rotation: 14, opacity: 0, scale: 0.9 },
      { y: 0, rotation: 0, opacity: 1, scale: 1, duration: 1.3, delay: 0.75, ease: 'elastic.out(1, 0.6)' }
    );
  }

  // 4. Section headlines: masked word reveal
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((title) => {
    const words = splitWords(title);
    gsap.fromTo(
      words,
      { yPercent: 125 },
      {
        yPercent: 0,
        duration: 0.95,
        stagger: 0.055,
        ease: 'power4.out',
        scrollTrigger: { trigger: title, start: 'top 88%', once: true },
      }
    );
  });

  // 5. Hand-drawn strokes (arrows, underlines) draw themselves
  document.querySelectorAll<SVGPathElement>('[data-draw]').forEach((path) => {
    if (path.closest('[data-split-hero]')) return;
    gsap.fromTo(
      path,
      { strokeDasharray: 1, strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: path, start: 'top 82%', once: true },
      }
    );
  });

  // 6. Running word bands: constant drift, pushed and leaned by scroll speed
  document.querySelectorAll<HTMLElement>('[data-band]').forEach((band) => {
    const base = Number(band.dataset.speed || 40);
    let x = 0;
    let dir = -1;
    let skew = 0;
    const tick = (_t: number, delta: number) => {
      const half = band.scrollWidth / 2;
      if (!half) return;
      const v = lenis.velocity || 0;
      if (Math.abs(v) > 0.4) dir = v > 0 ? -1 : 1;
      x += dir * (base + Math.min(Math.abs(v) * 26, 900)) * (delta / 1000);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew += (gsap.utils.clamp(-9, 9, v * 0.22) - skew) * 0.12;
      band.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${(-skew).toFixed(2)}deg)`;
    };
    gsap.ticker.add(tick);
    cleanups.push(() => gsap.ticker.remove(tick));
  });

  // 7. Layered parallax
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 30);
    gsap.fromTo(
      el,
      { y: -amount * 0.5 },
      { y: amount, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.7 } }
    );
  });

  // 8. Staggered text groups
  document.querySelectorAll<HTMLElement>('[data-stagger-group]').forEach((group) => {
    const children = group.querySelectorAll('[data-stagger-item]');
    if (!children.length) return;
    gsap.fromTo(
      children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: group, start: 'top 86%', once: true },
      }
    );
  });

  // 9. Photos: curtain wipe with the picture easing back inside the frame
  document.querySelectorAll<HTMLElement>('[data-clip-reveal]').forEach((frame) => {
    const img = frame.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 84%', once: true } });
    tl.fromTo(
      frame,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'power4.inOut', clearProps: 'clipPath' }
    );
    if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.7, ease: 'power3.out', clearProps: 'transform' }, 0);
  });

  // 10. Prints land on the page with a little spin
  document.querySelectorAll<HTMLElement>('[data-snap-in]').forEach((snap, i) => {
    const hasParallax = snap.hasAttribute('data-parallax');
    gsap.from(snap, {
      rotation: i % 2 ? '-=12' : '+=12',
      scale: 0.72,
      opacity: 0,
      duration: 1.1,
      ease: 'back.out(1.5)',
      clearProps: hasParallax ? 'opacity' : 'transform,opacity',
      scrollTrigger: { trigger: snap, start: 'top 90%', once: true },
    });
  });

  // 11. Gallery strip: prints slide in from the side one after another
  const strip = document.getElementById('photo-strip');
  if (strip) {
    gsap.from(strip.querySelectorAll('[data-strip-card]'), {
      x: 160,
      opacity: 0,
      duration: 1.05,
      stagger: 0.09,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: strip, start: 'top 85%', once: true },
    });
  }

  // 12. Guest notes get pinned up, then the marker runs over the best phrase
  document.querySelectorAll<HTMLElement>('[data-marker-group]').forEach((group) => {
    const notes = group.querySelectorAll('[data-note]');
    gsap.from(notes, {
      y: 70,
      opacity: 0,
      rotation: (i) => (i % 2 ? '+=5' : '-=5'),
      duration: 0.95,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: group,
        start: 'top 80%',
        once: true,
        onEnter: () => gsap.delayedCall(0.5, () => group.classList.add('is-inked')),
      },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-bar]').forEach((bar) => {
    gsap.fromTo(
      bar,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: bar, start: 'top 92%', once: true } }
    );
  });

  // 13. Count-up numbers
  document.querySelectorAll<HTMLElement>('[data-count-to]').forEach((el) => {
    const target = Number(el.dataset.countTo || 0);
    const decimals = Number(el.dataset.countDecimals || 0);
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent =
              decimals > 0 ? counter.val.toFixed(decimals).replace('.', ',') : Math.round(counter.val).toString();
          },
          onComplete: () => {
            el.textContent = el.dataset.countDisplay || el.textContent;
          },
        });
      },
    });
  });

  // 14. The map draws itself, then the pin drops
  document.querySelectorAll<HTMLElement>('[data-map]').forEach((map) => {
    ScrollTrigger.create({ trigger: map, start: 'top 78%', once: true, onEnter: () => map.classList.add('is-drawn') });
  });

  // 15. Footer sign: frame is drawn, the sign swings out and reacts to scroll speed
  const sign = document.querySelector<SVGElement>('[data-sign]');
  const swing = sign?.querySelector<SVGGElement>('.sign-swing');
  if (sign && swing) {
    gsap.set(swing, { svgOrigin: '260 46' });
    let settled = false;
    const settle = (from: number) =>
      gsap.fromTo(swing, { rotation: from }, { rotation: 0, duration: 4.2, ease: 'elastic.out(1.15, 0.2)', overwrite: true });
    ScrollTrigger.create({
      trigger: sign,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        sign.classList.add('is-hung');
        settle(11).eventCallback('onComplete', () => {
          settled = true;
        });
        gsap.delayedCall(1.2, () => {
          settled = true;
        });
      },
    });
    let kickAt = 0;
    const onScroll = () => {
      if (!settled) return;
      const now = performance.now();
      const v = lenis.velocity || 0;
      if (Math.abs(v) < 14 || now - kickAt < 900) return;
      const r = sign.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      kickAt = now;
      settle(gsap.utils.clamp(-9, 9, -v * 0.22));
    };
    lenis.on('scroll', onScroll);
    if (finePointer) sign.addEventListener('pointerenter', () => settled && settle(7));
  }

  // 16. Oversized farewell drifts sideways
  document.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
    gsap.fromTo(
      el,
      { xPercent: 7 },
      { xPercent: -7, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }
    );
  });

  // 17. Magnetic call-to-action buttons (mouse only)
  if (finePointer) {
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
  }

  // fonts change headline metrics: re-measure once they are in
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
