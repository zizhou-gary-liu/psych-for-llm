# Psych for LLM

An open, interactive companion to **“A Review of Incorporating Psychological Theories in LLMs”** (EACL 2026).

The website helps researchers explore where psychological theory appears across the LLM lifecycle, open the underlying papers, and check whether a multidisciplinary claim is properly grounded. This repository is the source of truth for the website and a reviewable path for keeping the survey alive.

- [Open the paper](https://aclanthology.org/2026.eacl-long.350/)
- [Explore the local website](http://localhost:3005/)
- [Suggest a paper](https://github.com/zizhou-gary-liu/psych-for-llm/issues/new?template=suggest-paper.yml)

## What is included

- **227 papers** reviewed in the published survey.
- **126 unique papers** explicitly linked from the 29 theory nodes in Figure 1 and currently available as structured records in `papers/`.
- An interactive map covering six psychology areas and four LLM development stages.
- A grounding lab and study-design checklist for young researchers.

The 126-paper Figure 1 set is the high-confidence first release. Reconstructing and checking the complete canonical 227-paper list is tracked separately so the two counts are never conflated.

## Contribute a paper

The easiest route is the [paper suggestion form](https://github.com/zizhou-gary-liu/psych-for-llm/issues/new?template=suggest-paper.yml). A pull request is welcome if you prefer structured data:

1. Copy `docs/paper-template.json` into `papers/<paper-id>.json`.
2. Connect it to one or more IDs in `data/research-map.json`.
3. Add the paper ID to each matching map group’s `paperIds` list.
4. Run `npm run data:index` and `npm run data:validate`.
5. Open a pull request and explain the grounding between the psychological construct and the LLM work.

Merging is the review decision: records on the default branch have passed the project’s relevance and grounding rubric. See [CONTRIBUTING.md](CONTRIBUTING.md) and [REVIEW_RUBRIC.md](REVIEW_RUBRIC.md).

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3005/` (or the port printed by the development server).

Before a pull request:

```bash
npm run data:index
npm run data:validate
npm run lint
npm test
```

## How the project stays lightweight

There is no paid database or submission backend. Paper records are plain JSON, GitHub Issues and pull requests handle contributions, GitHub Actions checks changes, and the website is generated from the reviewed files on the default branch.

## Citation

```bibtex
@inproceedings{liu-etal-2026-review,
  title = {A Review of Incorporating Psychological Theories in LLMs},
  author = {Liu, Zizhou and Gong, Ziwei and Ai, Lin and Hui, Zheng and Chen, Run and Leach, Colin Wayne and Greene, Michelle R. and Hirschberg, Julia},
  booktitle = {Proceedings of the 19th Conference of the European Chapter of the Association for Computational Linguistics},
  year = {2026},
  pages = {7459--7495},
  url = {https://aclanthology.org/2026.eacl-long.350/}
}
```

## License

Code in this repository is released under the [MIT License](LICENSE). Bibliographic facts and links remain attributable to their original publications; the paper and publisher-hosted PDFs retain their own terms.
