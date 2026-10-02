# Stronghold and Resilience — Book Plan

## Goal
Create 10-chapter technical book in `docs/book/stronghold/` on Theme: Stronghold and Resilience, blending physical fortification + human/organizational resilience, following `ai/Agents/AGENT_TECHNICAL_TOPIC.md`.

## Constraints (from AGENT_TECHNICAL_TOPIC.md)
- Designated folder only: `docs/book/stronghold/` — one file per chapter.
- 800–1500 words per chapter.
- Neutral, high-precision, third-person expository voice. No `I/me/my/we/our`.
- No personal anecdotes, opinions, emotional appeals, conversational filler.
- Clean structured Markdown for technical docs. Return only chapter content per generation.
- Do NOT adjust any `config.ts`. Isolated topic: do not read/reference other folders during writing.
- Filename convention (user decision): `01-slug.md` style (wealth-book pattern), not `chapter-01-` prefix.

## Approved Scope
Blended physical + human (user-approved):
- Physical: site selection, layered fortification, perimeter, sustainment, active defense.
- Human/systems: command/comms/continuity, stress physiology, cohesion/leadership, adaptation/recovery, training.

## Approved Outline (10 chapters)
1. `01-foundations-of-strongholds.md` — Foundations of Strongholds: definitions, stronghold vs shelter vs base, resilience principles, purpose/direction/tempo/protection/sustainment adapted to holding.
2. `02-site-selection-terrain.md` — Site Selection & Terrain: topography, hydrology, access/chokepoints, concealment, urban vs rural vs elevated.
3. `03-layered-fortification-perimeter.md` — Layered Fortification & Perimeter: outer/middle/inner rings, barriers, hardening, fields of observation/fire, redundancy.
4. `04-sustainment-under-siege.md` — Sustainment Under Siege: water, food, power, medical, stockpiling ratios, rationing, resupply denial scenarios.
5. `05-security-active-defense.md` — Security & Active Defense: access control, patrols, sensors/watches, response drills, deception vs exposure.
6. `06-command-comms-continuity.md` — Command, Comms & Continuity: decision structure, redundant comms, records, succession, degraded-ops protocols.
7. `07-individual-resilience-stress.md` — Individual Resilience Under Stress: stress physiology, sleep/fatigue, cognitive degradation, coping mechanisms, routines.
8. `08-team-cohesion-leadership.md` — Team Cohesion & Leadership: roles, trust, conflict under confinement, morale maintenance, leadership rotation.
9. `09-adaptation-recovery.md` — Adaptation & Recovery: damage assessment, expedient repair, breakout vs endure decisions, post-event recovery phases.
10. `10-training-long-term-holding.md` — Training & Long-Term Holding: drills, evaluation metrics, maintenance cycles, psychological endurance for prolonged holding.

Each file: H1 title, brief objective header, 5–7 H2 sections (definitions, mechanisms, comparisons, applications), tables/lists where technical, no front-matter unless repo book pipeline requires it — verify against wealth-book `--- title/description ---` pattern only if build fails.

## Implementation Task List (ordered)
1. Verify `docs/book/stronghold/` exists and is empty; create 10 empty placeholders only to reserve slugs (no content yet).
2. For chapters 01–10 in order, generate content via AGENT_TECHNICAL_TOPIC prompt template: inject FULL BOOK OUTLINE (titles above), currentChapter number/title/description, placement `chapter N of 10`, flow requirement.
3. Enforce per chapter: 800–1500 words, third-person only, Markdown H1/H2 + tables/lists, definitions → mechanisms → comparisons → applications.
4. Self-check each chapter: grep for `\b(I|me|my|we|our|I've|we've)\b` (case-sensitive with word boundaries, excluding quoted technical terms); fix violations; word-count check.
5. Verify filenames exactly: `01-` through `10-` slugs above, `.md` extension, kebab-case.
6. Final pass: ensure no `config.ts` touched, no cross-book imports/references, no first-person, no meta-commentary.

## Boundaries / Data Flow
- Input: this plan + `ai/Agents/AGENT_TECHNICAL_TOPIC.md` template only.
- Output: 10 Markdown files in `docs/book/stronghold/`.
- No code, no config, no other docs changes.

## Failure Modes & Mitigations
- Scope creep into offensive tactics → reject; holding/defense/resilience only.
- Overlap between Ch03/Ch05 (fortification vs active defense) → Ch03 = static works, Ch05 = dynamic actions/people/sensors.
- Overlap Ch04/Ch06 (sustainment vs continuity) → Ch04 = physical supplies, Ch06 = command/information continuity.
- Tone slip (second-person `you` like wealth book) → rewrite to third-person (`occupants, operators, teams`).
- Word-count drift → trim examples or expand mechanisms table to stay 800–1500.

## Validation
- `Test-Path docs/book/stronghold` contains exactly 10 `.md` files with approved slugs.
- Per file: word count 800–1500, no first-person pronouns, starts with H1, has ≥4 H2 sections.
- `git status` shows only `docs/book/stronghold/*.md` added; no `config.ts` modified.

## Open / Out of Scope
- No index/README/sidebar config changes (requires config edit — explicitly forbidden).
- No illustrations/diagrams.
- No translations.
