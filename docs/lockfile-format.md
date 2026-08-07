# Lockfile format

`agent-skills.lock.json` is a deterministic manifest of repo-local agent surfaces.

The file is meant to be reviewed in pull requests. It is not meant to contain secrets, absolute local paths, timestamps, or machine-specific state.

## Top-level shape

```json
{
  "lockfileVersion": 1,
  "generatedBy": "agent-skill-lock@0.1.0",
  "root": ".",
  "entries": []
}
```

## Entry shape

Each entry describes one discovered surface.

```json
{
  "id": "mcpserver:mcp:filesystem-local",
  "kind": "mcpServer",
  "platform": "mcp",
  "name": "filesystem-local",
  "path": ".mcp.json",
  "contentHash": "sha256:...",
  "metadata": {},
  "capabilities": [],
  "riskHints": []
}
```

Fields:

| Field | Meaning |
| --- | --- |
| `id` | Stable entry ID derived from kind, platform, name, and path |
| `kind` | Entry type such as `instructionFile`, `skill`, `mcpServer`, or `unparsedConfig` |
| `platform` | Source family such as `generic`, `hermes`, or `mcp` |
| `name` | Human-readable entry name |
| `path` | Repo-relative path, always using `/` separators |
| `contentHash` | SHA-256 hash of the source file bytes |
| `metadata` | Parsed metadata safe to store |
| `capabilities` | Extracted command, env, filesystem, or similar capability hints |
| `riskHints` | Review prompts generated from text and metadata |

## Stability rules

The lockfile writer sorts object keys, entries, capabilities, and review hints. It does not include timestamps, current working directories, usernames, temp paths, or absolute local paths.

This keeps lockfile diffs boring. Boring is good here.

## Redaction rules

The lockfile may record env var names. It must not record env var values.

It also redacts:

- secret-looking MCP arg values such as `--token value` and `--api-key=value`
- URL username and password fields
- suspicious URL query values such as `token`, `api_key`, `secret`, and `password`

Fixtures use fake values only. Do not put real credentials in examples, tests, issues, or lockfiles.

## Review hints are not findings

A `riskHints` entry means "review this carefully." It does not mean the config is vulnerable.

Likewise, no hints does not mean the config is safe.
