import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptsDirectory, '..');
const outputDirectory = path.join(projectRoot, 'pages-dist');
const playwrightReport = path.join(projectRoot, 'playwright-report');

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(playwrightReport, outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, '.nojekyll'), '');

console.log('Relatório Playwright preparado para publicação em pages-dist.');
