import fs from 'fs';

let content = fs.readFileSync('src/components/CSLab.tsx', 'utf8');

// Fix button text on slate-800 background
content = content.replace(/bg-slate-800 text-brand-cream/g, 'bg-slate-800 text-white');

// The active tab was using this color. Let's see:
// 'bg-slate-800 text-brand-cream shadow-md'
// Now 'bg-slate-800 text-white shadow-md'

// Let's also check text-slate-900. Did I change text-brand-charcoal to text-slate-900? Yes.
// So things that were text-brand-charcoal are now text-slate-900.
// Is text-brand-charcoal light or dark? It was #E0E0E0 (light). So text-slate-900 is dark!
// If the background was made light (bg-slate-100), then dark text (text-slate-900) is CORRECT!
// If the background was bg-slate-800, then it's text-white.

fs.writeFileSync('src/components/CSLab.tsx', content);
