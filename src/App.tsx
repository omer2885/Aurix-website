/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  Lock, 
  Eye, 
  Cpu, 
  Globe, 
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Activity,
  Layers,
  PieChart
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { cn } from './lib/utils';

const BackgroundBlurs = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#D3D2DA] blur-[120px] rounded-full opacity-40" />
    <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#D3D2DA] blur-[120px] rounded-full opacity-40" />
  </div>
);

// === TRANSPARENCY SECTION ILLUSTRATIONS ===
const FILL = '#585858';

const AllocationIllustration = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const baseBoxes = [
    { x: 0, y: 0, w: 140, h: 80 },
    { x: 150, y: 0, w: 170, h: 120 },
    { x: 0, y: 90, w: 140, h: 110 },
    { x: 150, y: 130, w: 80, h: 70 },
    { x: 240, y: 130, w: 80, h: 70 },
  ];

  return (
    <div className="absolute bottom-0 right-0 pointer-events-none p-6 md:p-8 opacity-80 origin-bottom-right scale-75 md:scale-100">
      <svg width="320" height="200" viewBox="0 0 320 200">
        {baseBoxes.map((rect, i) => {
          const isActive = activeIndex === i;
          
          // Calculate precise animated coordinates to preserve border radiuses perfectly
          const scale = isActive ? 1.04 : 0.96;
          const animW = rect.w * scale;
          const animH = rect.h * scale;
          const animX = rect.x - (animW - rect.w) / 2;
          const animY = rect.y - (animH - rect.h) / 2;
          const centerX = rect.x + rect.w / 2;
          const centerY = rect.y + rect.h / 2;

          return (
            <g key={i}>
              <motion.rect
                rx="6"
                stroke={FILL}
                strokeWidth="1.5"
                fill={FILL}
                initial={false}
                animate={{
                  x: animX,
                  y: animY,
                  width: animW,
                  height: animH,
                  fillOpacity: isActive ? 1 : 0.05,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.image
                href="/Favicon_Aurix.webp"
                initial={false}
                animate={{
                  x: centerX - (32 * (isActive ? 1 : 0.5)) / 2,
                  y: centerY - (32 * (isActive ? 1 : 0.5)) / 2,
                  width: 32 * (isActive ? 1 : 0.5),
                  height: 32 * (isActive ? 1 : 0.5),
                  opacity: isActive ? 1 : 0,
                }}
                style={{ filter: "invert(1) brightness(100)" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const PerformanceIllustration = () => {
  // Upward trend with small realistic market dips (spikes)
  const points = [
    {x: 0, y: 90},
    {x: 35, y: 82},
    {x: 55, y: 88}, // small spike
    {x: 100, y: 70},
    {x: 130, y: 75}, // small spike
    {x: 180, y: 55},
    {x: 210, y: 60}, // small spike
    {x: 260, y: 40},
    {x: 290, y: 46}, // small spike
    {x: 340, y: 25},
    {x: 370, y: 30}, // small spike
    {x: 400, y: 15}  // peak
  ];

  const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  const fillD = pathD + " L 400 100 L 0 100 Z";

  return (
    <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-80 h-[40%] flex items-end px-4 md:px-6 pb-6 relative z-0">
      
      {/* Container for perfectly circular HTML dots (avoids SVG viewbox distortion on wide screens) */}
      <div className="absolute inset-x-4 md:inset-x-6 bottom-6 top-0 z-10">
        {points.slice(1, -1).map((p, i) => {
          // Sync dot appearance with the line drawing across 3 seconds of a 5 sec loop
          const hitDelay = (p.x / 400) * 3; 
          return (
            <motion.div 
              key={i}
              className="absolute w-[5px] h-[5px] rounded-full bg-[#585858]"
              style={{ 
                left: `calc(${(p.x / 400) * 100}% - 2.5px)`, 
                top: `calc(${(p.y / 100) * 100}% - 2.5px)` 
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                 opacity: [0, 1, 0, 0], 
                 scale: [0, 1.5, 0, 0] 
              }}
              transition={{ 
                 duration: 5, 
                 repeat: Infinity, 
                 delay: hitDelay, 
                 ease: "easeInOut",
                 times: [0, 0.2, 0.4, 1] // Dots animate for 2 sec, idle for 3 sec mapping
              }}
            />
          );
        })}
      </div>

      <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none" className="relative z-0">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={FILL} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={FILL} stopOpacity="0.0"/>
          </linearGradient>
        </defs>

        {/* Minimal horizontal baselines */}
        <line x1="0" y1="33" x2="400" y2="33" stroke={FILL} strokeWidth="1" strokeDasharray="2 4" opacity="0.15" vectorEffect="non-scaling-stroke"/>
        <line x1="0" y1="66" x2="400" y2="66" stroke={FILL} strokeWidth="1" strokeDasharray="2 4" opacity="0.15" vectorEffect="non-scaling-stroke"/>

        {/* Shaded Area Fill */}
        <motion.path 
          d={fillD}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0, 0] }}
          transition={{ 
             duration: 5, 
             repeat: Infinity, 
             ease: "easeInOut",
             times: [0, 0.6, 0.7, 0.8, 1] // Complete cycle with 1 sec delay at end
          }}
        />
        
        {/* The 0 to 100 Animated Line */}
        <motion.path 
          d={pathD}
          stroke={FILL} strokeWidth="2.5" fill="none" vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
             pathLength: [0, 1, 1, 1, 0], 
             opacity: [1, 1, 1, 0, 0] 
          }}
          transition={{ 
             duration: 5, 
             repeat: Infinity, 
             ease: "easeInOut",
             times: [0, 0.6, 0.7, 0.8, 1] // Complete cycle with 1 sec delay at end
          }}
        />
      </svg>
    </div>
  );
};

const RiskIllustration = () => {
  return (
    <div className="absolute bottom-0 right-0 pointer-events-none opacity-90 flex items-end justify-end p-6 md:p-8 origin-bottom-right">
       <div className="relative w-[180px] md:w-[240px] aspect-square flex items-center justify-center translate-x-2 translate-y-2">
          
          {/* Radar Base Tracking Grid */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
             {/* Main Outer Ring */}
             <circle cx="100" cy="100" r="95" stroke={FILL} strokeWidth="1.5" opacity="0.3" fill="none" />
             {/* Inner Concentric Rings */}
             <circle cx="100" cy="100" r="70" stroke={FILL} strokeWidth="1" strokeDasharray="4 4" opacity="0.2" fill="none" />
             <circle cx="100" cy="100" r="45" stroke={FILL} strokeWidth="1" opacity="0.2" fill="none" />
             
             {/* Tracking Crosshairs & Ticks */}
             <line x1="100" y1="0" x2="100" y2="200" stroke={FILL} strokeWidth="1" opacity="0.15" />
             <line x1="0" y1="100" x2="200" y2="100" stroke={FILL} strokeWidth="1" opacity="0.15" />
             
             {/* Center Hub Container Ring */}
             <circle cx="100" cy="100" r="18" fill="transparent" stroke={FILL} strokeWidth="1" opacity="0.6" />
             <circle cx="100" cy="100" r="14" fill="#585858" opacity="0.9" />

             {/* Radar Target Blips */}
             {/* Top Right (~45 deg) */}
             <motion.circle cx="150" cy="50" r="3.5" fill={FILL} 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                 transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
                 
             {/* Bottom Left (~230 deg) */}
             <motion.circle cx="45" cy="140" r="2.5" fill={FILL} 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                 transition={{ duration: 4, repeat: Infinity, delay: 2.5 }} />

             {/* Top Left (~320 deg) */}
             <motion.circle cx="60" cy="40" r="3" fill={FILL} 
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                 transition={{ duration: 4, repeat: Infinity, delay: 3.5 }} />
          </svg>

          {/* Sweeping Radar Cone Overlay (perfectly mapped to the outer ring via 2.5% padding) */}
          <div className="absolute inset-[2.5%] overflow-hidden rounded-full mix-blend-multiply opacity-70">
            <motion.div 
               className="w-full h-full"
               style={{
                  background: 'conic-gradient(from 0deg, rgba(88,88,88,0) 0%, rgba(88,88,88,0) 65%, rgba(88,88,88,0.1) 85%, rgba(88,88,88,0.6) 100%)',
               }}
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Aurix Canonical Emblem Locked in the Hub */}
          <div className="absolute z-10 flex items-center justify-center pointer-events-none">
             <img src="/Favicon_Aurix.webp" alt="Aurix System" className="w-[14px] h-[14px]" style={{ filter: 'invert(1) brightness(100)' }} />
          </div>
       </div>
    </div>
  );
};

const DistributionIllustration = () => (
  <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-80 h-[50%] flex items-end justify-end px-4 md:px-8 pb-4 md:pb-8">
    <svg className="w-full h-full max-w-[700px]" viewBox="0 0 800 240" preserveAspectRatio="xMaxYMax meet">
       {[...Array(5)].map((_, i) => (
           <motion.path 
              key={i}
              d={`M -100 ${200 - i * 35} Q 300 ${280 - i * 60} 900 ${120 - i * 25}`}
              stroke={FILL} strokeWidth="1.5" strokeDasharray="6 8" fill="none" opacity="0.3"
           />
       ))}
       {[...Array(5)].map((_, i) => (
           <motion.circle key={`p-${i}`} r="5" fill={FILL} opacity="0.8">
              <animateMotion dur={`${5 + i}s`} repeatCount="indefinite"
                 path={`M -100 ${200 - i * 35} Q 300 ${280 - i * 60} 900 ${120 - i * 25}`}
              />
           </motion.circle>
       ))}
    </svg>
  </div>
);


const InteractiveGlobe = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    // Fallback if dimensions are not yet available
    if (width === 0 || height === 0) {
      width = 500;
      height = 500;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Clear any existing canvasses before appending
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Create dotted globe
    const geometry = new THREE.SphereGeometry(1.5, 120, 120); 
    const material = new THREE.PointsMaterial({
      color: 0x1a1a1a, // Dark institutional ink
      size: 0.02, // Refined point size
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7,
    });

    const globe = new THREE.Points(geometry, material);
    scene.add(globe);

    // Add breathing pulse dots
    const pulseDots: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
        const dotGeo = new THREE.SphereGeometry(0.04, 16, 16);
        const dotMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a, transparent: true, opacity: 0.8 });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        
        // Random position on sphere surface
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        dot.position.x = 1.51 * Math.sin(theta) * Math.cos(phi);
        dot.position.y = 1.51 * Math.sin(theta) * Math.sin(phi);
        dot.position.z = 1.51 * Math.cos(theta);
        
        globe.add(dot);
        pulseDots.push(dot);
    }

    // Add glowing outer ring
    const ringGeometry = new THREE.RingGeometry(1.6, 1.62, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x585858, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(ring);

    // Interaction variables
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSpeed = { x: 0.002, y: 0.001 };

    const handleMouseDown = () => { isDragging = true; };
    const handleMouseUp = () => { isDragging = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: e.offsetX - previousMousePosition.x,
          y: e.offsetY - previousMousePosition.y,
        };

        globe.rotation.y += deltaMove.x * 0.005;
        globe.rotation.x += deltaMove.y * 0.005;
      }
      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    };

    const container = mountRef.current;
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate pulse dots
      const time = Date.now() * 0.002;
      pulseDots.forEach((dot, i) => {
        const pulse = Math.sin(time + i * 1.5);
        dot.scale.setScalar(1 + pulse * 0.4);
        (dot.material as THREE.MeshBasicMaterial).opacity = 0.4 + pulse * 0.4;
      });

      if (!isDragging) {
        globe.rotation.y += 0.0015; // Slow horizontal rotation
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      if (mountRef.current) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[300px] md:h-[500px] cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden" />;
};

// Mock data for the performance chart
const performanceData = [
  { date: 'Jan', nav: 100.00 },
  { date: 'Feb', nav: 102.45 },
  { date: 'Mar', nav: 101.80 },
  { date: 'Apr', nav: 104.20 },
  { date: 'May', nav: 106.15 },
  { date: 'Jun', nav: 105.90 },
  { date: 'Jul', nav: 108.40 },
  { date: 'Aug', nav: 110.10 },
  { date: 'Sep', nav: 112.35 },
  { date: 'Oct', nav: 111.80 },
  { date: 'Nov', nav: 114.50 },
  { date: 'Dec', nav: 116.25 },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Strategy', href: '#strategy' },
    { name: 'Vaults', href: '#vaults' },
    { name: 'Performance', href: '#performance' },
    { name: 'Risk', href: '#risk' },
    { name: 'Docs', href: '#' },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-8 md:px-16 py-8 bg-transparent transition-all duration-500">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src="/aurix-logo.svg" alt="AURIX" className="h-6 w-auto" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="nav-link"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-aurix-ink p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-aurix-border p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-medium text-aurix-ink"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button 
              className="bg-aurix-ink text-white px-5 py-3 text-lg font-semibold tracking-tight w-full rounded-full cursor-pointer mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Enter Vault
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-aurix-ink selection:text-white bg-aurix-bg text-aurix-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 pt-32 pb-12 overflow-hidden bg-transparent">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover z-[-5]"
          >
            <source src="/Hero Video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="flex-1 flex flex-col justify-center pb-24">
          <div className="max-w-[1600px] mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <h1 className="text-4xl md:text-[50px] font-bold tracking-tight leading-[1.05] mb-5 text-aurix-ink">
                A vault-based capital allocator embedded in global commodities markets
              </h1>
              <p className="text-base md:text-lg text-aurix-muted mb-10 leading-relaxed font-medium">
                AURIX deploys onchain capital into structured trading strategies across metals markets. 
                Returns are generated through real market activity and reflected directly in vault performance.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-aurix-ink text-white px-8 py-3 text-sm font-semibold tracking-tight hover:bg-black transition-all rounded-full cursor-pointer">
                  Enter Vault
                </button>
                <button className="bg-white/60 backdrop-blur-md border border-aurix-border text-aurix-ink px-8 py-3 text-xs font-semibold tracking-tight hover:bg-white transition-all rounded-full cursor-pointer">
                  View Performance
                </button>
              </div>
            </motion.div>

            {/* Right side is handled by the background image in Frame 1 */}
            <div className="hidden lg:block" />
          </div>
        </div>

        {/* Metrics Bar - Bottom of Hero */}
        <div className="max-w-[1600px] mx-auto w-full mt-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-6"
          >
            {[
              { label: 'Current Allocation', value: '$116.25M' },
              { label: '30 Day Return', value: '+4.2%', highlight: true },
              { label: 'Current Assets', value: '82.4%' },
              { label: 'Max Drawdown', value: '10%' },
              { label: 'Active Strategies', value: '43' },
            ].map((metric, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 flex items-center justify-between hover:bg-white/10 transition-all group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-aurix-muted/80">{metric.label}</span>
                <span className={cn("text-lg font-bold tracking-tight", metric.highlight ? "text-aurix-ink" : "text-aurix-ink/90")}>{metric.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Statement */}
      <section className="py-12 md:py-16 px-8 md:px-16 border-y border-white/10 bg-aurix-ink relative overflow-hidden text-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle, #ffffff 2px, transparent 1px)`,
            backgroundSize: '32px 32px' 
          }} />
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center py-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
            Built on structure instead of promises
          </h2>
          <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium">
            Capital is deployed into defined strategies with controlled risk and transparent performance.
          </p>
        </div>
      </section>

      {/* About AURIX */}
      <section id="vaults" className="pt-20 pb-10 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            {/* Globe on Left */}
            <div className="order-2 lg:order-1 flex items-center justify-center min-h-[500px]">
              <InteractiveGlobe />
            </div>

            {/* Text on Right */}
            <div className="order-1 lg:order-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Protocol Overview</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">What is AURIX?</h2>
              <div className="space-y-6 text-base md:text-lg text-aurix-muted leading-relaxed font-medium">
                <p>
                  AURIX is a vault protocol designed to allocate capital across global commodities markets through structured trading strategies.
                  Participants deposit capital into vaults and receive shares in return representing their position.
                  That capital is deployed into arbitrage, liquidity, and structured trading strategies across metals markets.
                  Returns generated from these activities flow back into the vault reflecting in net asset value.
                </p>
                <div className="pt-8 border-t border-aurix-border space-y-4">
                  <p className="text-xl md:text-2xl font-bold text-aurix-ink leading-tight">
                    There are neither artificial emissions nor fixed returns.
                  </p>
                  <p>
                    Performance is driven by real execution in real markets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="pt-8 pb-4 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10 text-aurix-ink">
          <div className="mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Operational Flow</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">How it works</h2>
            <p className="text-base md:text-lg text-aurix-muted max-w-2xl leading-relaxed font-medium">
              A systematic approach to capital allocation in global metals markets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { step: '01', title: 'Deposit', desc: 'Deposit capital into a vault' },
              { step: '02', title: 'Allocation', desc: 'Capital is allocated across quantitative strategies in metals markets' },
              { step: '03', title: 'Optimization', desc: 'AI assistance in monitoring market conditions, optimizing execution, and guiding allocation' },
              { step: '04', title: 'Performance', desc: 'Trading performance updates vault NAV in real time. It can be withdrawn whenever the user likes.' },
            ].map((item, idx) => (
              <div key={idx} className="relative group/box">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative aspect-[10/16] p-8 flex flex-col justify-start overflow-hidden group transition-all duration-700 bg-transparent rounded-2xl"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                    style={{ backgroundImage: `url('/${item.title}.webp')` }}
                  />
                  
                  <div className="relative z-10 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-5xl font-bold text-aurix-ink/20 mb-2 block tracking-tighter">{item.step}</span>
                    <h3 className="text-2xl font-bold mb-1 tracking-tight">{item.title}</h3>
                    <p className="text-aurix-muted text-sm leading-relaxed font-semibold max-w-[90%]">{item.desc}</p>
                  </div>
                </motion.div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy Framework - Bento Grid */}
      <section id="strategy" className="pt-4 pb-10 md:pb-16 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Strategy Framework</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">How capital is deployed</h2>
            <p className="text-base md:text-lg text-aurix-muted max-w-3xl leading-relaxed font-medium">
              AURIX strategies are designed to capture inefficiencies across global commodities markets while maintaining controlled exposure and disciplined execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2 institutional-card">
              <div className="flex items-start justify-between mb-12">
                <div className="w-14 h-14 bg-aurix-bg flex items-center justify-center rounded-sm">
                  <Activity size={28} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurix-muted">Core Strategy</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Basis and Relative Value</h3>
              <p className="text-aurix-muted text-base md:text-lg leading-relaxed font-medium">
                Captures price differences between spot and futures markets across metals exchanges focusing on consistency and controlled exposure.
              </p>
            </div>

            <div className="institutional-card">
              <div className="flex items-start justify-between mb-12">
                <div className="w-14 h-14 bg-aurix-bg flex items-center justify-center rounded-sm">
                  <Zap size={28} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurix-muted">High Efficiency</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Cross Market Arbitrage</h3>
              <p className="text-aurix-muted text-base leading-relaxed font-medium">
                Identifies and executes price discrepancies across venues and geographies driven by speed, execution, and capital efficiency.
              </p>
            </div>

            <div className="institutional-card">
              <div className="flex items-start justify-between mb-12">
                <div className="w-14 h-14 bg-aurix-bg flex items-center justify-center rounded-sm">
                  <Layers size={28} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurix-muted">Market Making</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Liquidity Provision</h3>
              <p className="text-aurix-muted text-base leading-relaxed font-medium">
                Deploys capital into market making and structured liquidity opportunities capturing spreads generated through continuous trading activity.
              </p>
            </div>

            <div className="lg:col-span-2 institutional-card">
              <div className="flex items-start justify-between mb-12">
                <div className="w-14 h-14 bg-aurix-bg flex items-center justify-center rounded-sm">
                  <ShieldCheck size={28} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurix-muted">Risk Controlled</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Structured Opportunities</h3>
              <p className="text-aurix-muted text-base md:text-lg leading-relaxed font-medium">
                Selectively engages in defined volatility and options based strategies with strict allocation limits and risk controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI and Quant Layer */}
      <section className="py-10 md:py-24 px-8 md:px-16 bg-transparent border-y border-aurix-border relative overflow-hidden flex items-center justify-center min-h-[700px]">
        <BackgroundBlurs />
        {/* Quantitative Grid */}
        <div className="absolute inset-0 opacity-[0.6] pointer-events-none" style={{ 
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px' 
        }} />
        
        <div className="max-w-[1200px] mx-auto relative w-full flex items-center justify-center z-10 py-20 px-12">
          {/* 4 Corner Floating Images */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { id: 'quant (1)', pos: 'top-0 left-0', delay: 0 },
              { id: 'quant (2)', pos: 'top-0 right-0', delay: 0.5 },
              { id: 'quant (3)', pos: 'bottom-0 left-0', delay: 1 },
              { id: 'quant (4)', pos: 'bottom-0 right-0', delay: 1.5 }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className={cn("absolute w-32 h-32 md:w-56 md:h-56", item.pos)}
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: item.delay 
                }}
              >
                <div 
                  className="w-full h-full bg-white border border-aurix-border/50 rounded-3xl overflow-hidden relative group shadow-sm pointer-events-auto"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                    style={{ backgroundImage: `url('/Structured by quant Grid/${item.id}.webp')` }}
                  />
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-700" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Centered Text Content */}
          <div className="max-w-2xl text-center relative z-20 mt-12 mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Intelligence Layer</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 tracking-tight leading-[1.1]">Structured by quant.<br />Enhanced by AI.</h2>
            <div className="space-y-6 text-base md:text-lg text-aurix-muted leading-relaxed font-medium">
              <p>
                AURIX strategies are built on quantitative frameworks designed to operate within defined rules and risk parameters. AI systems enhance these strategies by continuously monitoring signals and identifying inefficiencies.
              </p>
              <p>
                Allocation decisions are guided by data instead of discretion, while risks are controlled through structure instead of reaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-aurix-ink border-y border-white/10 relative overflow-hidden text-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle, #ffffff 2px, transparent 1px)`,
            backgroundSize: '32px 32px' 
          }} />
        </div>
        <div className="max-w-[1700px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-6 block">Vault Mechanics</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-white">Understanding vault participation</h2>
              <div className="space-y-6 text-base md:text-lg text-white/60 leading-relaxed font-medium">
                <p>
                  Deposits into AURIX vaults are represented through LP shares.
                </p>
                <p>
                  These shares reflect a proportional claim on vault capital and performance. They are neither tradable nor designed to track a fixed price.
                </p>
                <p>
                  The value changes with the performance of the underlying strategies and withdrawals are processed based on available liquidity and prevailing market conditions.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="aspect-[4/3] overflow-hidden flex items-center justify-center">
                <img 
                  src="/Understanding the valut participation.webp" 
                  alt="Vault participation mechanics" 
                  className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance and NAV */}
      <section id="performance" className="py-10 md:py-16 px-8 md:px-16 bg-transparent border-y border-aurix-border relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-1 text-aurix-ink">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Performance Data</span>
              <h2 className="text-2xl md:text-4xl font-bold mb-8 tracking-tight text-aurix-ink">Performance reflects reality</h2>
              <div className="space-y-6 text-base md:text-lg text-aurix-muted leading-relaxed font-medium">
                <p>All returns are reflected through vault net asset value.</p>
                <p>No rebasing. No smoothing of returns. No artificial adjustments.</p>
                <p>Participants get to see the outcome of strategy execution directly.</p>
              </div>
              
              <div className="mt-16 grid grid-cols-2 gap-6">
                {[
                  { label: 'Daily Returns', value: '+0.12%', color: 'text-aurix-ink' },
                  { label: 'Volatility Range', value: '4.2 - 6.8%', color: 'text-aurix-ink' },
                  { label: 'Drawdown History', value: '-2.4%', color: 'text-red-600' },
                  { label: 'Current NAV', value: '$116.25', color: 'text-aurix-ink' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 border border-aurix-border bg-white/40 backdrop-blur-md">
                    <span className="text-[10px] uppercase tracking-widest text-aurix-muted font-bold block mb-2">{stat.label}</span>
                    <span className={cn("text-xl font-bold", stat.color)}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 h-[600px] bg-white/40 backdrop-blur-xl border border-aurix-border p-12">
              <div className="flex items-center justify-between mb-12">
                <h3 className="font-bold text-xl tracking-tight text-aurix-ink">Vault Net Asset Value (NAV)</h3>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-aurix-ink" />
                    <span className="text-xs font-bold uppercase tracking-widest text-aurix-muted">NAV</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#585858" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#585858" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} 
                    dy={15}
                  />
                  <YAxis 
                    domain={['dataMin - 5', 'dataMax + 5']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#888', fontWeight: 600 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #ddd',
                      borderRadius: '0px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                      padding: '16px'
                    }}
                    itemStyle={{ color: '#1a1a1a' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="nav" 
                    stroke="#1a1a1a" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorNav)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Management */}
      <section id="risk" className="py-10 md:py-16 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Risk Controls</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Structure before exposure</h2>
              <div className="space-y-6 text-base md:text-lg text-aurix-muted leading-relaxed font-medium">
                <p>
                  Risk is managed at the vault level through defined constraints and continuous monitoring with limited exposure to strategies, controlled leverage and drawdowns being actively monitored.
                </p>
                <p>
                  When market conditions shift, capital is reallocated to preserve stability.
                </p>
                <div className="pt-8 border-t border-aurix-border">
                  <p className="text-aurix-ink font-bold italic text-xl leading-tight">
                    There is only disciplined execution within defined boundaries and no assumption of constant returns.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {[
                { title: 'Limited Strategy Exposure', icon: <PieChart size={24} /> },
                { title: 'Controlled Leverage', icon: <Activity size={24} /> },
                { title: 'Active Drawdown Monitoring', icon: <TrendingUp size={24} /> },
                { title: 'Dynamic Reallocation', icon: <Zap size={24} /> },
              ].map((risk, idx) => (
                <div key={idx} className="p-8 border border-aurix-border bg-white/40 backdrop-blur-xl flex items-center gap-6 transition-all duration-500">
                  <div className="w-12 h-12 bg-aurix-bg flex items-center justify-center rounded-sm">
                    {risk.icon}
                  </div>
                  <span className="font-bold text-lg tracking-tight">{risk.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Transparency - Bento Grid */}
      <section className="py-10 md:py-16 px-8 md:px-16 bg-transparent border-y border-aurix-border relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Transparency</span>
            <h2 className="text-4xl md:text-4xl font-bold mb-6 tracking-tight">Visibility into capital</h2>
            <p className="text-base md:text-lg text-aurix-muted max-w-2xl mx-auto leading-relaxed font-medium">
              AURIX provides continuous insight into how capital is deployed. The foundation of trust is transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            {/* Card 1: Allocation */}
            <div className="lg:col-span-8 institutional-card relative overflow-hidden group min-h-[350px] flex flex-col justify-between">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurix-muted mb-4 block">Deployment Architecture</span>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Current strategy allocation</h3>
                <p className="text-aurix-muted text-base leading-relaxed font-medium max-w-xl">
                  Capital is dynamically allocated across basis, relative value, and liquidity strategies focusing on risk-adjusted returns.
                </p>
              </div>
              <AllocationIllustration />
            </div>

            {/* Card 2: Performance */}
            <div className="lg:col-span-4 institutional-card relative overflow-hidden group min-h-[350px] flex flex-col justify-between">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurix-muted mb-4 block">Audited Growth</span>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Historical performance</h3>
                <p className="text-aurix-muted text-sm leading-relaxed font-medium">
                  Verified returns reflected directly in the vault Net Asset Value through real execution.
                </p>
              </div>
              <PerformanceIllustration />
            </div>

            {/* Card 3: Risk */}
            <div className="lg:col-span-5 institutional-card relative overflow-hidden group min-h-[350px] flex flex-col justify-between">
              <div className="relative z-10 lg:max-w-[60%]">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurix-muted mb-4 block">Security Layer</span>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Risk metrics</h3>
                <p className="text-aurix-muted text-sm leading-relaxed font-medium">
                  Continuous monitoring of drawdown limits, strategy caps, and execution boundaries.
                </p>
              </div>
              <RiskIllustration />
            </div>

            {/* Card 4: Distribution */}
            <div className="lg:col-span-7 institutional-card relative overflow-hidden group min-h-[350px] flex flex-col justify-between">
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurix-muted mb-4 block">Global Connectivity</span>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">Capital distribution</h3>
                <p className="text-aurix-muted text-base leading-relaxed font-medium max-w-xl">
                  Real-time visibility into capital flow across decentralized venues and traditional commodities markets.
                </p>
              </div>
              <DistributionIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Why this Works */}
      <section className="py-10 md:py-16 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Market Context</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Why commodities markets</h2>
              <div className="space-y-6 text-base md:text-lg text-aurix-muted leading-relaxed font-medium">
                <p>
                  Global commodities markets are large, fragmented, and continuously active.
                </p>
                <p>
                  Price differences exist across exchanges, instruments, and geographies.
                </p>
                <p>
                  Execution inefficiencies persist due to structure and scale.
                </p>
                <p>
                  AURIX is designed to capture these inefficiencies through systematic strategies and return them to vault participants.
                </p>
              </div>
            </div>
            <div className="bg-aurix-ink p-10 md:p-14 text-white flex flex-col justify-center relative overflow-hidden rounded-3xl">
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `radial-gradient(circle, #ffffff 2px, transparent 1px)`,
                  backgroundSize: '32px 32px' 
                }} />
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <h3 className="text-2xl md:text-3xl font-bold mb-6 relative z-10 tracking-tight">Positioning</h3>
              <p className="text-base md:text-lg text-white/70 leading-relaxed relative z-10 font-medium">
                AURIX is neither a savings product nor a fixed yield instrument. It is also independent of token incentives.
              </p>
              <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                <p className="text-lg md:text-xl font-bold leading-tight">
                  AURIX is a capital allocator operating in real markets
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10 md:py-16 bg-transparent relative overflow-hidden flex justify-center">
        <div className="w-[98vw]">
          <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-8 md:px-16 rounded-[4rem] overflow-hidden">
            {/* Cinematic Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('/CTA.webp')" }}
            />
            <div className="absolute inset-0 bg-aurix-bg/5" />

            <div className="max-w-5xl mx-auto relative z-10 py-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="mb-12">
                  <img src="/aurix-logo.svg" alt="AURIX" className="h-10 w-auto" />
                </div>
                
                <h2 className="text-4xl md:text-[64px] font-bold tracking-tight mb-16 leading-[1] max-w-4xl text-aurix-ink">
                  Deploy capital into structured commodities strategies
                </h2>

                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <button className="px-10 py-4 rounded-full border border-aurix-ink text-aurix-ink font-semibold tracking-tight text-sm hover:bg-aurix-ink hover:text-white transition-all duration-500 cursor-pointer">
                    View Documentation
                  </button>
                  <button className="px-10 py-4 rounded-full bg-aurix-ink text-white font-semibold tracking-tight text-sm hover:bg-black transition-all duration-500 shadow-xl shadow-black/10 cursor-pointer">
                    Enter Vault
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 md:px-16 bg-aurix-ink text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(circle, #ffffff 2px, transparent 1px)`,
            backgroundSize: '32px 32px' 
          }} />
        </div>
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
            <div>
              <div className="mb-8">
                <img src="/aurix-logo.svg" alt="AURIX" className="h-8 w-auto" style={{ filter: 'invert(1) brightness(100)' }} />
              </div>
              <p className="text-sm max-w-md leading-relaxed font-medium text-white/70">
                AURIX is a vault based capital allocation protocol operating across global commodities markets. Participation involves exposure to market risk and variable performance outcomes.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-8 text-white/50">Protocol</h4>
                <ul className="space-y-4 text-sm font-medium text-white/60">
                  <li><a href="#strategy" className="hover:text-white transition-colors">Strategy</a></li>
                  <li><a href="#vaults" className="hover:text-white transition-colors">Vaults</a></li>
                  <li><a href="#performance" className="hover:text-white transition-colors">Performance</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-8 text-white/50">Resources</h4>
                <ul className="space-y-4 text-sm font-medium text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#risk" className="hover:text-white transition-colors">Risk Disclosure</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-8 text-white/50">Connect</h4>
                <ul className="space-y-4 text-sm font-medium text-white/60">
                  <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-24 flex flex-col items-center justify-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
            <span>© 2026 AURIX PROTOCOL. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
