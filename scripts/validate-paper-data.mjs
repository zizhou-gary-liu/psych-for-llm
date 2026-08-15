import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const paperFiles = (await readdir(path.join(root, "papers"))).filter((name) => name.endsWith(".json"));
const ids = new Set();
const citationKeys = new Set();
const allowedAreas = new Set(["developmental", "behavioral", "cognitive", "social", "personality", "psycholinguistics"]);
const map = JSON.parse(await readFile(path.join(root, "data", "research-map.json"), "utf8"));
const groupIds = new Set(map.map((group) => group.id));
if (groupIds.size !== map.length) throw new Error("data/research-map.json contains duplicate group ids");

for (const filename of paperFiles) {
  const paper = JSON.parse(await readFile(path.join(root, "papers", filename), "utf8"));
  for (const field of ["id", "citationKey", "title", "authors", "url"]) {
    if (!paper[field]) throw new Error(`${filename}: missing ${field}`);
  }
  if (!/^https?:\/\//.test(paper.url)) throw new Error(`${filename}: url must be an absolute HTTP(S) link`);
  if (ids.has(paper.id)) throw new Error(`${filename}: duplicate id ${paper.id}`);
  if (citationKeys.has(paper.citationKey)) throw new Error(`${filename}: duplicate citation key ${paper.citationKey}`);
  if (`${paper.id}.json` !== filename) throw new Error(`${filename}: filename must match paper id`);
  if (!Array.isArray(paper.connections) || !paper.connections.length) throw new Error(`${filename}: no map connections`);
  for (const connection of paper.connections) {
    if (!groupIds.has(connection)) throw new Error(`${filename}: unknown connection ${connection}`);
  }
  ids.add(paper.id);
  citationKeys.add(paper.citationKey);
}

for (const group of map) {
  if (!allowedAreas.has(group.area)) throw new Error(`${group.id}: invalid area ${group.area}`);
  if (!Array.isArray(group.paperIds) || !group.paperIds.length) throw new Error(`${group.id}: empty paper list`);
  for (const id of group.paperIds) if (!ids.has(id)) throw new Error(`${group.id}: unknown paper ${id}`);
}

const generated = JSON.parse(await readFile(path.join(root, "data", "papers.json"), "utf8"));
if (generated.length !== paperFiles.length) throw new Error("data/papers.json is out of date");
console.log(`Validated ${paperFiles.length} papers and ${map.length} map groups.`);
