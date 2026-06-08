/**
 * Aadarsha Bajagain - Personal Portfolio Interactions
 * Features: Three.js Interactive Particle Vortex (Stellar Nebula), GSAP ScrollTriggers, Custom Cursor, Modal Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  initCustomCursor();
  initHeaderScroll();
  initOverlayMenu();
  initThreeDCanvas();
  initGsapAnimations();
  initProjectModals();
  initArchiveToggle();
  initExpertiseConsole();
});

/* =========================================================================
   1. Custom Luxury Cursor
   ========================================================================= */
function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const follower = document.getElementById("custom-cursor-follower");

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Core cursor immediate tracking
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  // Smooth lagging follower
  function updateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    follower.style.left = followerX + "px";
    follower.style.top = followerY + "px";
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Hover states
  const hoverLinks = document.querySelectorAll(".hover-link");
  hoverLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      document.body.classList.add("hover-active");
    });
    link.addEventListener("mouseleave", () => {
      document.body.classList.remove("hover-active");
    });
  });
}

/* =========================================================================
   2. Header Scroll Effect
   ========================================================================= */
function initHeaderScroll() {
  const header = document.getElementById("main-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/* =========================================================================
   3. Fullscreen Overlay Navigation
   ========================================================================= */
function initOverlayMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const overlayMenu = document.getElementById("overlay-menu");
  const overlayClose = document.getElementById("overlay-close");
  const overlayLinks = document.querySelectorAll(".overlay-link");

  if (!menuToggle || !overlayMenu) return;

  menuToggle.addEventListener("click", () => {
    overlayMenu.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
  });

  const closeMenu = () => {
    overlayMenu.classList.remove("active");
    document.body.style.overflow = "";
  };

  overlayClose.addEventListener("click", closeMenu);

  overlayLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

/* =========================================================================
   4. Three.js Interactive Particle Vortex (Hero canvas)
   ========================================================================= */
function initThreeDCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();

  const width = canvas.parentElement.clientWidth;
  const height = canvas.parentElement.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Helper to create a soft glowing circle texture on the fly
  function createCircleTexture() {
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 32;
    canvasTexture.height = 32;
    const ctx = canvasTexture.getContext('2d');
    
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(239, 213, 194, 0.8)');
    grad.addColorStop(0.5, 'rgba(143, 118, 71, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    
    return new THREE.CanvasTexture(canvasTexture);
  }

  const vortexGroup = new THREE.Group();
  scene.add(vortexGroup);

  // Helper to create a very soft glowing blur texture for background auras
  function createGlowTexture() {
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 64;
    canvasTexture.height = 64;
    const ctx = canvasTexture.getContext('2d');
    
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(239, 213, 194, 0.35)'); // soft gold core
    grad.addColorStop(0.3, 'rgba(143, 118, 71, 0.15)'); // fading bronze
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // transparent
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    
    return new THREE.CanvasTexture(canvasTexture);
  }

  // Helper to draw text labels onto a high-res canvas and return a texture
  function createTextTexture(text, fontSize = 48, isMain = false) {
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 512;
    canvasTexture.height = 256;
    const ctx = canvasTexture.getContext('2d');
    
    ctx.clearRect(0, 0, 512, 256);
    
    ctx.font = `bold ${fontSize}px "Jost", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (isMain) {
      // Main central spark (IDEA)
      ctx.shadowColor = 'rgba(239, 213, 194, 0.95)';
      ctx.shadowBlur = 24;
      
      ctx.strokeStyle = '#8f7647';
      ctx.lineWidth = 4;
      ctx.strokeText(text, 256, 128);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, 256, 128);
    } else {
      // Technical blueprint labels (CEREBRUM, CEREBELLUM, STEM)
      ctx.shadowColor = 'rgba(143, 118, 71, 0.6)';
      ctx.shadowBlur = 8;
      
      ctx.fillStyle = '#8f7647'; // Muted gold/bronze
      ctx.fillText(text, 256, 128);
    }
    
    return new THREE.CanvasTexture(canvasTexture);
  }

  // State for active "Idea Generation" animation event (between 35s and 40s)
  const ideaGenerationState = {
    intensity: 0.0
  };

  // 1. Brain Point Cloud Generation (Cerebrum, Cerebellum, and Brain Stem)
  const brainPositions = [];
  const brainColors = [];
  const hubPositions = [];
  const hubNodeCount = 400; // Skeletal nodes with line connections
  const extraNodeCount = 3600; // Glow points without line connections for volumetric depth
  const totalNodeCount = hubNodeCount + extraNodeCount;
  
  for (let i = 0; i < totalNodeCount; i++) {
    let x = 0, y = 0, z = 0;
    const componentRand = Math.random();
    
    if (componentRand < 0.72) {
      // A. Cerebrum Hemispheres (72% of nodes)
      const isLeft = Math.random() > 0.5;
      
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      
      // Fine-grained cortex folds
      const folds = 0.12 * Math.sin(theta * 6.0) * Math.cos(phi * 6.0) +
                    0.04 * Math.sin(phi * 12.0);
      
      // Mix of surface and volume points to fill the brain shape
      const isSurface = Math.random() > 0.65;
      const radDist = isSurface ? 1.0 : Math.pow(Math.random(), 0.5);
      const r = 0.82 * (1.0 + folds) * radDist;
      
      const rawX = Math.abs(r * Math.sin(phi) * Math.cos(theta));
      const rawY = r * Math.sin(phi) * Math.sin(theta) * 0.95;
      const rawZ = r * Math.cos(phi) * 1.35; // elongated front-to-back
      
      // Taper front of the brain (z > 0 is front, z < 0 is back)
      const taper = 1.0 - 0.22 * (rawZ / 1.35); 
      
      // Separate left and right hemispheres to create the longitudinal fissure
      if (isLeft) {
        x = -0.05 - rawX * 0.78 * taper;
      } else {
        x = 0.05 + rawX * 0.78 * taper;
      }
      y = 0.38 + rawY;
      z = -0.05 + rawZ;
      
    } else if (componentRand < 0.88) {
      // B. Cerebellum (16% of nodes at bottom back)
      const isLeft = Math.random() > 0.5;
      
      const theta = Math.random() * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * Math.random() - 1.0);
      
      const folds = 0.05 * Math.sin(theta * 10.0) * Math.cos(phi * 10.0);
      
      const isSurface = Math.random() > 0.65;
      const radDist = isSurface ? 1.0 : Math.pow(Math.random(), 0.5);
      const r = 0.42 * (1.0 + folds) * radDist;
      
      const rawX = Math.abs(r * Math.sin(phi) * Math.cos(theta));
      const rawY = r * Math.sin(phi) * Math.sin(theta) * 0.6; // flattened vertically
      const rawZ = r * Math.cos(phi) * 0.8;
      
      // Separate left and right cerebellum lobes
      if (isLeft) {
        x = -0.03 - rawX * 0.75;
      } else {
        x = 0.03 + rawX * 0.75;
      }
      y = -0.42 + rawY;
      z = -0.6 + rawZ;
      
    } else {
      // C. Brain Stem (12% of nodes extending downwards as cylinder)
      const stemY = -0.35 - Math.random() * 0.95; // extends down to -1.3
      const stemRad = (0.16 - (stemY + 0.35) * 0.04) * Math.pow(Math.random(), 0.5); // filled volume cylinder
      const theta = Math.random() * 2.0 * Math.PI;
      
      x = stemRad * Math.cos(theta);
      y = stemY;
      z = -0.2 + stemRad * Math.sin(theta);
    }
    
    brainPositions.push(x, y, z);
    
    // Hub points for skeletal neural lines
    if (i < hubNodeCount) {
      hubPositions.push(new THREE.Vector3(x, y, z));
    }
    
    // Luxury gold-champagne gradient mapping
    const mix = Math.random();
    const rVal = mix * 0.56 + (1 - mix) * 0.87;
    const gVal = mix * 0.46 + (1 - mix) * 0.83;
    const bVal = mix * 0.28 + (1 - mix) * 0.76;
    brainColors.push(rVal, gVal, bVal);
  }
  
  const brainGeometry = new THREE.BufferGeometry();
  brainGeometry.setAttribute("position", new THREE.Float32BufferAttribute(brainPositions, 3));
  brainGeometry.setAttribute("color", new THREE.Float32BufferAttribute(brainColors, 3));
  
  const brainMaterial = new THREE.PointsMaterial({
    size: 0.32, // slightly smaller points for density
    map: createCircleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.2, // dynamic on scroll
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const brainPoints = new THREE.Points(brainGeometry, brainMaterial);
  vortexGroup.add(brainPoints);

  // 2. Brain Neural Line Connections (Computed only using the 400 skeletal hub points)
  const linePositions = [];
  const lineColors = [];
  
  for (let i = 0; i < hubPositions.length; i++) {
    const p1 = hubPositions[i];
    let connections = 0;
    
    for (let j = i + 1; j < hubPositions.length; j++) {
      if (connections > 2) break;
      const p2 = hubPositions[j];
      const dist = p1.distanceTo(p2);
      
      if (dist < 0.6) {
        linePositions.push(p1.x, p1.y, p1.z);
        linePositions.push(p2.x, p2.y, p2.z);
        
        // Muted gold line colors
        lineColors.push(0.56, 0.46, 0.28);
        lineColors.push(0.56, 0.46, 0.28);
        connections++;
      }
    }
  }
  
  const linesGeometry = new THREE.BufferGeometry();
  linesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  linesGeometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));
  
  const linesMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.05, // dynamic on scroll
    blending: THREE.AdditiveBlending
  });
  
  const brainLines = new THREE.LineSegments(linesGeometry, linesMaterial);
  vortexGroup.add(brainLines);

  // 2.5 Volumetric Soft Background Glow Sprites (Aura)
  const glowMat = new THREE.SpriteMaterial({
    map: createGlowTexture(),
    transparent: true,
    opacity: 0.15, // dynamic on scroll
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const leftGlow = new THREE.Sprite(glowMat);
  leftGlow.position.set(-0.35, 0.38, 0);
  leftGlow.scale.set(1.9, 1.9, 1);
  vortexGroup.add(leftGlow);
  
  const rightGlow = new THREE.Sprite(glowMat);
  rightGlow.position.set(0.35, 0.38, 0);
  rightGlow.scale.set(1.9, 1.9, 1);
  vortexGroup.add(rightGlow);
  
  const cerebellumGlow = new THREE.Sprite(glowMat);
  cerebellumGlow.position.set(0, -0.42, -0.5);
  cerebellumGlow.scale.set(1.5, 1.1, 1);
  vortexGroup.add(cerebellumGlow);
  
  const stemGlow = new THREE.Sprite(glowMat);
  stemGlow.position.set(0, -0.85, -0.2);
  stemGlow.scale.set(0.7, 1.4, 1);
  vortexGroup.add(stemGlow);

  // 2.6 Blueprint Labels & IDEA Text
  const stemTextTexture = createTextTexture("BRAIN STEM", 36, false);
  const stemMat = new THREE.SpriteMaterial({
    map: stemTextTexture,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const stemSprite = new THREE.Sprite(stemMat);
  stemSprite.position.set(0.0, -0.9, -0.2);
  stemSprite.scale.set(1.4, 0.7, 1.0);
  vortexGroup.add(stemSprite);

  const cerebellumTextTexture = createTextTexture("CEREBELLUM", 36, false);
  const cerebellumMat = new THREE.SpriteMaterial({
    map: cerebellumTextTexture,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cerebellumSprite = new THREE.Sprite(cerebellumMat);
  cerebellumSprite.position.set(0.4, -0.42, -0.6);
  cerebellumSprite.scale.set(1.4, 0.7, 1.0);
  vortexGroup.add(cerebellumSprite);

  const cerebrumTextTexture = createTextTexture("CEREBRUM", 36, false);
  const cerebrumMat = new THREE.SpriteMaterial({
    map: cerebrumTextTexture,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const cerebrumSprite = new THREE.Sprite(cerebrumMat);
  cerebrumSprite.position.set(-0.4, 0.6, 0.0);
  cerebrumSprite.scale.set(1.4, 0.7, 1.0);
  vortexGroup.add(cerebrumSprite);

  const ideaTexture = createTextTexture("IDEA", 84, true);
  const ideaMat = new THREE.SpriteMaterial({
    map: ideaTexture,
    transparent: true,
    opacity: 0.0, // starts completely hidden
    blending: THREE.NormalBlending, // NormalBlending makes the white/gold outline extremely crisp and vivid
    depthWrite: false
  });
  
  const ideaSprite = new THREE.Sprite(ideaMat);
  ideaSprite.position.set(0, 0.38, 0);
  ideaSprite.scale.set(1.8, 0.9, 1);
  vortexGroup.add(ideaSprite);

  // Active Idea Generation Timeline using GSAP
  if (typeof gsap !== "undefined") {
    const ideaTimeline = gsap.timeline();
    
    // Sequential blueprint labeling before the main idea spark
    // 28s: STEM fades in (ends at 30s)
    ideaTimeline.to(stemMat, {
      opacity: 0.7,
      duration: 2.0,
      delay: 28.0, // wait 28s to start sequence
      ease: "power1.inOut"
    });
    
    // 31s: CEREBELLUM fades in (ends at 33s)
    ideaTimeline.to(cerebellumMat, {
      opacity: 0.7,
      duration: 2.0,
      ease: "power1.inOut"
    }, "+=1.0");
    
    // 34s: CEREBRUM fades in (ends at 36s)
    ideaTimeline.to(cerebrumMat, {
      opacity: 0.7,
      duration: 2.0,
      ease: "power1.inOut"
    }, "+=1.0");
    
    // Phase 1 (35s - 40s): Brain starts active thinking/generating
    ideaTimeline.to(ideaGenerationState, {
      intensity: 1.0,
      duration: 5.0,
      ease: "power1.in"
    }, "-=3.0"); // starts at 35s
    
    // Phase 2 (40s - 42s): Flash / release, showing the IDEA text in brain (clear and vivid!)
    ideaTimeline.to(ideaMat, {
      opacity: 1.0, // 100% opacity for clear, vivid look
      duration: 2.0,
      ease: "power2.out"
    }, "-=0.0"); // triggers exactly at 40s
    
    // Phase 3 (42s - 45s): Brain settles back to normal, but IDEA text remains clear and floating
    ideaTimeline.to(ideaGenerationState, {
      intensity: 0.0,
      duration: 3.0,
      ease: "power2.out"
    });
  }

  // 3. Circuit Board Layout Generation
  const paths = [];
  const pathLinesGroup = new THREE.Group();
  const pathCount = 15;
  
  for (let i = 0; i < pathCount; i++) {
    const points = [];
    let currX = (Math.random() - 0.5) * 5.0;
    let currZ = (Math.random() - 0.5) * 4.0;
    let currY = -6.0; // Start below screen
    
    points.push(new THREE.Vector3(currX, currY, currZ));
    
    // Walk straight and make PCB-style bends
    while (currY < 0.5) {
      const stepY = 1.0 + Math.random() * 1.5;
      currY += stepY;
      if (currY > 0.5) currY = 0.5;
      
      if (Math.random() > 0.4) {
        // 45 degree angle in PCB layout
        const dir = Math.random() > 0.5 ? 1 : -1;
        const length = 0.5 + Math.random() * 1.0;
        currX += length * dir * 0.707;
        currZ += length * dir * 0.707;
      }
      points.push(new THREE.Vector3(currX, currY, currZ));
    }
    
    paths.push(points);
    
    // Draw the static circuit trace line
    const pathGeom = new THREE.BufferGeometry().setFromPoints(points);
    const pathMat = new THREE.LineBasicMaterial({
      color: 0x8f7647,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending
    });
    const pathLine = new THREE.Line(pathGeom, pathMat);
    pathLinesGroup.add(pathLine);
  }
  vortexGroup.add(pathLinesGroup);

  // 4. Glowing Data Pulses traveling along circuit paths
  const pulses = [];
  const pulseCount = 35;
  const pulseGeom = new THREE.SphereGeometry(0.045, 8, 8);
  const pulseMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  
  for (let i = 0; i < pulseCount; i++) {
    const pathIndex = Math.floor(Math.random() * paths.length);
    const path = paths[pathIndex];
    const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
    
    vortexGroup.add(pulseMesh);
    pulses.push({
      mesh: pulseMesh,
      path: path,
      progress: Math.random(),
      speed: 0.15 + Math.random() * 0.2
    });
  }

  // Interactivity variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener("resize", () => {
    const newWidth = canvas.parentElement.clientWidth;
    const newHeight = canvas.parentElement.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();
    const deltaTime = clock.getDelta();

    // Smooth mouse tilt tracking
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    vortexGroup.rotation.y = time * 0.1 + (targetX * 0.25);
    vortexGroup.rotation.x = time * 0.05 - (targetY * 0.2);

    // Scroll metrics
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

    // Mind awakening: as user scrolls down, the brain becomes brighter & highly active
    brainMaterial.opacity = 0.2 + scrollFraction * 0.7; // 20% to 90% opacity
    linesMaterial.opacity = 0.05 + scrollFraction * 0.45; // 5% to 50% opacity
    glowMat.opacity = 0.15 + scrollFraction * 0.45; // 15% to 60% opacity for background aura
    
    // Scale particles slightly + add a breathing aura pulse (which gets very active during idea generation)
    brainMaterial.size = (0.32 + scrollFraction * 0.15 + ideaGenerationState.intensity * 0.12) + 
                          Math.sin(time * (2.5 + ideaGenerationState.intensity * 5.0)) * (0.04 + ideaGenerationState.intensity * 0.04);

    // Animate volumetric aura breathing pulse (swells during idea generation)
    const glowScaleMultiplier = (1.0 + Math.sin(time * 2.0) * 0.05) * (1.0 + ideaGenerationState.intensity * 0.2);
    leftGlow.scale.set(1.9 * glowScaleMultiplier, 1.9 * glowScaleMultiplier, 1);
    rightGlow.scale.set(1.9 * glowScaleMultiplier, 1.9 * glowScaleMultiplier, 1);
    cerebellumGlow.scale.set(1.5 * glowScaleMultiplier, 1.1 * glowScaleMultiplier, 1);
    stemGlow.scale.set(0.7 * glowScaleMultiplier, 1.4 * glowScaleMultiplier, 1);

    // Gently float/hover the blueprint labels inside the brain
    ideaSprite.position.y = 0.38 + Math.sin(time * 1.5) * 0.02;
    stemSprite.position.y = -0.9 + Math.sin(time * 1.2) * 0.015;
    cerebellumSprite.position.y = -0.42 + Math.sin(time * 1.4) * 0.015;
    cerebrumSprite.position.y = 0.6 + Math.sin(time * 1.6) * 0.015;

    // Update glowing data pulses
    // Speed increases as brain gets activated by scroll OR when generating the idea
    const speedMultiplier = (1.0 + scrollFraction * 2.0) * (1.0 + ideaGenerationState.intensity * 3.0);

    pulses.forEach(p => {
      p.progress += p.speed * speedMultiplier * 0.016; // steady time increments
      if (p.progress > 1.0) {
        p.progress = 0;
        p.path = paths[Math.floor(Math.random() * paths.length)];
      }

      const segmentCount = p.path.length - 1;
      const rawIndex = p.progress * segmentCount;
      const idx = Math.floor(rawIndex);
      const t = rawIndex - idx;

      if (idx < segmentCount) {
        const pStart = p.path[idx];
        const pEnd = p.path[idx + 1];
        p.mesh.position.lerpVectors(pStart, pEnd, t);
      }
    });

    // Make the brain nodes wobble slightly + add a glowing energy wave aura
    const positionAttr = brainGeometry.attributes.position;
    const colorAttr = brainGeometry.attributes.color;
    const originalPositions = brainPositions;
    const originalColors = brainColors;

    // Energy wave Y-coordinate oscillates up and down the brain structure (oscillates faster during idea generation)
    const waveY = 1.2 + Math.sin(time * (1.8 + ideaGenerationState.intensity * 2.0)) * 1.5;
    const waveSpeed = 1.5 + ideaGenerationState.intensity * 3.0;
    const waveAmp = 0.025 + ideaGenerationState.intensity * 0.025;

    for (let i = 0; i < totalNodeCount; i++) {
      const idx = i * 3;
      const x = originalPositions[idx];
      const y = originalPositions[idx+1];
      const z = originalPositions[idx+2];

      const wave = Math.sin(time * waveSpeed + x * 2.0) * waveAmp;
      positionAttr.array[idx] = x + wave;
      positionAttr.array[idx+1] = y + wave * 0.7;
      positionAttr.array[idx+2] = z + wave * 1.2;

      // Color/Glow wave calculation based on distance from wave front
      const distToWave = Math.abs(y - waveY);
      let waveGlow = 0;
      if (distToWave < 0.6) {
        waveGlow = (1.0 - distToWave / 0.6) * (0.7 + ideaGenerationState.intensity * 0.3); // higher peak glow during idea generation
      }

      // Transition node color to bright gold/white wave front
      colorAttr.array[idx] = originalColors[idx] * (1 - waveGlow) + waveGlow * 1.0;
      colorAttr.array[idx+1] = originalColors[idx+1] * (1 - waveGlow) + waveGlow * 0.95;
      colorAttr.array[idx+2] = originalColors[idx+2] * (1 - waveGlow) + waveGlow * 0.75;
    }
    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
}

/* =========================================================================
   5. GSAP Scroll Animations
   ========================================================================= */
function initGsapAnimations() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero Section Load Animations
  const tl = gsap.timeline();

  tl.to(".reveal-text span", {
    y: 0,
    duration: 1.2,
    ease: "power4.out",
    stagger: 0.2
  });

  tl.to(".hero-meta, .hero-description, .hero-section .btn-primary", {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: "power3.out",
    stagger: 0.15
  }, "-=0.8");

  // Highlight navigation links dynamically on scroll
  const navItems = document.querySelectorAll(".bottom-left-menu a");
  const activeIndicatorText = document.querySelector("#nav-active-indicator .indicator-text");
  const navSections = ["about", "ventures", "timeline", "expertise", "achievements", "contact"];
  
  navSections.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: "top 120px",
      end: "bottom 120px",
      onToggle: (self) => {
        if (self.isActive) {
          navItems.forEach(item => {
            const href = item.getAttribute("href").substring(1);
            if (href === id) {
              item.classList.add("active");
              // Update indicator text with section index and name
              const index = item.getAttribute("data-index");
              const name = item.innerText;
              if (activeIndicatorText) {
                activeIndicatorText.innerText = `${index} // ${name}`;
              }
            } else {
              item.classList.remove("active");
            }
          });
        }
      }
    });
  });

  // Special trigger for Hero section to show 00 // START
  const heroEl = document.getElementById("hero");
  if (heroEl) {
    ScrollTrigger.create({
      trigger: heroEl,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        if (self.isActive && activeIndicatorText) {
          activeIndicatorText.innerText = "00 // START";
          navItems.forEach(item => item.classList.remove("active"));
        }
      }
    });
  }
}

