import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const directory = path.join(root, "papers");
const filenames = (await readdir(directory)).filter((name) => name.endsWith(".json")).sort();
const papers = [];
for (const filename of filenames) {
  papers.push(JSON.parse(await readFile(path.join(directory, filename), "utf8")));
}
await writeFile(path.join(root, "data", "papers.json"), `${JSON.stringify(papers, null, 2)}\n`);
console.log(`Indexed ${papers.length} paper records.`);
