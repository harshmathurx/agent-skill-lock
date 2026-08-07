# Architecture

The pipeline is deliberately boring:

```text
load defaults
→ discover candidate files
→ parse with small adapters
→ redact and normalize
→ stable stringify
→ write or compare lockfile
```

## Discovery

`src/scan.ts` uses fixed default paths for common agent surfaces. v0 does not load a repo-supplied policy file. That is intentional: a PR should not be able to widen the scan target into the home directory through config.

The scanner ignores `.git`, `node_modules`, `dist`, `coverage`, and log files by default.

## Adapters

`src/adapters.ts` keeps parsing small:

- MCP JSON parser
- Hermes skill frontmatter parser
- generic instruction-file parser
- unparsed config entry for malformed MCP JSON

Malformed MCP JSON becomes a lockfile entry with an `UNPARSED_CONFIG` hint. It should not crash CI.

## Redaction

`src/redact.ts` strips secret-looking values from MCP args and URLs. MCP env values are never stored; only names are recorded.

## Stable output

`src/stable.ts` recursively sorts object keys and uses bytewise string comparison. The lockfile should not change because of locale, machine path, temp directory, timestamp, or object insertion order.

## Comparison

`src/lockfile.ts` compares entries by ID and reports added, removed, and changed entries. The text formatter intentionally keeps output short enough for CI logs.

## Action mode

The CLI can scan arbitrary local paths. The GitHub Action enables workspace containment through `AGENT_SKILL_LOCK_ENFORCE_WORKSPACE=1`, which rejects roots outside `GITHUB_WORKSPACE`.
