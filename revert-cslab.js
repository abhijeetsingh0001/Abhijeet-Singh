import fs from 'fs';

let content = fs.readFileSync('src/components/CSLab.tsx', 'utf8');

// Revert terminal colors
// The terminal was originally using hex codes.
// bg-slate-100 for terminal wrapper, let's use bg-[#0C0B0A]
// text-slate-700 was text-stone-300
// text-slate-600 was text-stone-400
// text-emerald-600 was text-emerald-500
// border-slate-300 was border-stone-800
// border-slate-200 was border-stone-900

content = content.replace(/text-emerald-600/g, 'text-emerald-500');
content = content.replace(/border-slate-200/g, 'border-stone-900');
content = content.replace(/text-slate-700/g, 'text-stone-300');
// text-slate-600 was text-brand-muted or text-stone-400
// let's do a generic replace for slate to brand

content = content.replace(/bg-slate-100 border border-slate-300 rounded-xl/g, 'aesthetic-frame');
content = content.replace(/border border-slate-300\/60 rounded-lg/g, 'aesthetic-frame');
content = content.replace(/border border-slate-300 rounded-xl/g, 'aesthetic-frame');
content = content.replace(/aesthetic-frame-light/g, 'aesthetic-frame');

content = content.replace(/bg-slate-100/g, 'bg-brand-card');
content = content.replace(/bg-slate-200\/50/g, 'bg-brand-cream/50');
content = content.replace(/bg-slate-200/g, 'bg-[#1A1817]');
content = content.replace(/bg-white/g, 'bg-brand-cream');
content = content.replace(/bg-slate-50/g, 'bg-[#181615]');
content = content.replace(/border-slate-300/g, 'border-brand-border');
content = content.replace(/text-slate-600/g, 'text-brand-muted');
content = content.replace(/text-slate-900/g, 'text-brand-charcoal');
content = content.replace(/bg-slate-800/g, 'bg-brand-charcoal');
content = content.replace(/hover:border-slate-500/g, 'hover:border-brand-charcoal');
content = content.replace(/text-white/g, 'text-brand-cream');
content = content.replace(/hover:bg-slate-200/g, 'hover:bg-stone-800');

fs.writeFileSync('src/components/CSLab.tsx', content);
