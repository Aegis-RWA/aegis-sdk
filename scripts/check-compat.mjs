import { spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const browserEntry = join(projectRoot, 'tests', 'compat', 'browser-smoke.ts');
const nodeEntry = join(projectRoot, 'tests', 'compat', 'node-smoke.ts');
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'aegis-sdk-compat-'));
const nodeBundle = join(temporaryDirectory, 'node-smoke.cjs');

function assertNoExternalNodeImports(metafile) {
  const forbidden = new Set([
    'assert',
    'buffer',
    'child_process',
    'crypto',
    'events',
    'fs',
    'http',
    'https',
    'net',
    'os',
    'path',
    'process',
    'stream',
    'tls',
    'url',
    'util',
    'zlib',
  ]);

  for (const output of Object.values(metafile.outputs)) {
    for (const imported of output.imports) {
      const bareName = imported.path.replace(/^node:/, '').split('/')[0];
      if (imported.external && forbidden.has(bareName)) {
        throw new Error(
          `Browser bundle retains Node-only import "${imported.path}" in ${output.entryPoint ?? 'output'}`,
        );
      }
    }
  }
}

try {
  const browserBuild = await build({
    entryPoints: [browserEntry],
    bundle: true,
    platform: 'browser',
    format: 'esm',
    target: ['es2020'],
    conditions: ['browser', 'import', 'default'],
    write: false,
    metafile: true,
    logLevel: 'warning',
  });

  assertNoExternalNodeImports(browserBuild.metafile);

  await build({
    entryPoints: [nodeEntry],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['node20'],
    outfile: nodeBundle,
    logLevel: 'warning',
  });

  const nodeProbe = spawnSync(process.execPath, [nodeBundle], {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  if (nodeProbe.status !== 0) {
    throw new Error(
      [
        'Node compatibility probe failed.',
        nodeProbe.stdout.trim(),
        nodeProbe.stderr.trim(),
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  console.log('Browser compatibility: bundle resolved without Node-only imports.');
  console.log(nodeProbe.stdout.trim());
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
