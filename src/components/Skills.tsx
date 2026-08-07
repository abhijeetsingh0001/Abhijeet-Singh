import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Code2, Binary, Cpu, Layers, Workflow, Palette, 
  Sparkles, Activity, Server, Database, Zap, Box, GitMerge, 
  Network, FileJson, Compass, Search, HelpCircle 
} from 'lucide-react';
import { SKILLS_DATA } from '../data';
import { Skill } from '../types';

// Solid lookup mapping of imported Lucide icons to prevent bundler problems
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Terminal,
  Code2,
  Binary,
  Cpu,
  Layers,
  Workflow,
  Palette,
  Sparkles,
  Activity,
  Server,
  Database,
  Zap,
  Box,
  GitMerge,
  Network,
  FileJson,
  Compass
};

export default function Skills() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'languages' | 'frontend' | 'backend' | 'systems'>('all');

  // Filtering Logic
  const filteredSkills = SKILLS_DATA.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' ? true : skill.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { label: 'All Stack', id: 'all' },
    { label: 'Core Languages', id: 'languages' },
    { label: 'Frontend UX', id: 'frontend' },
    { label: 'Services & DB', id: 'backend' },
    { label: 'CS Systems', id: 'systems' },
  ];

  return (
    <section id="skills" className="py-24 bg-brand-card border-t border-brand-border">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center space-x-2 text-accent-primary mb-2">
              <Code2 className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-mono font-semibold">Stack Inventory</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-brand-charcoal">
              Skills & Proficiencies
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
            <input
              id="input-skill-search"
              type="text"
              placeholder="Search stack (e.g. Go, SQL)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 aesthetic-input text-xs font-mono text-brand-charcoal placeholder-brand-muted/75 transition-all outline-none focus:ring-1 focus:ring-accent-primary/20"
            />
          </div>
        </div>

        {/* Category Toggles */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-brand-border pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`btn-filter-skill-${cat.id}`}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-charcoal text-brand-cream'
                  : 'bg-brand-card aesthetic-frame hover:border-brand-charcoal text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              const Icon = iconMap[skill.iconName] || HelpCircle;
              
              return (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="bg-brand-card aesthetic-frame hover:border-brand-charcoal p-5 shadow-xs transition-colors duration-250 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Card Top: Icon and Name */}
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-brand-card aesthetic-frame text-brand-charcoal">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-brand-muted px-2 py-0.5 bg-brand-cream aesthetic-frame/60 rounded-full">
                        {skill.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-semibold text-sm text-brand-charcoal">{skill.name}</h4>
                      <p className="text-xs text-brand-muted mt-1 leading-relaxed font-sans">{skill.description}</p>
                    </div>
                  </div>

                  {/* Level Progress Indicator */}
                  <div className="mt-5 pt-3 border-t border-brand-cream space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-brand-muted">
                      <span>Pro Level</span>
                      <span className="font-bold text-brand-charcoal">{skill.level} / 5</span>
                    </div>
                    {/* Meter bar */}
                    <div className="w-full bg-brand-cream aesthetic-frame/60 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(skill.level / 5) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-accent-primary h-full rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Fallback empty state */}
          {filteredSkills.length === 0 && (
            <div className="col-span-full py-16 bg-brand-card aesthetic-frame text-center">
              <span className="font-mono text-xs text-brand-muted block">No skills match the query "{searchTerm}".</span>
              <button
                id="btn-clear-skill-search"
                onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                className="mt-4 px-4 py-2 bg-brand-charcoal text-brand-cream rounded-lg text-xs font-mono hover:bg-accent-primary transition-colors"
              >
                Clear Search filters
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
