const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

marked.setOptions({ breaks: true });

const root = path.resolve(__dirname, "..");
const details = path.join(root, "public", "personal-details");

function read(pathname) {
  return fs.readFileSync(path.join(details, pathname), "utf-8").trimEnd();
}

function readProject(name) {
  const dir = path.join(details, "projects", name);
  const readme = fs.readFileSync(path.join(dir, "README.md"), "utf-8");
  let arch = "";
  try { arch = fs.readFileSync(path.join(dir, "architecture.md"), "utf-8"); } catch {}
  let metrics = "";
  try { metrics = fs.readFileSync(path.join(dir, "metrics.json"), "utf-8"); } catch {}
  return { readme, arch, metrics };
}

const about = read("ABOUT.md");

const expBajaj = read("experience/bajaj-finserv.md");
const expAtsuya = read("experience/atsuya.md");

const education = read("education.md");

const cachePlatform = readProject("cache-platform");
const aiCli = readProject("ai-cli");
const contentMigration = readProject("content-migration");
const runClub = readProject("run-club");

const skillsSource = read("skills/index.ts");

// ── Build files object ─────────────────────────────────

const files = {};

files["about.md"] = {
  type: "Markdown",
  language: "Markdown",
  lines: about.split("\n"),
  html: marked.parse(about),
  terminal: [
    "> loading profile...",
    "> status: online",
    "",
    "$ whoami",
    "aaditya-hemant",
    "",
    "$ pwd",
    "/resume/software-engineer",
  ],
};

// ── Experience files ────────────────────────────────────

const experienceFiles = [
  {
    key: "experience/bajaj-finserv.md",
    content: expBajaj,
    terminalLines: [
      "$ cat experience/bajaj-finserv.md",
      "senior-software-engineer at Bajaj Finserv",
      "shipped cache management platform v2",
      "software-engineer at Bajaj Finserv",
      "sso-integration across partner apps",
      "",
      "career history loaded",
    ],
  },
  {
    key: "experience/atsuya.md",
    content: expAtsuya,
    terminalLines: [
      "$ cat experience/atsuya.md",
      "ml-intern at Atsuya Technologies",
      "time-series forecasting & anomaly detection",
      "",
      "internship completed dec 2021",
    ],
  },
];

for (const exp of experienceFiles) {
  files[exp.key] = {
    type: "Markdown",
    language: "Markdown",
    lines: exp.content.split("\n"),
    html: marked.parse(exp.content),
    terminal: exp.terminalLines,
  };
}

// ── Education file ──────────────────────────────────────

files["education.md"] = {
  type: "Markdown",
  language: "Markdown",
  lines: education.split("\n"),
  html: marked.parse(education),
  terminal: [
    "$ cat education.md",
    "VIT Chennai — BTech CSE (AI & ML), CGPA 9.01",
    "Bhatia College — HSC Science",
    "St. Joseph's — SSC",
    "",
    "education summary loaded",
  ],
};

const projects = [
  {
    key: "projects/cache-platform.md",
    name: "Cache Operations Platform",
    data: cachePlatform,
    termStack: "aws-lambda step-functions sqs akamai aem elasticsearch newrelic",
    termResult: "automated enterprise cache ops across multiple domains",
  },
  {
    key: "projects/ai-cli.md",
    name: "AI CLI",
    data: aiCli,
    termStack: "python nodejs git github-actions ollama claude",
    termResult: "40% faster prototyping, parallel worktree workflows",
  },
  {
    key: "projects/content-migration.md",
    name: "Content Migration Engine",
    data: contentMigration,
    termStack: "aws-lambda step-functions sqs s3 aem cf360",
    termResult: "120K+ pages migrated, 98 component types",
  },
  {
    key: "projects/run-club.md",
    name: "Run Club",
    data: runClub,
    termStack: "nextjs typescript tailwindcss netlify",
    termResult: "40+ runners at launch, bi-weekly social runs",
  },
];

for (const p of projects) {
  const projLines = p.data.readme.split("\n");
  if (p.data.arch) {
    projLines.push("", "---", "", "# Architecture");
    projLines.push(...p.data.arch.split("\n"));
  }
  if (p.data.metrics) {
    projLines.push("", "---", "", "# Metrics");
    try {
      const m = JSON.parse(p.data.metrics);
      projLines.push(JSON.stringify(m, null, 2));
    } catch {
      projLines.push(p.data.metrics);
    }
  }

  files[p.key] = {
    type: "Markdown",
    language: "Markdown",
    lines: projLines,
    html: marked.parse(projLines.join("\n")),
    terminal: [
      `$ npm run build -- ${p.name.toLowerCase().replace(/\s+/g, "-")}`,
      "compile... ok",
      "validate... ok",
      "deploy... ok",
      "",
      `stack: ${p.termStack}`,
      `result: ${p.termResult}`,
    ],
  };
}

