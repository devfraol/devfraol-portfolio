---
name: Workspace package installs
description: Monorepo-specific dependency installation behavior for artifact packages.
---

Install JavaScript dependencies against the owning artifact package rather than the pnpm workspace root.

**Why:** The workspace rejects root-level dependency additions, while the artifact package and lockfile can accept the same dependency set when targeted with its workspace filter.

**How to apply:** For a web artifact, target its package name with the package manager and then run that artifact's typecheck and build.