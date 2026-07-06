# Resume-Variant

An IDE-themed interactive resume. The site looks like VS Code — a file tree in the sidebar, tabbed editor pane in the center, and a live terminal on the right — so visitors browse the resume the way they browse a codebase.

**[Live site](https://your-site.netlify.app)** (add your deployment URL)

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

### Editor pane

- **File tree** on the left — each item maps to a key in the `files` object
- **Tabbed editor** — clicking a sidebar item opens a tab; multiple tabs can be open at once
- **Preview / Raw toggle** — markdown files render as HTML by default; click "Raw" to see the source
- **Fade transition** (150ms) when switching between files

### Terminal pane

The terminal is not an interactive shell — it shows pre-scripted output tied to the currently open file:

| Open file | Terminal shows |
|---|---|
| `about.md` | Boot-style profile load |
| `experience/*.md` | `git log --oneline` career history |
| `education.md` | Education summary |
| `projects/*.md` | `npm run build` output with stack + result |
| `skills.json` | `jq` queries |
| `contact.md` | `curl` mock response |

**Recognised commands:**

| Command | Action |
|---|---|
| `ls` | Print file tree |
| `help` | Show command reference |
| `whoami` | Open `about.md` |
| `git log --oneline` | Open career history |
| `cat <file>` | Open any file |
| `ls projects/` | Open first project |

Invalid commands show an orange "invalid command" indicator and do nothing.

### Status bar

A VS Code-style bar at the bottom shows fake branch name, file type, cursor position, and a real download link for `resume.pdf`.

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
│       ├── ABOUT.md             Personal info, summary, certifications
│       ├── education.md          Education history
│       ├── CHANGELOG.md          Version log
│       ├── experience/
│       │   ├── bajaj-finserv.md
│       │   └── atsuya.md
│       ├── projects/
│       │   ├── cache-platform/   README.md + architecture.md + metrics.json
│       │   ├── ai-cli/           README.md + roadmap.md
│       │   ├── cms-migration/    README.md
│       │   └── run-club/         README.md
│       ├── skills/
│       │   ├── backend.ts
│       │   ├── cloud.ts
│       │   └── ai.ts
│       ├── snippets/
│       │   ├── cache.ts
│       │   ├── event-driven.ts
│       │   └── redis.ts
│       └── docs/                 Place resume PDF here
├── package.json                  Build script only
└── README.md                     This file
```

---

## Updating content

1. Edit files in `public/personal-details/`
2. Run `npm run build` to regenerate `data.js`
3. Open `index.html` in a browser (or your dev server)

No server required — `index.html` works as a static file.

### Adding a new project

1. Create a folder under `projects/` with a `README.md` (optionally `architecture.md` and `metrics.json`)
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
| Deployment | Static — any host (Netlify, Vercel, GitHub Pages, S3) |

---

## Design decisions

- **No JavaScript framework.** The entire site is under 400 lines of vanilla JS. A framework would add complexity without benefit for a single-page static resume.
- **Pre-rendered markdown.** `marked` runs at build time, not in the browser. The browser receives pre-rendered HTML — zero runtime cost for rendering.
- **Flat surfaces, no shadows.** The theme uses 1px borders and solid backgrounds — matches the VS Code aesthetic without relying on box-shadows or gradients that break on older monitors.
- **Mobile-first collapse.** The terminal is hidden on mobile (<920px); the file tree collapses behind a hamburger. The editor fills the full viewport.

---

## Inspiration

Based on the **Split-pane editor** variant of the classic terminal-resume concept. Layout mirrors VS Code's three-column workspace: sidebar | editor | terminal.
