import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GlobalMap } from "./Map";
const services = [
  ["01", "Business Websites", "Digital presence engineered around clarity, trust and conversion."],
  ["02", "Restaurant & Cafe", "Editorial menus, atmosphere and booking journeys that sell the experience."],
  ["03", "Landing Pages", "Focused pages built to turn attention into action."],
  ["04", "Portfolio Websites", "Personal brands presented with a distinct visual point of view."],
  ["05", "E-commerce Websites", "High-impact storefronts with frictionless product discovery."],
  ["06", "Website Redesign", "A sharper visual system for brands ready to move forward."],
];
const projects = [
  [
    "01",
    "AURA Interior Studio",
    "Business Website",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=75",
    "https://vadrivo.github.io/aurainterior/"
  ],
  [
    "02",
    "New Ritual Cafe",
    "Restaurant / Cafe",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=75",
    "https://vadrivo.github.io/newritualcafe/"
  ],
  [
    "03",
    "AVREN",
    "E-commerce / Experience",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=75",
    "https://vadrivo.github.io/avren/"
  ],
  [
    "04",
    "NOVA ",
    "Fitness Studio / Landing Page",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=75",
    "https://vadrivo.github.io/nova-fitness/"
  ],
  [
    "05",
    "Portfolio",
    "Personal Portfolio",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1400&q=75",
    "https://vedansh250.github.io/"
  ]
];
const NAV_LINKS: [string, string][] = [
  ["work", "work"],
  ["services", "service-list"],
  ["process", "process"],
  ["about", "about"],
  ["contact", "contact"],
];

const tech = [
  ["HTML", "Semantic structure"],
  ["CSS", "Responsive visual systems"],
  ["JavaScript", "Interactive browser experiences"],
  ["TypeScript", "Reliable typed frontend"],
  ["React", "Component-driven interfaces"],
  ["Vite", "Fast modern build tooling"],
];
/* =========================================================
   VADRIVO — REAL 3D WEBGL EARTH
   ========================================================= */
