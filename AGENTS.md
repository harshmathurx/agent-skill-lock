# Repository guidance for agents

This project is a security-adjacent CLI. Keep the public promise narrow: detect agent capability drift in git and CI.

Rules:

- Do not claim a locked skill, MCP server, or instruction file is safe.
- Do not store secret values, absolute local paths, usernames, temp directories, or timestamps in lockfile output.
- Add or update tests before changing parser behavior.
- Keep CLI failure output short, specific, and actionable.
- Public docs should read like maintained OSS, not internal notes.
