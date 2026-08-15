import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "paper-source");
const overviewPath = path.join(sourceRoot, "graph", "overview.tex");
const papersDir = path.join(root, "papers");
const dataDir = path.join(root, "data");

const connections = [
  ["preprocessing", "Data collection", "developmental", "Ecological validity"],
  ["preprocessing", "Data collection", "developmental", "Incremental numerical cognition"],
  ["preprocessing", "Data preprocessing", "cognitive", "Selective attention"],
  ["preprocessing", "Data preprocessing", "cognitive", "Predictive coding"],
  ["pretraining", "Observational learning", "developmental", "Cognitive development"],
  ["pretraining", "Observational learning", "developmental", "Scaffolding theory"],
  ["pretraining", "Knowledge acquisition", "cognitive", "Top-down perception"],
  ["posttraining", "Supervised fine-tuning", "cognitive", "Memory"],
  ["posttraining", "RLHF", "behavioral", "Operant conditioning"],
  ["posttraining", "RLHF", "behavioral", "Thorndike’s law of effect"],
  ["evaluation", "Capability assessment", "cognitive", "Memory"],
  ["evaluation", "Capability assessment", "cognitive", "Cognitive maturity"],
  ["evaluation", "Capability assessment", "social", "Theory of Mind"],
  ["evaluation", "Capability assessment", "social", "Conformity theories"],
  ["evaluation", "Capability assessment", "social", "Social identity theory"],
  ["evaluation", "Capability assessment", "personality", "Big Five personality traits"],
  ["evaluation", "Capability assessment", "personality", "EPQR-A"],
  ["evaluation", "Capability assessment", "psycholinguistics", "Poverty of the stimulus"],
  ["evaluation", "Capability assessment", "psycholinguistics", "Conversational implicature"],
  ["evaluation", "Task enhancement", "cognitive", "Perception and attention"],
  ["evaluation", "Task enhancement", "cognitive", "Memory"],
  ["evaluation", "Task enhancement", "social", "Dual-process"],
  ["evaluation", "Task enhancement", "social", "Self-reflection"],
  ["evaluation", "Task enhancement", "social", "Theory of Mind"],
  ["evaluation", "Task enhancement", "personality", "MBTI"],
  ["evaluation", "Task enhancement", "personality", "Big Five personality traits"],
  ["evaluation", "Collaborative multi-agent", "social", "Persuasion models"],
  ["evaluation", "Collaborative multi-agent", "social", "Theory of Mind"],
  ["evaluation", "Collaborative multi-agent", "personality", "Big Five personality traits"],
].map(([stage, category, area, theory], index) => ({
  id: `${stage}-${slug(category)}-${slug(theory)}`,
  figureOrder: index + 1,
  stage,
  category,
  area,
  theory,
}));