function CinematicEarth() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.z = 4.15;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    const maxDpr = window.innerWidth > 900 ? 1.5 : 1.25;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);
    const earthGroup = new THREE.Group();
    earthGroup.rotation.x = -0.04;
    scene.add(earthGroup);
    const loader = new THREE.TextureLoader();
    const textureBase = `${import.meta.env.BASE_URL}textures/`;
    const earthTexture = loader.load(
      `${textureBase}earth_atmos_2048.jpg`
    );
    const normalTexture = loader.load(
      `${textureBase}earth_normal_2048.jpg`
    );
    const specularTexture = loader.load(
      `${textureBase}earth_specular_2048.jpg`
    );
    const cloudTexture = loader.load(
      `${textureBase}earth_clouds_1024.png`
    );
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    cloudTexture.colorSpace = THREE.SRGBColorSpace;
    const aniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    [earthTexture, normalTexture, specularTexture, cloudTexture].forEach(t => {
      t.anisotropy = aniso;
    });
    const earthGeometry = new THREE.SphereGeometry(1.45, 80, 80);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: normalTexture,
      specularMap: specularTexture,
      specular: new THREE.Color("#2a4058"),
      shininess: 2,
      bumpScale: 0.012,
      transparent: true,
      opacity: 0.92
    });
    const earth = new THREE.Mesh(
      earthGeometry,
      earthMaterial
    );
    // India is placed almost exactly at the camera-facing meridian.
    earth.rotation.y = -0.17;
    earthGroup.add(earth);
    const cloudGeometry = new THREE.SphereGeometry(1.475, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.46,
      depthWrite: false
    });
    const clouds = new THREE.Mesh(
      cloudGeometry,
      cloudMaterial
    );
    clouds.rotation.y = -0.17;
    earthGroup.add(clouds);
    // Thin blue atmospheric shell.
    const atmosphereGeometry = new THREE.SphereGeometry(1.56, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#3b9cff"),
      transparent: true,
      opacity: 0.13,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const atmosphere = new THREE.Mesh(
      atmosphereGeometry,
      atmosphereMaterial
    );
    earthGroup.add(atmosphere);
    // Softer outer halo.
    const glowGeometry = new THREE.SphereGeometry(1.62, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#146fff"),
      transparent: true,
      opacity: 0.045,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glow = new THREE.Mesh(
      glowGeometry,
      glowMaterial
    );
    earthGroup.add(glow);
    const ambient = new THREE.AmbientLight(0x7895b5, 0.42);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 2.65);
    sun.position.set(-4, 2.5, 5);
    scene.add(sun);
    const blueRim = new THREE.DirectionalLight(0x237dff, 1.35);
    blueRim.position.set(4, -1, -4);
    scene.add(blueRim);
    /*
      INDIA MARKER
      Latitude/longitude are converted onto the same sphere.
      The earth rotation above (-0.17 rad) puts this point
      almost directly toward the camera.
    */
    const indiaLat = THREE.MathUtils.degToRad(22.5);
    const indiaLon = THREE.MathUtils.degToRad(78.9);
    const indiaRadius = 1.475;
    const indiaNormal = new THREE.Vector3(
      Math.cos(indiaLat) * Math.cos(indiaLon),
      Math.sin(indiaLat),
      Math.cos(indiaLat) * Math.sin(indiaLon)
    ).normalize();
    const indiaGroup = new THREE.Group();
    indiaGroup.position.copy(
      indiaNormal.clone().multiplyScalar(indiaRadius)
    );
    indiaGroup.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      indiaNormal
    );
    earth.add(indiaGroup);
    // Bright location point.
    const markerGeometry = new THREE.SphereGeometry(
      0.025,
      24,
      24
    );
    const markerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    const marker = new THREE.Mesh(
      markerGeometry,
      markerMaterial
    );
    marker.position.z = 0.015;
    indiaGroup.add(marker);
    // Fine ring around India.
    const ringGeometry = new THREE.RingGeometry(
      0.045,
      0.052,
      48
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x74b8ff,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(
      ringGeometry,
      ringMaterial
    );
    ring.position.z = 0.008;
    indiaGroup.add(ring);
    // Soft pulsing halo.
    const pulseGeometry = new THREE.RingGeometry(
      0.075,
      0.082,
      48
    );
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b9cff,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide
    });
    const pulse = new THREE.Mesh(
      pulseGeometry,
      pulseMaterial
    );
    pulse.position.z = 0.006;
    indiaGroup.add(pulse);
    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resize();
    window.addEventListener("resize", resize);
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (event: MouseEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMouseMove, {
      passive: true
    });
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let animationFrame = 0;
    let pulseTime = 0;
    let lastTime = performance.now();
    let running = false;
    let inView = true;

    const animate = (now: number) => {
      animationFrame = requestAnimationFrame(animate);

      // Frame-rate independent: identical speed on 60Hz and 144Hz screens.
      const dt = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;

      mouseX += (targetX - mouseX) * Math.min(1, 0.025 * dt);
      mouseY += (targetY - mouseY) * Math.min(1, 0.025 * dt);

      const desktop = window.innerWidth > 900;
      earth.rotation.y += (desktop ? 0.0018 : 0.00028) * dt;
      clouds.rotation.y += (desktop ? 0.0024 : 0.00038) * dt;

      if (!reducedMotion) {
        pulseTime += 0.045 * dt;
        const wave = Math.sin(pulseTime) * 0.5 + 0.5;
        pulse.scale.setScalar(1 + wave * 0.9);
        pulseMaterial.opacity = 0.2 + wave * 0.38;
      }

      earthGroup.rotation.y = mouseX * 0.015;
      earthGroup.rotation.x = -0.04 + mouseY * 0.025;

      renderer.render(scene, camera);
    };

    // Only render while the hero is on screen and the tab is visible.
    const syncLoop = () => {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(animate);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(animationFrame);
      }
    };

    const visibilityObserver = new IntersectionObserver(
      entries => {
        inView = entries[0]?.isIntersecting ?? true;
        syncLoop();
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);
    document.addEventListener("visibilitychange", syncLoop);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    syncLoop();
    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", syncLoop);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      earthGeometry.dispose();
      earthMaterial.dispose();
      earthTexture.dispose();
      normalTexture.dispose();
      specularTexture.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      cloudTexture.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      markerGeometry.dispose();
      markerMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      pulseGeometry.dispose();
      pulseMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);
  return (
    <div
      ref={containerRef}
      className="hero-earth"
      aria-hidden="true"
    />
  );
}
/* =========================================================
   SCENE PROGRESS
   ========================================================= */