/* =========================================================================
   6. Project/Venture Modal Details
   ========================================================================= */
const projectDetails = {
  avyaas: {
    title: "Avyaas Learning Ecosystem",
    category: "EdTech SAAS",
    meta: "Target Audience: 100,000+ Students | iOS, Android, and Web Solutions",
    url: "https://avyaas.app/",
    image: "assets/avyaas_mockup.png",
    body: `
      <p><strong>Avyaas</strong> is a customized Learning Management System (LMS) and exam preparation suite engineered specifically to address the academic needs of students and chartered accountant aspirants in Nepal.</p>
      <h4>Architectural Achievements</h4>
      <ul>
        <li>Scaled microservices backend architecture to support over 100,000 registered users with zero downtime.</li>
        <li>Consistently ranked #1 Trending in the local Play Store under the Education category during launch and exam seasons.</li>
        <li>Average engagement time of 3 minutes per user in standard sessions and peak engagement of 12 minutes.</li>
        <li>Implemented content management systems allowing teachers to securely upload high-definition video modules, quiz metrics, and subscription plans.</li>
      </ul>
      <h4>Technologies Utilized</h4>
      <p>Go (Fiber), Java (Spring Boot), Kotlin (Native Android), Swift, React.js, Docker, Nginx, PostgreSQL, Redis, Amazon S3, and Huawei Cloud CDN.</p>
    `
  },
  verifylabs: {
    title: "VerifyLabs AI Content Detector",
    category: "AI Security & Deep Fake Detection",
    meta: "Precision: 99.2% Overall Confidence | Real-Time Video Scan",
    url: "https://verifylabs.ai/",
    image: "assets/verifylabs_mockup.png",
    body: `
      <p><strong>VerifyLabs</strong> is an AI-powered verification platform built to detect synthesized deep fake imagery, voice replication, and AI-generated textual footprints.</p>
      <h4>Key Deliverables</h4>
      <ul>
        <li>Worked as an Android Engineer, heading native mobile architecture specializing in secure sandbox execution to capture live media and run local verification.</li>
        <li>Designed real-time REST API interfaces delivering frame-by-frame convolutional analysis and heatmap texture mapping of faces.</li>
        <li>Implemented Dockerized GPU scaling engines to handle massive upload queues from European corporate verification firms.</li>
        <li>Ensured strict privacy standards safeguarding user-submitted PII and biometric metadata in compliance with GDPR.</li>
      </ul>
      <h4>Technologies Utilized</h4>
      <p>Kotlin, Python, PyTorch (CNN models), TensorFlow, FastAPI, Docker, GPU instances, OpenCV, and Web Sockets for socket state responses.</p>
    `
  },
  asha: {
    title: "ASHA Connect & Medicord",
    category: "Health-Tech EHR System",
    meta: "Active Reach: 40,000+ Patients in Dang, Nepal | Standards: Bahmni HL7-FHIR",
    url: "https://www.asha-np.org/en/partner",
    image: "assets/asha_connect_mockup.png",
    body: `
      <p><strong>ASHA Connect</strong> (funded by ASHA Japan) and <strong>Medicord</strong> (developed during MIT GSL labs incubation) constitute a clinical community care system bringing digital EMR tools to rural Nepal.</p>
      <h4>Engineering Scope & Health Standards</h4>
      <ul>
        <li>Digitized patient records and census workflows for community health workers serving over 40,000 citizens in Dang.</li>
        <li>Built gestative maternal care tracker applications conforming to international Bahmni standards.</li>
        <li>Developed COVID-19 quarantine point of entry screening dashboard implemented and utilized by the World Health Organization (WHO) at borders.</li>
        <li>Conformed application schemas to meet HL7/FHIR health interoperability, HIPAA compliance protocols, and DHIS-2 reporting portals.</li>
      </ul>
      <h4>Technologies Utilized</h4>
      <p>Kotlin, Java, Bahmni EHR modules, PostgreSQL, Android SDK, HL7/FHIR modeling APIs, and Nginx reverse proxies.</p>
    `
  },
  nepra: {
    title: "NEPRA Limited",
    category: "Circular Economy / B2B",
    meta: "Market: UK Sustainable Goods | Logistics: Plastic-Free",
    url: "https://nepraltd.com/",
    image: "",
    body: `
      <p><strong>NEPRA</strong> is a UK-based circular economy company importing sustainable, biodegradable alternatives to plastic from Nepal's rural cooperatives. Coded the complete full-stack architecture.</p>
      <h4>Innovation Scope</h4>
      <ul>
        <li>Direct Cooperative Sourcing bypassing brokers to ensure equitable, transparent wages.</li>
        <li>Verified Carbon Footprint reporting system for international shipments and ESG analytics.</li>
        <li>B2B/B2C marketplace connecting UK eco-brands directly to Nepalese producers.</li>
      </ul>
      <h4>Technologies Utilized</h4>
      <p>Node.js, React.js, WebSockets, Carbon ESG mapping tools, PostgreSQL, Docker, and Nginx.</p>
    `
  }
};

