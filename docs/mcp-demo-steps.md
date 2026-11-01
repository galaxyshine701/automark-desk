# Demo steps

The screen recording shows one Jira task, AMD-2 (answer matching bug), from the task to the pull request, in VS Code with Claude Code. It uses the Jira and GitHub MCP servers described in [mcp-setup.md](mcp-setup.md). Claude Code runs in manual mode and asks permission for each write.

## What the recording shows

1. **MCP is connected.** `/mcp` lists `atlassian` and `github` as connected.
2. **Read the task from Jira.** The agent reads AMD-2 through the Atlassian MCP server and summarises it.
3. **Branch and tests first.** The agent creates `fix/AMD-2-mcq-matching` from `main`. The `test-writer` sub-agent writes `tests/checkMCQ.test.js`. `npm test` runs on the old code and five tests fail. No file in `src/` is changed yet.
4. **Fix.** The agent fixes `src/utils/checkMCQ.js`, adds the option check to the instructor form, and runs `npm test` (37 of 37 pass) and `npm run build`.
5. **Commit, push, pull request.** `git diff --stat`, then a commit that starts with `AMD-2:`, a push, and a pull request into `main` that names the Jira key and the tests that failed before the fix. The agent comments the pull request link on Jira AMD-2.
6. **Review skill.** The `assignment-review` skill and the `pr-reviewer` sub-agent review the pull request with the 8-item checklist. The result is posted on the pull request and linked on Jira AMD-4.
7. **Merge limit.** The agent tries to merge through GitHub MCP and GitHub refuses (HTTP 403). The pull request is merged on GitHub in the browser instead; that part is not in the recording.
8. **Close the Jira tasks.** The agent moves AMD-1, AMD-2 and AMD-6 to Done.
9. **Pull.** `git switch main` and `git pull` bring the merged work onto the local `main`.

The recording has captions for each step. A faster 2x version is also provided.

## What is not in the recording

- The browser merge of the pull request.
- AMD-3 (storage errors), which followed the same steps with 10 failing tests before the fix.
- AMD-1, AMD-4, AMD-5 and AMD-6. Their pull requests and Jira comments are in the screenshots and on GitHub.

## Rules shown on screen

- Tokens are never typed into the repository. `.env` is ignored and `.env.example` has names only.
- Merging is done by a person on GitHub. The one time the agent was asked to merge (PR #4), GitHub refused.
