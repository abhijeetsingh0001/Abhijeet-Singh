import fs from 'fs';

let content = fs.readFileSync('src/components/CSLab.tsx', 'utf8');

// Replace dark hex colors
content = content.replace(/bg-\[#0C0B0A\]/g, 'bg-slate-100');
content = content.replace(/bg-\[#060505\]/g, 'bg-white');
content = content.replace(/bg-\[#121110\]/g, 'bg-white');
content = content.replace(/bg-\[#1A1817\]/g, 'bg-slate-200');
content = content.replace(/bg-\[#100F0E\]/g, 'bg-slate-100');
content = content.replace(/bg-\[#181615\]/g, 'bg-slate-50');

// Replace stone borders and text
content = content.replace(/border-stone-800/g, 'border-slate-300');
content = content.replace(/border-stone-900/g, 'border-slate-200');
content = content.replace(/text-stone-300/g, 'text-slate-700');
content = content.replace(/text-stone-400/g, 'text-slate-600');
content = content.replace(/text-emerald-500/g, 'text-emerald-600');
content = content.replace(/text-emerald-400/g, 'text-emerald-600');
content = content.replace(/hover:bg-stone-800/g, 'hover:bg-slate-200');

// Fix brand colors
content = content.replace(/bg-brand-card aesthetic-frame/g, 'bg-slate-100 border border-slate-300 rounded-xl');
content = content.replace(/bg-brand-card/g, 'bg-slate-100');
content = content.replace(/bg-brand-cream\/50/g, 'bg-slate-200/50');
content = content.replace(/bg-brand-cream/g, 'bg-white');
content = content.replace(/border-brand-cream/g, 'border-slate-300');
content = content.replace(/border-brand-border/g, 'border-slate-300');
content = content.replace(/text-brand-muted/g, 'text-slate-600');
content = content.replace(/text-brand-charcoal/g, 'text-slate-900');
content = content.replace(/bg-brand-charcoal/g, 'bg-slate-800');
content = content.replace(/hover:border-brand-charcoal/g, 'hover:border-slate-500');
content = content.replace(/hover:bg-brand-cream/g, 'hover:bg-white');
content = content.replace(/aesthetic-frame\/60/g, 'border border-slate-300/60 rounded-lg');
content = content.replace(/aesthetic-frame/g, 'border border-slate-300 rounded-xl');


fs.writeFileSync('src/components/CSLab.tsx', content);
