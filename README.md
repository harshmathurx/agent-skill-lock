# agent-skill-lock

Detect agent capability drift before it lands in `main`.

Modern coding agents do not just read source code. They load repo instructions, local skills, MCP servers, shell permissions, Cursor rules, Codex guidance, and whatever else a team has quietly taught them. Those files can change what an agent is allowed to do.

`agent-skill-lock` turns that surface into a lockfile.

```bash
pnpm install
pnpm build
node dist/cli.js update
node dist/cli.js check
```

It scans common agent config paths, writes `agent-skills.lock.json`, and fails CI when the repo's current agent surface no longer matches the committed lockfile.

That is the whole trick. Capability drift belongs in code review.

## What this is

A small CLI and GitHub Action for repositories that use coding agents.

It helps reviewers answer one boring but useful question:

> Did this PR change what our agents can read, run, call, or publish?

It works with the files teams already have in git. You do not need a hosted dashboard, a central registry, or a new agent runtime.

## What this is not

`agent-skill-lock` does not make an agent safe.

It is not:

- a sandbox
- an authorization system
- a malware scanner
- a prompt injection detector
- proof that a skill or MCP server is trustworthy

A locked dangerous skill is still dangerous. The lockfile only makes the change visible.

## When to use it

Use it when a repo has agent-facing files that reviewers can miss:

- `AGENTS.md` or `CLAUDE.md`
- `.claude/`, `.codex/`, or `.cursor/`
- MCP server config
- repo-local skills
- tool permission files
- CI workflows that depend on coding agents

Do not use it as a substitute for sandboxing, secret scanning, package review, or normal code review.

## 30-second demo

The examples are committed as tiny repos. This gives you a clean pass, then a failing drift check:

```bash
pnpm install
pnpm build
node dist/cli.js check --root examples/claude-mcp-webapp
printf "\nNew publishing instruction.\n" >> examples/claude-mcp-webapp/CLAUDE.md
node dist/cli.js check --root examples/claude-mcp-webapp
```

The second check should fail because the current agent surface no longer matches `agent-skills.lock.json`.

Reset the example after trying it:

```bash
git checkout -- examples/claude-mcp-webapp/CLAUDE.md
```

## Recommended PR workflow

1. Change the agent config, skill, or MCP file.
2. Run `agent-skill-lock update`.
3. Review `agent-skills.lock.json` like a dependency lockfile.
4. Commit the config change and lockfile together.
5. Let CI block accidental drift.

If the lockfile changes but the agent config diff is hard to understand, slow down. That is the point of the tool.

## What it watches

| Surface | Paths |
| --- | --- |
| Claude Code | `.claude/**`, `CLAUDE.md` |
| Codex | `.codex/**`, `AGENTS.md` |
| Cursor | `.cursor/**`, `.cursorrules` |
| Hermes skills | `.hermes/skills/**` |
| MCP | `.mcp.json`, `mcp.json`, `.cursor/mcp.json`, `.claude/mcp*.json` |
| Other agent docs | `.windsurfrules`, `.aider.conf.yml` |

The lockfile records stable metadata: entry IDs, paths, content hashes, MCP server commands, environment variable names, tool-like capabilities, and review hints.

It does not write secret values or absolute machine paths into the lockfile.

## Quick start

The repo is not published to npm yet. For now, run it from source:

```bash
git clone https://github.com/harshmathurx/agent-skill-lock.git
cd agent-skill-lock
pnpm install
pnpm build
node dist/cli.js update --root path/to/your/repo
git -C path/to/your/repo add agent-skills.lock.json
git -C path/to/your/repo commit -m "chore: lock agent capabilities"
```

After the first tagged release, the GitHub Action will look like this:

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
      - uses: harshmathurx/agent-skill-lock@v0.1.0
```

When a PR edits `.mcp.json`, `AGENTS.md`, `.claude/**`, `.cursor/**`, or `.hermes/skills/**`, CI should fail until the lockfile is updated in the same PR.

That failure is intentional. It gives the reviewer a clean diff of the agent surface change.

## Commands

### `scan`

Print the current agent surface without touching the lockfile.

```bash
agent-skill-lock scan
agent-skill-lock scan --root path/to/repo
```

### `update`

Write `agent-skills.lock.json` for the current repo state.

```bash
agent-skill-lock update
```

Commit the lockfile with the agent config change that caused it.

### `check`

Compare the committed lockfile with the current repo state.

```bash
agent-skill-lock check
```

Exit codes:

- `0`: lockfile is current
- `1`: lockfile is missing or stale

### `diff`

Print the drift as JSON.

```bash
agent-skill-lock diff
```

### `explain`

Show the entry a reviewer should inspect.

```bash
agent-skill-lock explain mcpserver:mcp:filesystem
```

## Example failure

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

## Real examples

The `examples/` directory contains four small repos with initialized lockfiles:

- `examples/claude-mcp-webapp`: Claude Code instructions plus filesystem and Playwright MCP servers.
- `examples/codex-data-worker`: Codex guidance for a data job with a Postgres MCP server.
- `examples/cursor-hermes-plugin`: Cursor rules plus a Hermes release skill.
- `examples/mixed-agent-monorepo`: a mixed team repo with Claude, Codex, Cursor, Hermes, and MCP surfaces.

Each example has a README, agent config files, and a committed `agent-skills.lock.json`. They are deliberately small so the lockfile diff is readable.

Read the walkthrough: [docs/examples.md](docs/examples.md).

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

## Review hints

Review hints are not findings. They are reminders to slow down.

Current hints cover:

- shell or process execution
- network access
- filesystem mutation
- public side effects such as publish, deploy, merge, post, or comment
- secret-looking environment variable names
- repository or home directory MCP scopes
- unpinned remote execution patterns such as `npx -y` and `curl | sh`

If no hints appear, the config may still be risky. The tool is not trying to be clever enough to replace a reviewer.

## Development

```bash
pnpm install
pnpm check
```

The project uses strict TypeScript and Vitest. Parser changes should start with a fixture or focused test.

## Docs

- [CLI reference](docs/cli.md)
- [GitHub Action](docs/github-action.md)
- [Lockfile format](docs/lockfile-format.md)
- [Platform coverage](docs/platform-coverage.md)
- [Architecture](docs/architecture.md)
- [Examples](docs/examples.md)
- [Threat model](docs/threat-model.md)
- [Release process](docs/release.md)
- [Roadmap](docs/roadmap.md)
- [Positioning](docs/positioning.md)
- [Support](SUPPORT.md)

## Status

Early v0. The lockfile workflow works. Parser coverage is intentionally narrow and will expand as real repos expose edge cases.
