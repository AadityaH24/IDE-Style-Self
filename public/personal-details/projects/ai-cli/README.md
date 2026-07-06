# AI CLI

CLI toolchain that orchestrates AI agent handoffs across isolated Git worktrees, enabling parallel AI-assisted feature development without branch conflicts.

## How it works

```
User task → AI CLI spawns isolated worktree
                ↓
         Agent A works in worktree-1
         Agent B works in worktree-2  (parallel, no conflicts)
                ↓
         Coordinated merge → PR creation
```

Each AI agent gets a dedicated Git worktree — a full working copy isolated from every other agent's changes. No branch switching, no merge conflicts between agents, no context loss.

## Key capabilities

- **Worktree lifecycle management** — create, track, and clean up isolated worktrees per agent session
- **Agent handoff protocol** — structured context files passed between agents via worktree boundaries
- **Automated merge orchestration** — sequential or parallel merge strategies for multi-agent output
- **Wrap-up automation** — commit squashing, branch creation, and PR generation after agent completion

## Impact

- 40% faster feature prototyping through parallel agent execution
- Eliminated context-switching overhead — each agent starts fresh in a clean worktree
- Reduced PR conflicts by isolating agent changes at the filesystem level