// Combine skills into a JSON display
const skillsJson = (() => {
  try {
    const parseTs = (src) => new Function(src.replace(/^export\s+const\s+\w+\s*=\s*/, "return ").replace(/;$/, ""))();
    return parseTs(skillsSource);
  } catch { return {}; }
})();

files["skills.json"] = {
  type: "JSON",
  language: "JSON",
  code: JSON.stringify(skillsJson, null, 2).split("\n"),
  terminal: [
    "$ jq '.cloud.aws' skills.json",
    '["Lambda", "Step Functions", "SQS", "API Gateway", "S3"]',
    "",
    "$ jq '.languages' skills.json",
    '["Python", "JavaScript", "TypeScript", "Go", "SQL"]',
    "",
    "$ jq '.expertise' skills.json",
    '["Distributed Systems", "Serverless Architectures", "Event-Driven Systems", ...]',
  ],
};

files["contact.md"] = {
  type: "Markdown",
  language: "Markdown",
  lines: [
    "# Contact",
    "",
    "Phone: +91 9619654093",
    "Email: aadityahemant24@gmail.com",
    "LinkedIn: https://linkedin.com/in/aaditya-hemant",
    "GitHub: https://github.com/aaditya-hemant",
    "[Download Resume](./resume.pdf)",
    "",
    "Open to software engineering, backend, platform, and distributed systems roles.",
  ],
  html: marked.parse([
    "# Contact",
    "",
    "Phone: +91 9619654093",
    "Email: aadityahemant24@gmail.com",
    "LinkedIn: https://linkedin.com/in/aaditya-hemant",
    "GitHub: https://github.com/aaditya-hemant",
    "[Download Resume](./resume.pdf)",
    "",
    "Open to software engineering, backend, platform, and distributed systems roles.",
  ].join("\n")),
  terminal: [
    "$ curl /api/contact",
    "HTTP/1.1 200 OK",
    "content-type: application/json",
    "",
    "{",
    '  "email": "aadityahemant24@gmail.com",',
    '  "phone": "+91 9619654093",',
    '  "linkedin": "https://linkedin.com/in/aaditya-hemant",',
    '  "github": "https://github.com/aaditya-hemant"',
    "}",
  ],
};

// ── Build commands map ─────────────────────────────────

const commands = {
  whoami: "about.md",
  "cat about.md": "about.md",
  "git log --oneline": "experience/bajaj-finserv.md",
  "cat experience/bajaj-finserv.md": "experience/bajaj-finserv.md",
  "cat experience/atsuya.md": "experience/atsuya.md",
  "cat education.md": "education.md",
  "ls projects/": Object.keys(files).find((k) => k.startsWith("projects/")) || "projects/cache-platform.md",
  "cat projects/cache-platform.md": "projects/cache-platform.md",
  "cat projects/ai-cli.md": "projects/ai-cli.md",
  "cat projects/cms-migration.md": "projects/cms-migration.md",
  "cat skills.json": "skills.json",
  "cat contact.md": "contact.md",
  "cat resume.pdf": "contact.md",
};

// Add commands for all project and experience files
for (const k of Object.keys(files)) {
  if (k.startsWith("projects/") && !commands[`cat ${k}`]) {
    commands[`cat ${k}`] = k;
  }
  if (k.startsWith("experience/") && !commands[`cat ${k}`]) {
    commands[`cat ${k}`] = k;
  }
}

// Copy resume PDF to root for download
const srcPdf = path.join(details, "docs", "resume.pdf");
const dstPdf = path.join(root, "resume.pdf");
try {
  fs.copyFileSync(srcPdf, dstPdf);
  console.log("✓ resume.pdf copied to root");
} catch (e) {
  console.warn("⚠ resume.pdf not found at", srcPdf);
}

// ── Write data.js ──────────────────────────────────────

const output = `window.resumeData = ${JSON.stringify({ files, commands }, null, 2)};`;

fs.writeFileSync(path.join(root, "data.js"), output, "utf-8");
console.log("✓ data.js generated");
