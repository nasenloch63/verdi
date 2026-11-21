import * as THREE from 'three';

function createCrustTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bctx = bumpCanvas.getContext('2d')!;

  // Base warm stone-oven dough tone
  const baseGrad = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, size / 2);
  baseGrad.addColorStop(0, '#E3B474');
  baseGrad.addColorStop(0.7, '#D49852');
  baseGrad.addColorStop(1, '#B87635');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, size, size);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, size, size);

  // Subtle flour & baked dough grain
  let seed = 42;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < 420; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 4 + rand() * 18;
    const isBlister = rand() > 0.78;

    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    if (isBlister) {
      // Neapolitan leopard-spotting char blister
      g.addColorStop(0, 'rgba(42, 24, 14, 0.78)');
      g.addColorStop(0.55, 'rgba(110, 56, 22, 0.42)');
      g.addColorStop(1, 'rgba(180, 115, 50, 0)');
    } else {
      // Golden toasted flour/crust variation
      g.addColorStop(0, rand() > 0.5 ? 'rgba(246, 224, 184, 0.35)' : 'rgba(165, 98, 42, 0.25)');
      g.addColorStop(1, 'rgba(212, 152, 82, 0)');
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Bump bubble
    const bg = bctx.createRadialGradient(x, y, 0, x, y, r);
    bg.addColorStop(0, isBlister ? 'rgba(255,255,255,0.65)' : 'rgba(210,210,210,0.35)');
    bg.addColorStop(1, 'rgba(128,128,128,0)');
    bctx.fillStyle = bg;
    bctx.beginPath();
    bctx.arc(x, y, r, 0, Math.PI * 2);
    bctx.fill();
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

function createSauceTexture(): { map: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture } {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;

  const b = document.createElement('canvas');
  b.width = size;
  b.height = size;
  const bctx = b.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
  grad.addColorStop(0, '#C22C1A');
  grad.addColorStop(0.75, '#A82314');
  grad.addColorStop(1, '#851A0E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  bctx.fillStyle = '#707070';
  bctx.fillRect(0, 0, size, size);

  let seed = 1337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  // Crushed San Marzano tomato pulp & oregano flecks
  for (let i = 0; i < 650; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 1.5 + rand() * 8;
    const isHerb = rand() > 0.88;
    ctx.fillStyle = isHerb
      ? 'rgba(34, 68, 42, 0.55)'
      : rand() > 0.5
        ? 'rgba(218, 66, 40, 0.25)'
        : 'rgba(122, 22, 12, 0.28)';
    ctx.beginPath();
    ctx.arc(x, y, isHerb ? r * 0.45 : r, 0, Math.PI * 2);
    ctx.fill();

    bctx.fillStyle = rand() > 0.5 ? 'rgba(220,220,220,0.35)' : 'rgba(60,60,60,0.35)';
    bctx.beginPath();
    bctx.arc(x, y, r, 0, Math.PI * 2);
    bctx.fill();
  }

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = new THREE.CanvasTexture(b);
  return { map, bumpMap };
}

function createBasilLeafGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.18, 0.08, 0.22, 0.34, 0, 0.52);
  shape.bezierCurveTo(-0.22, 0.34, -0.18, 0.08, 0, 0);

  const geo = new THREE.ShapeGeometry(shape, 10);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Natural cupped leaf curl
    const z = Math.sin((y / 0.52) * Math.PI) * 0.06 - Math.abs(x) * 0.18;
    pos.setZ(i, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function mountPizza3D(container: HTMLElement): () => void {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return () => {};

  const width = container.clientWidth || 520;
  const height = container.clientHeight || 440;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch {
    return () => {};
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  renderer.domElement.className = 'h-full w-full block cursor-grab active:cursor-grabbing';
  renderer.domElement.setAttribute(
    'aria-label',
    'Interaktives 3D-Modell einer Verdi Steinofen-Pizza – zum Drehen ziehen'
  );
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
  camera.position.set(0, 4.35, 5.45);
  camera.lookAt(0, -0.05, 0);

  // Culinary 3-point warm lighting
  const ambient = new THREE.HemisphereLight('#FFF5E6', '#2B1F19', 1.15);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight('#FFEAD0', 2.4);
  keyLight.position.set(4.5, 7.5, 4.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const ovenGlowLight = new THREE.PointLight('#FF6B35', 1.8, 12);
  ovenGlowLight.position.set(-3.8, 2.0, 2.5);
  scene.add(ovenGlowLight);

  const rimLight = new THREE.DirectionalLight('#D8F3E1', 1.1);
  rimLight.position.set(-4.5, 3.8, -4.5);
  scene.add(rimLight);

  // Root pizza group
  const pizzaGroup = new THREE.Group();
  scene.add(pizzaGroup);

  const crustTex = createCrustTexture();
  const sauceTex = createSauceTexture();

  // 1. Dark slate / stone-oven peel disc beneath the pizza
  const peelMat = new THREE.MeshStandardMaterial({
    color: '#25211E',
    roughness: 0.78,
    metalness: 0.08,
  });
  const peel = new THREE.Mesh(new THREE.CylinderGeometry(2.38, 2.44, 0.1, 64), peelMat);
  peel.position.y = -0.14;
  peel.receiveShadow = true;
  pizzaGroup.add(peel);

  // Subtle brass inlay ring on peel
  const inlay = new THREE.Mesh(
    new THREE.TorusGeometry(2.32, 0.014, 12, 80),
    new THREE.MeshStandardMaterial({ color: '#C78A3B', roughness: 0.35, metalness: 0.75 })
  );
  inlay.rotation.x = Math.PI / 2;
  inlay.position.y = -0.088;
  pizzaGroup.add(inlay);

  // 2. Thin pizza base dough
  const doughMat = new THREE.MeshStandardMaterial({
    map: crustTex.map,
    bumpMap: crustTex.bumpMap,
    bumpScale: 0.035,
    roughness: 0.74,
    metalness: 0.02,
  });
  const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(2.02, 1.98, 0.1, 64), doughMat);
  baseDisc.position.y = -0.03;
  baseDisc.castShadow = true;
  baseDisc.receiveShadow = true;
  pizzaGroup.add(baseDisc);

  // 3. Hand-stretched undulating cornicione (blistered crust rim)
  const rimGeo = new THREE.TorusGeometry(1.98, 0.22, 24, 88);
  const rimPos = rimGeo.attributes.position;
  for (let i = 0; i < rimPos.count; i++) {
    const x = rimPos.getX(i);
    const y = rimPos.getY(i);
    const z = rimPos.getZ(i);
    const angle = Math.atan2(y, x);
    const wobble =
      Math.sin(angle * 7) * 0.032 +
      Math.cos(angle * 13) * 0.022 +
      Math.sin(angle * 3 + 1.2) * 0.028;
    const scale = 1 + wobble;
    rimPos.setXYZ(i, x * scale, y * scale, z * (0.78 + Math.sin(angle * 9) * 0.12));
  }
  rimGeo.computeVertexNormals();

  const rim = new THREE.Mesh(rimGeo, doughMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.06;
  rim.castShadow = true;
  rim.receiveShadow = true;
  pizzaGroup.add(rim);

  // 4. Glossy San Marzano tomato sauce layer
  const sauceMat = new THREE.MeshStandardMaterial({
    map: sauceTex.map,
    bumpMap: sauceTex.bumpMap,
    bumpScale: 0.025,
    roughness: 0.34,
    metalness: 0.04,
  });
  const sauce = new THREE.Mesh(new THREE.CylinderGeometry(1.83, 1.84, 0.035, 64), sauceMat);
  sauce.position.y = 0.032;
  sauce.receiveShadow = true;
  pizzaGroup.add(sauce);

  // Deterministic PRNG for organic artisan topping placement
  let s = 2026;
  const r = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  // 5. Melted Fior di Latte Mozzarella medallions
  const mozzMat = new THREE.MeshStandardMaterial({
    color: '#FAF3E3',
    roughness: 0.28,
    metalness: 0.02,
  });
  for (let i = 0; i < 16; i++) {
    const ring = i < 6 ? 0.55 + r() * 0.35 : 0.98 + r() * 0.55;
    const angle = (i / (i < 6 ? 6 : 10)) * Math.PI * 2 + r() * 0.35;
    const radius = 0.22 + r() * 0.14;
    const blob = new THREE.Mesh(new THREE.SphereGeometry(radius, 18, 12), mozzMat);
    blob.scale.set(1.15 + r() * 0.3, 0.16, 0.95 + r() * 0.3);
    blob.position.set(Math.cos(angle) * ring, 0.062 + r() * 0.01, Math.sin(angle) * ring);
    blob.rotation.y = r() * Math.PI;
    blob.castShadow = true;
    blob.receiveShadow = true;
    pizzaGroup.add(blob);
  }

  // 6. Roasted Cherry Tomato halves
  const tomatoOuterMat = new THREE.MeshStandardMaterial({
    color: '#D6321F',
    roughness: 0.22,
    metalness: 0.05,
  });
  for (let i = 0; i < 8; i++) {
    const dist = 0.45 + r() * 1.1;
    const angle = (i / 8) * Math.PI * 2 + 0.3 + r() * 0.25;
    const tom = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
      tomatoOuterMat
    );
    tom.position.set(Math.cos(angle) * dist, 0.058, Math.sin(angle) * dist);
    tom.rotation.set((r() - 0.5) * 0.25, r() * Math.PI * 2, (r() - 0.5) * 0.25);
    tom.castShadow = true;
    pizzaGroup.add(tom);
  }

  // 7. Glossy Black Olive rings (echoing the real Verdi Rucola & Olive pizza!)
  const oliveMat = new THREE.MeshStandardMaterial({
    color: '#1A1718',
    roughness: 0.18,
    metalness: 0.12,
  });
  const oliveGeo = new THREE.TorusGeometry(0.11, 0.045, 10, 20);
  for (let i = 0; i < 15; i++) {
    const dist = 0.3 + r() * 1.28;
    const angle = (i / 15) * Math.PI * 2 + r() * 0.4;
    const olive = new THREE.Mesh(oliveGeo, oliveMat);
    olive.position.set(Math.cos(angle) * dist, 0.082, Math.sin(angle) * dist);
    olive.rotation.set(Math.PI / 2 + (r() - 0.5) * 0.3, (r() - 0.5) * 0.3, r() * Math.PI);
    olive.castShadow = true;
    pizzaGroup.add(olive);
  }

  // 8. Sculpted Fresh Verdi Basil Leaves (gently levitating / breathing!)
  const leafGeo = createBasilLeafGeometry();
  const leafMat = new THREE.MeshStandardMaterial({
    color: '#2A7045',
    roughness: 0.38,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });

  const floatingLeaves: Array<{ mesh: THREE.Mesh; baseY: number; phase: number; speed: number }> = [];
  for (let i = 0; i < 11; i++) {
    const dist = i === 0 ? 0.08 : 0.42 + r() * 1.05;
    const angle = (i / 11) * Math.PI * 2 + r() * 0.3;
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    const scale = 0.88 + r() * 0.45;
    leaf.scale.setScalar(scale);
    const baseY = 0.13 + (i % 3 === 0 ? 0.16 : 0.04) + r() * 0.06;
    leaf.position.set(Math.cos(angle) * dist, baseY, Math.sin(angle) * dist);
    leaf.rotation.set(-Math.PI / 2 + (r() - 0.5) * 0.55, r() * Math.PI * 2, (r() - 0.5) * 0.45);
    leaf.castShadow = true;
    pizzaGroup.add(leaf);
    floatingLeaves.push({ mesh: leaf, baseY, phase: r() * Math.PI * 2, speed: 1.1 + r() * 0.9 });
  }

  // 9. Warm floating stone-oven flour & ember dust motes
  const particleCount = 48;
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const a = r() * Math.PI * 2;
    const rad = 0.8 + r() * 2.4;
    pPositions[i * 3] = Math.cos(a) * rad;
    pPositions[i * 3 + 1] = 0.2 + r() * 1.9;
    pPositions[i * 3 + 2] = Math.sin(a) * rad;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: '#F6D399',
    size: 0.045,
    transparent: true,
    opacity: 0.65,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Subtle initial artisan presentation angle
  pizzaGroup.rotation.x = 0.14;
  pizzaGroup.rotation.z = -0.06;

  // Interactive pointer drag & hover parallax
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;
  let spinVelocity = 0.0038;
  let targetTiltX = 0.14;
  let targetTiltZ = -0.06;
  let scrollProgress = 0;

  const onPointerDown = (e: PointerEvent) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    renderer.domElement.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (isDragging) {
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      spinVelocity = dx * 0.012;
      pizzaGroup.rotation.y += dx * 0.01;
      targetTiltX = THREE.MathUtils.clamp(targetTiltX + dy * 0.005, -0.35, 0.55);
      prevX = e.clientX;
      prevY = e.clientY;
    } else {
      targetTiltX = 0.14 + ny * 0.16;
      targetTiltZ = -0.06 - nx * 0.12;
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    isDragging = false;
    try {
      renderer.domElement.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const onScroll = () => {
    scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 600), 1.4);
  };

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  // Resize observer
  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(container);

  // Pause rendering when scrolled off-screen for battery & Lighthouse performance
  let isVisible = true;
  const io = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0]?.isIntersecting ?? true;
    },
    { threshold: 0.02 }
  );
  io.observe(container);

  let rafId = 0;
  const startTime = performance.now();

  const animate = () => {
    rafId = requestAnimationFrame(animate);
    if (!isVisible) return;

    const t = (performance.now() - startTime) * 0.001;

    if (!isDragging) {
      // Gentle return toward continuous artisan turntable rotation
      spinVelocity += (0.0038 - spinVelocity) * 0.03;
      pizzaGroup.rotation.y += spinVelocity;
    }

    // Scroll-coupled 3D tilt & gentle levitation
    const desiredX = targetTiltX + scrollProgress * 0.38;
    pizzaGroup.rotation.x += (desiredX - pizzaGroup.rotation.x) * 0.07;
    pizzaGroup.rotation.z += (targetTiltZ - pizzaGroup.rotation.z) * 0.07;
    pizzaGroup.position.y = Math.sin(t * 1.15) * 0.07 + scrollProgress * 0.25;

    // Gentle floating basil leaves
    for (const item of floatingLeaves) {
      item.mesh.position.y = item.baseY + Math.sin(t * item.speed + item.phase) * 0.025;
    }

    // Subtle rising oven embers / flour motes
    particles.rotation.y = t * 0.06;
    particles.position.y = Math.sin(t * 0.5) * 0.08;

    renderer.render(scene, camera);
  };

  animate();

  // Clean unmount for Astro View Transitions
  return () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    io.disconnect();
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('scroll', onScroll);
    crustTex.map.dispose();
    crustTex.bumpMap.dispose();
    sauceTex.map.dispose();
    sauceTex.bumpMap.dispose();
    renderer.dispose();
  };
}
