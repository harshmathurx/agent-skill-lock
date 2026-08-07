# agent-skill-lock

A repo-local lockfile for coding-agent skills, MCP servers, and tool permissions.

Agent tools now load instructions, skills, servers, and permission surfaces from files in your repository. Those files change what an agent can do. `agent-skill-lock` makes that surface reviewable in git.

It scans common agent configuration paths, writes `agent-skills.lock.json`, and fails CI when the current agent surface does not match the committed lockfile.

```bash
npx agent-skill-lock update
npx agent-skill-lock check
```

`agent-skill-lock` detects drift. It does not certify that a locked skill or server is safe.

## What it watches

| Surface | Paths |
| --- | --- |
| Claude Code | `.claude/**`, `CLAUDE.md` |
| Codex | `.codex/**`, `AGENTS.md` |
| Cursor | `.cursor/**`, `.cursorrules` |
| Hermes skills | `.hermes/skills/**` |
| MCP | `.mcp.json`, `mcp.json`, `.cursor/mcp.json`, `.claude/mcp*.json` |
| Other agent docs | `.windsurfrules`, `.aider.conf.yml` |

The scanner records stable metadata: entry IDs, paths, content hashes, extracted commands/env names, MCP server definitions, capabilities, and risk hints.

It intentionally does not store secret values or absolute machine paths.

## Why this exists

Security scanners ask whether a skill looks malicious. That is useful, but it is not the first boundary most teams need.

The first boundary is simpler:

> Did the agent gain a new instruction, server, command surface, environment binding, or permission in this repo, and did the diff show it?

Teams already review dependency lockfiles. Agent capability needs the same habit.

## Install

Use without installing:

```bash
npx agent-skill-lock scan
npx agent-skill-lock update
npx agent-skill-lock check
```

Or add it as a dev dependency:

```bash
pnpm add -D agent-skill-lock
pnpm agent-skill-lock update
```

## Commands

### `scan`

Print the current agent capability manifest without writing a lockfile.

```bash
agent-skill-lock scan
agent-skill-lock scan --root path/to/repo
```

### `update`

Write `agent-skills.lock.json` for the current repository state.

```bash
agent-skill-lock update
```

Commit the lockfile with the agent configuration change.

### `check`

Compare the committed lockfile with the current repository state.

```bash
agent-skill-lock check
```

If the lockfile is stale, the command exits `1` and prints the added, removed, or changed entries.

### `diff`

Print the lockfile drift as JSON for downstream tools.

```bash
agent-skill-lock diff
```

### `explain`

Explain one lockfile entry.

```bash
agent-skill-lock explain mcpserver:mcp:filesystem
```

## GitHub Actions

```yaml
name: agent-skill-lock
on:
  pull_request:
  push:
    branches: [main]

jobs:
  check-agent-capabilities:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: harshmathurx/agent-skill-lock@v0
```

The Action only needs read access. It does not comment on PRs, write files, upload artifacts, or call an external service.

## Example stale-lock output

```text
Agent capability lock is stale.

The repo's agent surface changed but agent-skills.lock.json was not updated.

Added:
  + mcpserver:mcp:filesystem-local
    path: .mcp.json
    risk: high FILESYSTEM_SCOPE_REPO - MCP server appears scoped to the repository root.

Changed:
  ~ skill:hermes:deploy
    path: .hermes/skills/deploy/SKILL.md
    fields: contentHash, riskHints

Fix:
  Review the diff, then run:
    npx agent-skill-lock update
  Commit agent-skills.lock.json with the capability change.

Note: this detects drift. It does not certify that a locked skill or server is safe.
```

## Lockfile shape

```json
{
  "lockfileVersion": 1,
  "generatedBy": "agent-skill-lock@0.1.0",
  "root": ".",
  "entries": [
    {
      "id": "mcpserver:mcp:filesystem-local",
      "kind": "mcpServer",
      "platform": "mcp",
      "name": "filesystem-local",
      "path": ".mcp.json",
      "contentHash": "sha256:...",
      "metadata": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
        "url": null,
        "envNames": [],
        "disabled": false
      },
      "capabilities": [
        { "type": "command", "name": "npx", "source": "mcp.command" },
        { "type": "filesystem", "scope": "." }
      ],
      "riskHints": [
        {
          "level": "high",
          "code": "FILESYSTEM_SCOPE_REPO",
          "message": "MCP server appears scoped to the repository root."
        }
      ]
    }
  ]
}
```

## Risk hints

Risk hints are review prompts, not vulnerability findings.

Current hints include:

- shell/process execution
- network access
- filesystem mutation
- public or external side effects
- secret-looking environment variable names
- repository/home filesystem MCP scopes
- unpinned remote execution patterns such as `npx -y` and `curl | sh`

If no hints appear, that is not a security guarantee.

## Non-goals

- Not a sandbox.
- Not an authorization layer.
- Not a generic prompt-injection scanner.
- Not a central skill registry.
- Not a hosted dashboard.
- Not proof that a locked agent configuration is safe.

## Development

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

The project uses strict TypeScript and Vitest. New parser behavior should start with a fixture or focused test that fails before implementation.

## Status

Early v0. The core lockfile flow works, but parser coverage is intentionally narrow. Expect adapters to improve as real repositories expose edge cases.