function useSceneProgress(
  ref: React.RefObject<HTMLElement | null>,
  apply: (progress: number) => void
) {
  // Keep the latest callback without restarting the scroll loop.
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let target = 0;
    let current = 0;
    let inView = true;

    const readTarget = () => {
      const r = el.getBoundingClientRect();
      const distance = Math.max(1, r.height - window.innerHeight);
      target = Math.min(1, Math.max(0, -r.top / distance));
    };

    // The loop only runs while the value is still easing toward the
    // target, then stops. No React re-render happens per frame.
    const tick = () => {
      raf = 0;
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0004) current = target;
      applyRef.current(current);
      if (current !== target) raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (inView && !raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readTarget();
      kick();
    };

    const observer = new IntersectionObserver(
      entries => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) {
          readTarget();
          kick();
        }
      },
      { rootMargin: "25% 0px 25% 0px" }
    );

    readTarget();
    current = target;
    applyRef.current(current);
    observer.observe(el);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [ref]);
}

/* =========================================================
   MAGNETIC BUTTON
   ========================================================= */
function Magnetic({
  children,
  className = "",
  href = "#contact"
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref =
    useRef<HTMLAnchorElement>(null);
  const move = (
    e: React.MouseEvent
  ) => {
    const el = ref.current;
    if (
      !el ||
      matchMedia(
        "(pointer: coarse)"
      ).matches
    ) {
      return;
    }
    const r =
      el.getBoundingClientRect();
    const x =
      (e.clientX -
        r.left -
        r.width / 2) *
      0.18;
    const y =
      (e.clientY -
        r.top -
        r.height / 2) *
      0.18;
    el.style.transform =
      `translate3d(${x}px,${y}px,0)`;
  };
  const leave = () => {
    if (ref.current) {
      ref.current.style.transform = "";
    }
  };
  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={move}
      onMouseLeave={leave}
    >
      {children}
    </a>
  );
}
/* =========================================================
   PRELOADER
   ========================================================= */
function Preloader({
  done,
  setDone
}: {
  done: boolean;
  setDone: (v: boolean) => void;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setValue(v => Math.min(100, v + Math.ceil(Math.random() * 7)));
    }, 55);
    return () => clearInterval(id);
  }, [done]);

  useEffect(() => {
    if (value < 100 || done) return;
    const t = setTimeout(() => setDone(true), 550);
    return () => clearTimeout(t);
  }, [value, done, setDone]);

  return (
    <div className={`preloader ${done ? "is-done" : ""}`} aria-hidden={done}>
      <div className="loader-mark">VADRIVO</div>
      <p>We Build Websites That Grow Businesses.</p>
      <div className="loader-track">
        <span style={{ width: `${value}%` }} />
      </div>
      <div className="loader-count">{String(value).padStart(2, "0")}</div>
    </div>
  );
}

