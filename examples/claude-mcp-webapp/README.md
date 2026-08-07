# Claude MCP web app

A tiny repo that uses Claude Code to help with frontend work and release checks.


## Try it

From the repository root:

```bash
pnpm build
node dist/cli.js check --root examples/claude-mcp-webapp
```

Edit one of the agent files in this example, then run the check again. It should fail until you update the example lockfile:

```bash
node dist/cli.js update --root examples/claude-mcp-webapp
```
