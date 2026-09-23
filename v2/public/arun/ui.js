// Gravino UI Interactions (Tabs, Modals, Navigation)
document.addEventListener('DOMContentLoaded', () => {
  // Discipline Tabs Switcher under "What We Cover" (Left Split Navigation)
  const disciplineTabs = document.querySelectorAll('.discipline-tab');
  const disciplinePanels = document.querySelectorAll('.discipline-panel');

  disciplineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-discipline');

      disciplineTabs.forEach(t => {
        t.classList.remove('bg-white/25', 'text-white', 'border-white/50', 'shadow-lg', 'font-semibold');
        t.classList.add('bg-transparent', 'text-purple-200/80', 'border-transparent', 'font-medium');
        const arrow = t.querySelector('svg');
        if (arrow) arrow.classList.add('opacity-0');
      });

      tab.classList.remove('bg-transparent', 'text-purple-200/80', 'border-transparent', 'font-medium');
      tab.classList.add('bg-white/25', 'text-white', 'border-white/50', 'shadow-lg', 'font-semibold');
      const activeArrow = tab.querySelector('svg');
      if (activeArrow) activeArrow.classList.remove('opacity-0');

      disciplinePanels.forEach(panel => {
        if (panel.getAttribute('id') === targetId) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // Mobile Navigation Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeMobileMenuBtn = document.getElementById('closeMobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenuDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuDrawer.classList.remove('hidden');
      setTimeout(() => {
        mobileMenuDrawer.classList.add('opacity-100');
        mobileMenuDrawer.querySelector('div').classList.remove('-translate-y-full');
      }, 10);
    });

    const closeMenu = () => {
      mobileMenuDrawer.classList.remove('opacity-100');
      mobileMenuDrawer.querySelector('div').classList.add('-translate-y-full');
      setTimeout(() => {
        mobileMenuDrawer.classList.add('hidden');
      }, 300);
    };

    if (closeMobileMenuBtn) {
      closeMobileMenuBtn.addEventListener('click', closeMenu);
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Teardown / Start Project Modal
  const teardownTriggers = document.querySelectorAll('.trigger-teardown');
  const teardownModal = document.getElementById('teardownModal');
  const closeTeardownBtn = document.getElementById('closeTeardownBtn');
  const teardownForm = document.getElementById('teardownForm');
  const formStateInitial = document.getElementById('formStateInitial');
  const formStateSuccess = document.getElementById('formStateSuccess');

  const openTeardownModal = () => {
    if (!teardownModal) return;
    teardownModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (formStateInitial) formStateInitial.classList.remove('hidden');
    if (formStateSuccess) formStateSuccess.classList.add('hidden');
  };

  const closeTeardownModal = () => {
    if (!teardownModal) return;
    teardownModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  teardownTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openTeardownModal();
    });
  });

  if (closeTeardownBtn) {
    closeTeardownBtn.addEventListener('click', closeTeardownModal);
  }

  if (teardownModal) {
    teardownModal.addEventListener('click', (e) => {
      if (e.target === teardownModal) {
        closeTeardownModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && teardownModal && teardownModal.classList.contains('active')) {
      closeTeardownModal();
    }
  });

  if (teardownForm) {
    teardownForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formStateInitial && formStateSuccess) {
        formStateInitial.classList.add('hidden');
        formStateSuccess.classList.remove('hidden');
      }
    });
  }

  // Smooth scroll offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Scroll Reveal Observer for Glass Box in Section 2
  const scrollRevealElems = document.querySelectorAll('.scroll-reveal');
  if (scrollRevealElems.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.12
    });

    scrollRevealElems.forEach(elem => observer.observe(elem));
  }

  // Cinematic Full-Bleed Portfolio Showcase Slider
  const portfolioSection = document.getElementById('portfolio');
  const portfolioThumbsTrack = document.getElementById('portfolioThumbsTrack');

  if (portfolioSection && portfolioThumbsTrack) {
    const portfolioProjects = [
      {
        id: 0,
        title: 'Aura Pay',
        desc: 'Zero-knowledge biometric authentication and ultra-low latency transaction clearing for sovereign wealth and high-volume banking systems.',
        image: 'assets/portfolio-1.jpg'
      },
      {
        id: 1,
        title: 'Nexus AI',
        desc: 'Autonomous generative synthesis and predictive decision infrastructure empowering executive boards with real-time operational telemetry.',
        image: 'assets/portfolio-2.jpg'
      },
      {
        id: 2,
        title: 'Lumen Edu',
        desc: 'Immersive spatial learning environments and unified curriculum delivery engineering next-generation cognitive retention at global scale.',
        image: 'assets/portfolio-3.jpg'
      },
      {
        id: 3,
        title: 'Vanguard Bio',
        desc: 'Precision oncology data visualizer and distributed genomic pipeline architecture transforming complex biomarker sequencing into clinical action.',
        image: 'assets/portfolio-4.jpg'
      }
    ];

    let currentProjectIdx = 0;
    let isTransitioning = false;
    let activeBgLayer = 'A';

    const bgLayerA = document.getElementById('portfolioBgA');
    const bgLayerB = document.getElementById('portfolioBgB');
    const titleEl = document.getElementById('portfolioTitle');
    const descEl = document.getElementById('portfolioDesc');
    const prevBtn = document.getElementById('portfolioPrev');
    const nextBtn = document.getElementById('portfolioNext');
    const animItems = portfolioSection.querySelectorAll('.portfolio-anim-item');

    function renderThumbnails(activeIdx) {
      portfolioThumbsTrack.innerHTML = '';
      const otherProjects = [];
      for (let i = 1; i < portfolioProjects.length; i++) {
        const nextIdx = (activeIdx + i) % portfolioProjects.length;
        otherProjects.push(portfolioProjects[nextIdx]);
      }

      otherProjects.forEach((proj) => {
        const card = document.createElement('div');
        card.className = 'portfolio-thumb-card group bg-[#12121e] select-none shadow-xl';
        card.setAttribute('data-target-idx', proj.id);
        card.innerHTML = `
          <img src="${proj.image}" alt="${proj.title}" class="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110 pointer-events-none">
          <div class="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors pointer-events-none"></div>
        `;

        card.addEventListener('click', () => {
          if (!isTransitioning && proj.id !== currentProjectIdx) {
            goToProject(proj.id);
          }
        });

        portfolioThumbsTrack.appendChild(card);
      });
    }

    function goToProject(nextIdx) {
      if (isTransitioning || nextIdx === currentProjectIdx) return;
      isTransitioning = true;
      const targetProj = portfolioProjects[nextIdx];

      const incomingLayer = activeBgLayer === 'A' ? bgLayerB : bgLayerA;
      const outgoingLayer = activeBgLayer === 'A' ? bgLayerA : bgLayerB;

      if (incomingLayer && outgoingLayer) {
        incomingLayer.style.backgroundImage = `url('${targetProj.image}')`;
        incomingLayer.style.transform = 'scale(1.06)';
        incomingLayer.style.opacity = '0';

        requestAnimationFrame(() => {
          incomingLayer.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)';
          outgoingLayer.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
          incomingLayer.style.opacity = '1';
          incomingLayer.style.transform = 'scale(1.0)';
          outgoingLayer.style.opacity = '0';
          activeBgLayer = activeBgLayer === 'A' ? 'B' : 'A';
        });
      }

      animItems.forEach(item => item.classList.add('text-exit'));

      setTimeout(() => {
        if (titleEl) {
          const parts = targetProj.title.split(' ');
          const firstWord = parts[0];
          const restWords = parts.slice(1).join(' ');
          titleEl.innerHTML = `${firstWord} <span class="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] pb-1 inline-block">${restWords}</span>`;
        }
        if (descEl) descEl.textContent = targetProj.desc;

        animItems.forEach(item => {
          item.classList.remove('text-exit');
          item.classList.add('text-enter');
        });

        requestAnimationFrame(() => {
          animItems.forEach(item => {
            item.classList.remove('text-enter');
          });
        });
      }, 240);

      currentProjectIdx = nextIdx;
      renderThumbnails(currentProjectIdx);
      setTimeout(updatePortfolioLine, 260);

      setTimeout(() => {
        isTransitioning = false;
      }, 750);
    }

    function updatePortfolioLine() {
      const line = document.getElementById('portfolioAccentLine');
      const title = document.getElementById('portfolioTitle');
      const portfolio = document.getElementById('portfolio');
      if (!line || !title || !portfolio) return;
      const portfolioRect = portfolio.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const offsetTop = titleRect.top - portfolioRect.top - 24; // elevated 24px cleanly above title
      line.style.top = `${Math.max(0, offsetTop)}px`;
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const nextIdx = (currentProjectIdx - 1 + portfolioProjects.length) % portfolioProjects.length;
        goToProject(nextIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const nextIdx = (currentProjectIdx + 1) % portfolioProjects.length;
        goToProject(nextIdx);
      });
    }

    // Keyboard navigation when near portfolio
    window.addEventListener('keydown', (e) => {
      const rect = portfolioSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (e.key === 'ArrowRight') {
          const nextIdx = (currentProjectIdx + 1) % portfolioProjects.length;
          goToProject(nextIdx);
        } else if (e.key === 'ArrowLeft') {
          const nextIdx = (currentProjectIdx - 1 + portfolioProjects.length) % portfolioProjects.length;
          goToProject(nextIdx);
        }
      }
    });

    renderThumbnails(0);
    requestAnimationFrame(updatePortfolioLine);
    window.addEventListener('resize', updatePortfolioLine);
    window.addEventListener('load', updatePortfolioLine);

    // =========================================================================
    // CORPORATE SCROLL-LOCKING & FLUID VIEWPORT TRANSITIONS
    // - Section 2: Scroll up glides to Hero 2; scroll down glides to Portfolio
    // - Portfolio: Cycles 4 slides in place; scroll up on slide 1 glides to Section 2;
    //              scroll down on slide 4 glides to Proof of Work
    // - Proof of Work: Scroll up at top glides back to Portfolio
    // =========================================================================
    const sec2 = document.getElementById('what-we-cover');
    const secProof = document.getElementById('proof-of-work');
    let isSectionTransitioning = false;

    // Smooth navigation from Section 2
    if (sec2) {
      sec2.addEventListener('wheel', (e) => {
        if (isSectionTransitioning) return;
        const rect = sec2.getBoundingClientRect();

        // Scroll UP when near the top of Section 2 -> glide back to Hero 2
        if (e.deltaY < -15 && rect.top >= -30) {
          e.preventDefault();
          isSectionTransitioning = true;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => { isSectionTransitioning = false; }, 650);
          return;
        }

        // Scroll DOWN when at bottom of Section 2 -> glide to Portfolio
        if (e.deltaY > 18 && rect.bottom <= window.innerHeight + 40) {
          e.preventDefault();
          isSectionTransitioning = true;
          const targetY = portfolioSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          setTimeout(() => { isSectionTransitioning = false; }, 650);
        }
      }, { passive: false });
    }

    // Scroll locking inside Portfolio section
    portfolioSection.addEventListener('wheel', (e) => {
      if (isSectionTransitioning) return;
      const rect = portfolioSection.getBoundingClientRect();
      const inView = Math.abs(rect.top) < 65;

      if (inView) {
        // Scroll UP on first slide -> glide back to Section 2
        if (e.deltaY < -18 && currentProjectIdx === 0) {
          if (sec2) {
            e.preventDefault();
            isSectionTransitioning = true;
            const targetY = sec2.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
            setTimeout(() => { isSectionTransitioning = false; }, 650);
          }
          return;
        }

        // Scroll DOWN on portfolio:
        if (e.deltaY > 18) {
          if (currentProjectIdx < portfolioProjects.length - 1) {
            e.preventDefault();
            goToProject(currentProjectIdx + 1);
          } else {
            // On final slide -> advance to Proof of Work
            if (secProof) {
              e.preventDefault();
              isSectionTransitioning = true;
              const targetY = secProof.getBoundingClientRect().top + window.pageYOffset;
              window.scrollTo({ top: targetY, behavior: 'smooth' });
              setTimeout(() => { isSectionTransitioning = false; }, 650);
            }
          }
        } else if (e.deltaY < -18 && currentProjectIdx > 0) {
          e.preventDefault();
          goToProject(currentProjectIdx - 1);
        }
      }
    }, { passive: false });

    // Smooth return from Proof of Work to Portfolio when scrolling UP at the top
    if (secProof) {
      secProof.addEventListener('wheel', (e) => {
        if (isSectionTransitioning) return;
        const rect = secProof.getBoundingClientRect();
        if (e.deltaY < -18 && rect.top >= -35) {
          e.preventDefault();
          isSectionTransitioning = true;
          const targetY = portfolioSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          setTimeout(() => { isSectionTransitioning = false; }, 650);
        }
      }, { passive: false });
    }
  }

  // Mild Ambient Floating Particles (Suppressed on Hero 1 & 2, active from Section 2 downward)
  function initAmbientParticles() {
    let canvas = document.getElementById('ambient-particles-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ambient-particles-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '35';
      canvas.style.mixBlendMode = 'screen';
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 0.5s ease';
      document.body.appendChild(canvas);
    }

    // Dynamic visibility: Completely hidden on Hero 1 & Hero 2, fades in on Section 2 and downstream
    function updateParticleVisibility() {
      const sec2 = document.getElementById('what-we-cover');
      if (!sec2 || !canvas) return;
      const rect = sec2.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.8) {
        canvas.style.opacity = '0.9';
      } else {
        canvas.style.opacity = '0';
      }
    }

    window.addEventListener('scroll', updateParticleVisibility, { passive: true });
    updateParticleVisibility();

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateParticleVisibility();
    });

    const PARTICLE_COUNT = 75;
    const particles = [];

    const palette = [
      'rgba(32, 196, 244, ',   // iridescent cyan
      'rgba(168, 85, 247, ',   // vibrant cosmic purple
      'rgba(123, 63, 228, ',   // ultra-violet
      'rgba(245, 248, 255, ',  // starlight white
      'rgba(56, 189, 248, '    // electric sky blue
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 0.8 + 0.6, // reduced to delicate micro-specks (0.6px - 1.4px)
        colorBase: palette[Math.floor(Math.random() * palette.length)],
        baseAlpha: Math.random() * 0.35 + 0.25,
        alphaPhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.3 - 0.12, // gentle upward cosmic float
        swaySpeed: Math.random() * 0.018 + 0.008,
        swayRange: Math.random() * 0.35 + 0.12
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.alphaPhase += p.swaySpeed;
        p.x += p.vx + Math.sin(p.alphaPhase) * p.swayRange;
        p.y += p.vy;

        // Wrap smoothly around screen edges
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        const alpha = p.baseAlpha * (0.75 + 0.25 * Math.sin(p.alphaPhase * 1.5));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.colorBase + alpha.toFixed(3) + ')';
        ctx.shadowBlur = 3;
        ctx.shadowColor = p.colorBase + '0.4)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // 3D Particle Circle Ring behind Section 2 Title & Totem Numbers
  function initSection2Ring() {
    const canvas = document.getElementById('sec2-ring-canvas');
    const container = document.getElementById('sec2-ring-container');
    const sec2 = document.getElementById('what-we-cover');
    if (!canvas || !container || !window.THREE) return;

    const THREE = window.THREE;
    const scene = new THREE.Scene();

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 800;

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    camera.position.set(0, 0, 44);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Particle Parameters matching Hero Section
    const ringParticleCount = 18000;
    const ringGeometry = new THREE.BufferGeometry();
    const ringPositions = new Float32Array(ringParticleCount * 3);
    const ringOpacities = new Float32Array(ringParticleCount);
    const ringColors = new Float32Array(ringParticleCount * 3);
    const ringSizes = new Float32Array(ringParticleCount);

    // Hero brand palette colors
    const colorCyan = new THREE.Color('#20c4f4');       // iridescent cyan
    const colorElectric = new THREE.Color('#38bdf8');   // sky / electric blue
    const colorViolet = new THREE.Color('#a855f7');     // cosmic purple
    const colorDeepPurple = new THREE.Color('#7b3fe4'); // ultra-violet
    const colorWhite = new THREE.Color('#ffffff');      // starlight white

    for (let i = 0; i < ringParticleCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const densityClump = Math.sin(theta * 4) * Math.cos(theta * 2);

      let radius;
      const particleType = Math.random();

      if (particleType < 0.15) {
        // Outer diffuse cosmic haze
        radius = 15 + Math.random() * 18;
        ringOpacities[i] = Math.random() * 0.35 + 0.18;
        ringSizes[i] = Math.random() * 1.2 + 0.7;
      } else if (particleType < 0.52 + densityClump * 0.28) {
        // Core luminous ring (brighter & crisp)
        radius = 13.8 + (Math.random() - 0.5) * 1.6;
        ringOpacities[i] = 0.88 + Math.random() * 0.12;
        ringSizes[i] = Math.random() * 1.8 + 1.2;
      } else {
        // Inner and outer ring dust band
        radius = 13.8 + (Math.random() - 0.5) * 6.5;
        ringOpacities[i] = 0.50 + Math.random() * 0.45;
        ringSizes[i] = Math.random() * 1.4 + 0.8;
      }

      // 3D dispersion with soft z-spread
      const x = Math.cos(theta) * radius + (Math.random() - 0.5) * 0.6;
      const y = Math.sin(theta) * radius + (Math.random() - 0.5) * 0.6;
      const zSpread = radius > 16 ? 12 : 2.8;
      const z = (Math.random() - 0.5) * zSpread;

      ringPositions[i3] = x;
      ringPositions[i3 + 1] = y;
      ringPositions[i3 + 2] = z;

      // Color distribution: radiant angle-based gradient from purple to blue/cyan with starlight sparkle
      if (Math.random() < 0.14) {
        // Diamond starlight sparkle (brighter)
        ringColors[i3] = colorWhite.r * 1.2;
        ringColors[i3 + 1] = colorWhite.g * 1.2;
        ringColors[i3 + 2] = colorWhite.b * 1.2;
      } else {
        const angleRatio = (Math.sin(theta + Math.PI * 0.25) * 0.5 + 0.5);
        const col1 = colorDeepPurple.clone().lerp(colorViolet, Math.random());
        const col2 = colorCyan.clone().lerp(colorElectric, Math.random());
        const particleCol = col1.lerp(col2, angleRatio).multiplyScalar(1.25);

        ringColors[i3] = particleCol.r;
        ringColors[i3 + 1] = particleCol.g;
        ringColors[i3 + 2] = particleCol.b;
      }
    }

    ringGeometry.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
    ringGeometry.setAttribute('alpha', new THREE.BufferAttribute(ringOpacities, 1));
    ringGeometry.setAttribute('aColor', new THREE.BufferAttribute(ringColors, 3));
    ringGeometry.setAttribute('aSize', new THREE.BufferAttribute(ringSizes, 1));

    const ringMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uScale: { value: 44.0 }
      },
      vertexShader: `
        attribute float alpha;
        attribute vec3 aColor;
        attribute float aSize;
        varying float vAlpha;
        varying vec3 vColor;
        uniform float uScale;

        void main() {
          vAlpha = alpha;
          vColor = aColor;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (uScale / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.6, 14.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;

        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float dist = length(xy);
          if (dist > 0.5) discard;
          float baseAlpha = smoothstep(0.5, 0.04, dist);
          vec3 finalColor = mix(vColor * 1.2, vec3(1.0), smoothstep(0.24, 0.0, dist) * 0.80);
          gl_FragColor = vec4(finalColor, baseAlpha * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const ring = new THREE.Points(ringGeometry, ringMaterial);
    scene.add(ring);

    // Resize handling
    function handleResize() {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 800;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    // Animation & visibility throttling via IntersectionObserver
    let isVisible = false;
    let animId = null;
    const clock = new THREE.Clock();

    function animate() {
      if (!isVisible) {
        animId = null;
        return;
      }
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth continuous ring rotation matching reference
      ring.rotation.z = time * 0.05;

      // Subtle 3D tilting for depth
      ring.rotation.x = Math.sin(time * 0.08) * 0.08;
      ring.rotation.y = Math.cos(time * 0.06) * 0.08;

      renderer.render(scene, camera);
    }

    if (sec2 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            clock.start();
            animate();
          }
        });
      }, { threshold: 0.02 });
      observer.observe(sec2);
    } else {
      isVisible = true;
      animate();
    }
  }

  initAmbientParticles();
  initSection2Ring();
});
