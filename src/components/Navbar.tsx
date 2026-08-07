import { useState, useEffect } from 'react';
import { Menu, X, Terminal, Code2 } from 'lucide-react';

interface NavbarProps {
  onNavClick: (id: string) => void;
}

export default function Navbar({ onNavClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Sandbox Lab', id: 'cs-lab' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleClick = (id: string) => {
    setIsOpen(false);
    onNavClick(id);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-brand-cream/85 backdrop-blur-md border-brand-border py-4'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Monogram Monospace Logo */}
        <button
          id="logo-nav"
          onClick={() => handleClick('hero')}
          className="flex items-center space-x-2 group focus:outline-none"
        >
          <div className="bg-brand-charcoal text-brand-cream p-1.5 rounded-md transition-transform duration-300 group-hover:scale-105">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-sm tracking-wider uppercase text-brand-charcoal group-hover:text-accent-primary transition-colors duration-200">
            Abhijeet Singh <span className="font-mono text-xs text-accent-primary">()</span>
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleClick(item.id)}
              className="text-xs uppercase tracking-widest font-mono font-medium text-brand-charcoal/80 hover:text-accent-primary transition-colors duration-200 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <button
            id="nav-action-resume"
            onClick={() => handleClick('contact')}
            className="px-4 py-1.5 border border-brand-charcoal hover:bg-brand-charcoal hover:text-brand-cream rounded-lg text-xs font-mono transition-colors duration-250"
          >
            Get In Touch
          </button>
        </div>

        {/* Mobile Hamburguer Toggle */}
        <button
          id="btn-mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-brand-charcoal hover:text-accent-primary transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-brand-cream z-40 flex flex-col justify-between py-12 px-6 border-t border-brand-border animate-fade-in">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleClick(item.id)}
                className="text-left text-lg font-display font-medium text-brand-charcoal hover:text-accent-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <button
              id="mobile-nav-contact"
              onClick={() => handleClick('contact')}
              className="w-full py-3 bg-brand-charcoal text-brand-cream rounded-lg font-mono text-sm font-medium transition-colors hover:bg-accent-primary"
            >
              Contact Me
            </button>
            <div className="text-center">
              <span className="font-mono text-[10px] text-brand-muted uppercase">
                ABHIJEET SINGH / COMPUTER SCIENCE STUDENT
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
