import type { RiskHint } from './types.js';

const PATTERNS: Array<{ code: string; level: RiskHint['level']; pattern: RegExp; message: string }> = [
  { code: 'PUBLIC_SIDE_EFFECT', level: 'high', pattern: /\b(post|publish|deploy|release|merge|tweet|send_message|comment)\b/i, message: 'Instruction appears to permit a public or external side effect.' },
  { code: 'UNPINNED_REMOTE_EXEC', level: 'high', pattern: /\b(npx\s+-y|uvx|curl\s+[^\n]*\|\s*(sh|bash))\b/i, message: 'Configuration may execute an unpinned remote package or script.' },
  { code: 'SHELL_COMMAND', level: 'medium', pattern: /\b(shell|bash|zsh|subprocess|exec|spawn|terminal)\b/i, message: 'Instruction references shell or process execution.' },
  { code: 'NETWORK_ACCESS', level: 'medium', pattern: /\b(curl|wget|fetch|https?:\/\/)\b/i, message: 'Instruction references network access.' },
  { code: 'FILESYSTEM_WRITE', level: 'medium', pattern: /\b(write|delete|remove|patch|move|overwrite|commit)\b/i, message: 'Instruction references filesystem mutation.' },
];

export function inferRiskHints(text: string): RiskHint[] {
  const seen = new Set<string>();
  const hints: RiskHint[] = [];
  for (const item of PATTERNS) {
    if (item.pattern.test(text) && !seen.has(item.code)) {
      seen.add(item.code);
      hints.push({ level: item.level, code: item.code, message: item.message });
    }
  }
  return hints.sort((a, b) => a.code.localeCompare(b.code));
}

export function hintForSecretEnvNames(names: string[]): RiskHint[] {
  return names.some((name) => /token|key|secret|password|passwd/i.test(name))
    ? [{ level: 'medium', code: 'SECRET_ENV_REFERENCE', message: 'MCP server references secret-looking environment variable names. Values are redacted.' }]
    : [];
}
