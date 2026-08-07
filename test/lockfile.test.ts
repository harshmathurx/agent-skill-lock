import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { compareLockfiles, scanRepository, stableStringify, updateLockfile } from '../src/index.js';

async function tempRepo(name: string): Promise<string> {
  return mkdtemp(path.join(tmpdir(), `${name}-`));
}

describe('lockfile generation', () => {
  it('produces deterministic JSON without absolute paths', async () => {
    const root = await tempRepo('agent-lock-deterministic');
    await writeFile(path.join(root, 'AGENTS.md'), 'Use pnpm. Do not deploy.');

    const first = await scanRepository({ root });
    const second = await scanRepository({ root });

    expect(stableStringify(first)).toBe(stableStringify(second));
    expect(stableStringify(first)).not.toContain(root);
    expect(first.entries[0]?.id).toBe('instructionfile:generic:agents.md');
  });

  it('parses Hermes skills and captures command/env metadata', async () => {
    const root = await tempRepo('agent-lock-hermes');
    const dir = path.join(root, '.hermes/skills/personal/deploy');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'SKILL.md'), `---\nname: deploy\ndescription: Deploy safely.\nrequired_commands: [git, gh]\nrequired_environment_variables: [GITHUB_TOKEN]\n---\n# Deploy\nPost a release only after approval.`);

    const lockfile = await scanRepository({ root });
    const entry = lockfile.entries[0];

    expect(entry?.id).toBe('skill:hermes:deploy');
    expect(entry?.capabilities).toContainEqual({ type: 'command', name: 'gh', source: 'required_commands' });
    expect(stableStringify(entry)).toContain('SECRET_ENV_REFERENCE');
  });

  it('redacts MCP env values and secret-looking URL query values', async () => {
    const root = await tempRepo('agent-lock-mcp-redact');
    await writeFile(path.join(root, '.mcp.json'), JSON.stringify({
      mcpServers: {
        github: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-github'],
          url: 'https://example.com/mcp?token=super-secret&safe=ok',
          env: { GITHUB_TOKEN: 'real-token-value' }
        }
      }
    }));

    const lockfile = await scanRepository({ root });
    const text = stableStringify(lockfile);

    expect(text).toContain('GITHUB_TOKEN');
    expect(text).not.toContain('real-token-value');
    expect(text).not.toContain('super-secret');
    expect(text).toContain('token=%3Credacted%3E');
  });

  it('detects stale lockfiles after capability drift', async () => {
    const root = await tempRepo('agent-lock-drift');
    await writeFile(path.join(root, 'AGENTS.md'), 'Use pnpm.');
    const before = await updateLockfile({ root });

    await writeFile(path.join(root, '.mcp.json'), JSON.stringify({
      mcpServers: { fs: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '.'] } }
    }));

    const after = await scanRepository({ root });
    const diff = compareLockfiles(before, after);

    expect(diff.added.map((entry) => entry.id)).toContain('mcpserver:mcp:fs');
    expect(diff.isClean).toBe(false);
    expect(await readFile(path.join(root, 'agent-skills.lock.json'), 'utf8')).toContain('AGENTS.md');
  });
});
