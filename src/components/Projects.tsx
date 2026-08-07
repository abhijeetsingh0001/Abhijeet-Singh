import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderGit2, GitBranch, ExternalLink, ShieldAlert, Cpu, 
  Layers, HardDrive, Network, Sparkles, X, ChevronRight, Activity
} from 'lucide-react';
import { PROJECTS_DATA } from '../data';
import { Project } from '../types';

export default function Projects() {
  const [activeTab, setActiveTab] = useState<'all' | 'systems' | 'web' | 'ai' | 'tools'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  const categories = [
    { label: 'All Artifacts', id: 'all' },
    { label: 'Low-Level Systems', id: 'systems' },
    { label: 'Web Concurrency', id: 'web' },
    { label: 'ML & Classifiers', id: 'ai' },
    { label: 'Dev Tooling', id: 'tools' }
  ];

  return (
    <section id="projects" className="py-24 bg-brand-card border-t border-brand-border">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 text-accent-primary mb-2">
            <FolderGit2 className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-mono font-semibold">Compiled Directory</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-brand-charcoal">
            Engineering Projects
          </h2>
          <p className="mt-3 text-brand-muted max-w-2xl text-sm leading-relaxed font-sans">
            A selective collection of systems and application software engineered to study efficiency bounds, memory hierarchies, and concurrency resolution.
          </p>
        </div>

        {/* Filters Toggles */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-brand-border pb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`btn-filter-project-${cat.id}`}
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === cat.id
                  ? 'bg-brand-charcoal text-brand-cream'
                  : 'bg-brand-cream aesthetic-frame hover:border-brand-charcoal text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-card aesthetic-frame hover:border-brand-charcoal p-6 flex flex-col justify-between hover:shadow-xs group transition-all duration-250"
              >
                <div className="space-y-4">
                  {/* Card Header Info */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-accent-primary bg-accent-secondary aesthetic-frame/40 px-2.5 py-0.5 rounded-full font-bold">
                      {project.difficulty} Build
                    </span>
                    
                    {/* Complexity Tags (High CS authenticity) */}
                    {(project.timeComplexity) && (
                      <span className="text-[10px] font-mono text-brand-muted flex items-center bg-brand-card aesthetic-frame px-2 py-0.5 rounded-md">
                        <Activity className="w-3 h-3 text-brand-charcoal mr-1" />
                        Time: {project.timeComplexity.split(',')[0]}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-brand-charcoal group-hover:text-accent-primary transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-xs text-brand-muted mt-2 leading-relaxed font-sans min-h-[48px]">
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tech.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-brand-cream aesthetic-frame/40 text-[9px] font-mono text-brand-charcoal rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inspect Engine Action Trigger */}
                <div className="mt-6 pt-4 border-t border-brand-cream flex items-center justify-between">
                  <button
                    id={`btn-inspect-project-${project.id}`}
                    onClick={() => setSelectedProject(project)}
                    className="text-[11px] font-mono uppercase tracking-wider text-brand-charcoal hover:text-accent-primary font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Inspect Architecture</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  
                  <div className="flex space-x-2">
                    <span className="p-1.5 hover:bg-brand-cream rounded-md text-brand-muted hover:text-brand-charcoal transition-colors duration-150 cursor-pointer" title="Mock Repository">
                      <GitBranch className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Floating Architectural Inspection Modal (Zero AI slop, pure engineering review) */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backing Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-brand-charcoal"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25 }}
                className="relative bg-brand-card aesthetic-frame max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl p-6 md:p-8 z-10"
              >
                {/* Dismiss Button */}
                <button
                  id="btn-close-project-modal"
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-brand-cream rounded-lg text-brand-charcoal transition-colors duration-150"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Content */}
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-accent-primary bg-accent-secondary px-2.5 py-0.5 rounded-full font-bold">
                      {selectedProject.difficulty} Level Compilation
                    </span>
                    <h3 className="font-display font-bold text-2xl text-brand-charcoal mt-3">
                      {selectedProject.title}
                    </h3>
                    <p className="text-xs font-mono text-brand-muted mt-0.5">
                      Class: {selectedProject.category.toUpperCase()} / Scope: Autonomous Build
                    </p>
                  </div>

                  {/* Mathematical complexity profile */}
                  <div className="grid grid-cols-2 gap-4 p-3.5 bg-brand-card aesthetic-frame font-mono text-[11px] text-brand-muted">
                    <div className="flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-brand-charcoal" />
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-brand-muted">Time Complexity</span>
                        <strong className="text-brand-charcoal">{selectedProject.timeComplexity || "O(1) Standard"}</strong>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-brand-charcoal" />
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-brand-muted">Aux Space Complexity</span>
                        <strong className="text-brand-charcoal">{selectedProject.spaceComplexity || "O(1) Constant"}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Extended narrative detailing technical problems */}
                  <div className="space-y-2">
                    <h4 className="font-mono text-[10px] text-brand-muted uppercase tracking-widest">Architectural Summary</h4>
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed font-sans">
                      {selectedProject.extendedDescription}
                    </p>
                  </div>

                  {/* Highlights Bulleting (Shows deep engineering depth) */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-mono text-[10px] text-brand-muted uppercase tracking-widest">Key Implementation Highlights</h4>
                    <ul className="space-y-2.5">
                      {selectedProject.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start text-xs text-brand-muted font-sans leading-relaxed">
                          <span className="text-accent-primary mr-2 font-mono font-bold">↳</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action row */}
                  <div className="pt-6 border-t border-brand-cream flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-brand-muted">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      <span>Code compilation certified complete</span>
                    </div>

                    <button
                      id="btn-modal-close-action"
                      onClick={() => setSelectedProject(null)}
                      className="px-4 py-2 bg-brand-charcoal text-brand-cream hover:bg-accent-primary rounded-lg text-xs font-mono transition-colors duration-200"
                    >
                      Close Report
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
