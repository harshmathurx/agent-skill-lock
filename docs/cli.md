# CLI reference

The CLI is intentionally small. It scans repo-local agent surfaces, writes a deterministic lockfile, and compares the current repo state with that lockfile.

## `scan`

Print the current agent surface as JSON. It does not read or write `agent-skills.lock.json`.

```bash
agent-skill-lock scan
agent-skill-lock scan --root path/to/repo
```

Use this when you want to inspect what the tool sees before committing a lockfile.

## `update`

Write `agent-skills.lock.json` for the current repo state.

```bash
agent-skill-lock update
agent-skill-lock update --root path/to/repo
```

Run this after reviewing an intentional agent config change. Commit the lockfile with the config change.

## `check`

Compare the current repo state with the committed lockfile.

```bash
agent-skill-lock check
agent-skill-lock check --root path/to/repo
```

Exit codes:

- `0`: the lockfile matches the current repo state
- `1`: the lockfile is missing or stale

The command prints a compact diff when it fails.

## `diff`

Print the comparison result as JSON.

```bash
agent-skill-lock diff
```

This is for scripts and future integrations. The output is not meant to be beautiful. It is meant to be stable enough to inspect.

## `explain`

Print one lockfile entry by ID.

```bash
agent-skill-lock explain skill:hermes:deploy
agent-skill-lock explain mcpserver:mcp:filesystem-local
```

Use it when a lockfile diff points at an entry and you want the short version: kind, platform, path, capabilities, and review hints.

## `--root`

Every command accepts `--root`.

```bash
agent-skill-lock check --root examples/mixed-agent-monorepo
```

When the GitHub Action runs, roots are restricted to `GITHUB_WORKSPACE`. Local CLI usage does not enforce that restriction, so tests and examples can scan temporary directories.
