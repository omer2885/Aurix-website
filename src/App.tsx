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

const InteractiveGlobe = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Create dotted globe
    const geometry = new THREE.SphereGeometry(1.5, 50, 50); // Reduced segments slightly for cleaner dots
    const material = new THREE.PointsMaterial({
      color: 0x585858,
      size: 0.03, // Larger points
      transparent: true,
      opacity: 0.8, // More opaque
      sizeAttenuation: true
    });

    const globe = new THREE.Points(geometry, material);
    scene.add(globe);

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
      if (!isDragging) {
        globe.rotation.y += rotationSpeed.x;
        globe.rotation.x += rotationSpeed.y;
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

  return <div ref={mountRef} className="w-full h-[500px] md:h-full cursor-grab active:cursor-grabbing" />;
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
            className="absolute top-full left-0 right-0 bg-white border-b border-aurix-border p-6 md:hidden flex flex-col gap-4 shadow-xl"
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
            <button className="bg-aurix-ink text-white px-5 py-3 text-lg font-medium w-full">
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
    <div className="min-h-screen selection:bg-aurix-ink selection:text-white">
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
                <button className="bg-aurix-ink text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10">
                  Enter Vault
                </button>
                <button className="bg-white/60 backdrop-blur-md border border-aurix-border text-aurix-ink px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-all">
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
              <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-6 flex items-center justify-between hover:bg-white/10 transition-all group shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-aurix-muted/80">{metric.label}</span>
                <span className={cn("text-lg font-bold tracking-tight", metric.highlight ? "text-aurix-ink" : "text-aurix-ink/90")}>{metric.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Statement */}
      <section className="py-20 px-8 md:px-16 border-y border-white/10 bg-aurix-ink relative overflow-hidden text-white">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Built on structure instead of promises
            </h2>
            <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium">
              Capital is deployed into defined strategies with controlled risk and transparent performance.
            </p>
          </div>
        </div>
      </section>

      {/* About AURIX */}
      <section id="vaults" className="py-20 px-8 md:px-16 bg-transparent relative overflow-hidden">
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

      {/* How it Works */}
      <section className="py-20 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10 text-aurix-ink">
          <div className="mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Operational Flow</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">How it Works</h2>
            <p className="text-base md:text-lg text-aurix-muted max-w-2xl leading-relaxed font-medium">
              A systematic approach to capital allocation in global metals markets.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  className="relative aspect-[3/4] p-8 flex flex-col justify-start overflow-hidden group transition-all duration-700 bg-transparent rounded-2xl"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                    style={{ backgroundImage: `url('/${item.title}.png')` }}
                  />
                  
                  <div className="relative z-10 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-5xl font-bold text-aurix-ink/20 mb-2 block tracking-tighter">{item.step}</span>
                    <h3 className="text-2xl font-bold mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-aurix-muted text-xs leading-relaxed font-semibold max-w-[90%]">{item.desc}</p>
                  </div>
                </motion.div>

                {/* Animated arrows between boxes (Desktop only) */}
                {idx < 3 && (
                  <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <motion.div
                      animate={{ x: [0, 6, 0], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight size={32} strokeWidth={1} className="text-aurix-ink/40" />
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy Framework - Bento Grid */}
      <section id="strategy" className="py-20 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Strategy Framework</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">How capital is deployed</h2>
            <p className="text-base md:text-lg text-aurix-muted max-w-3xl leading-relaxed font-medium">
              AURIX strategies are designed to capture inefficiencies across global commodities markets while maintaining controlled exposure and disciplined execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-20 px-8 md:px-16 bg-transparent border-y border-aurix-border relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="order-2 lg:order-1">
             <div className="grid grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-[#f3f4f6] border border-aurix-border p-10 flex flex-col justify-between shadow-sm">
                    <div className="w-10 h-10 rounded-full border border-aurix-ink/20 flex items-center justify-center">
                      <div className="w-3 h-3 bg-aurix-ink rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-1.5 bg-aurix-ink/10 w-full" />
                      <div className="h-1.5 bg-aurix-ink/10 w-2/3" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Intelligence Layer</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Structured by quant. Enhanced by AI.</h2>
            <div className="space-y-6 text-base md:text-lg text-aurix-muted leading-relaxed font-medium">
              <p>
                AURIX strategies are built on quantitative frameworks designed to operate within defined rules and risk parameters. AI systems enhance these strategies by continuously monitoring cross market signals, identifying inefficiencies, and optimizing execution timing.
              </p>
              <p>
                Allocation decisions are guided by data instead of discretion, while risks are controlled through structure instead of reaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vault Mechanics */}
      <section className="py-20 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="max-w-4xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Vault Mechanics</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Understanding vault participation</h2>
            <div className="space-y-6 text-base md:text-lg text-aurix-muted leading-relaxed font-medium">
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
        </div>
      </section>

      {/* Performance and NAV */}
      <section id="performance" className="py-20 px-8 md:px-16 bg-aurix-ink border-y border-white/10 relative overflow-hidden text-white">
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-6 block">Performance Data</span>
              <h2 className="text-2xl md:text-4xl font-bold mb-8 tracking-tight">Performance reflects reality</h2>
              <div className="space-y-6 text-base md:text-lg text-white/60 leading-relaxed font-medium">
                <p>All returns are reflected through vault net asset value.</p>
                <p>No rebasing. No smoothing of returns. No artificial adjustments.</p>
                <p>Participants get to see the outcome of strategy execution directly.</p>
              </div>
              
              <div className="mt-16 grid grid-cols-2 gap-6">
                {[
                  { label: 'Daily Returns', value: '+0.12%', color: 'text-white' },
                  { label: 'Volatility Range', value: '4.2 - 6.8%', color: 'text-white' },
                  { label: 'Drawdown History', value: '-2.4%', color: 'text-red-400' },
                  { label: 'Current NAV', value: '$116.25', color: 'text-white' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 border border-white/10 bg-white/5">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold block mb-2">{stat.label}</span>
                    <span className={cn("text-xl font-bold", stat.color)}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 h-[600px] bg-white/5 border border-white/10 p-12">
              <div className="flex items-center justify-between mb-12">
                <h3 className="font-bold text-xl tracking-tight">Vault Net Asset Value (NAV)</h3>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white" />
                    <span className="text-xs font-bold uppercase tracking-widest">NAV</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
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
                      backgroundColor: '#1a1a1a', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                      padding: '16px'
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="nav" 
                    stroke="#ffffff" 
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
      <section id="risk" className="py-20 px-8 md:px-16 bg-transparent relative overflow-hidden">
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
                <div key={idx} className="p-8 border border-aurix-border bg-white/40 backdrop-blur-xl flex items-center gap-6 shadow-sm hover:shadow-xl transition-all duration-500">
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
      <section className="py-20 px-8 md:px-16 bg-transparent border-y border-aurix-border relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-aurix-muted mb-6 block">Transparency</span>
            <h2 className="text-4xl md:text-4xl font-bold mb-6 tracking-tight">Visibility into capital</h2>
            <p className="text-base md:text-lg text-aurix-muted max-w-2xl mx-auto leading-relaxed font-medium">
              AURIX provides continuous insight into how capital is deployed. The foundation of trust is transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Current strategy allocation', icon: <Layers size={32} /> },
              { title: 'Historical performance', icon: <BarChart3 size={32} /> },
              { title: 'Risk metrics', icon: <ShieldCheck size={32} /> },
              { title: 'Capital distribution', icon: <Globe size={32} /> },
            ].map((item, idx) => (
              <div key={idx} className="institutional-card flex flex-col items-center text-center p-12">
                <div className="w-14 h-14 bg-aurix-bg flex items-center justify-center mb-6 rounded-sm">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg tracking-tight">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this Works */}
      <section className="py-20 px-8 md:px-16 bg-transparent relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
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
            <div className="bg-aurix-ink p-16 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <h3 className="text-4xl font-bold mb-10 relative z-10 tracking-tight">Positioning</h3>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed relative z-10 font-medium">
                AURIX is neither a savings product nor a fixed yield instrument. It is also independent of token incentives.
              </p>
              <div className="mt-10 pt-10 border-t border-white/10 relative z-10">
                <p className="text-2xl md:text-3xl font-bold leading-tight">
                  AURIX is a capital allocator operating in real markets
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-8 md:px-16 bg-transparent border-t border-aurix-border text-center relative overflow-hidden">
        <BackgroundBlurs />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                 <path d="M 80 0 L 0 0 0 80" fill="none" stroke="black" strokeWidth="1"/>
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#grid)" />
           </svg>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-[50px] font-bold tracking-tight mb-12 leading-[1.05] text-aurix-ink">
            Deploy capital into structured commodities strategies
          </h2>
          <button className="bg-aurix-ink text-white px-12 py-5 text-lg font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-black/20 group">
            Enter Vault
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 md:px-16 bg-transparent border-t border-aurix-border relative overflow-hidden">
        <BackgroundBlurs />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
            <div>
              <div className="mb-8">
                <img src="/aurix-logo.svg" alt="AURIX" className="h-8 w-auto" />
              </div>
              <p className="text-xl text-aurix-muted max-w-md leading-relaxed font-medium">
                AURIX is a vault based capital allocation protocol operating across global commodities markets. Participation involves exposure to market risk and variable performance outcomes.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-10 text-aurix-ink">Protocol</h4>
                <ul className="space-y-6 text-sm md:text-base text-aurix-muted font-bold">
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">Strategy</a></li>
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">Vaults</a></li>
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">Performance</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-10 text-aurix-ink">Resources</h4>
                <ul className="space-y-6 text-sm md:text-base text-aurix-muted font-bold">
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">Risk Disclosure</a></li>
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">Terms</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-[0.3em] mb-10 text-aurix-ink">Connect</h4>
                <ul className="space-y-6 text-sm md:text-base text-aurix-muted font-bold">
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">Discord</a></li>
                  <li><a href="#" className="hover:text-aurix-ink transition-colors">GitHub</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-aurix-border flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-aurix-muted font-bold uppercase tracking-[0.4em]">
            <span>© 2026 AURIX PROTOCOL. ALL RIGHTS RESERVED.</span>
            <div className="flex gap-12">
              <a href="#" className="hover:text-aurix-ink transition-colors">Terms</a>
              <a href="#" className="hover:text-aurix-ink transition-colors">Risk Disclosure</a>
              <a href="#" className="hover:text-aurix-ink transition-colors">Documentation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