function initProjectModals() {
  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalMeta = document.getElementById("modal-meta");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");
  const projectCards = document.querySelectorAll(".venture-card");
  const modalLinkWrapper = document.getElementById("modal-link-wrapper");
  const modalLink = document.getElementById("modal-link");

  if (!modal || !modalClose) return;

  // Open modal with specific project data
  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const projectId = card.getAttribute("data-project");
      const details = projectDetails[projectId];

      if (details) {
        modalTitle.innerText = details.title;
        modalMeta.innerText = details.meta + " | " + details.category;
        modalBody.innerHTML = details.body;

        if (details.url && modalLink && modalLinkWrapper) {
          modalLink.href = details.url;
          modalLinkWrapper.style.display = "block";
        } else if (modalLinkWrapper) {
          modalLinkWrapper.style.display = "none";
        }

        modal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scroll
      }
    });
  });

  // Close modal functions
  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  modalClose.addEventListener("click", closeModal);
  
  // Close when clicking outside content box
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Esc key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
}

/* =========================================================================
   8. Archive Expandable Table Toggle
   ========================================================================= */
function initArchiveToggle() {
  const toggleBtn = document.getElementById("archive-toggle-btn");
  const container = document.getElementById("archive-expand-container");

  if (!toggleBtn || !container) return;

  toggleBtn.addEventListener("click", () => {
    const isExpanded = container.classList.contains("expanded");
    if (isExpanded) {
      container.classList.remove("expanded");
      container.style.maxHeight = "0px";
      toggleBtn.querySelector(".btn-text").innerText = "View Complete Archive (12 Projects)";
      toggleBtn.querySelector(".btn-icon").innerText = "+";
    } else {
      container.classList.add("expanded");
      container.style.maxHeight = container.scrollHeight + "px";
      toggleBtn.querySelector(".btn-text").innerText = "Collapse Archive";
      toggleBtn.querySelector(".btn-icon").innerText = "−";
    }

    // Refresh GSAP ScrollTriggers after height transition completes (0.6s)
    setTimeout(() => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 600);
  });
}

// Ensure ScrollTrigger refreshes after all resources and images have fully loaded
window.addEventListener("load", () => {
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
});

/* =========================================================================
   9. Interactive Technical Console Toggle
   ========================================================================= */
function initExpertiseConsole() {
  const menuButtons = document.querySelectorAll(".console-menu-btn");
  const contentPanels = document.querySelectorAll(".console-content-panel");

  if (!menuButtons.length || !contentPanels.length) return;

  menuButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Deactivate current active button and panel
      menuButtons.forEach(b => b.classList.remove("active"));
      contentPanels.forEach(p => p.classList.remove("active"));

      // Activate clicked button
      btn.classList.add("active");

      // Activate corresponding content panel
      const targetId = btn.getAttribute("data-target");
      const targetPanel = document.getElementById(`panel-${targetId}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });
}
