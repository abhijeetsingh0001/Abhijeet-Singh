/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CSLab from './components/CSLab';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';

export default function App() {
  // Smooth scroll coordination engine
  const handleScrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of our sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-brand-cream selection:bg-accent-tertiary selection:text-brand-charcoal overflow-x-hidden">
      {/* Sticky Top Navigation */}
      <Navbar onNavClick={handleScrollToSection} />

      <main className="relative">
        {/* Core Sections */}
        <Hero onNavClick={handleScrollToSection} />
        <ScrollReveal><About /></ScrollReveal>
        <ScrollReveal><CSLab /></ScrollReveal>
        <ScrollReveal><Skills /></ScrollReveal>
        <ScrollReveal><Projects /></ScrollReveal>
        <ScrollReveal><Contact /></ScrollReveal>
      </main>

      {/* Footer Branding */}
      <Footer onNavClick={handleScrollToSection} />
    </div>
  );
}

