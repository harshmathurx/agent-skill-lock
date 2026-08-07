#!/usr/bin/env node
import { existsSync } from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import { compareLockfiles, formatDiff, readLockfile, scanRepository, stableStringify, updateLockfile, LOCKFILE_NAME } from './index.js';
const program = new Command();
program
    .name('agent-skill-lock')
    .description('Lock and check repo-local agent skills, MCP servers, and tool permissions.')
    .version('0.1.0');
program.command('scan')
    .description('Print the current agent capability manifest.')
    .option('--root <path>', 'repository root', process.cwd())
    .action(async (options) => {
    const lockfile = await scanRepository({ root: options.root });
    process.stdout.write(stableStringify(lockfile));
});
program.command('update')
    .description('Write agent-skills.lock.json for the current repository state.')
    .option('--root <path>', 'repository root', process.cwd())
    .action(async (options) => {
    const lockfile = await updateLockfile({ root: options.root });
    process.stdout.write(`agent-skill-lock updated\n  entries: ${lockfile.entries.length}\n  lockfile: ${LOCKFILE_NAME}\n`);
});
program.command('check')
    .description('Fail when the committed lockfile does not match the current agent surface.')
    .option('--root <path>', 'repository root', process.cwd())
    .action(async (options) => {
    const lockPath = path.join(options.root, LOCKFILE_NAME);
    if (!existsSync(lockPath)) {
        process.stderr.write(`Missing ${LOCKFILE_NAME}. Run: npx agent-skill-lock update\n`);
        process.exitCode = 1;
        return;
    }
    const before = await readLockfile(options.root);
    const after = await scanRepository({ root: options.root });
    const diff = compareLockfiles(before, after);
    process.stdout.write(formatDiff(diff));
    process.exitCode = diff.isClean ? 0 : 1;
});
program.command('diff')
    .description('Print the lockfile drift diff as JSON.')
    .option('--root <path>', 'repository root', process.cwd())
    .action(async (options) => {
    const before = await readLockfile(options.root);
    const after = await scanRepository({ root: options.root });
    process.stdout.write(stableStringify(compareLockfiles(before, after)));
});
program.command('explain')
    .description('Explain one lockfile entry by id.')
    .argument('<entry-id>')
    .option('--root <path>', 'repository root', process.cwd())
    .action(async (entryId, options) => {
    const lockfile = await readLockfile(options.root);
    const entry = lockfile.entries.find((item) => item.id === entryId);
    if (!entry) {
        process.stderr.write(`Entry not found: ${entryId}\n`);
        process.exitCode = 1;
        return;
    }
    process.stdout.write(`${entry.id}\n  kind: ${entry.kind}\n  platform: ${entry.platform}\n  path: ${entry.path}\n`);
    for (const capability of entry.capabilities)
        process.stdout.write(`  capability: ${capability.type}:${capability.name ?? capability.scope ?? ''}\n`);
    for (const hint of entry.riskHints)
        process.stdout.write(`  risk: ${hint.level} ${hint.code} - ${hint.message}\n`);
});
program.parseAsync().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
});
//# sourceMappingURL=cli.js.map