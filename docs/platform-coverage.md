# Platform coverage

Coverage is intentionally shallow in v0. The tool first proves the lockfile workflow. Deeper parser support should come from real repos and real review needs.

| Platform | Paths watched | Metadata extracted | Known limits |
| --- | --- | --- | --- |
| Claude Code | `CLAUDE.md`, `.claude/**`, `.claude/mcp*.json` | instruction file hash, MCP servers in Claude MCP JSON | most `.claude/**` files are treated as instruction surfaces, not deeply parsed |
| Codex | `AGENTS.md`, `.codex/**` | instruction file hash | no deep Codex config schema yet |
| Cursor | `.cursor/**`, `.cursor/mcp.json`, `.cursorrules` | instruction file hash, MCP servers in Cursor MCP JSON | Cursor rule metadata is not parsed beyond file hashing and text hints |
| Hermes skills | `.hermes/skills/**/SKILL.md` | frontmatter name, description, required commands, required env vars | linked skill files are not deeply parsed yet |
| MCP | `.mcp.json`, `mcp.json`, `.cursor/mcp.json`, `.claude/mcp*.json` | server name, command, args, URL, env names, disabled flag | only JSON MCP config is supported in v0 |
| Other agent docs | `.windsurfrules`, `.aider.conf.yml` | instruction file hash and text hints | no vendor-specific parser yet |

## How to request support

Open an issue with:

- the tool or platform name
- the repo-relative config path
- a redacted sample config
- what reviewers need to see in the lockfile
- what should never be stored

Do not paste real tokens, private URLs, or employer-confidential config.
