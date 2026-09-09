import { useEffect, useRef, useState } from "react";
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

function useSceneProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const distance = Math.max(1, r.height - innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / distance));
      setProgress(p);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [ref]);
  return progress;
}

function Magnetic({ children, className = "", href = "#contact" }: {children: React.ReactNode; className?: string; href?: string}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.18;
    el.style.transform = `translate3d(${x}px,${y}px,0)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <a ref={ref} href={href} className={className} onMouseMove={move} onMouseLeave={leave}>{children}</a>;
}

function Preloader({done, setDone}: {done: boolean; setDone: (v:boolean)=>void}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setValue(v => {
        const n = Math.min(100, v + Math.ceil(Math.random() * 7));
        if (n >= 100) {
          clearInterval(id);
          setTimeout(() => setDone(true), 550);
        }
        return n;
      });
    }, 55);
    return () => clearInterval(id);
  }, [done, setDone]);
  return <div className={`preloader ${done ? "is-done" : ""}`}>
    <div className="loader-mark">VADRIVO</div>
    <p>We Build Websites That Grow Businesses.</p>
    <div className="loader-track"><span style={{width:`${value}%`}} /></div>
    <div className="loader-count">{String(value).padStart(2,"0")}</div>
  </div>;
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const coarse = matchMedia("(pointer: coarse)").matches;
    if (coarse) return;
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    const move = (e: MouseEvent) => { x=e.clientX; y=e.clientY; };
    const tick = () => {
      rx += (x-rx)*0.13; ry += (y-ry)*0.13;
      if(dot.current) dot.current.style.transform=`translate3d(${x}px,${y}px,0)`;
      if(ring.current) ring.current.style.transform=`translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(tick);
    };
    addEventListener("mousemove", move);
    const raf=requestAnimationFrame(tick);
    return()=>{removeEventListener("mousemove",move);cancelAnimationFrame(raf)};
  },[]);
  return <><div ref={ring} className="cursor-ring"/><div ref={dot} className="cursor-dot"/></>;
}

