# The `assignment-review` skill

A reusable review skill for this project. File: `.claude/skills/assignment-review/SKILL.md`.

## What it is for

Reviewing a pull request the same way every time, before it is merged. The development task it covers is **code review**.

It is used with Claude Code. The agent loads the skill when asked to review a pull request or before merging any change for an `AMD` Jira task. A read-only sub-agent, `pr-reviewer` (`.claude/agents/pr-reviewer.md`), runs it so that the review cannot change code.

## What it checks

Every review answers the same eight questions, in this order, with PASS or FAIL and one line of evidence for each:

| # | Check | What counts as evidence |
|---|-------|-------------------------|
| 1 | Jira link | The pull request description contains the Jira key and a commit message starts with it |
| 2 | Scope | Only the files that belong to that Jira task changed |
| 3 | Secrets | No token, password or personal data in the diff; `.env` not committed; `.env.example` has names only |
| 4 | Calculation | If marks logic changed: tests for fully correct, partly correct and late, with hand-worked numbers |
| 5 | Status flow | Checked → Reviewed → Final kept; editing blocked after the due date and after Final |
| 6 | Override rule | Marks can be overridden only with a written reason |
| 7 | Tests | `npm test` passes; every bug fix has a test that fails without the fix |
| 8 | Build | `npm run build` passes |

The skill ends with a verdict: APPROVE only if every item is PASS, otherwise CHANGES NEEDED with the failing items. It must run `npm test` and `npm run build` and quote the real output. It never edits code.

## How it was used

It was run on pull request #4 (Jira AMD-2, the answer-matching bug fix) before the merge. The result was posted as a comment on the pull request and linked on Jira AMD-4. The 8 lines, shortened:

```
1 Jira link:   PASS - description and commit bb8daac start with the AMD-2 key
2 Scope:       PASS - only the 3 files listed for AMD-2 changed
3 Secrets:     PASS - .env not tracked, nothing in the diff
4 Calculation: PASS - tests cover fully correct, wrong and multi-question totals;
               no late-submission test, but that logic is untouched
5 Status flow: PASS - no status or due-date code touched
6 Override:    PASS - no override code touched
7 Tests:       PASS - tests 37 / pass 37 / fail 0; five new tests failed on the old code
8 Build:       PASS - vite build succeeded, 57 modules
Verdict: APPROVE (with an optional note on item 4)
```

Three things in that review were not clean, and are recorded here on purpose:

- The sub-agent first marked item 1 as FAIL. It could not read the pull request description: the GitHub CLI is not installed and the sub-agent had no GitHub tools. The main agent read the description itself, saw the Jira key, and changed item 1 to PASS before posting. The comment says so.
- For item 7 the sub-agent did not re-run the tests on the old code. The five failures on the old code come from the earlier test-first run and are listed in the pull request description.
- The sub-agent's optional note was to add an explicit test for a partly correct quiz. It was not added in this pull request.

## How it improves consistency and productivity

**Consistency.** Without the skill, a review depends on what the reviewer remembers to look at. With it, every pull request gets the same eight questions in the same order and the same output format, so two reviews can be compared line by line. The questions are specific to this app's rules (late penalty, status flow, override reason), so a change that touches marks cannot be approved without tests for them. Each answer needs evidence (file name or command output), which makes a review easy to check.

**Productivity.** One command starts the whole review, including running the tests and the build. The review of PR #4 took the agent about one and a half minutes ("Worked for 1m 27s" in the Claude Code log). Writing the checklist once also removed the need to re-explain the review rules for each pull request. This is one observed run, not a measured comparison.

## Limitations

- The `pr-reviewer` sub-agent has a limited tool list (`Read, Grep, Glob, Bash`) and cannot call the GitHub MCP tools, so it cannot read a pull request by itself. Removing the `tools:` line from `.claude/agents/pr-reviewer.md` would let it inherit them. This was not changed inside the documentation task.
- The reviewer is an AI. It does not replace reading the diff. Item 7 checks that tests pass, not that the tests are good, so the test code still needs a human read.
- The checklist is written for this project. Another project needs its own items 4 to 6.

## The test-writer sub-agent

A second sub-agent, `test-writer` (`.claude/agents/test-writer.md`), writes unit tests. Its rules: use Node's built-in test runner, work out the expected numbers by hand, run `npm test` **before** any change in `src/` and report which new tests fail (that is the bug evidence), and never edit `src/` itself. It was used for AMD-2 and AMD-3.
