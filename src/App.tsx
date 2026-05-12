import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ExternalLink, Mail, MapPin, Award, BookOpen, Briefcase, Code, FileText } from 'lucide-react';
import bgRemovedProfile from './assets/profilephoto1.jpg';
import charusat from "./assets/charusat.jpeg" ;
import devangmehta from './assets/devangmehta.jpeg' ;
import EY from './assets/EY.png' ;
import hackout from './assets/hackout.jpeg';
import ideathon from './assets/ideathon.jpeg';
import mathschallenge from './assets/mathschallenge.jpeg';
import MOSIP from  './assets/MOSIP.png' ;
import summerAnalytics from './assets/summerAnalytics.jpeg' ;
import resume from "./assets/Haraprasad_mahapatra_resume_1.pdf";
// Custom Github Icon 
const Github = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
// Custom LinkedIn Icon
const Linkedin = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Custom YouTube Icon
const Youtube = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. TYPOGRAPHY COMPONENT (Blur-to-Clear)
// ==========================================
const AnimatedH3 = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(" ");

  return (
    <h3
      className={`text-4xl md:text-6xl font-black tracking-tighter uppercase mb-12 flex flex-wrap gap-x-4 ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h3>
  );
};

// ==========================================
// 2. DIGITAL SIGNATURE COMPONENT
// ==========================================
const DigitalSignature = () => (
  <div className="flex flex-col items-center mt-6 z-20 pointer-events-none">
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap');
        .handwriting-font { font-family: 'Caveat', cursive; }
      `}
    </style>
    
    <div className="relative inline-block">
      <span className="handwriting-font text-3xl md:text-4xl text-transparent opacity-0 select-none">
        Hara Prasad Mahapatra
      </span>
      <motion.span
        initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 2.5, ease: [0.45, 0.05, 0.15, 1], delay: 0.3 }}
        className="absolute top-0 left-0 handwriting-font text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFFBF5] to-[#FFA800] whitespace-nowrap drop-shadow-md"
      >
        Hara Prasad Mahapatra
      </motion.span>
    </div>
    
  </div>
);


// ==========================================
// 3. THREE.JS HYPERSPEED COMPONENT
// ==========================================
const DEFAULT_OPTIONS = {
  distortion: 'turbulentDistortion',
  length: 400, roadWidth: 10, islandWidth: 2, lanesPerRoad: 3,
  fov: 90, fovSpeedUp: 150, speedUp: 2,
  colors: {
    roadColor: 0x080808, islandColor: 0x0a0a0a, background: 0x110C04,
    shoulderLines: 0x422D0B, brokenLines: 0x422D0B,
    leftCars: [0xFFA800, 0xFFC24A, 0x967A53], rightCars: [0xFFFBF5, 0xE8DDCB, 0xFFC24A], sticks: 0xFFA800,
  },
};

