import { motion } from 'motion/react';
import { ArrowRight, Terminal, Cpu, HardDrive, AlertTriangle, ShieldAlert } from 'lucide-react';
import { PERSONAL_DETAILS } from '../data';

interface HeroProps {
  onNavClick: (id: string) => void;
}

export default function Hero({ onNavClick }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-brand-cream warning-stripes"
    >
      <div className="absolute inset-0 bg-brand-cream/95 z-0" />
      {/* Decorative subtle visual markers (geometric/grid alignments, no AI slop) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80" 
          alt="Abstract technology background" 
          className="w-full h-full object-cover opacity-15"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-cream/60 mix-blend-multiply" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center z-10">
        {/* Monospace tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-3 py-1 bg-accent-tertiary border border-accent-primary rounded-none aesthetic-border text-brand-charcoal mb-8"
        >
          <Terminal className="w-3.5 h-3.5 text-accent-primary animate-pulse" />
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-accent-primary">
            Systems & Algorithms Engineer
          </span>
        </motion.div>

        {/* Display Typography Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-accent-primary tracking-tight leading-[1.05] uppercase glitch"
          data-text={PERSONAL_DETAILS.tagline}
        >
          {PERSONAL_DETAILS.tagline}
        </motion.h1>

        {/* Supporting bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed font-sans"
        >
          Hi, I'm <strong className="text-brand-charcoal font-semibold">{PERSONAL_DETAILS.name}</strong>, a computer science student specializing in memory engines, concurrency safety, and crafting beautiful web clients.
        </motion.p>

        {/* Dynamic CS Metrics row (shows high quality and technical grounding) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 mb-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto border-t border-b border-brand-border/50 py-4 font-mono text-[11px] text-brand-muted"
        >
          <div className="flex items-center justify-center space-x-1.5 py-1">
            <Cpu className="w-4 h-4 text-accent-primary" />
            <span>Core: <strong className="text-brand-charcoal">Go / Rust / C++</strong></span>
          </div>
          <div className="flex items-center justify-center space-x-1.5 py-1">
            <HardDrive className="w-4 h-4 text-accent-primary" />
            <span>LSM Engine: <strong className="text-brand-charcoal">CoreLSM</strong></span>
          </div>
          <div className="hidden sm:flex items-center justify-center space-x-1.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>GPA: <strong className="text-brand-charcoal">{PERSONAL_DETAILS.gpa}</strong></span>
          </div>
        </motion.div>

        {/* Action button groupings */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            id="btn-hero-projects"
            onClick={() => onNavClick('projects')}
            className="w-full sm:w-auto px-6 py-3.5 bg-brand-charcoal text-brand-cream hover:bg-accent-primary hover:shadow-md rounded-xl text-sm font-mono font-medium flex items-center justify-center space-x-2 transition-all duration-200"
          >
            <span>View Compilations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            id="btn-hero-lab"
            onClick={() => onNavClick('cs-lab')}
            className="w-full sm:w-auto px-6 py-3.5 aesthetic-frame hover:border-brand-charcoal bg-brand-card hover:bg-brand-cream text-sm font-mono font-medium text-brand-charcoal flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <span>Open Algorithm Sandbox</span>
          </button>
        </motion.div>
      </div>

      {/* Floating Indicator (Pure design) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1 opacity-40">
        <span className="font-mono text-[9px] uppercase tracking-widest text-brand-muted">Scroll to inspect</span>
        <div className="w-[1px] h-6 bg-brand-charcoal animate-bounce" />
      </div>
    </section>
  );
}