function slug(value) {
  return value
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function cleanLatex(value = "") {
  return value
    .replace(/[{}]/g, "")
    .replace(/\\&/g, "&")
    .replace(/\\text(?:it|bf|tt)\s*/g, "")
    .replace(/\\url\s*/g, "")
    .replace(/---/g, "—")
    .replace(/--/g, "–")
    .replace(/\\['"`^~=.]\s*([A-Za-z])/g, "$1")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resolvePaperUrl(entry, citationKey) {
  const rawUrl = (entry.url || "").trim();
  const anthology = rawUrl.match(/(?:anth|aclanthology)\s*#\s*\{([^}]+)\}/i);
  if (anthology) return `https://aclanthology.org/${anthology[1]}`;
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl.replace(/[{}]/g, "");
  if (entry.doi) return `https://doi.org/${entry.doi.replace(/[{}]/g, "")}`;
  if (/^10\.\d{4,9}\//.test(citationKey)) return `https://doi.org/${citationKey}`;
  if (entry.eprint && /\d{4}\.\d{4,5}/.test(entry.eprint)) {
    return `https://arxiv.org/abs/${entry.eprint.replace(/[{}]/g, "")}`;
  }
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(cleanLatex(entry.title))}`;
}

function parseBibtex(text) {
  const entries = new Map();
  let cursor = 0;
  while (cursor < text.length) {
    const at = text.indexOf("@", cursor);
    if (at < 0) break;
    const open = text.indexOf("{", at);
    if (open < 0) break;
    const type = text.slice(at + 1, open).trim().toLowerCase();
    if (["comment", "preamble", "string"].includes(type)) {
      cursor = open + 1;
      continue;
    }
    let depth = 1;
    let quote = false;
    let i = open + 1;
    for (; i < text.length && depth > 0; i += 1) {
      const char = text[i];
      if (char === '"' && text[i - 1] !== "\\") quote = !quote;
      if (!quote && char === "{") depth += 1;
      if (!quote && char === "}") depth -= 1;
    }
    const body = text.slice(open + 1, i - 1);
    const comma = body.indexOf(",");
    if (comma > 0) {
      const key = body.slice(0, comma).trim();
      const fields = parseFields(body.slice(comma + 1));
      if (!entries.has(key)) entries.set(key, { type, key, ...fields });
    }
    cursor = i;
  }
  return entries;
}

function parseFields(body) {
  const fields = {};
  let cursor = 0;
  while (cursor < body.length) {
    const match = /([a-zA-Z][\w-]*)\s*=\s*/y;
    match.lastIndex = cursor;
    const found = match.exec(body);
    if (!found) {
      cursor += 1;
      continue;
    }
    const name = found[1].toLowerCase();
    cursor = match.lastIndex;
    let value = "";
    if (body[cursor] === "{") {
      let depth = 1;
      const start = ++cursor;
      while (cursor < body.length && depth > 0) {
        if (body[cursor] === "{") depth += 1;
        if (body[cursor] === "}") depth -= 1;
        cursor += 1;
      }
      value = body.slice(start, cursor - 1);
    } else if (body[cursor] === '"') {
      const start = ++cursor;
      while (cursor < body.length && (body[cursor] !== '"' || body[cursor - 1] === "\\")) cursor += 1;
      value = body.slice(start, cursor);
      cursor += 1;
    } else {
      const start = cursor;
      while (cursor < body.length && body[cursor] !== "," && body[cursor] !== "\n") cursor += 1;
      value = body.slice(start, cursor).trim();
    }
    fields[name] = value;
    while (cursor < body.length && /[\s,]/.test(body[cursor])) cursor += 1;
  }
  return fields;
}

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(target));
    else result.push(target);
  }
  return result;
}

const overview = await readFile(overviewPath, "utf8");
const citationGroups = [...overview.matchAll(/\\citep\{([^}]+)\}/g)].map((match) =>
  [...new Set(match[1].split(",").map((key) => key.trim()).filter(Boolean))]
);

if (citationGroups.length !== connections.length) {
  throw new Error(`Expected ${connections.length} Figure 1 citation groups; found ${citationGroups.length}.`);
}

const bibFiles = (await walk(sourceRoot)).filter((file) => file.endsWith(".bib"));
const bibliography = new Map();
for (const file of bibFiles) {
  const parsed = parseBibtex(await readFile(file, "utf8"));
  for (const [key, value] of parsed) if (!bibliography.has(key)) bibliography.set(key, value);
}

const papers = new Map();
const mapGroups = connections.map((connection, index) => {
  const paperIds = citationGroups[index].map((citationKey) => {
    const entry = bibliography.get(citationKey);
    if (!entry) throw new Error(`Missing BibTeX entry: ${citationKey}`);
    const id = slug(citationKey);
    const existing = papers.get(id);
    const link = resolvePaperUrl(entry, citationKey);
    const paper = existing ?? {
      id,
      citationKey,
      title: cleanLatex(entry.title),
      authors: cleanLatex(entry.author),
      year: Number.parseInt(entry.year, 10) || null,
      venue: cleanLatex(entry.booktitle || entry.journal || entry.publisher || ""),
      url: link,
      doi: entry.doi || null,
      source: { survey: "2026.eacl-long.350", figure: "Figure 1" },
      connections: [],
    };
    paper.connections.push(connection.id);
    papers.set(id, paper);
    return id;
  });
  return { ...connection, paperIds };
});

await rm(papersDir, { recursive: true, force: true });
await mkdir(papersDir, { recursive: true });
await mkdir(dataDir, { recursive: true });
const sortedPapers = [...papers.values()].sort((a, b) => a.id.localeCompare(b.id));
for (const paper of sortedPapers) {
  await writeFile(path.join(papersDir, `${paper.id}.json`), `${JSON.stringify(paper, null, 2)}\n`);
}
await writeFile(path.join(dataDir, "research-map.json"), `${JSON.stringify(mapGroups, null, 2)}\n`);
await writeFile(path.join(dataDir, "papers.json"), `${JSON.stringify(sortedPapers, null, 2)}\n`);
console.log(`Built ${sortedPapers.length} unique papers across ${mapGroups.length} Figure 1 theory groups.`);
