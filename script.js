const data = window.resumeData;
const files = data.files;
const email = (files["contact.md"].lines.find(l => l.startsWith("Email:")) || "").replace("Email: ", "").trim();
const phone = (files["about.md"].lines.find(l => l.startsWith("- Phone:")) || "").replace("- Phone: ", "").trim();
const linkedin = "https://linkedin.com/in/aaditya-hemant";

function createCopyBtn(text) {
  const btn = document.createElement("button");
  btn.className = "copy-btn";
  btn.dataset.copyText = text;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  return btn;
}

const openTabs = ["about.md"];
let activeFile = "about.md";
let previewMode = true;

const tabsEl = document.querySelector("#tabs");
const editorBody = document.querySelector("#editorBody");
const terminalOutput = document.querySelector("#terminalOutput");
const fileButtons = document.querySelectorAll(".file-item");
const mobileToggle = document.querySelector(".mobile-toggle");
const sidebar = document.querySelector("#fileTree");
const terminalForm = document.querySelector("#terminalForm");
const terminalInput = document.querySelector("#terminalInput");
const terminalHint = document.querySelector("#terminalHint");
let lastEchoedCommand = null;

function dismissHint() {
  if (!terminalHint || terminalHint.classList.contains("dismissed")) return;
  terminalHint.classList.add("dismissed");
  window.setTimeout(() => { terminalHint.hidden = true; }, 220);
}

const commands = data.commands;

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;"
  })[char]);
}

function highlightCode(line) {
  return escapeHtml(line)
    .replace(/(const|export|default)/g, '<span class="keyword">$1</span>')
    .replace(/(&quot;.*?&quot;)/g, '<span class="string">$1</span>')
    .replace(/\b(company|role|years|impact)\b(?=:)/g, '<span class="property">$1</span>')
    .replace(/\b(\d+[M%]?|\d{4})\b/g, '<span class="number">$1</span>');
}

function renderLine(content, index, className = "code-line") {
  return `<div class="${className}"><span class="line-number">${index + 1}</span><span class="line-content">${content}</span></div>`;
}

