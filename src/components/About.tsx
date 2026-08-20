import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, GraduationCap, Briefcase, Award, MapPin, Calendar, Heart } from 'lucide-react';
import { PERSONAL_DETAILS, RESUME_TIMELINE } from '../data';

export default function About() {
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'experience' | 'education'>('all');

  const filteredEvents = RESUME_TIMELINE.filter(event => {
    if (timelineFilter === 'all') return true;
    return event.type === timelineFilter;
  });

  const coreCourses = [
    "Data Structures & Algorithms",
    "Operating Systems Design",
    "Software Engineering",
    
  ];

  return (
    <section id="about" className="py-24 bg-brand-card border-t border-brand-border">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Double Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Column 1: Bio and Academic Profile */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden aesthetic-frame shrink-0">
               
              </div>
              <div>
                <div className="flex items-center space-x-2 text-accent-primary mb-2">
                  <GraduationCap className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-widest font-mono font-semibold">About Me</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-brand-charcoal">
                  The Academic Narrative
                </h2>
              </div>
            </div>

            <p className="text-sm md:text-base text-brand-muted leading-relaxed font-sans">
              {PERSONAL_DETAILS.bio}
            </p>

            {/* University Detail Box */}
            <div className="p-5 bg-brand-card aesthetic-frame space-y-4">
              <div className="flex items-start space-x-3.5">
                <BookOpen className="w-5 h-5 text-accent-primary mt-0.5" />
                <div>
                  <h4 className="font-display font-semibold text-sm text-brand-charcoal">{PERSONAL_DETAILS.university}</h4>
                  <p className="text-xs text-brand-muted mt-1">{PERSONAL_DETAILS.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-brand-border/40 font-mono text-xs text-brand-muted">
                <div>
                  <span>GPA: </span>
                  <strong className="text-brand-charcoal">{PERSONAL_DETAILS.gpa}</strong>
                </div>
                <div>
                  <span className="block text-right">{PERSONAL_DETAILS.graduation}</span>
                </div>
              </div>
            </div>

            {/* Crucial Coursework */}
            <div>
              <h3 className="font-mono text-[10px] text-brand-muted uppercase tracking-widest mb-3">Key Academic Coursework</h3>
              <div className="flex flex-wrap gap-2">
                {coreCourses.map((course, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent-secondary/80 aesthetic-frame/40 text-[11px] font-mono text-brand-charcoal rounded-md"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Timeline Events */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-border pb-4">
              <h3 className="font-display font-semibold text-lg text-brand-charcoal flex items-center space-x-2">
                <span>Academic & Career Steps</span>
              </h3>
              
              {/* Filter Toggles */}
              <div className="flex bg-brand-card p-1 aesthetic-frame self-start">
                {(['all', 'experience', 'education'] as const).map((filter) => (
                  <button
                    key={filter}
                    id={`btn-filter-timeline-${filter}`}
                    onClick={() => setTimelineFilter(filter)}
                    className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                      timelineFilter === filter
                        ? 'bg-brand-charcoal text-brand-cream'
                        : 'text-brand-muted hover:text-brand-charcoal'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Timeline Tree */}
            <div className="relative border-l border-brand-border pl-6 space-y-8 ml-3">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, idx) => {
                  const Icon = event.type === 'education' ? BookOpen : event.type === 'experience' ? Briefcase : Award;
                  
                  return (
                    <motion.div
                      key={event.title}
                      layout
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.35 }}
                      className="relative group"
                    >
                      {/* Timeline Node Point Indicator */}
                      <span className="absolute -left-[31px] top-1 bg-brand-card border-2 border-brand-border group-hover:border-accent-primary p-1 rounded-full transition-colors duration-300">
                        <Icon className="w-3.5 h-3.5 text-brand-charcoal group-hover:text-accent-primary" />
                      </span>

                      {/* Event Content card */}
                      <div className="p-5 aesthetic-frame hover:border-brand-charcoal bg-brand-card hover:bg-brand-cream/30 transition-all duration-300">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center text-xs font-mono font-medium text-accent-primary">
                            <Calendar className="w-3 h-3 mr-1" />
                            {event.year}
                          </span>
                          <span className="px-2 py-0.5 bg-brand-card aesthetic-frame text-[9px] uppercase font-mono tracking-wider text-brand-muted rounded-full">
                            {event.type}
                          </span>
                        </div>
                        
                        <h4 className="font-display font-bold text-sm text-brand-charcoal">
                          {event.title}
                        </h4>
                        
                        <p className="text-xs font-mono text-brand-muted mt-0.5">
                          {event.institution}
                        </p>
                        
                        <p className="text-xs text-brand-muted mt-3 leading-relaxed font-sans">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
