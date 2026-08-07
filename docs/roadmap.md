# Roadmap

The product should stay narrow until users pull it wider.

## v0.1

Current target:

- deterministic lockfile
- `scan`, `update`, `check`, `diff`, `explain`
- GitHub Action with read-only permissions
- basic parsing for Claude, Codex, Cursor, Hermes skills, and MCP configs
- redaction for env values, secret-looking args, and suspicious URL query values
- examples that show real review flows

## v0.2

Likely next:

- better config path coverage from real repos
- richer MCP server metadata
- clearer text diff output
- duplicate ID and path collision diagnostics
- symlink and large-file hardening
- schema documentation

## v0.3

Only if users ask for it:

- optional policy file
- PR annotation output
- JSON schema for lockfiles
- pre-commit hook generation
- integration with scanner output as metadata, not as a verdict

## Not planned yet

- hosted dashboard
- central agent skill registry
- runtime enforcement
- package reputation scoring
- broad vulnerability scanning

Those may be good products. They are not this product yet.
