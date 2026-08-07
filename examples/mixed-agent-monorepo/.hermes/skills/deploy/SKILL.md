---
name: deploy
description: Prepare a deploy checklist for this monorepo.
required_commands:
  - pnpm
  - git
required_environment_variables:
  - VERCEL_TOKEN
---

# Deploy checklist

Run tests and prepare the deployment notes. Do not deploy, merge, or publish without explicit maintainer approval.
