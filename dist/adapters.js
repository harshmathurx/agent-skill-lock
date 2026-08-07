import path from 'node:path';
import { z } from 'zod';
import { makeEntryId } from './identity.js';
import { parseFrontmatter, stringArray } from './frontmatter.js';
import { hintForSecretEnvNames, inferRiskHints } from './risk.js';
import { compareStrings } from './stable.js';
import { redactArgs, redactUrl } from './redact.js';
export function parseFile(file) {
    const rel = file.relativePath.replace(/\\/g, '/');
    if (rel.endsWith('/SKILL.md') && rel.includes('.hermes/skills/'))
        return [parseHermesSkill(file)];
    if (isMcpPath(rel))
        return parseMcpConfig(file);
    if (isInstructionPath(rel))
        return [parseInstructionFile(file)];
    return [];
}
function parseHermesSkill(file) {
    const text = file.bytes.toString('utf8');
    const fm = parseFrontmatter(text);
    const name = stringValue(fm.name) || path.basename(path.dirname(file.relativePath));
    const commands = stringArray(fm.required_commands ?? fm.requiredCommands);
    const env = stringArray(fm.required_environment_variables ?? fm.requiredEnv);
    const capabilities = [
        ...commands.map((command) => ({ type: 'command', name: command, source: 'required_commands' })),
        ...env.map((name) => ({ type: 'env', name, source: 'required_environment_variables' })),
    ];
    return normalizeEntry({
        id: makeEntryId({ kind: 'skill', platform: 'hermes', name, path: file.relativePath }),
        kind: 'skill',
        platform: 'hermes',
        name,
        path: file.relativePath,
        contentHash: file.contentHash,
        metadata: {
            description: stringValue(fm.description),
            requiredCommands: commands,
            requiredEnv: env,
        },
        capabilities,
        riskHints: [...inferRiskHints(text), ...hintForSecretEnvNames(env)],
    });
}
const McpServer = z.object({
    command: z.string().optional(),
    args: z.array(z.string()).optional(),
    url: z.string().optional(),
    env: z.record(z.string(), z.string()).optional(),
    disabled: z.boolean().optional(),
}).passthrough();
const McpConfig = z.object({ mcpServers: z.record(z.string(), McpServer).optional() }).passthrough();
function parseMcpConfig(file) {
    const text = file.bytes.toString('utf8');
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch {
        return [unparsed(file, 'mcp', 'Invalid JSON in MCP config.')];
    }
    const result = McpConfig.safeParse(parsed);
    if (!result.success || !result.data.mcpServers)
        return [];
    return Object.entries(result.data.mcpServers).map(([name, server]) => {
        const envNames = Object.keys(server.env ?? {}).sort();
        const command = server.command ?? null;
        const args = redactArgs(server.args ?? []);
        const capabilities = [
            ...(command ? [{ type: 'command', name: command, source: 'mcp.command' }] : []),
            ...inferFilesystemCapabilities(args),
            ...envNames.map((envName) => ({ type: 'env', name: envName, source: 'mcp.env' })),
        ];
        const riskText = [command, ...args, server.url ?? ''].filter(Boolean).join(' ');
        const riskHints = [...inferRiskHints(riskText), ...hintForSecretEnvNames(envNames)];
        if (args.some((arg) => arg === '.' || arg === './'))
            riskHints.push({ level: 'high', code: 'FILESYSTEM_SCOPE_REPO', message: 'MCP server appears scoped to the repository root.' });
        if (args.some((arg) => arg === '~' || arg.startsWith('~/')))
            riskHints.push({ level: 'high', code: 'FILESYSTEM_SCOPE_HOME', message: 'MCP server appears scoped to a home directory.' });
        return normalizeEntry({
            id: makeEntryId({ kind: 'mcpServer', platform: 'mcp', name, path: file.relativePath }),
            kind: 'mcpServer',
            platform: 'mcp',
            name,
            path: file.relativePath,
            contentHash: file.contentHash,
            metadata: { command, args, url: redactUrl(server.url), envNames, disabled: server.disabled ?? false },
            capabilities,
            riskHints,
        });
    });
}
function parseInstructionFile(file) {
    const name = file.relativePath.replace(/\\/g, '/');
    const text = file.bytes.toString('utf8');
    return normalizeEntry({
        id: makeEntryId({ kind: 'instructionFile', platform: 'generic', name, path: file.relativePath }),
        kind: 'instructionFile',
        platform: 'generic',
        name,
        path: file.relativePath,
        contentHash: file.contentHash,
        metadata: { bytes: file.bytes.length },
        capabilities: [],
        riskHints: inferRiskHints(text),
    });
}
function unparsed(file, platform, message) {
    const name = file.relativePath;
    return normalizeEntry({
        id: makeEntryId({ kind: 'unparsedConfig', platform, name, path: file.relativePath }),
        kind: 'unparsedConfig',
        platform,
        name,
        path: file.relativePath,
        contentHash: file.contentHash,
        metadata: { message },
        capabilities: [],
        riskHints: [{ level: 'medium', code: 'UNPARSED_CONFIG', message }],
    });
}
function inferFilesystemCapabilities(args) {
    return args
        .filter((arg) => arg === '.' || arg === './' || arg === '~' || arg.startsWith('~/'))
        .map((scope) => ({ type: 'filesystem', scope }));
}
function isMcpPath(rel) {
    return rel === '.mcp.json' || rel === 'mcp.json' || rel === '.cursor/mcp.json' || /^\.claude\/mcp.*\.json$/.test(rel);
}
function isInstructionPath(rel) {
    return ['AGENTS.md', 'CLAUDE.md', '.cursorrules', '.windsurfrules', '.aider.conf.yml'].includes(rel)
        || rel.startsWith('.claude/')
        || rel.startsWith('.codex/')
        || rel.startsWith('.cursor/');
}
function stringValue(value) {
    return typeof value === 'string' ? value : null;
}
function normalizeEntry(entry) {
    return {
        ...entry,
        path: entry.path.replace(/\\/g, '/'),
        capabilities: [...entry.capabilities].sort((a, b) => compareStrings(`${a.type}:${a.name ?? a.scope ?? ''}`, `${b.type}:${b.name ?? b.scope ?? ''}`)),
        riskHints: dedupeRiskHints(entry.riskHints),
    };
}
function dedupeRiskHints(hints) {
    const byCode = new Map();
    for (const hint of hints)
        byCode.set(hint.code, hint);
    return [...byCode.values()].sort((a, b) => compareStrings(a.code, b.code));
}
//# sourceMappingURL=adapters.js.map