function renderEditor() {
  const file = files[activeFile];
  editorBody.classList.add("fading");

  window.setTimeout(() => {
    let previewHtml = file.html;
    if (previewHtml && previewMode) {
      previewHtml = previewHtml.replace(
        /(\+91 \d{10})/,
        '<span data-copy-field="phone">$1</span>'
      );
    }

    const body = previewHtml && previewMode
      ? `<div class="markdown-preview">${previewHtml}</div>`
      : (file.code || file.lines).map((line, index) => renderLine(
          file.lines ? escapeHtml(line) : highlightCode(line), index
        )).join("");

    editorBody.innerHTML = body;
    editorBody.classList.remove("fading");

    if (file.html && previewMode) {
      // Email copy
      const mailto = editorBody.querySelector('a[href^="mailto:"]');
      if (mailto && !mailto.nextElementSibling?.classList.contains("copy-btn")) {
        mailto.after(createCopyBtn(email));
      }

      // Phone copy
      const phoneEl = editorBody.querySelector('[data-copy-field="phone"]');
      if (phoneEl && !phoneEl.nextElementSibling?.classList.contains("copy-btn")) {
        phoneEl.after(createCopyBtn(phone));
      }

      // LinkedIn & GitHub copy
      editorBody.querySelectorAll('a[href*="linkedin.com"], a[href*="github.com"]').forEach((link) => {
        if (link.nextElementSibling?.classList.contains("copy-btn")) return;
        link.after(createCopyBtn(link.href));
      });

      // Style PDF links: open in new tab + download icon
      editorBody.querySelectorAll('a[href$=".pdf"]').forEach((link) => {
        if (link.classList.contains("dl-link")) return;
        link.className = "dl-link";
        link.target = "_blank";
        link.rel = "noopener";
        link.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Open Resume`;
        const dl = document.createElement("a");
        dl.href = link.href;
        dl.download = "";
        dl.className = "dl-icon";
        dl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
        dl.innerHTML += ` Download`;
        dl.className = "dl-icon";
        dl.title = "Download Resume";
        link.after(dl);
      });
    }

    document.querySelector("#fileType").textContent = file.language;
    document.querySelector("#cursorPosition").textContent = activeFile.startsWith("experience/") || activeFile === "education.md" ? "Ln 4, Col 12" : "Ln 1, Col 1";
    document.querySelector("#branchName").textContent = activeFile.includes("projects/") ? "feature/project-case-study" : "career/senior-backend";
  }, 120);
}

function renderTabs() {
  tabsEl.innerHTML = openTabs.map((fileName) => `
    <button class="tab ${fileName === activeFile ? "active" : ""}" type="button" role="tab" aria-selected="${fileName === activeFile}" data-tab="${fileName}">
      <span>${fileName.split("/").pop()}</span><span class="tab-close">x</span>
    </button>
  `).join("") + `
    <div class="view-toggle">
      <button type="button" class="${previewMode ? "active" : ""}" data-view="preview">Preview</button>
      <button type="button" class="${previewMode ? "" : "active"}" data-view="raw">Raw</button>
    </div>
  `;
}

let hasShownHelp = false;

function renderTerminal() {
  const lines = [];

  if (lastEchoedCommand) {
    lines.push(`$ ${lastEchoedCommand}`, "");
  }

  if (!hasShownHelp) {
    lines.push(
      "available commands:",
      "  help                show this help",
      "  ls                  list file tree",
      "  ls projects/        browse projects",
      "  ls experience/      browse experience",
      "  whoami              about me",
      "  resume              download resume",
      "  contact             contact info",
      "  coffee              ☕",
      "  uptime              career uptime",
      "  cat [file]          open any file",
      ""
    );
    hasShownHelp = true;
  }

  lines.push(...files[activeFile].terminal);

  const output = lines.map((line) => {
    const safe = escapeHtml(line);
    if (line.startsWith("$")) return `<span class="cmd">${safe}</span>`;
    if (line.includes("ok") || line.startsWith("> status")) return `<span class="ok">${safe}</span>`;
    if (line.startsWith("HTTP") || line.includes("result:")) return `<span class="warn">${safe}</span>`;
    return safe;
  }).join("\n");

  terminalOutput.innerHTML = output;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function setActiveFile(fileName, echo = null) {
  if (!openTabs.includes(fileName)) openTabs.push(fileName);
  activeFile = fileName;
  lastEchoedCommand = echo;
  renderTabs();
  renderEditor();
  renderTerminal();

  fileButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.file === fileName);
  });

  if (window.matchMedia("(max-width: 920px)").matches) {
    sidebar.classList.remove("open");
    mobileToggle.setAttribute("aria-expanded", "false");
  }
}

fileButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveFile(button.dataset.file));
});

tabsEl.addEventListener("click", (event) => {
  const toggleBtn = event.target.closest("[data-view]");
  if (toggleBtn) {
    const view = toggleBtn.dataset.view;
    previewMode = view === "preview";
    renderTabs();
    renderEditor();
    return;
  }

  const tab = event.target.closest(".tab");
  if (!tab) return;

  if (event.target.matches(".tab-close")) {
    const closingFile = tab.dataset.tab;
    if (openTabs.length === 1) return;

    openTabs.splice(openTabs.indexOf(closingFile), 1);
    if (closingFile === activeFile) activeFile = openTabs[openTabs.length - 1];
    setActiveFile(activeFile);
    return;
  }

  setActiveFile(tab.dataset.tab);
});

document.querySelectorAll(".folder-label").forEach((label) => {
  label.addEventListener("click", () => {
    const folderFiles = label.nextElementSibling;
    const isOpen = !folderFiles.hidden;
    folderFiles.hidden = isOpen;
    label.setAttribute("aria-expanded", String(!isOpen));
  });
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => runCommand(button.dataset.command));
});

if (terminalHint) {
  terminalHint.querySelector(".hint-close").addEventListener("click", dismissHint);
  terminalHint.querySelectorAll("[data-hint-cmd]").forEach((button) => {
    button.addEventListener("click", () => {
      terminalInput.value = button.dataset.hintCmd;
      terminalInput.focus();
    });
  });
}

function generateFileTree() {
  const keys = Object.keys(files).sort();
  const dirs = {};
  for (const key of keys) {
    const parts = key.split("/");
    if (parts.length === 1) {
      dirs[key] = true;
    } else {
      const d = parts[0];
      if (!dirs[d]) dirs[d] = [];
      dirs[d].push(parts[1]);
    }
  }

  const entries = Object.keys(dirs).sort();
  const tree = [".", ""];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isLast = i === entries.length - 1;
    const prefix = isLast ? "└── " : "├── ";

    if (Array.isArray(dirs[entry])) {
      tree.push(prefix + entry + "/");
      const filesList = dirs[entry].sort();
      for (let j = 0; j < filesList.length; j++) {
        const isFileLast = j === filesList.length - 1;
        const indent = isLast ? "    " : "│   ";
        tree.push(indent + (isFileLast ? "└── " : "├── ") + filesList[j]);
      }
    } else {
      tree.push(prefix + entry);
    }
  }

  return escapeHtml(tree.join("\n"));
}

function generateCommandsHelp() {
  return [
    "  help                show this help",
    "  ls                  list file tree",
    "  ls projects/        browse projects",
    "  ls experience/      browse experience",
    "  whoami              about me",
    "  resume              download resume",
    "  contact             contact info",
    "  coffee              ☕",
    "  uptime              career uptime",
    "  cat [file]          open any file",
  ].join("\n");
}

function runCommand(command) {
  const normalized = command.trim();
  terminalForm.classList.remove("invalid");

  if (normalized === "ls") {
    terminalInput.value = "";
    terminalOutput.innerHTML += `\n<span class="cmd">$ ls</span>\n${generateFileTree()}\n`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return true;
  }

  if (normalized === "help") {
    terminalInput.value = "";
    terminalOutput.innerHTML += `\n<span class="cmd">$ help</span>\n${generateCommandsHelp()}\n`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return true;
  }

  if (normalized === "resume") {
    terminalInput.value = "";
    terminalOutput.innerHTML += `\n<span class="cmd">$ resume</span>\nopening resume.pdf...\n`;
    const link = document.querySelector('.status-bar a[download]') || document.querySelector('.dl-link');
    if (link) link.click();
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return true;
  }

  if (normalized === "contact") {
    terminalInput.value = "";
    terminalOutput.innerHTML += `\n<span class="cmd">$ contact</span>\nPhone: +91 9619654093\nEmail: aadityahemant24@gmail.com\nWebsite: https://aadityah24.github.io/IDE-Style-Self/\nLinkedIn: https://linkedin.com/in/aaditya-hemant\nGitHub: https://github.com/aaditya-hemant\n`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return true;
  }

  if (normalized === "coffee") {
    terminalInput.value = "";
    terminalOutput.innerHTML += `\n<span class="cmd">$ coffee</span>\n☕ Brewing...\nCoffee acquired.\nProductivity +15%\n`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return true;
  }

  if (normalized === "uptime") {
    terminalInput.value = "";
    terminalOutput.innerHTML += `\n<span class="cmd">$ uptime</span>\nCareer Uptime\nSince Jan 2023\n3 Years 6 Months\nNo critical outages.\n`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return true;
  }

  if (normalized === "ls experience/") {
    terminalInput.value = "";
    terminalOutput.innerHTML += `\n<span class="cmd">$ ls experience/</span>\nexperience/\n├── bajaj-finserv.md\n└── atsuya.md\n`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    return true;
  }

  const nextFile = commands[normalized];

  if (!nextFile) {
    terminalForm.classList.add("invalid");
    return false;
  }

  terminalInput.value = "";
  setActiveFile(nextFile, normalized);
  return true;
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runCommand(terminalInput.value);
});

terminalInput.addEventListener("input", () => {
  terminalForm.classList.remove("invalid");
});

editorBody.addEventListener("click", async (event) => {
  const copyBtn = event.target.closest(".copy-btn");
  if (!copyBtn) return;

  const text = copyBtn.dataset.copyText;
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else {
    const selection = window.getSelection();
    const range = document.createRange();
    const prev = copyBtn.previousElementSibling;
    if (prev) range.selectNodeContents(prev);
    else range.selectNodeContents(copyBtn);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
  }

  const svg = copyBtn.querySelector("svg");
  const orig = svg.innerHTML;
  svg.innerHTML = `<polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  window.setTimeout(() => { svg.innerHTML = orig; }, 1400);
});

mobileToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
});

renderTabs();
renderEditor();
renderTerminal();
terminalInput.focus();