const Hyperspeed = forwardRef<HTMLDivElement, { effectOptions?: any; className?: string }>(
  ({ effectOptions, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useImperativeHandle(ref, () => containerRef.current!);

    useEffect(() => {
      if (!containerRef.current || !canvasRef.current) return;
      const options = { ...DEFAULT_OPTIONS, ...effectOptions };
      const colors = { ...DEFAULT_OPTIONS.colors, ...effectOptions?.colors };

      const state = { speed: 1, targetSpeed: 1, fov: options.fov, targetFov: options.fov };
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(colors.background);
      const camera = new THREE.PerspectiveCamera(state.fov, 1, 0.1, 10000);
      camera.position.z = 10; camera.position.y = 7;

      const resize = () => {
        if (!containerRef.current) return;
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', resize);
      resize();

      const count = 2000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3 * 2);
      const lineColors = new Float32Array(count * 3 * 2);

      for (let i = 0; i < count; i++) {
        const z = Math.random() * options.length;
        const r = options.roadWidth + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const x = Math.cos(theta) * r; const y = Math.sin(theta) * r;
        const idx = i * 6;

        positions[idx] = x; positions[idx + 1] = y; positions[idx + 2] = -z;
        positions[idx + 3] = x; positions[idx + 4] = y; positions[idx + 5] = -(z + 10 + Math.random() * 50);

        const colorSet = i % 2 === 0 ? colors.leftCars : colors.rightCars;
        const chosenColor = new THREE.Color(colorSet[Math.floor(Math.random() * colorSet.length)]);

        lineColors[idx] = chosenColor.r; lineColors[idx + 1] = chosenColor.g; lineColors[idx + 2] = chosenColor.b;
        lineColors[idx + 3] = chosenColor.r; lineColors[idx + 4] = chosenColor.g; lineColors[idx + 5] = chosenColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

      const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
      const lines = new THREE.LineSegments(geometry, material);
      scene.add(lines);

      const applyDistortion = (time: number) => {
        const pos = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
          const idx = i * 6;
          pos[idx + 2] += state.speed * 5; pos[idx + 5] += state.speed * 5;
          if (pos[idx + 2] > 50) {
            const newZ = options.length;
            pos[idx + 2] = -newZ; pos[idx + 5] = -(newZ + 10 + Math.random() * 50);
          }
          const offset = Math.sin(time * 0.001 + pos[idx + 2] * 0.01) * 2;
          pos[idx] += offset * 0.01; pos[idx + 3] += offset * 0.01;
        }
        geometry.attributes.position.needsUpdate = true;
      };

      let animationId: number;
      const animate = (time: number) => {
        animationId = requestAnimationFrame(animate);
        state.speed += (state.targetSpeed - state.speed) * 0.05;
        state.fov += (state.targetFov - state.fov) * 0.05;
        camera.fov = state.fov; camera.updateProjectionMatrix();
        applyDistortion(time);
        renderer.render(scene, camera);
      };
      animate(0);

      const handleMouseDown = () => { state.targetSpeed = options.speedUp; state.targetFov = options.fovSpeedUp; effectOptions?.onSpeedUp?.(); };
      const handleMouseUp = () => { state.targetSpeed = 1; state.targetFov = options.fov; effectOptions?.onSlowDown?.(); };

      window.addEventListener('mousedown', handleMouseDown); window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchstart', handleMouseDown); window.addEventListener('touchend', handleMouseUp);

      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousedown', handleMouseDown); window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchstart', handleMouseDown); window.removeEventListener('touchend', handleMouseUp);
        cancelAnimationFrame(animationId);
        geometry.dispose(); material.dispose(); renderer.dispose();
      };
    }, []);

    return (
      <div ref={containerRef} className={`absolute inset-0 w-full h-full overflow-hidden ${className ?? ''}`}>
        <canvas ref={canvasRef} className="block w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#110C04]/60 to-[#110C04] pointer-events-none" />
      </div>
    );
  }
);
Hyperspeed.displayName = 'Hyperspeed';


