# Plan: Offensive and Defensive Strategy Book

## Goal

Write a 10-chapter philosophical book titled **How to Make Offensive and Defensive Strategy** into
`docs/book/offensive-and-defensive/`. Each chapter is a standalone Markdown file named
`chapter-#-title.md`, approximately 1,500 words. The book is bookended by `introduction.md` before
Chapter 1 and `summary.md` after Chapter 10. No index, README, or compiled book file.

## Constraints

- Read and write **only** inside `docs/book/offensive-and-defensive/`; do not inspect or modify other directories.
- The directory currently exists and is empty.
- Focus on philosophy and lived application — life, decision-making, organization, goals, and objectives.
  Do not turn chapters into tactical checklists or implementation manuals.
- Original prose only. No fabricated quotes, citations, statistics, or attributed aphorisms.
- No emojis. No code blocks. Clean GitHub-flavored Markdown.
- Each chapter targets 1,500 words (acceptable range 1,400–1,650), verified by word count.
- `introduction.md` and `summary.md` target 600–900 words each; they frame and close the book without
  competing with the chapters.

## Voice and Structure

- Authoritative, reflective, aphoristic but readable. Write as a strategist-philosopher addressing a
  serious reader, not as a motivational speaker.
- Each chapter opens with a concrete tension or paradox, develops one central idea philosophically,
  then turns that idea toward personal life, decisions, organizations, and long-range goals.
- Use 3–5 `##` sections per chapter. Close with a short reflective passage or question to carry,
  not an action checklist.
- Maintain a through-line: **offense without defense is exhaustion; defense without offense is decay;
  strategy is the disciplined tension between them.**
- Cross-reference earlier chapters by name where natural, but keep every chapter readable alone.

## Book Structure

```
docs/book/offensive-and-defensive/
├── introduction.md
├── chapter-1-the-two-impulses.md
├── ... (chapters 2–9)
├── chapter-10-the-integrated-life.md
└── summary.md
```

### Introduction (`introduction.md`)

- `# Introduction: The Question of Strategy`
- States the book's central problem: people treat offense and defense as opposites or as tactics,
  when they are two halves of one discipline.
- Introduces the through-line and the philosophical wager: strategy is a way of seeing and living,
  not a collection of moves.
- Previews the arc of the ten chapters without summarizing them chapter by chapter.
- Establishes the reader's stakes: decisions, organizations, goals, and a life that must both advance
  and endure.

### Summary (`summary.md`)

- `# Summary: The Strategist's Return`
- Distills the book's argument into its enduring principles: the two impulses, clear sight, initiative,
  defensive architecture, economy of force, reading the field, ethical advantage, organizational trust,
  defeat as information, and integration.
- Reads as a closing meditation, not a bulleted recap; no new arguments.
- Ends with a final charge to the reader and a question to carry into life.

## Chapter Outline

| # | Filename | Central idea |
|---|----------|--------------|
| 1 | `chapter-1-the-two-impulses.md` | The ontology of offense and defense: every living system must both advance and preserve. Strategy begins with accepting that tension rather than resolving it. |
| 2 | `chapter-2-the-strategists-eye.md` | Perception before action: the map is not the terrain. Clear seeing, self-deception, and the discipline of describing reality without flattering it. Decision-making. |
| 3 | `chapter-3-initiative-is-a-moral-choice.md` | Offense as agency and courage. The hidden cost of waiting, the ethics of acting first, and why goals require the willingness to disturb the present. |
| 4 | `chapter-4-the-architecture-of-defense.md` | Defense as design: boundaries, reserves, redundancy, and the difference between fragility and resilience. Protecting what matters without walling off growth. |
| 5 | `chapter-5-the-economy-of-force.md` | Finite energy and concentration of effort. Tradeoffs, saying no, the fallacy of total fronts, and how organizations dissipate strength through miscounting their own capacity. |
| 6 | `chapter-6-reading-the-field.md` | Uncertainty, signal versus noise, timing and tempo. Why prediction fails and preparation succeeds; how to decide when the field cannot be fully known. |
| 7 | `chapter-7-the-ethics-of-advantage.md` | Power, restraint, and legitimacy. Winning that corrodes the winner; why character is a strategic asset and trust is a defensive structure. |
| 8 | `chapter-8-the-organization-as-a-body.md` | Coordination, delegation, command, and culture. Organizations as organisms that must move and stabilize at once; trust as the connective tissue of strategy. |
| 9 | `chapter-9-defeat-and-the-long-game.md` | Failure, recovery, adaptation, and compounding. Defeat as information; the long game as the only game in which strategy matures. |
| 10 | `chapter-10-the-integrated-life.md` | Synthesis: the rhythm of advance and consolidation across a life. A strategic creed built from the previous nine chapters; goals as commitments rather than wishes. |

## Execution Steps

1. Create `introduction.md` in `docs/book/offensive-and-defensive/`, following the introduction spec above.
2. Create `chapter-1-the-two-impulses.md` through `chapter-10-the-integrated-life.md`, one file at a
   time, following the outline and voice.
3. Create `summary.md` after Chapter 10, following the summary spec above.
4. Each file begins with a single `#` title, then continuous prose.
5. Keep each chapter self-contained but allow brief forward/backward references by chapter title.
6. After writing all files, count words per file and revise any chapter outside 1,400–1,650 words, or
   either bookend outside 600–900 words.
7. Confirm the directory contains exactly 12 files: `introduction.md`, ten `chapter-#-title.md` files,
   and `summary.md`.

## Validation

Run from the repository root:

```powershell
Get-ChildItem -LiteralPath "docs\book\offensive-and-defensive" -Filter "*.md" |
  ForEach-Object { "{0}: {1} words" -f $_.Name, ((Get-Content -LiteralPath $_.FullName -Raw) -split '\s+' | Where-Object { $_ }).Count }
```

- Expect exactly 12 files: one `introduction.md`, ten `chapter-#-title.md` files, one `summary.md`.
- Chapters: 1,400–1,650 words each. Bookends: 600–900 words each.
- Spot-check that each file has one `#` heading; chapters have 3–5 `##` sections; no fabricated quotations.
- Confirm `summary.md` adds no new arguments and `introduction.md` does not pre-summarize the chapters.
- Confirm nothing outside `docs/book/offensive-and-defensive/` was created or modified.

## Out of Scope

- README, table of contents, compiled `book.md`, cover art, metadata, or publishing files.
- Tactical worksheets, templates, exercises, or implementation checklists.
- Any file outside the target directory.
