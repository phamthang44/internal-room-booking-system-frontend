# Graphify Coding Workflow

Use this as the default routine for feature work, refactors, and debugging.

## Trigger-First Rules (Daily)

Use these as non-optional triggers:

- **Whenever I add, update, or refactor a feature**
  - run scoped Graphify kickoff first
  - run incremental update after each edit batch
- **Whenever I commit with git**
  - run pre-commit graph gate first (`graphify --update <scope>`, `npm run type-check`, report review)
  - recommended one-time automation: `graphify hook install`
- **Whenever I prompt to setup**
  - set up/refresh rules, skills, workflow docs, and scoped graph baseline

## 1) Start Of Task

- Decide scope first:
  - `src/core` for infrastructure/routing/auth
  - `src/features/<feature-name>` for product work
- Build graph if missing:
  - `graphify <scope>`
- If graph already exists:
  - `graphify --update <scope>`

## 2) Understand Before Editing

- Ask broad flow questions:
  - `graphify query "How does booking creation work?"`
- Trace dependencies:
  - `graphify path "entry point" "target module"`
- Deep dive one concept:
  - `graphify explain "symbol or concept"`

Goal: identify likely blast radius before touching code.

## 3) Implement In Batches

After each meaningful batch of edits:

- Run:
  - `graphify --update <scope>`
- Check:
  - New God Nodes (unexpected coupling)
  - Surprising Connections (new hidden dependencies)
  - Suggested Questions (new risk areas)

## 4) Pre-Commit Gate

Before commit or PR:

1. `graphify --update <scope>`
2. Re-read `graphify-out/GRAPH_REPORT.md`
3. Verify:
   - intended architecture change only
   - no accidental cross-feature coupling
   - no unexpected bridge node growth
4. Run `npm run type-check` (and `npm run build` for risky changes)

## 5) Voice-Friendly Prompts You Can Use

Say these naturally in chat:

- "Start a new feature in `<feature>` with graphify-first workflow."
- "Map current flow before I edit `<module>`."
- "Check what can break if I change `<symbol>`."
- "Update graph and tell me new risks after my changes."
- "Give me pre-commit graphify safety check."

## 6) Suggested Team Ritual

- Start of day: update graph for active scope.
- Before risky refactor: run `query` + `path` checks.
- End of day: run `--update` and leave one-line findings in PR notes.