// ==========================================
// 4. MAIN PORTFOLIO APP
// ==========================================
export default function Portfolio() {
  const [isSpeeding, setIsSpeeding] = useState(false);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const hackathonCardsRef = useRef<(HTMLDivElement | null)[]>([]); // New Ref for Hackathons
  
  // Spotlight State for Desktop Photo
  const photoSectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handlePhotoMouseMove = (e: React.MouseEvent) => {
    if (photoSectionRef.current) {
      const rect = photoSectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // GSAP Stack Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Project Cards
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.to(card, {
          scale: 0.92, opacity: 0.6,
          scrollTrigger: { trigger: card, start: 'top 15%', end: 'bottom top', scrub: true },
        });
      });
      // Animate Hackathon Cards
      hackathonCardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.to(card, {
          scale: 0.92, opacity: 0.6,
          scrollTrigger: { trigger: card, start: 'top 15%', end: 'bottom top', scrub: true },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const projects = [
    {
      title: 'CryptoAssure', date: 'Jan – Feb 2026',
      desc: 'Automated Cryptographic Security Evaluation Engine analyzing encryption outputs using avalanche effect, entropy, and key strength estimation.',
      tech: ['Python', 'FastAPI', 'Gemini API', 'Stats'], Githublink: 'https://github.com/Haraprasad-workspace/CryptoAssure',
    },
    {
      title: 'Sangam', date: 'Sept – Nov 2025',
      desc: 'Web application for sharing thoughts for social connectivity. Integrated NLP emotion detection using a 66M-parameter DistilBERT model.',
      tech: ['MERN Stack', 'FastAPI', 'DistilBERT'], Githublink: 'https://github.com/Haraprasad-workspace/Sangam',
      Livelink : 'https://sangam-beryl.vercel.app/'
    },
    {
      title: 'ZestyCart', date: 'June – July 2025',
      desc: 'Full-stack food ordering system supporting menu browsing, order placement, and automated receipt generation with Cloudinary integration.',
      tech: ['Node.js', 'Express', 'MongoDB', 'EJS'], Githublink: 'https://github.com/Haraprasad-workspace/ZestyCart_main',
      Livelink : "https://zestycart.onrender.com/" 
    },
  ];

  const hackathons = [
    {
      hackathonName: 'Charusat X OceanLabs 2026',
      prototypeName: 'AuditShield',
      date: 'Mar 2026',
      problemStatement: 'Modern organizations struggle with secret sprawl — sensitive credentials, confidential files, and personal data are accidentally exposed across GitHub repositories, cloud storage, and documents, while manual security audits are too slow and unreliable to prevent breaches in time.',
      solution:"AuditShield provides continuous automated security auditing by scanning repositories, cloud storage, and uploaded documents in real time to detect exposed secrets, compliance risks, and sensitive data leaks, while instantly alerting teams and generating actionable audit reports.",
      tech: ['MERN', 'Tailwind Css', 'Supabase' , 'GROQ API' , 'Github Webhooks' , 'google Drive API' , "Slack Webhook"],
      Githublink: 'https://github.com/Haraprasad-workspace/AuditShield.git',
      Livelink : 'https://youtu.be/p7LfeUrRdkw?si=60Mq99pkj0k8LSd6'
    },
    {
      hackathonName: 'Intelliverse',
      prototypeName: 'SwasthyaMitra',
      date: 'Dec 2025',
      problemStatement: 'Healthcare clinics still rely heavily on manual queue systems, disconnected patient records, and inefficient communication between departments, leading to long wait times, poor patient experience, and difficulty managing medical data securely.',
      solution:"Swasthya Mitra is a real-time clinical management and digital health locker platform that streamlines patient flow, enables instant lab-doctor coordination, and provides patients with secure access to their complete medical history through a centralized digital health vault.",
      tech: ['MongoDB', 'Express', 'React', 'Node.js'],
      
      Githublink: 'https://github.com/Haraprasad-workspace/SwasthyaMitra.git',
      Livelink : 'https://youtu.be/Uk0m9fIE4CQ'
    },
    {
      hackathonName: 'Smart India Hackathon 2025',
      prototypeName: 'AlmaVerse',
      date: 'Aug 2025',
      problemStatement: 'Digital Platform for Centralized Alumni Data Management and Engagement',
      solution:"AlmaVerse centralizes alumni data and enables seamless networking, mentorship, communication, and engagement between alumni and institutions through a unified digital platform.",
      tech: ['MongoDB', 'Express', 'React', 'Node.js'],
      Githublink: 'https://github.com/Haraprasad-workspace/',
      Livelink : 'https://youtu.be/CGE1WVMjDUI'
    }
  ];

  const certificates = [
    charusat, // Replace these with your actual image imports or paths
    devangmehta,
    EY,
    hackout,
    ideathon,mathschallenge,MOSIP,summerAnalytics
  ];

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#110C04] text-[#FFFBF5] font-sans selection:bg-[#FFA800] selection:text-black">

      {/* ── Top Navigation ────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-[#110C04]/70 backdrop-blur-md border-b border-[#422D0B]/40">
        <div className="text-xl font-black tracking-widest uppercase text-[#FFA800]">HPM</div>
        <a href={resume} download className="flex items-center gap-2 bg-[#FFA800] hover:bg-[#FFC24A] active:scale-95 text-[#2a1d07] px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-200 select-none">
          <Download size={15} /> Resume
        </a>
      </nav>

      {/* ── Hero Section (Hyperspeed) ─────────────────────────────── */}
      <header className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <Hyperspeed effectOptions={{ onSpeedUp: () => setIsSpeeding(true), onSlowDown: () => setIsSpeeding(false) }} />
        <div className="relative z-10 text-center px-6 pointer-events-none pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease: 'easeOut' }}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-4 text-transparent bg-clip-text bg-gradient-to-br from-[#FFFBF5] via-[#FFC24A] to-[#FFA800]">
              HARA PRASAD<br />MAHAPATRA
            </h1>
            <p className="text-base sm:text-xl md:text-2xl font-light text-[#E8DDCB] tracking-[0.25em] uppercase mb-8">
              Software Engineer &amp; Developer
            </p>
          </motion.div>
          <AnimatePresence>
            {!isSpeeding && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 1 }} className="flex flex-col items-center gap-2 mt-10 text-[#967A53]">
                <div className="w-7 h-11 border-2 border-[#967A53] rounded-full flex justify-center pt-1">
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} className="w-1 h-3 bg-[#FFA800] rounded-full" />
                </div>
                <span className="text-[10px] tracking-[0.35em] uppercase">Press &amp; Hold or Scroll</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Interactive Spotlight + Signature Section ──────────────────── */}
      <section 
        ref={photoSectionRef}
        onMouseMove={handlePhotoMouseMove}
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#110C04] md:cursor-none group border-b border-[#422D0B]/30 py-20 md:py-16"
      >
        <div className="relative w-full h-[60vh] md:h-[65vh] flex items-center justify-center mt-10 md:mt-0">
          
          {/* MOBILE ONLY: Fully colored static image, no hover effects */}
          <div className="absolute inset-0 flex md:hidden items-center justify-center">
             <img src={bgRemovedProfile} alt="Profile" className="h-full w-auto object-contain drop-shadow-[0_0_30px_rgba(255,168,0,0.3)]" />
          </div>

          {/* DESKTOP ONLY: Base Dimmed Image */}
          <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-40 transition-opacity duration-500">
             <img src={bgRemovedProfile} alt="Profile Base" className="h-full w-auto object-contain brightness-[1.5] contrast-75 grayscale-[30%]" />
          </div>

          {/* DESKTOP ONLY: Masked Spotlight Image */}
          <div 
            className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              maskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, black 20%, transparent 80%)`,
              WebkitMaskImage: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, black 20%, transparent 80%)`,
            }}
          >
             <img src={bgRemovedProfile} alt="Profile Revealed" className="h-full w-auto object-contain drop-shadow-[0_0_50px_rgba(255,168,0,0.4)]" />
          </div>
        </div>

        {/* DESKTOP ONLY: The Thin Blob Border Ring */}
        {/* <div 
          className="absolute hidden md:block rounded-full border border-[#FFA800]/40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            width: '150px',  
            height: '150px',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: 'translate(-50%, -50%)', 
          }}
        /> */}

        {/* Signature Container */}
        <DigitalSignature />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-[#FFA800]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      </section>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-32 sm:space-y-40">

        {/* Profile & Education */}
        <section className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div>
  <AnimatedH3 text="Profile" className="text-[#FFA800]" />

  <div className="space-y-5 text-base sm:text-lg text-[#E8DDCB]">
    
    {/* Location */}
    <p className="flex items-center gap-3">
      <MapPin className="text-[#FFA800] shrink-0" size={20} />
      Anand, Gujarat, India
    </p>

    {/* Email */}
    <p className="flex items-start gap-3 break-all">
      <Mail className="text-[#FFA800] shrink-0 mt-0.5" size={20} />
      <span>haraprasadmahapatra223@gmail.com</span>
    </p>

    {/* Phone */}
    <p className="flex items-center gap-3">
      <span className="text-[#FFA800] font-semibold">Phone:</span>
      <span>+91 9537362412</span>
    </p>

    {/* Social Links */}
    <div className="flex flex-wrap gap-4 pt-4">

      {/* GitHub */}
      <a
        href="https://github.com/Haraprasad-workspace/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#422D0B] hover:border-[#FFA800] hover:text-[#FFA800] hover:bg-[#FFA800]/10 transition-all duration-300"
      >
        <Github size={18} />
        <span className="text-sm">GitHub</span>
      </a>

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/in/haraprasad-mahapatra-549a1a280"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#422D0B] hover:border-[#FFA800] hover:text-[#FFA800] hover:bg-[#FFA800]/10 transition-all duration-300"
      >
        <Linkedin size={18} />
        <span className="text-sm">LinkedIn</span>
      </a>

      {/* YouTube */}
      <a
        href="https://www.youtube.com/@haraprasadworkspace"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#422D0B] hover:border-[#FFA800] hover:text-[#FFA800] hover:bg-[#FFA800]/10 transition-all duration-300"
      >
        <Youtube size={18} />
        <span className="text-sm">YouTube</span>
      </a>

      {/* LeetCode - text only */}
      <a
        href="https://leetcode.com/u/haraprasad22/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-full border border-[#422D0B] hover:border-[#FFA800] hover:text-[#FFA800] hover:bg-[#FFA800]/10 transition-all duration-300 text-sm"
      >
        LeetCode
      </a>

      {/* HackerRank - text only */}
      <a
        href="https://www.hackerrank.com/profile/haraprasadmahap1"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-full border border-[#422D0B] hover:border-[#FFA800] hover:text-[#FFA800] hover:bg-[#FFA800]/10 transition-all duration-300 text-sm"
      >
        HackerRank
      </a>

      {/* Portfolio - text only */}
      <a
        href="https://haraprasad-portfolio.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 rounded-full border border-[#422D0B] hover:border-[#FFA800] hover:text-[#FFA800] hover:bg-[#FFA800]/10 transition-all duration-300 text-sm"
      >
        Portfolio
      </a>

    </div>
  </div>
</div>

          <div>
            <AnimatedH3 text="Education" className="text-[#FFA800]" />
            <div className="relative border-l-2 border-[#422D0B] pl-8 ml-5 space-y-8">
              <div className="relative">
                <div className="absolute -left-[2.65rem] top-1 p-1 bg-[#110C04] border-2 border-[#FFA800] rounded-full"><BookOpen size={13} className="text-[#FFA800]" /></div>
                <h4 className="text-lg sm:text-xl font-bold text-[#FFFBF5] leading-snug">B.Tech in Information Technology</h4>
                <p className="text-[#FFA800] font-medium text-sm mt-1">Birla Vishvakarma Mahavidyalaya &nbsp;|&nbsp; 2024 – 2028</p>
                <p className="text-[#967A53] text-sm mt-1">CPI: 9.76 &nbsp;|&nbsp; 3rd Sem SPI: 10.00</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[2.65rem] top-1 p-1 bg-[#110C04] border-2 border-[#967A53] rounded-full"><BookOpen size={13} className="text-[#967A53]" /></div>
                <h4 className="text-lg sm:text-xl font-bold text-[#E8DDCB] leading-snug">HSC [CBSE] – Class 12</h4>
                <p className="text-[#967A53] text-sm mt-1">Gajera International School &nbsp;|&nbsp; 93.40%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Arsenal */}
        <section>
          <AnimatedH3 text="Technical Arsenal" className="text-[#FFA800]" />
          <div className="flex flex-wrap gap-3">
            {['C++', 'Python', 'React', 'Node.js', 'MongoDB', 'Express.js', 'FastAPI', 'Data Structures', 'Postman'].map(
              (skill, i) => (
                <motion.span key={skill} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.35, delay: i * 0.05 }} className="px-5 py-2.5 bg-[#422D0B]/30 border border-[#422D0B] rounded-full text-[#FFC24A] font-medium tracking-wide text-sm hover:bg-[#FFA800] hover:text-[#110C04] hover:border-[#FFA800] transition-all duration-200 cursor-default">
                  {skill}
                </motion.span>
              )
            )}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="relative pb-[15vh]">
          <AnimatedH3 text="Featured Projects" className="text-[#FFA800]" />
          <div className="mt-8 space-y-8">
            {projects.map((project, index) => (
              <div key={project.title} ref={(el) => { cardsRef.current[index] = el; }} className="sticky top-20 w-full bg-[#1A1208] border border-[#422D0B] rounded-[2rem] p-7 sm:p-10 md:p-14 shadow-2xl flex flex-col justify-between overflow-hidden group" style={{ zIndex: index + 10, minHeight: 'clamp(260px, 45vh, 420px)' }}>
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#FFA800]/5 rounded-full blur-3xl group-hover:bg-[#FFA800]/10 transition-colors duration-700 pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                    <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFBF5] leading-tight">{project.title}</h4>
                    <span className="self-start text-[#FFA800] font-mono border border-[#FFA800]/30 px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">{project.date}</span>
                  </div>
                  <p className="text-base sm:text-lg text-[#E8DDCB] leading-relaxed max-w-3xl">{project.desc}</p>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 relative z-10">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span key={t} className="flex items-center gap-1.5 text-xs sm:text-sm text-[#967A53] bg-[#110C04] px-3 py-1.5 rounded-lg border border-[#422D0B]/50">
                        <Code size={13} /> {t}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3 self-end shrink-0">
                    {project.Githublink && (
                      <a href={project.Githublink} target="_blank" rel="noopener noreferrer" aria-label={`GitHub`} className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1A1208] border-2 border-[#FFA800] text-[#FFA800] rounded-full flex items-center justify-center hover:bg-[#FFA800] hover:text-[#110C04] active:scale-95 transition-all duration-200">
                        <Github size={20} />
                      </a>
                    )}
                    {project.Livelink && (
                      <a href={project.Livelink} target="_blank" rel="noopener noreferrer" aria-label={`Live Site`} className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FFA800] text-[#110C04] rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hackathons Section */}
        <section className="relative pb-[25vh]">
          <AnimatedH3 text="Hackathons" className="text-[#FFA800]" />
          <div className="mt-8 space-y-8">
  {hackathons.map((hackathon, index) => (
    <div
      key={hackathon.prototypeName}
      ref={(el) => {
        hackathonCardsRef.current[index] = el;
      }}
      className="sticky top-20 w-full bg-[#1A1208] border border-[#422D0B] rounded-[2rem] p-7 sm:p-10 md:p-14 shadow-2xl overflow-hidden group"
      style={{
        zIndex: index + 10,
        minHeight: "clamp(320px, 55vh, 520px)",
      }}
    >
      {/* Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#FFA800]/5 rounded-full blur-3xl group-hover:bg-[#FFA800]/10 transition-colors duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Top */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h4 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFBF5] leading-tight mb-3">
                {hackathon.prototypeName}
              </h4>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block text-[#FFA800] font-mono border border-[#FFA800]/30 px-3 py-1 rounded-full text-xs sm:text-sm bg-[#FFA800]/10">
                  {hackathon.hackathonName}
                </span>

                <span className="inline-block text-[#967A53] border border-[#422D0B] px-3 py-1 rounded-full text-xs sm:text-sm bg-[#110C04]">
                  {hackathon.date}
                </span>
              </div>
            </div>
          </div>

          {/* Problem */}
          {hackathon.problemStatement && (
            <div className="mb-6">
              <h5 className="text-[#FFFBF5] text-lg sm:text-xl font-semibold mb-2">
                Problem Statement
              </h5>

              <p className="text-[#E8DDCB] leading-relaxed text-sm sm:text-base md:text-lg max-w-4xl">
                {hackathon.problemStatement}
              </p>
            </div>
          )}

          {/* Solution */}
          {hackathon.solution && (
            <div>
              <h5 className="text-[#FFFBF5] text-lg sm:text-xl font-semibold mb-2">
                Solution
              </h5>

              <p className="text-[#CBB89D] leading-relaxed text-sm sm:text-base md:text-lg max-w-4xl">
                {hackathon.solution}
              </p>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-6">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2">
            {hackathon.tech?.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-xs sm:text-sm text-[#967A53] bg-[#110C04] px-3 py-2 rounded-xl border border-[#422D0B]/50 hover:border-[#FFA800]/30 transition-all"
              >
                <Code size={13} />
                {t}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={hackathon.Githublink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#110C04] border border-[#422D0B] text-[#FFFBF5] hover:border-[#FFA800]/40 hover:bg-[#1F160A] transition-all duration-300"
            >
              <Github size={18} />
              GitHub
            </a>

            <a
              href={hackathon.Livelink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFA800] text-black font-semibold hover:scale-[1.03] transition-all duration-300"
            >
              <ExternalLink size={18} />
              Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
        </section>

        {/* Certificates Image Marquee Section */}
        <section className="relative pb-[25vh] overflow-hidden">
  <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
    <AnimatedH3 text="Certifications" className="text-[#FFA800]" />
  </div>

  {/* Marquee Wrapper */}
  <div className="relative mt-8 w-full overflow-hidden">

    {/* Left Fade */}
    <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#110C04] to-transparent z-10 pointer-events-none" />

    {/* Right Fade */}
    <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#110C04] to-transparent z-10 pointer-events-none" />

    {/* Moving Track */}
    <motion.div
      className="flex gap-6 md:gap-8 w-max px-4"
      animate={{ x: ["0%", "-50%"] }}
      transition={{
        ease: "linear",
        duration: 30,
        repeat: Infinity,
      }}
    >
      {[...certificates, ...certificates].map((certImg, index) => (
        <div
          key={index}
          className="w-72 md:w-[22rem] h-48 md:h-60 shrink-0 bg-[#1A1208] border-2 border-[#422D0B] hover:border-[#FFA800] hover:shadow-[0_0_30px_rgba(255,168,0,0.2)] rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer"
        >
          <img
            src={certImg}
            alt={`Certificate ${index}`}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </motion.div>
  </div>
</section>

        {/* Experience & Achievements */}
        <section className="grid md:grid-cols-2 gap-12 lg:gap-20 pb-24">
          
          <div className="flex flex-col gap-8">
            <AnimatedH3 text="Experience" className="text-[#FFA800] mb-0" />
            
            {/* NEW: Tech Manager Card */}
            <div className="p-7 sm:p-9 border border-[#422D0B] rounded-3xl bg-[#1A1208]/60 backdrop-blur-sm hover:border-[#FFA800]/50 transition-colors duration-300">
              <Briefcase className="text-[#FFA800] mb-4" size={30} />
              <h4 className="text-xl sm:text-2xl font-bold text-[#FFFBF5] mb-1">Tech Manager</h4>
              <p className="text-[#FFA800] font-medium text-sm mb-4">GFG Student Chapter BVM &nbsp;|&nbsp; 2025 – Present</p>
              <p className="text-[#967A53] text-sm sm:text-base leading-relaxed mb-6">
                Led technical initiatives and successfully modified and maintained the official website of the BVM GFG Student Chapter.
              </p>
              <a href="https://geeksforgeeks-six.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-[#110C04] bg-[#FFA800] px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200">
                <ExternalLink size={16} /> Visit Website
              </a>
            </div>

            {/* Original: Ready for Opportunities Card */}
            <div className="p-7 sm:p-9 border border-[#422D0B] rounded-3xl bg-[#1A1208]/60 backdrop-blur-sm hover:border-[#FFA800]/50 transition-colors duration-300">
              <Briefcase className="text-[#FFA800] mb-4" size={30} />
              <h4 className="text-xl sm:text-2xl font-bold text-[#FFFBF5] mb-2">Ready for Opportunities</h4>
              <p className="text-[#967A53] text-sm sm:text-base leading-relaxed">Currently seeking internships and roles to apply analytical and developmental skills in a real-world environment.</p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <AnimatedH3 text="Achievements" className="text-[#FFA800] mb-0" />
            <ul className="space-y-3">
              {['Summer Analytics 2025 – Certificate of Excellence (IIT Guwahati)', '5 Stars in C++ & 4 Stars in SQL on HackerRank', 'Runner-up position in Ideathon 2024', 'Project: Sustainable Solar Panels for Vallabh Vidhyanagar'].map((item, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.4, delay: i * 0.08 }} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#422D0B]/20 transition-colors duration-200">
                  <Award className="text-[#FFC24A] shrink-0 mt-0.5" size={22} />
                  <span className="text-sm sm:text-base text-[#E8DDCB] leading-snug">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 text-center py-8 border-t border-[#422D0B]/40 text-[#967A53] text-xs tracking-widest uppercase">
        <p>© {new Date().getFullYear()} Designed and Developed by Haraprasad Mahapatra</p>
      </footer>
    </div>
  );
}