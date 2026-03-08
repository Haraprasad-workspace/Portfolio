import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PresentationControls, Stage, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';

// --- 3D CYBER-CORE COMPONENT ---
// This acts as the "Advanced Hacker" visual element
const CyberCore = () => {
  return (
    <Float speed={3} rotationIntensity={2} floatIntensity={2}>
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#FFA800" // Primary Accent: Marigold
          speed={3}
          distort={0.45}
          radius={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

// --- REUSABLE PREMIUM CARD ---
const ProjectCard = ({ title, tech, description }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-[#422D0B]/20 backdrop-blur-xl border border-[#E8DDCB]/10 p-8 rounded-3xl"
  >
    <h3 className="text-[#FFC24A] text-xl font-bold mb-2">{title}</h3>
    <p className="text-[#967A53] text-sm mb-4 font-mono">{tech}</p>
    <p className="text-[#E8DDCB]/80 leading-relaxed">{description}</p>
  </motion.div>
);

export default function Portfolio() {
  return (
    <div className="bg-[#0a0a0a] text-[#E8DDCB] font-sans selection:bg-[#FFA800] selection:text-black">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* 3D Background Layer */}
        <div className="absolute inset-0 z-0 opacity-60">
          <Canvas dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
              <Stage environment="city" intensity={0.5}>
                <Suspense fallback={null}>
                  <CyberCore />
                </Suspense>
              </Stage>
            </PresentationControls>
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[#FFA800] tracking-[0.5em] uppercase text-sm font-bold mb-4">
              Information Technology • BVM
            </h2>
            <h1 className="text-7xl md:text-9xl font-black text-white mb-6">
              HARA <span className="text-[#FFA800]">PRASAD</span>
            </h1>
            <p className="max-w-xl mx-auto text-[#967A53] text-lg font-medium">
              Developing high-performance software solutions like ZestyCart and CryptoAssure. 
              Maintaining a 9.61 CPI while mastering the MERN stack.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* --- PROFILE & STATS SECTION --- */}
        <section className="grid lg:grid-cols-2 gap-16 py-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            {/* PROFILE IMAGE SLOT */}
            <div className="w-full aspect-square max-w-md mx-auto rounded-[3rem] overflow-hidden border-2 border-[#FFA800] bg-[#422D0B]/30 relative group">
              <img 
                src="YOUR_IMAGE_URL_HERE" 
                alt="Hara Prasad Mahapatra" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#FFA800] text-black p-6 rounded-2xl shadow-2xl rotate-12">
              <p className="font-black text-2xl leading-none">9.79</p>
              <p className="text-xs font-bold uppercase">Latest SPI</p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-white">Technical Prowess</h2>
            <p className="text-[#967A53]">
              Education: Birla Vishvakarma Mahavidyalaya. 
              Specializing in C++ (OOPs), JavaScript, and Database Management (MongoDB, MySQL).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#E8DDCB]/10 p-6 rounded-2xl bg-[#422D0B]/10">
                <h4 className="text-[#FFA800] font-bold">Class 12</h4>
                <p className="text-2xl text-white">93.40%</p>
              </div>
              <div className="border border-[#E8DDCB]/10 p-6 rounded-2xl bg-[#422D0B]/10">
                <h4 className="text-[#FFA800] font-bold">Class 10</h4>
                <p className="text-2xl text-white">92.60%</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- PROJECTS GRID --- */}
        <section className="py-20">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-5xl font-black text-white">Engineering <br/><span className="text-[#FFA800]">Showcase</span></h2>
            <p className="text-[#967A53] hidden md:block">Selected Works 2024-2026</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard 
              title="ZestyCart Full Stack"
              tech="Node.js • Express • MongoDB"
              description="Full-scale food ordering ecosystem with jsPDF receipt generation and JWT authentication."
            />
            <ProjectCard 
              title="CryptoAssure"
              tech="Cryptography • Security"
              description="Automated security evaluation platform for cryptographic algorithms."
            />
            <ProjectCard 
              title="PrintPulse"
              tech="Management • Logic"
              description="A printing order management platform designed for operational efficiency."
            />
          </div>
        </section>

        {/* --- ACHIEVEMENTS & FOOTER --- */}
        <section className="mt-20 bg-[#FFA800] rounded-[4rem] p-12 md:p-20 text-black">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-black mb-6">Let's Connect.</h2>
              <div className="space-y-4 font-bold">
                <p className="text-2xl underline">haraprasadmahapatra223@gmail.com</p>
                <p>Anand, Gujarat, India</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start md:items-end">
              <div className="bg-black text-[#FFA800] px-6 py-2 rounded-full font-bold">Ideathon 2024 Runner-up</div>
              <div className="bg-black/10 px-6 py-2 rounded-full font-bold">HackerRank: 5⭐ C++, 4⭐ SQL</div>
              <div className="bg-black/10 px-6 py-2 rounded-full font-bold">IIT Guwahati Analytics Excellence</div>
            </div>
          </div>
        </section>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
        :root { font-family: 'Montserrat', sans-serif; }
      `}</style>
    </div>
  );
}