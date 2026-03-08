import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

/* ─── GOOGLE FONTS ─────────────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Mono:wght@300;400;500&display=swap');`}</style>
);

/* ─── SUBTLE THREE.JS BACKGROUND ───────────────────────────────────────────── */
function ThreeBg() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const W = window.innerWidth, H = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    cam.position.z = 50;

    const N = 600;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 140;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x4a7fa5, size: 0.18, transparent: true, opacity: 0.4 });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const rg = new THREE.TorusGeometry(18, 0.06, 8, 80);
    const rm = new THREE.MeshBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.25 });
    const ring = new THREE.Mesh(rg, rm);
    ring.rotation.x = 1.1;
    ring.position.set(14, -6, -20);
    scene.add(ring);

    let mx = 0, my = 0;
    const onM = e => { mx = (e.clientX / W - 0.5) * 0.04; my = (e.clientY / H - 0.5) * 0.04; };
    window.addEventListener("mousemove", onM);

    let t = 0;
    const tick = () => {
      requestAnimationFrame(tick);
      t += 0.0008;
      pts.rotation.y = t + mx;
      pts.rotation.x = t * 0.4 + my;
      ring.rotation.z += 0.0015;
      renderer.render(scene, cam);
    };
    tick();

    const onR = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onR);
    return () => {
      window.removeEventListener("mousemove", onM);
      window.removeEventListener("resize", onR);
      el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return <div ref={ref} className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ─── CURSOR ────────────────────────────────────────────────────────────────── */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const trail = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = e => {
      cur.current = { x: e.clientX, y: e.clientY };
      if (dot.current) dot.current.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 3}px)`;
    };
    window.addEventListener("mousemove", move);

    const lerp = (a, b, t) => a + (b - a) * t;
    let raf;
    const loop = () => {
      trail.current.x = lerp(trail.current.x, cur.current.x, 0.1);
      trail.current.y = lerp(trail.current.y, cur.current.y, 0.1);
      if (ring.current) ring.current.style.transform = `translate(${trail.current.x - 16}px,${trail.current.y - 16}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const grow = () => ring.current?.classList.add("ring-grow");
    const shrink = () => ring.current?.classList.remove("ring-grow");
    document.querySelectorAll("a,button,[data-h]").forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <style>{`
        .ring-grow { width: 36px !important; height: 36px !important; opacity: 0.5 !important; margin-left: -18px !important; margin-top: -18px !important; }
        @media(hover:none){ .cdot,.cring{display:none} }
      `}</style>
      <div ref={dot} className="cdot fixed top-0 left-0 w-1.5 h-1.5 bg-blue-400 rounded-full z-[9999] pointer-events-none" style={{ willChange: "transform" }} />
      <div ref={ring} className="cring fixed top-0 left-0 w-8 h-8 border border-blue-400/50 rounded-full z-[9998] pointer-events-none transition-all duration-300 opacity-70" style={{ willChange: "transform" }} />
    </>
  );
}

/* ─── SCROLL PROGRESS ───────────────────────────────────────────────────────── */
function ScrollBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      setP((d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[200] bg-slate-800/60">
      <div className="h-full bg-blue-500 transition-all duration-75" style={{ width: `${p}%` }} />
    </div>
  );
}

/* ─── FADE IN ───────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── SECTION HEADING ───────────────────────────────────────────────────────── */
function SectionHead({ label, title }) {
  return (
    <Reveal>
      <div className="mb-12">
        <span className="text-blue-500 font-mono text-xs tracking-[0.25em] uppercase">{label}</span>
        <h2 className="mt-2 text-3xl font-semibold text-slate-100 tracking-tight">{title}</h2>
        <div className="mt-3 w-8 h-[2px] bg-blue-500 rounded-full" />
      </div>
    </Reveal>
  );
}

/* ─── NAV ───────────────────────────────────────────────────────────────────── */
const NAV = ["About", "Skills", "Projects", "Education", "Achievements", "Contact"];

