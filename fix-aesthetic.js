import fs from 'fs';

let content = fs.readFileSync('src/components/CSLab.tsx', 'utf8');

content = content.replace(/bg-slate-100 border border-slate-300 rounded-xl/g, 'aesthetic-frame-light');
content = content.replace(/border border-slate-300\/60 rounded-lg/g, 'aesthetic-frame-light');
content = content.replace(/border border-slate-300 rounded-xl/g, 'aesthetic-frame-light');

fs.writeFileSync('src/components/CSLab.tsx', content);
