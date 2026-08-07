import { Terminal, Code2, Heart, Cpu } from 'lucide-react';
import { PERSONAL_DETAILS } from '../data';

interface FooterProps {
  onNavClick: (id: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-charcoal text-brand-cream py-16 border-t border-brand-border/10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Top footer row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-brand-border/10">
          
          {/* Brand block */}
          <div className="space-y-3">
            <button
              id="footer-logo"
              onClick={() => onNavClick('hero')}
              className="flex items-center space-x-2 text-brand-cream hover:text-accent-primary transition-colors focus:outline-none"
            >
              <Terminal className="w-5 h-5 text-accent-primary" />
              <span className="font-display font-bold tracking-wider uppercase text-sm">
                Abhijeet Singh <span className="text-accent-primary font-mono">()</span>
              </span>
            </button>
            <p className="text-xs text-brand-muted max-w-sm leading-relaxed font-sans font-medium text-stone-400">
               Computer Science student provide you a responsive web platforms.
            </p>
          </div>

          {/* Core profile links */}
          <div className="flex flex-wrap gap-4 font-mono text-[11px] text-stone-400">
            <a
              href={PERSONAL_DETAILS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-cream transition-colors"
            >
              Github
            </a>
            <span className="text-stone-600">•</span>
            <a
              href={PERSONAL_DETAILS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-cream transition-colors"
            >
              LinkedIn
            </a>
            <span className="text-stone-600">•</span>
            <a
              href={`mailto:${PERSONAL_DETAILS.email}`}
              className="hover:text-brand-cream transition-colors"
            >
              Email Mailbox
            </a>
          </div>
        </div>

        {/* Bottom row: System specs and Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-stone-500 text-[10px] font-mono">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-stone-600" />
            <span>Assembled from scratch in React • Built 100% Client-Side</span>
          </div>

          <div>
            <span>© {currentYear} Abhijeet Singh. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
