import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import { parseFile, type DiscoveredFile } from './adapters.js';
import { sha256Bytes } from './hash.js';
import type { LockEntry, Lockfile, ScanOptions } from './types.js';

const VERSION = '0.1.0';

export const DEFAULT_PATTERNS = [
  '.claude/**',
  '.codex/**',
  '.cursor/**',
  '.hermes/skills/**',
  'AGENTS.md',
  'CLAUDE.md',
  '.cursorrules',
  '.windsurfrules',
  '.aider.conf.yml',
  '.mcp.json',
  'mcp.json',
];

export async function scanRepository(options: ScanOptions): Promise<Lockfile> {
  const root = path.resolve(options.root);
  const matches = await fg(DEFAULT_PATTERNS, {
    cwd: root,
    dot: true,
    onlyFiles: true,
    unique: true,
    ignore: ['.git/**', 'node_modules/**', 'dist/**', 'coverage/**', '**/*.log'],
  });

  const entries: LockEntry[] = [];
  for (const relativePath of matches.sort()) {
    const bytes = await readFile(path.join(root, relativePath));
    const file: DiscoveredFile = { relativePath: relativePath.replace(/\\/g, '/'), bytes, contentHash: sha256Bytes(bytes) };
    entries.push(...parseFile(file));
  }

  return {
    lockfileVersion: 1,
    generatedBy: `agent-skill-lock@${VERSION}`,
    root: '.',
    entries: entries.sort((a, b) => a.id.localeCompare(b.id) || a.path.localeCompare(b.path)),
  };
}
