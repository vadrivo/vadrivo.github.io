import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GlobalMap } from "./Map";

const services = [
  ["01", "Business Websites", "Digital presence engineered around clarity, trust and conversion."],
  ["02", "Restaurant & Cafe", "Editorial menus, atmosphere and booking journeys that sell the experience."],
  ["03", "Landing Pages", "Focused pages built to turn attention into action."],
  ["04", "Portfolio Websites", "Personal brands presented with a distinct visual point of view."],
  ["05", "E-commerce Websites", "High-impact storefronts with frictionless product discovery."],
  ["06", "Website Redesign", "A sharper visual system for brands ready to move forward."],
  ["07", "Performance", "Fast, responsive frontend experiences with disciplined motion."],
  ["08", "SEO", "A clean technical foundation designed to be discoverable."]
];

const projects = [
  ["01", "Restaurant Experience", "Hospitality / Digital Experience", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=85"],
  ["02", "SaaS Platform", "Product / Conversion", "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=85"],
  ["03", "Luxury Business", "Brand / Editorial", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85"],
  ["04", "E-commerce Brand", "Commerce / Experience", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=85"],
  ["05", "Personal Brand", "Creator / Portfolio", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1800&q=85"]
];

const tech = [
  ["HTML", "Semantic structure"],
  ["CSS", "Responsive systems"],
  ["JavaScript", "Browser interactions"],
  ["TypeScript", "Typed frontend"],
  ["React", "Reusable UI"],
  ["Git", "Version control"],
  ["GitHub", "Static deployment"],
  ["Node.js", "Scalable server-side applications and APIs."],
  ["Express.js", "Fast and flexible backend APIs."],
  ["Python", "Backend logic, automation and web applications."],
  ["PHP", "Dynamic websites and server-side applications."],
  ["MongoDB", "Flexible database for modern applications."],
  ["PostgreSQL", "Powerful relational database for structured data."],
  ["Tailwind CSS", "Utility-first styling"]
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
    const textureBase =
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/";

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

    const earthGeometry = new THREE.SphereGeometry(1.45, 128, 128);

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

    const cloudGeometry = new THREE.SphereGeometry(
      1.475,
      128,
      128
    );

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
    const atmosphereGeometry = new THREE.SphereGeometry(
      1.56,
      128,
      128
    );

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
    const glowGeometry = new THREE.SphereGeometry(
      1.62,
      96,
      96
    );

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
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );
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

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      mouseX += (targetX - mouseX) * 0.025;
      mouseY += (targetY - mouseY) * 0.025;

      /*
       * EARTH ROTATION
       * Keep the globe rotating continuously on desktop and mobile.
       * Earth rotation is intentionally independent of
       * prefers-reduced-motion so the laptop cannot freeze the globe.
       */
      const desktop = window.innerWidth > 900;

      const earthSpeed = desktop ? 0.0018 : 0.00028;
      const cloudSpeed = desktop ? 0.0024 : 0.00038;

      earth.rotation.y += earthSpeed;
      clouds.rotation.y += cloudSpeed;

      /*
       * Decorative pulse animation still respects the user's
       * reduced-motion preference.
       */
      if (!reducedMotion) {
        pulseTime += 0.045;

        const pulseScale =
          1 + (Math.sin(pulseTime) * 0.5 + 0.5) * 0.9;

        pulse.scale.setScalar(pulseScale);

        pulseMaterial.opacity =
          0.20 +
          (Math.sin(pulseTime) * 0.5 + 0.5) * 0.38;
      }

      // Subtle mouse tilt without moving the globe away from the heading.
      earthGroup.rotation.y = mouseX * 0.035;
      earthGroup.rotation.x = -0.04 + mouseY * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);

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
  ref: React.RefObject<HTMLElement | null>
) {
  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    let raf = 0;

    const update = () => {
      const r =
        el.getBoundingClientRect();

      const distance =
        Math.max(
          1,
          r.height - innerHeight
        );

      const p =
        Math.min(
          1,
          Math.max(
            0,
            -r.top / distance
          )
        );

      setProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);

      raf =
        requestAnimationFrame(update);
    };

    update();

    addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    addEventListener(
      "resize",
      onScroll
    );

    return () => {
      cancelAnimationFrame(raf);

      removeEventListener(
        "scroll",
        onScroll
      );

      removeEventListener(
        "resize",
        onScroll
      );
    };
  }, [ref]);

  return progress;
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
  const [value, setValue] =
    useState(0);

  useEffect(() => {
    if (done) return;

    const id =
      setInterval(() => {
        setValue(v => {
          const n =
            Math.min(
              100,
              v +
                Math.ceil(
                  Math.random() * 7
                )
            );

          if (n >= 100) {
            clearInterval(id);

            setTimeout(
              () => setDone(true),
              550
            );
          }

          return n;
        });
      }, 55);

    return () =>
      clearInterval(id);
  }, [done, setDone]);

  return (
    <div
      className={`preloader ${
        done ? "is-done" : ""
      }`}
    >
      <div className="loader-mark">
        VADRIVO
      </div>

      <p>
        We Build Websites That Grow Businesses.
      </p>

      <div className="loader-track">
        <span
          style={{
            width: `${value}%`
          }}
        />
      </div>

      <div className="loader-count">
        {String(value).padStart(2, "0")}
      </div>
    </div>
  );
}