function App() {
  const [loaded,setLoaded]=useState(false);
  const [menu,setMenu]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [mouse,setMouse]=useState({x:0,y:0});
  const methodRef=useRef<HTMLElement>(null);
  const methodP=useSceneProgress(methodRef);
  const workRef=useRef<HTMLElement>(null);
  const workP=useSceneProgress(workRef);

  useEffect(()=>{
    const fn=()=>setScrolled(scrollY>70);
    addEventListener("scroll",fn,{passive:true});
    return()=>removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    const fn=(e:MouseEvent)=>setMouse({x:e.clientX/innerWidth-.5,y:e.clientY/innerHeight-.5});
    addEventListener("mousemove",fn);
    return()=>removeEventListener("mousemove",fn);
  },[]);

  useEffect(()=>{
    document.body.style.overflow=loaded?"":"hidden";
    return()=>{document.body.style.overflow=""};
  },[loaded]);

  return <>
    <Preloader done={loaded} setDone={setLoaded}/>
    <Cursor/>
    <header className={`nav ${scrolled?"nav-scrolled":""}`}>
      <a className="brand" href="#top">VADRIVO<span>®</span></a>
      <nav className={menu?"mobile-open":""}>
        {["work","services","process","about","contact"].map(x=><a key={x} href={`#${x}`} onClick={()=>setMenu(false)}>{x}</a>)}
      </nav>
      <Magnetic className="nav-cta" href="#contact">START A PROJECT <i>↗</i></Magnetic>
      <button className={`menu-btn ${menu?"open":""}`} onClick={()=>setMenu(!menu)} aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu}><span/><span/></button>
    </header>

    <main id="top">
      <section className="hero scene">
        <div className="hero-grid"/>
        <div className="hero-orb orb-a" style={{transform:`translate3d(${mouse.x*55}px,${mouse.y*55}px,0)`}}/>
        <div className="hero-orb orb-b" style={{transform:`translate3d(${mouse.x*-80}px,${mouse.y*-80}px,0)`}}/>
        <div className="hero-panel panel-a" style={{transform:`translate3d(${mouse.x*-25}px,${mouse.y*-18}px,0) rotate(-9deg)`}}><span>01 / DESIGN</span><b>VISUAL<br/>SYSTEM</b></div>
        <div className="hero-panel panel-b" style={{transform:`translate3d(${mouse.x*30}px,${mouse.y*24}px,0) rotate(8deg)`}}><span>02 / BUILD</span><b>FAST<br/>FRONTEND</b></div>
        <div className="hero-copy">
          <div className="eyebrow"><span/> DIGITAL STUDIO / 2026</div>
          <h1><span>WE BUILD</span><span>DIGITAL</span><span className="outline">EXPERIENCES.</span><em>THAT GROW<br/>BUSINESSES.</em></h1>
          <div className="hero-bottom"><p>Design. Development. Motion.<br/>One digital experience.</p><a href="#work" className="scroll-cue"><span>SCROLL TO EXPLORE</span><b>↓</b></a></div>
        </div>
        <div className="hero-code">VDR / 001<br/><span>INTERFACE_ENGINE</span></div>
      </section>

      <section className="statement pin-scene">
        <div className="statement-inner">
          <div className="section-index">01 — FIRST IMPRESSION</div>
          <h2><span>YOUR WEBSITE</span><span>IS MORE THAN</span><span className="accent-word">A WEBSITE.</span></h2>
          <div className="statement-tail"><span>IT'S YOUR</span><strong>FIRST IMPRESSION.</strong></div>
        </div>
      </section>

      <section className="transform pin-scene" id="services" ref={methodRef}>
        <div className="transform-top"><span>02 — THE VADRIVO METHOD</span><span>SCROLL / TRANSFORM</span></div>
        <div className="transform-word">
          {["DESIGN","DEVELOP","OPTIMIZE","GROW"].map((w,i)=><div key={w} className="method-word" style={{transform:`translate3d(0,${(i-methodP*3)*24}%,0) scale(${1-Math.abs(i-methodP*3)*.08})`,opacity:Math.max(0,1-Math.abs(i-methodP*3)*.7)}}>{w}<sup>0{i+1}</sup></div>)}
        </div>
        <p className="transform-note">One continuous system — from first idea to measurable digital growth.</p>
      </section>

      <section className="services-section scene" id="service-list">
        <div className="services-heading"><span>03 — CAPABILITIES</span><h2>WHAT<br/><i>WE BUILD.</i></h2></div>
        <div className="service-list">{services.map(([n,t,d])=><article className="service-row" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>↗</b></article>)}</div>
      </section>

      <section className="work-scene" id="work" ref={workRef}>
        <div className="work-sticky">
          <div className="work-head"><span>04 — SELECTED WORK</span><span>DRAGGED BY SCROLL</span></div>
          <div className="work-track" style={{transform:`translate3d(${-workP*(projects.length-1)*75}vw,0,0)`}}>
            {projects.map(([n,t,c,image],i)=><article className="project" key={n}>
              <div className={`project-art art-${i}`}>
                <img src={image} alt={`${t} website concept`} loading={i===0 ? "eager" : "lazy"} />
                <div className="project-image-overlay">
                  <span>VADRIVO / CASE {n}</span>
                  <b>{i===0?"MENU":i===1?"PRODUCT":i===2?"MONOGRAM":i===3?"SHOP":"PROFILE"}</b>
                  <i>CONCEPT / DEMO</i>
                </div>
              </div>
              <div className="project-meta"><span>{n}</span><div><h3>{t}</h3><p>{c}</p></div><b>↗</b></div>
            </article>)}
          </div>
          <div className="work-progress"><span style={{width:`${Math.max(4,workP*100)}%`}}/></div>
        </div>
      </section>

      <section className="flow scene" id="process">
        <div className="flow-copy"><span>05 — FROM IDEA TO LAUNCH</span><h2>MAKE IT<br/><i>MOVE.</i></h2></div>
        <div className="flow-map">
          {["IDEA","DESIGN","CODE","LAUNCH","GROWTH"].map((x,i)=><div className="flow-node" key={x} style={{"--i":i} as React.CSSProperties}><span>0{i+1}</span><strong>{x}</strong></div>)}
          <div className="flow-line"/><div className="flow-pulse"/>
        </div>
      </section>

      <section className="manifesto pin-scene">
        <div className="manifesto-small">06 — THE BELIEF</div>
        <div className="manifesto-lines"><span>WE DON'T BUILD</span><span>WEBSITES TO</span><span>FILL A SCREEN.</span></div>
        <div className="manifesto-answer"><span>WE BUILD THEM</span><strong>TO MAKE<br/>BUSINESSES MOVE.</strong></div>
      </section>

      <section className="tech scene" id="technology">
        <div className="tech-head"><span>07 — TECHNOLOGY</span><h2>CRAFTED<br/><i>IN CODE.</i></h2></div>
        <div className="tech-grid">
          {tech.map(([t,d],i)=><article className="tech-card" key={t}>
            <span>{String(i+1).padStart(2,"0")}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </article>)}
        </div>
      </section>

      <section className="global scene" id="global">
        <div className="global-copy">
          <span>08 — GLOBAL REACH</span>
          <h2>BUILT<br/><i>WITHOUT</i><br/>BORDERS.</h2>
        </div>
        <GlobalMap />
        <p className="global-note">
          A visual network for businesses, ideas and brands without borders.
        </p>
      </section>

      <section className="timeline scene">
        <div className="timeline-head"><span>09 — PROCESS</span><h2>FROM FIRST<br/><i>HELLO.</i></h2></div>
        <div className="timeline-list">{["DISCOVER","STRATEGY","DESIGN","DEVELOP","LAUNCH"].map((x,i)=><div key={x} className="timeline-item"><span>0{i+1}</span><h3>{x}</h3><b>+</b></div>)}</div>
      </section>

      <section className="about scene" id="about">
        <div className="about-index">10 — ABOUT VADRIVO</div>
        <div className="about-layout">
          <h2>SMALL TEAM.<br/><i>BIG DIGITAL</i><br/>EXPERIENCES.</h2>
          <p>Vadrivo is a digital studio that builds modern, high-performance digital experiences for ambitious businesses, combining strategy, design, motion and technology to create websites that stand out. Our development capabilities cover frontend, backend and database development, allowing us to build complete digital solutions that are responsive, scalable, reliable and designed around real business goals.</p>
        </div>
      </section>

      <section className="contact scene" id="contact">
        <div className="contact-head"><span>12 — CONTACT</span><h2>LET'S BUILD<br/><i>SOMETHING</i><br/>WORTH REMEMBERING.</h2></div>
        <form onSubmit={(e)=>{e.preventDefault(); const f=new FormData(e.currentTarget); const body=`Name: ${f.get("name")}\nEmail: ${f.get("email")}\nBusiness: ${f.get("business")}\nProject: ${f.get("type")}\n\n${f.get("message")}`; location.href=`mailto:hello@vadrivo.com?subject=Vadrivo Project Request&body=${encodeURIComponent(body)}`;}}>
          <label><span>01</span><input name="name" placeholder="Your name" required/></label>
          <label><span>02</span><input name="email" type="email" placeholder="Email address" required/></label>
          <label><span>03</span><input name="business" placeholder="Business / brand"/></label>
          <label><span>04</span><select name="type" defaultValue=""><option value="" disabled>Project type</option><option>Business Website</option><option>Restaurant / Cafe</option><option>Landing Page</option><option>Portfolio</option><option>E-commerce</option><option>Redesign</option></select></label>
          <label className="message"><span>05</span><textarea name="message" placeholder="Tell us what you're building..." rows={3}/></label>
          <button type="submit">SEND PROJECT REQUEST <b>↗</b></button>
        </form>
      </section>
    </main>

    <footer>
      <div><a className="brand" href="#top">VADRIVO<span>®</span></a><p>We Build Websites That Grow Businesses.</p></div>
      <div className="footer-links">{["WORK","SERVICES","PROCESS","ABOUT","CONTACT"].map(x=><a key={x} href={`#${x.toLowerCase()}`}>{x}</a>)}</div>
      <div className="socials"><a href="https://instagram.com" target="_blank">Instagram ↗</a></div>
      <small>© 2026 VADRIVO / ALL RIGHTS RESERVED</small>
    </footer>
  </>;
}

export default App;
