import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const sourcePath = process.argv[2] || join(dir, '../src/data/unicorn-logo-source.svg');
const raw = readFileSync(sourcePath, 'utf8');
const seen = new Set();
const paths = [];

for (const match of raw.matchAll(/<path\b([^>]*?)\/?>/g)) {
    const attrs = match[1];
    const dMatch = attrs.match(/\bd="([^"]+)"/);
    if (!dMatch || seen.has(dMatch[1])) continue;
    seen.add(dMatch[1]);
    paths.push(`<path d="${dMatch[1]}" fill="currentColor"/>`);
}

const icon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity:0.9">${paths.join('')}</svg>`;

if (process.argv.includes('--write-constants')) {
    const constantsPath = join(dir, '../src/data/constants.js');
    const constants = readFileSync(constantsPath, 'utf8');
    const updated = constants.replace(
        /logos: `[^`]*`/,
        `logos: \`${icon}\``
    );
    writeFileSync(constantsPath, updated);
    console.log(`Updated constants.js with ${paths.length} paths, icon length ${icon.length}`);
} else {
    process.stdout.write(icon);
}
