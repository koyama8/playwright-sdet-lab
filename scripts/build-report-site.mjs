import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptsDirectory, '..');
const sourceDirectory = path.join(projectRoot, 'report-site');
const outputDirectory = path.join(projectRoot, 'pages-dist');
const playwrightReport = path.join(projectRoot, 'playwright-report');
const testResults = path.join(projectRoot, 'test-results');
const jsonReport = path.join(testResults, 'results.json');
const videosDirectory = path.join(outputDirectory, 'videos');

async function findVideos(directory) {
  const videos = [];

  async function visit(currentDirectory) {
    let entries = [];
    try {
      entries = await readdir(currentDirectory, { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }

    for (const entry of entries) {
      const entryPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) await visit(entryPath);
      if (entry.isFile() && entry.name === 'video.webm') videos.push(entryPath);
    }
  }

  await visit(directory);
  return videos.sort();
}

function scenarioDetails(spec, index) {
  const match = spec.title.match(/(CT-(?:WEB|API)-[A-Z0-9-]+-\d+)\s*[-–—:]?\s*(.*)/i);
  const id = match?.[1]?.toUpperCase() ?? `CT-${String(index + 1).padStart(3, '0')}`;
  const title = match?.[2]?.trim() || spec.title;
  const normalizedFile = spec.file.replaceAll('\\', '/').toLowerCase();
  const tags = spec.tags.map((tag) => tag.toLowerCase());
  const kind = tags.includes('@api') || normalizedFile.includes('/api/') ? 'api' : 'web';

  return { id, title, kind };
}

function collectScenarios(suites, scenarios = []) {
  for (const suite of suites) {
    for (const spec of suite.specs) {
      for (const test of spec.tests) {
        const result = [...test.results]
          .reverse()
          .find((entry) =>
            entry.attachments.some((attachment) => attachment.contentType === 'video/webm'),
          );
        const attachment = result?.attachments.find(
          (entry) => entry.contentType === 'video/webm' && entry.path,
        );

        if (attachment?.path) scenarios.push({ spec, videoPath: attachment.path });
      }
    }

    if (suite.suites) collectScenarios(suite.suites, scenarios);
  }

  return scenarios;
}

async function scenariosFromJsonReport() {
  try {
    const report = JSON.parse(await readFile(jsonReport, 'utf8'));
    return collectScenarios(report.suites);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(videosDirectory, { recursive: true });
await cp(sourceDirectory, outputDirectory, { recursive: true });
await cp(playwrightReport, path.join(outputDirectory, 'report'), { recursive: true });

const reportScenarios = await scenariosFromJsonReport();
const fallbackVideos = reportScenarios.length === 0 ? await findVideos(testResults) : [];
const scenarios =
  reportScenarios.length > 0
    ? reportScenarios
    : fallbackVideos.map((videoPath, index) => ({
        spec: {
          title: `Cenário ${index + 1}`,
          tags: [],
          file: videoPath,
        },
        videoPath,
      }));
const manifest = [];

for (const [index, scenario] of scenarios.entries()) {
  const videoPath = path.isAbsolute(scenario.videoPath)
    ? scenario.videoPath
    : path.resolve(projectRoot, scenario.videoPath);
  const filename = `scenario-${String(index + 1).padStart(2, '0')}.webm`;
  await cp(videoPath, path.join(videosDirectory, filename));
  manifest.push({
    ...scenarioDetails(scenario.spec, index),
    file: `videos/${filename}`,
  });
}

await writeFile(
  path.join(videosDirectory, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await writeFile(path.join(outputDirectory, '.nojekyll'), '');

console.log(`Site gerado em pages-dist com ${manifest.length} vídeo(s).`);