/* =========================================================
   CURSOR
   ========================================================= */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const tick = () => {
      raf = 0;
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      }
      if (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) {
        raf = requestAnimationFrame(tick);
      }
    };

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    addEventListener("mousemove", move, { passive: true });
    return () => {
      removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/* =========================================================
   APP
   ========================================================= */
function App() {
  const [loaded, setLoaded] =
    useState(false);
  const [menu, setMenu] =
    useState(false);
  const [scrolled, setScrolled] =
    useState(false);
  const [submitted, setSubmitted] =
    useState(false);
  const [sending, setSending] = useState(false);
  const heroRef =
    useRef<HTMLElement>(null);
  const methodRef = useRef<HTMLElement>(null);
  const methodWords = useRef<(HTMLDivElement | null)[]>([]);
  const workRef = useRef<HTMLElement>(null);
  const workTrack = useRef<HTMLDivElement>(null);
  const workBar = useRef<HTMLSpanElement>(null);

  useSceneProgress(
    methodRef,
    useCallback((p: number) => {
      methodWords.current.forEach((el, i) => {
        if (!el) return;
        const d = i - p * 3;
        el.style.transform = `translate3d(0,${d * 24}%,0) scale(${1 - Math.abs(d) * 0.08})`;
        el.style.opacity = String(Math.max(0, 1 - Math.abs(d) * 0.7));
      });
    }, [])
  );

  useSceneProgress(
    workRef,
    useCallback((p: number) => {
      if (workTrack.current) {
        workTrack.current.style.transform = `translate3d(${-p * (projects.length - 1) * 75}vw,0,0)`;
      }
      if (workBar.current) {
        workBar.current.style.width = `${Math.max(4, p * 100)}%`;
      }
    }, [])
  );
  useEffect(() => {
    let raf = 0;
    let last = false;
    const update = () => {
      raf = 0;
      const next = window.scrollY > 70;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(update);
      }
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || matchMedia("(pointer: coarse)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const orb = hero.querySelector<HTMLElement>(".orb-b");
    const panelA = hero.querySelector<HTMLElement>(".panel-a");
    const panelB = hero.querySelector<HTMLElement>(".panel-b");

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;
    let inView = true;

    const tick = () => {
      raf = 0;
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (orb) orb.style.transform = `translate3d(${currentX * -80}px,${currentY * -80}px,0)`;
      if (panelA) panelA.style.transform = `translate3d(${currentX * -25}px,${currentY * -18}px,0) rotate(-9deg)`;
      if (panelB) panelB.style.transform = `translate3d(${currentX * 30}px,${currentY * 24}px,0) rotate(8deg)`;
      if (Math.abs(targetX - currentX) > 0.0005 || Math.abs(targetY - currentY) > 0.0005) {
        raf = requestAnimationFrame(tick);
      }
    };

    const move = (e: MouseEvent) => {
      if (!inView) return;
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(hero);

    addEventListener("mousemove", move, { passive: true });
    return () => {
      observer.disconnect();
      removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const locked = !loaded || (menu && innerWidth <= 900);
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loaded, menu]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menu]);
  useEffect(() => {
    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      let destination: Element | null = null;
      try {
        destination = document.querySelector(href);
      } catch {
        return;
      }
      if (!destination) return;
      e.preventDefault();
      destination.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });
      history.replaceState(null, "", href);
    };
    document.addEventListener("click", onAnchorClick);
    return () => {
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);
  return (
    <>
      <Preloader
        done={loaded}
        setDone={setLoaded}
      />
      <Cursor />
      <header
        className={`nav ${
          scrolled
            ? "nav-scrolled"
            : ""
        }`}
      >
        <a
          className="brand"
          href="#top"
        >
          VADRIVO<span>®</span>
        </a>
        <nav
          className={
            menu
              ? "mobile-open"
              : ""
          }
        >
          {NAV_LINKS.map(([label, id]) => (
            <a key={label} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <Magnetic
          className="nav-cta"
          href="#contact"
        >
          START A PROJECT{" "}
          <i>↗</i>
        </Magnetic>
        <button
          className={`menu-btn ${
            menu ? "open" : ""
          }`}
          onClick={() =>
            setMenu(!menu)
          }
          aria-label={
            menu
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={menu}
        >
          <span />
          <span />
        </button>
      </header>
      <main id="top">
        {/* =================================================
            HERO
        ================================================= */}
        <section className="hero scene" ref={heroRef}>
          <div className="hero-grid" aria-hidden="true">
            {Array.from({ length: 60 }, (_, i) => (
              <span
                key={i}
                className="hero-star"
                style={{
                  left: `${(i * 37.7) % 100}%`,
                  top: `${(i * 61.3) % 100}%`,
                  width: `${i % 7 === 0 ? 2 : 1}px`,
                  height: `${i % 7 === 0 ? 2 : 1}px`,
                  animationDelay: `${-((i * 0.73) % 7)}s`,
                  animationDuration: `${5.5 + (i % 6) * 0.8}s`
                }}
              />
            ))}
          </div>
          {/* PREMIUM 3D EARTH */}
          <div className="hero-earth-wrap">
            <CinematicEarth />
          </div>
          {/* SECOND ATMOSPHERIC ORB */}
          <div className="hero-orb orb-b" />
          <div className="hero-panel panel-a">
            <span>
              01 / DESIGN
            </span>
            <b>
              VISUAL
              <br />
              SYSTEM
            </b>
          </div>
          <div className="hero-panel panel-b">
            <span>
              02 / BUILD
            </span>
            <b>
              FAST
              <br />
              FRONTEND
            </b>
          </div>
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> DIGITAL STUDIO / 2025
            </div>
            <h1>
              <span>
                WE BUILD
              </span>
              <span>
                DIGITAL
              </span>
              <span className="outline">
                EXPERIENCES.
              </span>
              <em>
                THAT GROW
                <br />
                BUSINESSES.
              </em>
            </h1>
            <div className="hero-bottom">
              <p>
                Design. Development. Motion.
                <br />
                One digital experience.
              </p>
              <a
                href="#work"
                className="scroll-cue"
              >
                <span>
                  SCROLL TO EXPLORE
                </span>
                <b>↓</b>
              </a>
            </div>
          </div>
          <div className="hero-code">
            VDR / 001
            <br />
            <span>
              INTERFACE_ENGINE
            </span>
          </div>
          
        </section>
        {/* =================================================
            STATEMENT
        ================================================= */}
        <section className="statement pin-scene">
          <div className="statement-inner">
            <div className="section-index">
              01 — FIRST IMPRESSION
            </div>
            <h2>
              <span>
                YOUR WEBSITE
              </span>
              <span>
                IS MORE THAN
              </span>
              <span className="accent-word">
                A WEBSITE.
              </span>
            </h2>
            <div className="statement-tail">
              <span>
                IT'S YOUR
              </span>
              <strong>
                FIRST IMPRESSION.
              </strong>
            </div>
          </div>
        </section>
        {/* =================================================
            METHOD
        ================================================= */}
        <section
          className="transform pin-scene"
          id="services"
          ref={methodRef}
        >
          <div className="transform-top">
            <span>
              02 — THE VADRIVO METHOD
            </span>
            <span>
              SCROLL / TRANSFORM
            </span>
          </div>
          <div className="transform-word">
            {[
              "DESIGN",
              "DEVELOP",
              "OPTIMIZE",
              "GROW"
            ].map(
              (w, i) => (
                <div
                  key={w}
                  className="method-word"
                  ref={el => {
                    methodWords.current[i] = el;
                  }}
                >
                  {w}
                </div>
              )
            )}
          </div>
          <p className="transform-note">
            One continuous system — from first idea to measurable digital growth.
          </p>
        </section>
        {/* =================================================
            SERVICES
        ================================================= */}
        <section
          className="services-section scene"
          id="service-list"
        >
          <div className="services-heading">
            <span>
              03 — CAPABILITIES
            </span>
            <h2>
              WHAT
              <br />
              <i>WE BUILD.</i>
            </h2>
          </div>
          <div className="service-list">
            {services.map(
              ([n, t, d]) => (
                <article
                  className="service-row"
                  key={n}
                >
                  <span>
                    {n}
                  </span>
                  <h3>
                    {t}
                  </h3>
                  <p>
                    {d}
                  </p>
                  <b>
                  </b>
                </article>
              )
            )}
          </div>
        </section>
        {/* =================================================
            WORK
        ================================================= */}
        <section
          className="work-scene"
          id="work"
          ref={workRef}
        >
          <div className="work-sticky">
            <div className="work-head">
              <span>
                04 — SELECTED WORK
              </span>
              <span>
                DRAGGED BY SCROLL
              </span>
            </div>
            <div className="work-track" ref={workTrack}>
              {projects.map(
                (
                  [
                    n,
                    t,
                    c,
                    image,
                    link
                  ],
                  i
                ) => (
                  <article
                    className="project"
                    key={n}
                  >
                    <div
                      className={`project-art art-${i}`}
                    >
                      <img
                        src={image}
                        alt={`${t} website concept`}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                      <div className="project-image-overlay">
                        <span>
                          VADRIVO / CASE {n}
                        </span>
                        <b>
                          {i === 0
                            ? ""
                            : i === 1
                            ? ""
                            : i === 2
                            ? ""
                            : i === 3
                            ? ""
                            : ""}
                        </b>
                        <i>
                          CONCEPT / DEMO
                        </i>
                      </div>
                    </div>
                    <div className="project-meta">
                      <span>
                        {n}
                      </span>
                      <div>
                        <h3>
                          {t}
                        </h3>
                        <p>
                          {c}
                        </p>
                      </div>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${t}`}
                      >
                        ↗
                      </a>
                    </div>
                  </article>
                )
              )}
            </div>
            <div className="work-progress">
              <span ref={workBar} />
            </div>
          </div>
        </section>
        {/* =================================================
            MANIFESTO
        ================================================= */}
        <section className="manifesto pin-scene">
          <div className="manifesto-small">
            05 — THE BELIEF
          </div>
          <div className="manifesto-lines">
            <span>
              WE DON'T BUILD
            </span>
            <span>
              WEBSITES TO
            </span>
            <span>
              FILL A SCREEN.
            </span>
          </div>
          <div className="manifesto-answer">
            <span>
              WE BUILD THEM
            </span>
            <strong>
              TO MAKE
              <br />
              BUSINESSES MOVE.
            </strong>
          </div>
        </section>
        {/* =========================================================
          Replace your existing SECTION 06 — TECHNOLOGY JSX with
          everything below.
          ========================================================= */}
        <section
          className="tech scene"
          id="technology"
        >
          <div className="tech-head">
            <div className="tech-head-top">
              <span>06 — TECHNOLOGY &amp; STACK</span>
              <span>DESIGN × CODE × PERFORMANCE</span>
            </div>
            <div className="tech-title-row">
              <h2>
                CRAFTED
                <br />
                <i>IN CODE.</i>
              </h2>
              <div className="tech-head-copy">
                <span className="tech-orbit" aria-hidden="true">
                  <span />
                </span>
                <p>
                  Modern tools. Clean architecture.<br />
                  Scalable solutions. We use the right<br />
                  technology to turn ideas into high-<br />
                  performing digital experiences.
                </p>
                <small>
                  06 TECHNOLOGIES / ONE DIGITAL SYSTEM
                </small>
              </div>
            </div>
          </div>
          <div className="tech-loop" aria-label="Vadrivo technology stack">
            <div className="tech-track">
              <div className="tech-group">
                {tech.map(([t, d], i) => {
                  const icons: Record<string, string> = {
                    HTML: "html5",
                    CSS: "css",
                    JavaScript: "javascript",
                    TypeScript: "typescript",
                    React: "react",
                    Vite: "vite",
                  };
                  return (
                    <article className="tech-card" key={t}>
                      <div className="tech-card-top">
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <span className="tech-card-mark">↗</span>
                      </div>
                      <div className="tech-card-main">
                        <div className="tech-icon" aria-hidden="true">                          <img
                            src={`https://cdn.simpleicons.org/${icons[t]}/ffffff`}
                            alt=""
                            loading="lazy"
                          />
                        </div>
                        <h3>{t}</h3>
                      </div>
                      <p>{d}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="tech-footer">
            <span>VADRIVO / STACK 06</span>
            <div className="tech-footer-line">
              <span />
            </div>
            <span>BUILT FOR THE WEB</span>
          </div>
        </section>
        {/* =================================================
            GLOBAL
        ================================================= */}
        <section
          className="global scene"
          id="global"
        >
          <div className="global-copy">
            <span>
              07 — GLOBAL REACH
            </span>
            <h2>
              BUILT
              <br />
              <i>WITHOUT</i>
              <br />
              BORDERS.
            </h2>
          </div>
          <GlobalMap />
          <p className="global-note">
            A visual network for businesses, ideas and brands without borders.
          </p>
        </section>
        {/* =================================================
            TIMELINE
        ================================================= */}
        <section className="timeline scene" id="process">
          <div className="timeline-head">
            <span>
              08 — PROCESS
            </span>
            <h2>
              FROM FIRST
              <br />
              <i>HELLO.</i>
            </h2>
          </div>
          <div className="timeline-list">
            {[
              "DISCOVER",
              "STRATEGY",
              "DESIGN",
              "DEVELOP",
              "LAUNCH"
            ].map(
              (x, i) => (
                <div
                  key={x}
                  className="timeline-item"
                >
                  <span>
                    0{i + 1}
                  </span>
                  <h3>
                    {x}
                  </h3>
                  <b>
                    +
                  </b>
                </div>
              )
            )}
          </div>
        </section>
        {/* =================================================
            ABOUT
        ================================================= */}
        <section
          className="about scene"
          id="about"
        >
          <div className="about-index">
            09 — ABOUT VADRIVO
          </div>
          <div className="about-layout">
            <h2>
              SMALL TEAM.
              <br />
              <i>BIG DIGITAL</i>
              <br />
              EXPERIENCES.
            </h2>
            <p>
              Vadrivo is a digital studio that builds modern, high-performance
              digital experiences for ambitious businesses, combining strategy,
              design, motion and technology to create websites that stand out.
              Our development capabilities cover frontend, backend and database
              development, allowing us to build complete digital solutions that
              are responsive, scalable, reliable and designed around real business goals.
            </p>
          </div>
        </section>
        {/* =================================================
            CONTACT
        ================================================= */}
        <section
          className="contact scene"
          id="contact"
        >
          <div className="contact-head">
            <span>
              10 — CONTACT
            </span>
            <h2>
              LET'S BUILD
              <br />
              <i>SOMETHING</i>
              <br />
              WORTH REMEMBERING.
            </h2>
          </div>
          <form
            onSubmit={async e => {
              e.preventDefault();
              if (sending) return;
              setSending(true);
              const form = e.currentTarget;
              const formData =
                new FormData(form);
              formData.append(
                "access_key",
                "c356724a-95d8-4e3b-9d53-8b4a5ccd8448"
              );
              formData.append(
                "subject",
                "New Vadrivo Project Request"
              );
              formData.append(
                "from_name",
                "Vadrivo Website"
              );
              try {
                const response =
                  await fetch(
                    "https://api.web3forms.com/submit",
                    {
                      method:
                        "POST",
                      body:
                        formData
                    }
                  );
                const result =
                  await response.json();
                if (
                  result.success
                ) {
                  form.reset();
                  setSubmitted(
                    true
                  );
                  setTimeout(
                    () =>
                      setSubmitted(
                        false
                      ),
                    4000
                  );
                } else {
                  alert(
                    "Something went wrong. Please try again."
                  );
                }
              } catch {
                alert(
                  "Unable to send your request. Please try again."
                );
              } finally {
                setSending(false);
              }
            }}
          >
            <label>
              <span>
                01
              </span>
              <input
                name="name"
                placeholder="Your name"
                required
              />
            </label>
            <label>
              <span>
                02
              </span>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
              />
            </label>
            <label>
              <span>
                03
              </span>
              <input
                name="business"
                placeholder="Business / brand"
              />
            </label>
            <label>
              <span>
                04
              </span>
              <select
                name="type"
                defaultValue=""
                required
              >
                <option
                  value=""
                  disabled
                >
                  Project type
                </option>
                <option>
                  Business Website
                </option>
                <option>
                  Restaurant / Cafe
                </option>
                <option>
                  Landing Page
                </option>
                <option>
                  Portfolio
                </option>
                <option>
                  E-commerce
                </option>
                <option>
                  Redesign
                </option>
              </select>
            </label>
            <label className="message">
              <span>
                05
              </span>
              <textarea
                name="message"
                placeholder="Tell us what you're building..."
                rows={3}
              />
            </label>
            <button
              type="submit"
              disabled={submitted || sending}
            >
              {submitted ? "REQUEST SENT ✓" : sending ? "SENDING…" : "SEND PROJECT REQUEST"}{" "}
              <b>
                ↗
              </b>
            </button>
            {submitted && (
              <p className="form-success">
                Your request has been successfully sent.
              </p>
            )}
          </form>
        </section>
      </main>
      {/* =================================================
          FOOTER
      ================================================= */}
      <footer>
        <div>
          <a
            className="brand"
            href="#top"
          >
            VADRIVO<span>®</span>
          </a>
          <p>
            We Build Websites That Grow Businesses.
          </p>
        </div>
        <div className="footer-links">
          {NAV_LINKS.map(([label, id]) => (
            <a key={label} href={`#${id}`}>
              {label.toUpperCase()}
            </a>
          ))}
        </div>
        <div className="socials">
          <a
            href="https://instagram.com/vadrivo"
            target="_blank"
            rel="noreferrer"
          >
            Instagram ↗
          </a>
        </div>
        <small>
          © 2026 VADRIVO / ALL RIGHTS RESERVED
        </small>
      </footer>
    </>
  );
}
export default App
