# Positioning

This project should be described as infrastructure for review, not as agent security magic.

The short version:

```text
A lockfile for agent capability drift.
```

The longer version:

```text
agent-skill-lock scans repo-local agent surfaces such as CLAUDE.md, AGENTS.md, Cursor rules, Hermes skills, and MCP configs. It writes a deterministic lockfile and fails CI when those surfaces change without a lockfile update.
```

## The angle

Most teams already know how to review dependency lockfiles. Agent config needs the same habit.

When a PR changes an MCP server, a skill, or an instruction file, that change can be as meaningful as a package upgrade. The tool does not decide whether the change is good. It makes the change visible.

## Good language

Use:

- "capability drift"
- "review boundary"
- "repo-local agent surface"
- "deterministic lockfile"
- "CI check for MCP and agent config changes"

Avoid:

- "AI firewall"
- "secure your agents"
- "prevents prompt injection"
- "zero trust agent runtime"
- "autonomous security"
- "guarantees safe agents"

## Audience

This is for maintainers who already have agents touching their repos and want a boring control point.

Good launch venues:

- Hacker News, if framed as a small tool and not a grand security model
- r/programming, if the post is about the lockfile pattern
- r/devops, if the post focuses on CI drift checks
- Claude/Cursor/Codex communities, if the example repos are the center of the post

## Questions worth asking in public

Ask for critique, not applause:

- Which agent config paths are missing?
- Should v0 stay lockfile-only, or add a tiny policy file later?
- What would make the diff useful in a real PR review?
- Where should scanner output sit, if at all: inside the lockfile, next to it, or in a separate report?

Do not pretend the tool solves runtime safety. Skeptical developers will be right to push back if the copy overclaims.
