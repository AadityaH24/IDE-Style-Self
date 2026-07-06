# VSCode Portfolio

An interactive, IDE-themed resume built as a static single-page application. The site replicates the VS Code workspace layout — file tree sidebar, tabbed editor, and live terminal — to present professional experience in a format engineers instinctively understand.

## Stack

Vanilla HTML, CSS, JavaScript — no frameworks.

## Architecture

### Build pipeline

```
public/personal-details/  →  scripts/build-data.js  →  data.js
   (markdown, TS skills)       (Node.js + marked)       (static bundle)
```

Content lives as flat markdown files. A Node.js build script reads them at build time, renders markdown to HTML via `marked`, and produces a static `data.js` bundle. The browser loads only that bundle plus `script.js` — zero runtime dependencies.

### Editor

- File tree with collapsible folders and file-type icons (M for markdown, {} for JSON)
- Tabbed editor with Preview/Raw toggle for markdown files
- Copy buttons injected next to email, phone, LinkedIn, and GitHub links
- Open/Download resume buttons for the PDF

### Terminal

Not a real shell — contextual pre-scripted output per file (mock `npm run build`, `curl`, `jq`, etc.). Meta-commands (`ls`, `help`, `resume`, `contact`, `coffee`, `uptime`) echo directly into the terminal without switching files.

### Skills

Written as TypeScript object exports; parsed at build time with `new Function()` after stripping the export keyword. No TypeScript compiler needed.

## Deployment

GitHub Pages. Static files only — no server, no database.

## Live Site

https://aadityah24.github.io/IDE-Style-Self/
