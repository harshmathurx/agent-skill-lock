# Changelog

## Unreleased

- Added four runnable example repos under `examples/`.
- Added docs for examples, threat model, release process, roadmap, positioning, CLI, GitHub Action, lockfile format, platform coverage, architecture, and support.
- Added tests for secret-like MCP arg redaction and Action workspace containment.
- Hardened Action mode so root scanning is restricted to `GITHUB_WORKSPACE` only when the Action enables enforcement.

## 0.1.0

Initial public repo:

- TypeScript CLI with `scan`, `update`, `check`, `diff`, and `explain`.
- Deterministic `agent-skills.lock.json` output.
- Discovery for Claude, Codex, Cursor, Hermes skills, MCP configs, and common agent instruction files.
- GitHub Action wrapper with read-only permissions.
- Initial README, contributing guide, security policy, code of conduct, issue templates, PR template, CI, and MIT license.
