import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptsDirectory, '..');
const sourceDirectory = path.join(projectRoot, 'report-site');
const outputDirectory = path.join(projectRoot, 'pages-dist');
const playwrightReport = path.join(projectRoot, 'playwright-report');

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(sourceDirectory, outputDirectory, { recursive: true });
await cp(playwrightReport, path.join(outputDirectory, 'report'), { recursive: true });
await writeFile(path.join(outputDirectory, '.nojekyll'), '');

console.log('Site gerado em pages-dist com o relatório Playwright.');
