# AI use log

This project was built with AI help. This log says which AI tool did what, how each piece was checked, and where the AI's work was wrong. The first part is a record of what happened. The second part is mine to write in my own words before I submit.

## Which tool did what

| Task | Tool | What the AI did | Evidence |
|------|------|-----------------|----------|
| First version of the app (initial commit) | Claude, in a chat | Wrote the app and its first documents, including the marking rules, before the repository was used | commit `161793e` |
| AMD-6 portal redesign | Claude, in a chat (code); Claude Code (Jira and pull request) | The redesign was written in the chat. Claude Code read the AMD-6 task from Jira through MCP, ran `npm run build`, opened PR #1 and commented the link on the task. It did not write this code. | PR #1, Jira AMD-6 |
| AMD-4 review skill and sub-agents | Claude, in a chat; Claude Code | The skill and the two sub-agents were written in the chat and added in PR #2. Claude Code then used them. | PR #2, `docs/skill.md` |
| AMD-1 unit tests | Claude Code | Read the task, wrote 21 tests with hand-worked numbers, added `npm test`, opened PR #3 and commented on Jira | PR #3 |
| AMD-2 answer matching | Claude Code with the `test-writer` sub-agent | Wrote tests first (5 failed on the old code), then fixed `checkMCQ` and the instructor form, opened PR #4 | PR #4 |
| AMD-2 review | Claude Code with the `assignment-review` skill and `pr-reviewer` sub-agent | Reviewed PR #4 with the 8-item checklist and posted the result | PR #4 comment, Jira AMD-4 |
| AMD-3 storage errors | Claude Code with the `test-writer` sub-agent | Wrote tests first (10 failed on the old code), then fixed `storage.js` and added the warning banner in `App.jsx`, opened PR #5 | PR #5 |
| AMD-5 documentation | Claude, in a chat; Claude Code | These documents were drafted in the chat from the real state of the repository. Claude Code committed them and opened the pull request. | this PR |

Claude Code ran in manual mode: it asked permission before editing files, running commands and writing to Jira or GitHub. Its prompts said not to merge. The one time I asked it to merge (PR #4), GitHub refused, so I merged every pull request myself on GitHub.

## Where the AI's work was wrong or incomplete

- **Broken CSS in the redesign.** The `@media (max-width: 900px)` block in `styles.css` had no closing brace, so `npm run build` failed. The brace was added before the code was committed.
- **Weak first version of the AMD-3 tests.** The six wrong-shape cases were in one test with a loop, so the test stopped at the first failure and the other five never ran. I asked for six separate tests, and the failing list then showed 5 of the 6 failing (the stored `null` case already passed).
- **Wrong claim about the warning banner.** I first asked for the pull request to say the banner is "covered by the tests". The agent corrected this: no test renders `App.jsx`, so the banner was checked by the build only. The pull request says that.
- **The reviewer could not read the pull request.** The `pr-reviewer` sub-agent first marked the Jira-link check as FAIL because it had no GitHub tools. The main agent read the pull request itself and corrected the result, and said so in the comment. See `docs/skill.md`.
- **The AI cannot merge with the token it has.** The merge request through GitHub MCP was refused with HTTP 403. See `docs/mcp-setup.md`.

## What I decided and checked (write in my own words before submitting)

- Suggested by the AI that I accepted, and why:
- Suggested by the AI that I changed, and how:
- Suggested by the AI that I rejected, and why:
- What I reviewed line by line before merging:
- A mistake I found in the AI's work:
- How the `assignment-review` skill helped (consistency, time saved):
