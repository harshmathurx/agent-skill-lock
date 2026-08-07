import { readFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import { resolveRoot } from './root.js';
import { parseFile, type DiscoveredFile } from './adapters.js';
import { compareStrings } from './stable.js';
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
  const root = resolveRoot(options.root);
  const matches = await fg(DEFAULT_PATTERNS, {
    cwd: root,
    dot: true,
    onlyFiles: true,
    unique: true,
    ignore: ['.git/**', 'node_modules/**', 'dist/**', 'coverage/**', '**/*.log'],
  });

  const entries: LockEntry[] = [];
  for (const relativePath of matches.sort(compareStrings)) {
    const bytes = await readFile(path.join(root, relativePath));
    const file: DiscoveredFile = { relativePath: relativePath.replace(/\\/g, '/'), bytes, contentHash: sha256Bytes(bytes) };
    entries.push(...parseFile(file));
  }

  const sortedEntries = entries.sort((a, b) => compareStrings(a.id, b.id) || compareStrings(a.path, b.path));
  assertUniqueEntryIds(sortedEntries);

  return {
    lockfileVersion: 1,
    generatedBy: `agent-skill-lock@${VERSION}`,
    root: '.',
    entries: sortedEntries,
  };
}

function assertUniqueEntryIds(entries: Array<{ id: string; path: string }>): void {
  const seen = new Map<string, string>();
  for (const entry of entries) {
    const existing = seen.get(entry.id);
    if (existing) throw new Error(`Duplicate lockfile entry id: ${entry.id} (${existing}, ${entry.path})`);
    seen.set(entry.id, entry.path);
  }
}
