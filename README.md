# Aaditya H Chattankatil | VSCode Portfolio

An IDE-themed interactive resume. The site looks like VS Code — a file tree in the sidebar, tabbed editor pane in the center, and a live terminal on the right — so visitors browse the resume the way they browse a codebase.

**[Live site](https://aadityah24.github.io/IDE-Style-Self/)**

---

## How it works

### Data flow

```
public/personal-details/     ← markdown / JSON / TypeScript source files
        │
        ▼
scripts/build-data.js        ← Node.js build script (uses marked)
        │
        ▼
data.js                      ← generated data consumed by the browser
        │
        ▼
index.html + script.js       ← static site, no framework, no server
```

The build script reads every file from `public/personal-details/`, renders markdown to HTML via `marked`, and produces a `data.js` bundle. The browser loads `data.js` and `script.js` — no runtime dependencies, no server.

### Skills parsing

Skills are stored as TypeScript object exports in `skills/index.ts`. The build script reads the file, strips the `export const` prefix, and evaluates the remainder with `new Function()`. This allows writing skills as structured objects without needing a TypeScript compiler.

### Editor pane

- **File tree** on the left — each item maps to a key in the `files` object; folders collapse with chevron toggles
- **File-type icons** — `.md` files show a blue **M**, `.json` files show `{}` in yellow, folders show `▾`/`▸` chevrons
- **Tabbed editor** — clicking a sidebar item opens a tab; multiple tabs can be open at once
- **Preview / Raw toggle** — markdown files render as HTML by default; click "Raw" to see the source
- **Copy buttons** — email, phone, LinkedIn, and GitHub links get an icon-only clipboard button; clicking copies the value and shows a checkmark briefly
- **Open/Download Resume** — PDF links show two buttons: "Open Resume" (opens in new tab) and a download icon

### Terminal pane

The terminal is not an interactive shell — it shows pre-scripted output tied to the currently open file:

| Open file | Terminal shows |
|---|---|
| `about.md` | Boot-style profile load |
| `experience/*.md` | `cat` career history |
| `education.md` | Education summary |
| `projects/*.md` | `npm run build` output with stack + result |
| `skills.json` | `jq` queries |
| `contact.md` | `curl` mock response |

**Meta-commands** (echo directly into terminal, don't switch file):

| Command | Action |
|---|---|
| `ls` | Print file tree |
| `help` | Show command reference |
| `ls projects/` | List project files |
| `ls experience/` | List experience files |
| `resume` | Open resume PDF |
| `contact` | Show phone, email, website, LinkedIn, GitHub |
| `coffee` | ☕ Easter egg |
| `uptime` | Career uptime |

**File commands** (switch to the corresponding file):

| Command | Opens |
|---|---|
| `whoami` | `about.md` |
| `cat <file>` | Any file by name |
| `cat resume.pdf` | `contact.md` |

Invalid commands show an orange "invalid command" indicator.

### Status bar

A VS Code-style bar at the bottom shows fake branch name, file type, cursor position, and a download link for `resume.pdf`.

---

## Project structure

```
├── index.html                    Main page (static HTML shell)
├── styles.css                    All styles (dark IDE theme)
├── script.js                     Browser logic (tabs, editor, terminal, commands)
├── data.js                       Generated — do not edit directly
├── scripts/
│   └── build-data.js            Build script — reads personal-details/ → data.js
├── public/
│   └── personal-details/        Source data — edit these files
│       ├── ABOUT.md             Personal info, summary, core expertise
│       ├── education.md          Education history
│       ├── CHANGELOG.md          Version log
│       ├── experience/
│       │   ├── bajaj-finserv.md
│       │   └── atsuya.md
│       ├── projects/
│       │   ├── cache-platform/  Cache Operations Platform
│       │   ├── ai-cli/          AI CLI (Git worktree orchestration)
│       │   ├── content-migration/ Content Migration Engine
│       │   └── run-club/        Out of Office Run Club
│       ├── skills/
│       │   └── index.ts         All skills (expertise, languages, cloud, etc.)
│       ├── snippets/
│       │   ├── cache.ts
│       │   ├── event-driven.ts
│       │   └── redis.ts
│       └── docs/                 Source resume PDF (copied to root at build)
├── package.json                  Build script only
├── resume.pdf                    Generated — copied from docs/ at build
└── README.md                     This file
```

---

## Updating content

1. Edit files in `public/personal-details/`
2. Run `npm run build` to regenerate `data.js` and copy `resume.pdf`
3. Open `index.html` in a browser (or deploy to GitHub Pages)

No server required — `index.html` works as a static file.

### Adding a new project

1. Create a folder under `projects/` with a `README.md`
2. Add a sidebar entry in `index.html`
3. Add a `readProject("folder-name")` call in `scripts/build-data.js`
4. Add the project object to the `projects` array in the build script
5. Run `npm run build`

---

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Semantic HTML5 |
| Styling | CSS (custom properties, grid, no framework) |
| Runtime | Vanilla JavaScript (no framework) |
| Markdown rendering | `marked` (Node.js build step) |
| Font | JetBrains Mono (Google Fonts) |
| Deployment | GitHub Pages |

---

## Design decisions

- **No JavaScript framework.** The entire site is vanilla JS. A framework would add complexity without benefit for a single-page static resume.
- **Pre-rendered markdown.** `marked` runs at build time, not in the browser. The browser receives pre-rendered HTML — zero runtime cost for rendering.
- **Flat surfaces, no shadows.** The theme uses 1px borders and solid backgrounds — matches the VS Code aesthetic without relying on box-shadows or gradients.
- **Mobile-first collapse.** The terminal is hidden on mobile (<920px); the file tree collapses behind a hamburger. The editor fills the full viewport.
- **Scripted terminal.** The terminal shows contextual pre-written output per file, plus a handful of meta-commands (`ls`, `help`, `resume`, `contact`, `coffee`, `uptime`) that echo directly without switching files.
- **TypeScript without a compiler.** Skills are written as `.ts` files with `export const` — the build script strips the export and evaluates the plain object with `new Function()`.

---

## Inspiration

Based on the **Split-pane editor** variant of the classic terminal-resume concept. Layout mirrors VS Code's three-column workspace: sidebar | editor | terminal.