function Nav() {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    NAV.forEach(n => { const el = document.getElementById(n.toLowerCase()); if (el) obs.observe(el); });

    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav className={`fixed top-[2px] left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "bg-[#020817]/90 backdrop-blur-md border-b border-slate-800/60" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => go("about")} data-h className="font-mono text-sm text-slate-400 hover:text-slate-100 transition-colors tracking-widest">
          HPM<span className="text-blue-500">.</span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {NAV.map(l => (
            <button key={l} onClick={() => go(l.toLowerCase())} data-h
              className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-200 ${active === l.toLowerCase() ? "text-slate-100 bg-slate-800" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"}`}>
              {l}
            </button>
          ))}
        </div>
        <a href="mailto:haraprasadmahapatra223@gmail.com" data-h
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors duration-200">
          Get in touch
        </a>
      </div>
    </nav>
  );
}

/* ─── HERO ──────────────────────────────────────────────────────────────────── */
function Hero() {
  const [typed, setTyped] = useState("");
  const roles = ["Full-Stack Developer", "MERN Stack Engineer", "AI Integrator", "Competitive Programmer"];
  const ri = useRef(0), ci = useRef(0), del = useRef(false);

  useEffect(() => {
    const tick = () => {
      const r = roles[ri.current];
      if (!del.current) {
        ci.current++;
        setTyped(r.slice(0, ci.current));
        if (ci.current === r.length) { del.current = true; setTimeout(tick, 2000); return; }
      } else {
        ci.current--;
        setTyped(r.slice(0, ci.current));
        if (ci.current === 0) { del.current = false; ri.current = (ri.current + 1) % roles.length; }
      }
      setTimeout(tick, del.current ? 35 : 75);
    };
    const t = setTimeout(tick, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="about" className="min-h-screen flex items-center px-6 pt-20">
      <div className="max-w-6xl mx-auto w-full py-24">
        <div className="grid md:grid-cols-[1fr_auto] gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8"
              style={{ opacity: 0, animation: "fadeUp 0.5s 0.1s forwards" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium font-mono">Open to opportunities · 2nd Year B.Tech IT</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-100 leading-[1.1] tracking-tight mb-4"
              style={{ opacity: 0, animation: "fadeUp 0.5s 0.25s forwards" }}>
              Hara Prasad<br />
              <span className="text-blue-400">Mahapatra</span>
            </h1>

            <div className="h-7 mb-6 font-mono text-slate-400 text-base"
              style={{ opacity: 0, animation: "fadeUp 0.5s 0.4s forwards" }}>
              {typed}<span className="animate-pulse text-blue-400">|</span>
            </div>

            <p className="text-slate-400 text-base leading-relaxed max-w-lg mb-8"
              style={{ opacity: 0, animation: "fadeUp 0.5s 0.55s forwards" }}>
              2nd year B.Tech IT student at <span className="text-slate-200">BVM Engineering College, Anand</span> with a <span className="text-slate-200 font-semibold">9.76 CPI</span> and a perfect <span className="text-slate-200 font-semibold">10.0 SPI</span> in 3rd semester. I build full-stack web apps, integrate AI/ML pipelines, and love cryptographic systems.
            </p>

            {/* Contact info row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 mb-10"
              style={{ opacity: 0, animation: "fadeUp 0.5s 0.65s forwards" }}>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Anand, Gujarat
              </span>
              <a href="mailto:haraprasadmahapatra223@gmail.com" data-h className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                haraprasadmahapatra223@gmail.com
              </a>
              <a href="tel:9537362412" data-h className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                +91 9537362412
              </a>
            </div>

            <div className="flex items-center gap-3 flex-wrap"
              style={{ opacity: 0, animation: "fadeUp 0.5s 0.75s forwards" }}>
              <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} data-h
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors duration-200">
                View Projects
              </button>
              <a href="mailto:haraprasadmahapatra223@gmail.com" data-h
                className="px-6 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-medium rounded-md transition-colors duration-200">
                Contact Me
              </a>
              <a href="https://github.com/Haraprasad-workspace/" target="_blank" rel="noreferrer" data-h title="GitHub"
                className="p-2.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/haraprasad-mahapatra-549a1a280/" target="_blank" rel="noreferrer" data-h title="LinkedIn"
                className="p-2.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://www.hackerrank.com/profile/haraprasadmahap1" target="_blank" rel="noreferrer" data-h title="HackerRank"
                className="p-2.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded-md transition-colors duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701c.141 0 .254-.115.254-.258V6.4c0-.141-.113-.254-.254-.254H7.027c-.141 0-.254.113-.254.254v.252c0 .143.113.258.254.258h.701v10.184h-.701c-.141 0-.254.115-.254.258v.254c0 .139.113.254.254.254h3.638c.141 0 .254-.115.254-.254v-.254c0-.143-.113-.258-.254-.258h-.701V13.41h4.074v3.676h-.701c-.141 0-.258.115-.258.258v.254c0 .139.117.254.258.254H17.27c.141 0 .254-.115.254-.254v-.254c0-.143-.113-.258-.254-.258h-.699V6.908h.699c.141 0 .254-.115.254-.258V6.4c0-.141-.113-.254-.254-.254h-2.975z"/></svg>
              </a>
            </div>
          </div>

          {/* Photo + Stats */}
          <div className="hidden md:flex flex-col items-center gap-5" style={{ opacity: 0, animation: "fadeUp 0.5s 0.5s forwards" }}>
            {/* ── PHOTO SLOT ── Replace the src below with your actual photo path e.g. src="/photo.jpg" */}
            <div className="relative w-48 h-48 shrink-0">
              <div className="w-48 h-48 rounded-2xl border-2 border-slate-700 bg-slate-900 overflow-hidden flex items-center justify-center group">
                <img
                  src="/photo.jpeg"
                  alt="Hara Prasad Mahapatra"
                  className="w-full h-full object-cover object-top"
                  onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                />
                {/* Fallback placeholder shown if no photo */}
                <div className="hidden w-full h-full flex-col items-center justify-center gap-2 text-slate-600">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span className="text-xs font-mono text-slate-700">Add photo.jpg</span>
                </div>
              </div>
              {/* Blue glow ring */}
              <div className="absolute -inset-1 rounded-2xl border border-blue-500/20 pointer-events-none" />
            </div>

            {/* Stats card */}
            <div className="w-48 border border-slate-800 rounded-xl bg-slate-900/60 backdrop-blur-sm p-4 space-y-4">
              {[
                { label: "Current CPI", value: "9.76", sub: "B.Tech IT — BVM" },
                { label: "3rd Sem SPI", value: "10.00", sub: "Perfect Score" },
                { label: "Projects Built", value: "3+", sub: "Production" },
                { label: "HackerRank", value: "5★", sub: "C++ · 4★ SQL" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-xs font-mono">{s.label}</div>
                    <div className="text-slate-600 text-xs mt-0.5">{s.sub}</div>
                  </div>
                  <div className="text-xl font-bold text-slate-100 font-mono">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </section>
  );
}

/* ─── SKILLS ────────────────────────────────────────────────────────────────── */
const SKILLS_DATA = [
  { category: "Languages", icon: "⌨", items: ["C++", "Python"] },
  { category: "Frontend", icon: "🖥", items: ["React", "HTML5", "CSS3", "JavaScript (ES6+)"] },
  { category: "Backend", icon: "⚙", items: ["Node.js", "Express.js", "FastAPI", "PHP"] },
  { category: "Database", icon: "🗄", items: ["MongoDB", "MySQL"] },
  { category: "AI / ML", icon: "🤖", items: ["DistilBERT (NLP)", "Gemini API", "Data Analysis", "Statistical Modelling"] },
  { category: "Tools & Infra", icon: "🛠", items: ["Git & GitHub", "Postman", "Cloudinary", "Render", "Vercel", "Hugging Face"] },
];

function Skills() {
  return (
    <section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHead label="02 — Skills" title="Technical Expertise" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILLS_DATA.map((s, i) => (
            <Reveal key={s.category} delay={i * 0.07}>
              <div className="group border border-slate-800 hover:border-slate-700 rounded-xl p-5 bg-slate-900/40 hover:bg-slate-900/70 transition-all duration-300" data-h>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-slate-300 font-medium text-sm">{s.category}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map(item => (
                    <span key={item} className="px-2.5 py-1 text-xs font-mono bg-slate-800 text-slate-400 group-hover:text-slate-300 rounded-md border border-slate-700/50 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ──────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    num: "01",
    title: "CryptoAssure",
    subtitle: "Automated Cryptographic Security Evaluation Engine",
    period: "Jan – Feb 2026",
    badge: "Python · Security · AI",
    stack: ["Python", "FastAPI", "Cryptographic Libraries", "Statistical Analysis", "Gemini API"],
    bullets: [
      "Built a Python-based cryptographic evaluation engine analysing encryption outputs using avalanche effect, entropy, frequency distribution deviation, and key strength estimation.",
      "Implemented a rule-based validation system to detect insecure configurations (weak key sizes, ECB mode) and compute a standardised security score.",
      "Integrated an AI-powered recommendation engine via the Gemini API — feeds evaluation stats to generate actionable configuration improvement suggestions.",
    ],
    github: "https://github.com/Haraprasad-workspace/CryptoAssure",
    live: null,
    accent: "#3b82f6",
    deploy: null,
  },
  {
    num: "02",
    title: "Sangam",
    subtitle: "Social Connectivity Web Application",
    period: "Sep – Nov 2025",
    badge: "MERN · NLP · Full-Stack",
    stack: ["React", "Node.js", "Express.js", "MongoDB", "FastAPI", "DistilBERT", "Google OAuth"],
    bullets: [
      "Full-stack MERN application with Google OAuth, thought posting, profile management, and social interactions (follow, like).",
      "Integrated NLP emotion detection system using a fine-tuned 66M-parameter DistilBERT model to infer emotional sentiment from user posts.",
      "FastAPI inference service on Render with ML model hosted on Hugging Face — enabling scalable real-time emotion prediction via REST API.",
    ],
    github: "https://github.com/Haraprasad-workspace/Sangam",
    live: "https://sangam-beryl.vercel.app/",
    accent: "#10b981",
    deploy: "Vercel (Frontend) · Render (Backend) · Hugging Face (ML Model)",
  },
  {
    num: "03",
    title: "ZestyCart",
    subtitle: "Web-based Food Ordering Application",
    period: "Jun – Jul 2025",
    badge: "Node.js · MongoDB · Full-Stack",
    stack: ["Node.js", "Express.js", "MongoDB", "EJS", "Cloudinary"],
    bullets: [
      "Full-stack food ordering system with menu browsing, cart management, order placement, and automated receipt generation.",
      "Role-based admin dashboard with full CRUD management for food items and basic sales analytics for order tracking.",
      "Integrated Cloudinary cloud storage for scalable image hosting and optimised media delivery across the platform.",
    ],
    github: "https://github.com/Haraprasad-workspace/ZestyCart_main",
    live: "https://zestycart.onrender.com/",
    accent: "#f59e0b",
    deploy: "Render",
  },
];

function Projects() {
  const [open, setOpen] = useState(null);
  return (
    <section id="projects" className="py-28 px-6 bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        <SectionHead label="03 — Projects" title="Featured Work" />
        <div className="space-y-4">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${open === i ? "border-slate-600 bg-slate-900" : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60"}`}>
                <button className="w-full text-left p-6 flex items-start gap-4" onClick={() => setOpen(open === i ? null : i)} data-h>
                  <span className="font-mono text-slate-600 text-sm mt-0.5 shrink-0 w-7">{p.num}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-slate-100">{p.title}</h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: p.accent + "50", color: p.accent, background: p.accent + "15" }}>
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">{p.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-xs text-slate-600 font-mono hidden sm:block">{p.period}</span>
                    <svg className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ${open === i ? "max-h-[700px]" : "max-h-0"}`}>
                  <div className="px-6 pb-6 border-t border-slate-800">
                    {/* ── PROJECT SCREENSHOT ── Replace src with actual screenshot, e.g. src={`/${p.title.toLowerCase()}.png`} */}
                    <div className="mt-5 mb-6 w-full h-44 rounded-lg border border-slate-800 bg-slate-900 overflow-hidden relative flex items-center justify-center">
                      <img
                        src={`/${p.title.toLowerCase()}.png`}
                        alt={`${p.title} screenshot`}
                        className="w-full h-full object-cover object-top"
                        onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                      />
                      {/* Fallback */}
                      <div className="hidden w-full h-full flex-col items-center justify-center gap-2 text-slate-700">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <span className="text-xs font-mono">Add {p.title.toLowerCase()}.png for screenshot</span>
                      </div>
                      {/* Accent tint overlay */}
                      <div className="absolute inset-0 pointer-events-none rounded-lg" style={{ background: `linear-gradient(to top, ${p.accent}18 0%, transparent 60%)` }} />
                    </div>

                    <div className="grid md:grid-cols-[1fr_200px] gap-8">
                      <div>
                        <ul className="space-y-2.5 mb-5">
                          {p.bullets.map((b, j) => (
                            <li key={j} className="flex gap-3 text-sm text-slate-400 leading-relaxed">
                              <span className="mt-2 w-1 h-1 rounded-full shrink-0" style={{ background: p.accent }} />
                              {b}
                            </li>
                          ))}
                        </ul>
                        {p.deploy && <p className="text-xs text-slate-600 font-mono mb-5">Deployment: {p.deploy}</p>}
                        <div className="flex gap-3">
                          <a href={p.github} target="_blank" rel="noreferrer" data-h
                            className="flex items-center gap-2 px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-md text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                            GitHub
                          </a>
                          {p.live && (
                            <a href={p.live} target="_blank" rel="noreferrer" data-h
                              className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono text-white transition-colors" style={{ background: p.accent }}>
                              ↗ Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 font-mono mb-3 uppercase tracking-widest">Tech Stack</div>
                        <div className="flex flex-wrap gap-1.5">
                          {p.stack.map(t => (
                            <span key={t} className="px-2 py-1 text-xs font-mono rounded bg-slate-800 text-slate-400 border border-slate-700/50">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── EDUCATION ─────────────────────────────────────────────────────────────── */
const EDU = [
  {
    school: "Birla Vishvakarma Mahavidyalaya (BVM Engineering College)",
    degree: "B.Tech — Information Technology",
    period: "2024 – 2028",
    location: "Anand, Gujarat",
    current: true,
    highlights: [{ label: "Year", val: "2nd Year" }, { label: "CPI", val: "9.76" }, { label: "3rd Sem SPI", val: "10.00" }],
  },
  {
    school: "Gajera International School",
    degree: "HSC [CBSE] — Class 12",
    period: "2022 – 2024",
    location: "Surat, Gujarat",
    current: false,
    highlights: [{ label: "Score", val: "93.40%" }],
  },
  {
    school: "Gajera International School",
    degree: "SSC [CBSE] — Class 10",
    period: "2010 – 2022",
    location: "Surat, Gujarat",
    current: false,
    highlights: [{ label: "Score", val: "92.60%" }],
  },
];

function Education() {
  return (
    <section id="education" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHead label="04 — Education" title="Academic Background" />
        <div className="relative pl-8">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-800" />
          <div className="space-y-6">
            {EDU.map((e, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative">
                  <div className={`absolute -left-8 top-2 w-3 h-3 rounded-full border-2 ${e.current ? "border-blue-500 bg-blue-500/30" : "border-slate-600 bg-[#020817]"}`} />
                  <div className="border border-slate-800 hover:border-slate-700 rounded-xl p-6 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300" data-h>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-slate-200 font-semibold">{e.school}</h3>
                          {e.current && (
                            <span className="px-2 py-0.5 text-xs font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-full">Current</span>
                          )}
                        </div>
                        <p className="text-slate-500 text-sm">{e.degree}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-slate-400 text-sm font-mono">{e.period}</div>
                        <div className="text-slate-600 text-xs mt-0.5">{e.location}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-800/60">
                      {e.highlights.map(h => (
                        <div key={h.label} className="flex items-center gap-2">
                          <span className="text-slate-600 text-xs font-mono">{h.label}:</span>
                          <span className="text-slate-200 text-sm font-semibold font-mono">{h.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ACHIEVEMENTS ──────────────────────────────────────────────────────────── */
function Achievements() {
  return (
    <section id="achievements" className="py-28 px-6 bg-slate-950/50">
      <div className="max-w-6xl mx-auto">
        <SectionHead label="05 — Recognition" title="Achievements & Certifications" />
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-4">Achievements</h3>
            <div className="space-y-3">
              {[
                { title: "IIT Guwahati — Summer Analytics Program", desc: "Completed Summer Analytics Program, a prestigious data science bootcamp conducted by IIT Guwahati.", icon: "🏛" },
                { title: "HackerRank — 5★ C++ · 4★ SQL", desc: "Secured 5-star rating in C++ and 4-star rating in SQL on HackerRank competitive coding platform.", icon: "⭐" },
                { title: "Ideathon 2024 — Runner-Up", desc: "Runner-up position in Ideathon 2024. Project: Sustainable Solar Panels for Vallabh Vidhyanagar.", icon: "🥈" },
              ].map((a, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="flex gap-4 p-4 border border-slate-800 rounded-xl bg-slate-900/40 hover:border-slate-700 transition-all duration-200" data-h>
                    <span className="text-2xl mt-0.5 shrink-0">{a.icon}</span>
                    <div>
                      <div className="text-slate-200 text-sm font-medium mb-0.5">{a.title}</div>
                      <div className="text-slate-500 text-xs leading-relaxed">{a.desc}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-slate-500 text-xs font-mono uppercase tracking-widest mb-4">Certifications</h3>
            <Reveal>
              <div className="p-5 border border-slate-800 rounded-xl bg-slate-900/40 hover:border-blue-500/30 transition-all duration-300" data-h>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-200 font-medium mb-1">Summer Analytics 2025</div>
                    <div className="text-slate-500 text-sm mb-2">Certificate of Excellence — IIT Guwahati</div>
                    <div className="text-blue-400 text-xs font-mono">Issued 2025</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { v: "9.76", l: "CPI at BVM" },
                { v: "10.0", l: "SPI Sem 3" },
                { v: "5★", l: "C++ HackerRank" },
                { v: "3+", l: "Projects Built" },
              ].map(s => (
                <Reveal key={s.l}>
                  <div className="p-4 border border-slate-800 rounded-xl bg-slate-900/40 text-center">
                    <div className="text-2xl font-bold text-slate-100 font-mono">{s.v}</div>
                    <div className="text-xs text-slate-600 mt-1 font-mono">{s.l}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ───────────────────────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHead label="06 — Contact" title="Get In Touch" />
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <Reveal>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              I'm currently open to internship opportunities, freelance projects, and collaborations. Whether you have a project in mind or just want to say hello — feel free to reach out.
            </p>
            <div className="space-y-3">
              {[
                { icon: "✉", label: "Email", val: "haraprasadmahapatra223@gmail.com", href: "mailto:haraprasadmahapatra223@gmail.com" },
                { icon: "📞", label: "Phone", val: "+91 9537362412", href: "tel:9537362412" },
                { icon: "📍", label: "Location", val: "Anand, Gujarat, India", href: null },
                { icon: "🎓", label: "College", val: "BVM Engineering College, Anand (2024–2028)", href: null },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4 p-4 border border-slate-800 rounded-xl bg-slate-900/40">
                  <span className="text-lg shrink-0">{c.icon}</span>
                  <div>
                    <div className="text-slate-600 text-xs font-mono">{c.label}</div>
                    {c.href ? (
                      <a href={c.href} data-h className="text-slate-300 text-sm hover:text-blue-400 transition-colors">{c.val}</a>
                    ) : (
                      <div className="text-slate-300 text-sm">{c.val}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-3">
              {[
                {
                  platform: "GitHub",
                  handle: "github.com/haraprasad",
                  sub: "Source code & projects",
                  href: "https://github.com/Haraprasad-workspace/",
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>,
                },
                {
                  platform: "LinkedIn",
                  handle: "Hara Prasad Mahapatra",
                  sub: "Professional profile",
                  href: "https://www.linkedin.com/in/haraprasad-mahapatra-549a1a280/",
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                },
                {
                  platform: "HackerRank",
                  handle: "5★ C++ · 4★ SQL",
                  sub: "Competitive programming",
                  href: "https://www.hackerrank.com/profile/haraprasadmahap1",
                  icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701c.141 0 .254-.115.254-.258V6.4c0-.141-.113-.254-.254-.254H7.027c-.141 0-.254.113-.254.254v.252c0 .143.113.258.254.258h.701v10.184h-.701c-.141 0-.254.115-.254.258v.254c0 .139.113.254.254.254h3.638c.141 0 .254-.115.254-.254v-.254c0-.143-.113-.258-.254-.258h-.701V13.41h4.074v3.676h-.701c-.141 0-.258.115-.258.258v.254c0 .139.117.254.258.254H17.27c.141 0 .254-.115.254-.254v-.254c0-.143-.113-.258-.254-.258h-.699V6.908h.699c.141 0 .254-.115.254-.258V6.4c0-.141-.113-.254-.254-.254h-2.975z"/></svg>,
                },
              ].map(s => (
                <a key={s.platform} href={s.href} target="_blank" rel="noreferrer" data-h
                  className="flex items-center gap-4 p-4 border border-slate-800 rounded-xl bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/70 transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-300 text-sm font-medium">{s.platform}</div>
                    <div className="text-slate-600 text-xs font-mono">{s.handle} · {s.sub}</div>
                  </div>
                  <svg className="w-4 h-4 text-slate-700 group-hover:text-slate-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-slate-800 px-6 pt-10 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs font-mono">Available for opportunities</span>
          </div>
          <div className="flex items-center gap-4">
            {[
              { title: "GitHub", href: "https://github.com/Haraprasad-workspace/", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg> },
              { title: "LinkedIn", href: "https://www.linkedin.com/in/haraprasad-mahapatra-549a1a280/", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
              { title: "HackerRank", href: "https://www.hackerrank.com/profile/haraprasadmahap1", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701c.141 0 .254-.115.254-.258V6.4c0-.141-.113-.254-.254-.254H7.027c-.141 0-.254.113-.254.254v.252c0 .143.113.258.254.258h.701v10.184h-.701c-.141 0-.254.115-.254.258v.254c0 .139.113.254.254.254h3.638c.141 0 .254-.115.254-.254v-.254c0-.143-.113-.258-.254-.258h-.701V13.41h4.074v3.676h-.701c-.141 0-.258.115-.258.258v.254c0 .139.117.254.258.254H17.27c.141 0 .254-.115.254-.254v-.254c0-.143-.113-.258-.254-.258h-.699V6.908h.699c.141 0 .254-.115.254-.258V6.4c0-.141-.113-.254-.254-.254h-2.975z"/></svg> },
            ].map(s => (
              <a key={s.title} href={s.href} target="_blank" rel="noreferrer" data-h title={s.title}
                className="p-2 text-slate-600 hover:text-slate-300 transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
          <a href="mailto:haraprasadmahapatra223@gmail.com" className="text-slate-700 hover:text-slate-400 text-xs font-mono transition-colors" data-h>
            haraprasadmahapatra223@gmail.com
          </a>
        </div>

        {/* Trademark line */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-600 text-xs font-mono">© 2026 Hara Prasad Mahapatra · Anand, Gujarat</p>
          <p className="text-slate-500 text-xs font-mono tracking-wide">
            Designed <span className="text-slate-600">&</span> Developed by{" "}
            <span className="text-blue-500 font-medium">Hara Prasad Mahapatra</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ───────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif", cursor: "none" }}>
      <FontLink />
      <style>{`
        *,*::before,*::after{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:#020817}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#020817}
        ::-webkit-scrollbar-thumb{background:#1e3a5f;border-radius:2px}
        ::-webkit-scrollbar-thumb:hover{background:#3b82f6}
        .font-mono{font-family:'DM Mono',monospace}
      `}</style>

      <ThreeBg />
      <Cursor />
      <ScrollBar />
      <Nav />

      <div className="relative z-10">
        <Hero />
        <Skills />
        <Projects />
        <Education />
        <Achievements />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}