/* =========================================================
   CURSOR
   ========================================================= */

function Cursor() {
  const dot =
    useRef<HTMLDivElement>(null);

  const ring =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse =
      matchMedia(
        "(pointer: coarse)"
      ).matches;

    if (coarse) return;

    let x =
      innerWidth / 2;

    let y =
      innerHeight / 2;

    let rx = x;
    let ry = y;

    const move = (
      e: MouseEvent
    ) => {
      x = e.clientX;
      y = e.clientY;
    };

    let raf = 0;

    const tick = () => {
      rx +=
        (x - rx) * 0.13;

      ry +=
        (y - ry) * 0.13;

      if (dot.current) {
        dot.current.style.transform =
          `translate3d(${x}px,${y}px,0)`;
      }

      if (ring.current) {
        ring.current.style.transform =
          `translate3d(${rx}px,${ry}px,0)`;
      }

      raf =
        requestAnimationFrame(tick);
    };

    addEventListener(
      "mousemove",
      move
    );

    raf =
      requestAnimationFrame(tick);

    return () => {
      removeEventListener(
        "mousemove",
        move
      );

      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="cursor-ring"
      />

      <div
        ref={dot}
        className="cursor-dot"
      />
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

  const [mouse, setMouse] =
    useState({
      x: 0,
      y: 0
    });

  const methodRef =
    useRef<HTMLElement>(null);

  const methodP =
    useSceneProgress(methodRef);

  const workRef =
    useRef<HTMLElement>(null);

  const workP =
    useSceneProgress(workRef);

  useEffect(() => {
    const fn = () =>
      setScrolled(
        scrollY > 70
      );

    addEventListener(
      "scroll",
      fn,
      { passive: true }
    );

    return () =>
      removeEventListener(
        "scroll",
        fn
      );
  }, []);

  useEffect(() => {
    const fn = (
      e: MouseEvent
    ) =>
      setMouse({
        x:
          e.clientX /
            innerWidth -
          0.5,

        y:
          e.clientY /
            innerHeight -
          0.5
      });

    addEventListener(
      "mousemove",
      fn
    );

    return () =>
      removeEventListener(
        "mousemove",
        fn
      );
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      loaded ? "" : "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [loaded]);

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
          {[
            "work",
            "services",
            "process",
            "about",
            "contact"
          ].map(x => (
            <a
              key={x}
              href={`#${x}`}
              onClick={() =>
                setMenu(false)
              }
            >
              {x}
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

        <section className="hero scene">

          <div className="hero-grid" />

          {/* PREMIUM 3D EARTH */}

          <div className="hero-earth-wrap">
            <CinematicEarth />
          </div>

          {/* SECOND ATMOSPHERIC ORB */}

          <div
            className="hero-orb orb-b"
            style={{
              transform:
                `translate3d(${mouse.x * -80}px,${mouse.y * -80}px,0)`
            }}
          />

          <div
            className="hero-panel panel-a"
            style={{
              transform:
                `translate3d(${mouse.x * -25}px,${mouse.y * -18}px,0) rotate(-9deg)`
            }}
          >
            <span>
              01 / DESIGN
            </span>

            <b>
              VISUAL
              <br />
              SYSTEM
            </b>
          </div>

          <div
            className="hero-panel panel-b"
            style={{
              transform:
                `translate3d(${mouse.x * 30}px,${mouse.y * 24}px,0) rotate(8deg)`
            }}
          >
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
                  style={{
                    transform:
                      `translate3d(0,${(i - methodP * 3) * 24}%,0) scale(${1 - Math.abs(i - methodP * 3) * 0.08})`,

                    opacity:
                      Math.max(
                        0,
                        1 -
                          Math.abs(
                            i -
                              methodP *
                                3
                          ) *
                            0.7
                      )
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
                    ↗
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

            <div
              className="work-track"
              style={{
                transform:
                  `translate3d(${-workP * (projects.length - 1) * 75}vw,0,0)`
              }}
            >

              {projects.map(
                (
                  [
                    n,
                    t,
                    c,
                    image
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
                        loading={
                          i === 0
                            ? "eager"
                            : "lazy"
                        }
                      />

                      <div className="project-image-overlay">

                        <span>
                          VADRIVO / CASE {n}
                        </span>

                        <b>
                          {i === 0
                            ? "MENU"
                            : i === 1
                            ? "PRODUCT"
                            : i === 2
                            ? "MONOGRAM"
                            : i === 3
                            ? "SHOP"
                            : "PROFILE"}
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

                      <b>
                        ↗
                      </b>

                    </div>

                  </article>
                )
              )}

            </div>

            <div className="work-progress">

              <span
                style={{
                  width:
                    `${Math.max(
                      4,
                      workP * 100
                    )}%`
                }}
              />

            </div>

          </div>

        </section>

        {/* =================================================
            PROCESS FLOW
        ================================================= */}

        <section
          className="flow scene"
          id="process"
        >

          <div className="flow-copy">

            <span>
              05 — FROM IDEA TO LAUNCH
            </span>

            <h2>
              MAKE IT
              <br />
              <i>MOVE.</i>
            </h2>

          </div>

          <div className="flow-map">

            {[
              "IDEA",
              "DESIGN",
              "CODE",
              "LAUNCH",
              "GROWTH"
            ].map(
              (x, i) => (
                <div
                  className="flow-node"
                  key={x}
                  style={
                    {
                      "--i": i
                    } as React.CSSProperties
                  }
                >

                  <span>
                    0{i + 1}
                  </span>

                  <strong>
                    {x}
                  </strong>

                </div>
              )
            )}

            <div className="flow-line" />

            <div className="flow-pulse" />

          </div>

        </section>

        {/* =================================================
            MANIFESTO
        ================================================= */}

        <section className="manifesto pin-scene">

          <div className="manifesto-small">
            06 — THE BELIEF
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

        {/* =================================================
            TECHNOLOGY
        ================================================= */}

        <section
          className="tech scene"
          id="technology"
        >

          <div className="tech-head">

            <span>
              07 — TECHNOLOGY
            </span>

            <h2>
              CRAFTED
              <br />
              <i>IN CODE.</i>
            </h2>

          </div>

          <div
            className="tech-loop"
            aria-label="Technology stack"
          >

            <div className="tech-track">

              {[0, 1].map(
                group => (
                  <div
                    className="tech-group"
                    key={group}
                    aria-hidden={
                      group === 1
                    }
                  >

                    {tech.map(
                      (
                        [t, d],
                        i
                      ) => (
                        <article
                          className="tech-card"
                          key={`${group}-${t}`}
                        >

                          <span>
                            {String(
                              i + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <h3>
                            {t}
                          </h3>

                          <p>
                            {d}
                          </p>

                        </article>
                      )
                    )}

                  </div>
                )
              )}

            </div>

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
              08 — GLOBAL REACH
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

        <section className="timeline scene">

          <div className="timeline-head">

            <span>
              09 — PROCESS
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
            10 — ABOUT VADRIVO
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
              12 — CONTACT
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

              const form =
                e.currentTarget;

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
              disabled={submitted}
            >

              {submitted
                ? "REQUEST SENT ✓"
                : "SEND PROJECT REQUEST"}{" "}

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

          {[
            "WORK",
            "SERVICES",
            "PROCESS",
            "ABOUT",
            "CONTACT"
          ].map(
            x => (
              <a
                key={x}
                href={`#${x.toLowerCase()}`}
              >
                {x}
              </a>
            )
          )}

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

export default App;
