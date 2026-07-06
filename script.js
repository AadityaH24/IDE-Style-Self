const data = window.resumeData;
const files = data.files;
const email = (files["contact.md"].lines.find(l => l.startsWith("Email:")) || "").replace("Email: ", "").trim();

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
    const body = file.html && previewMode
      ? `<div class="markdown-preview">${file.html}</div>`
      : (file.code || file.lines).map((line, index) => renderLine(
          file.lines ? escapeHtml(line) : highlightCode(line), index
        )).join("");

    editorBody.innerHTML = body;
    editorBody.classList.remove("fading");

    // inject email copy button next to mailto link
    if (file.html && previewMode) {
      const mailto = editorBody.querySelector('a[href^="mailto:"]');
      if (mailto && !mailto.nextElementSibling?.classList.contains("copy-email")) {
        const btn = document.createElement("button");
        btn.className = "copy-email";
        btn.textContent = "copy";
        mailto.after(btn);
      }
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
      "  ls                  list file tree",
      "  help                show this help",
      "  whoami              about me",
      "  git log --oneline   career history",
      "  ls projects/        browse projects",
      "  cat about.md",
      "  cat experience/bajaj-finserv.md",
      "  cat experience/atsuya.md",
      "  cat education.md",
      "  cat skills.json",
      "  cat contact.md",
      "  cat resume.pdf",
      "  cat projects/<name> open any project",
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

document.querySelector(".folder-label").addEventListener("click", (event) => {
  const folderFiles = event.currentTarget.nextElementSibling;
  const isOpen = folderFiles.hidden;
  folderFiles.hidden = !isOpen;
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
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
    "  ls                  list file tree",
    "  help                show this help",
    "  whoami              about me",
    "  git log --oneline   career history",
    "  ls projects/        browse projects",
    "  cat <file>          open any file",
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
  if (!event.target.matches(".copy-email")) return;

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(email);
  } else {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(event.target.previousElementSibling);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
  }

  event.target.textContent = "copied";
  window.setTimeout(() => {
    event.target.textContent = "copy";
  }, 1400);
});

mobileToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
});

renderTabs();
renderEditor();
renderTerminal();
terminalInput.focus();
