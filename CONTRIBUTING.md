# Contributing to Psych for LLM

Thank you for helping keep this research map useful and grounded. You do not need to be a programmer to contribute.

## Suggestion route

Open a **Suggest a paper** issue and complete the prompts. This is best for a single paper or when you are unsure which map node fits. A maintainer will review the paper and, if accepted, create the structured record.

## Pull request route

Use this route for one or more ready-to-review records.

1. Create one JSON file per paper using `docs/paper-template.json`.
2. Use a lowercase, hyphenated `id` and the same value for the filename.
3. Choose only map connections that the paper substantively uses. Merely mentioning a psychological term is not enough.
4. Add the ID to the matching `paperIds` arrays in `data/research-map.json`.
5. Run:

   ```bash
   npm install
   npm run data:index
   npm run data:validate
   npm run lint
   npm test
   ```

6. Explain the construct-to-computation mapping and the evidence in the pull request.

## Scope

Good candidates use, operationalize, evaluate, critique, or meaningfully extend a psychological theory in LLM research. Work that only uses psychological vocabulary as a metaphor, lacks a traceable publication, or makes claims unsupported by its evidence may be declined.

The maintainer applies [REVIEW_RUBRIC.md](REVIEW_RUBRIC.md). Review is about fit and evidence, not whether the results agree with the survey authors.

## Proposing a new theory node

Open an issue before editing the map. Include a source-discipline definition, why existing nodes do not fit, at least one eligible LLM paper, and any known validity debate around the construct.

## Respectful collaboration

Critique claims and methods, not people. Disclose conflicts of interest, including authorship of a suggested paper. Do not upload publisher PDFs or copyrighted full text to this repository.
