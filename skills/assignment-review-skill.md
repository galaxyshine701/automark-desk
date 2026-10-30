# Assignment Review Skill — reusable pull-request checklist

Use this checklist on every pull request for this project. Do not approve a PR until every item is checked.

1. Jira link: does the PR description link the Jira task, and does at least one commit message carry the Jira key?
2. Scope: does the change match only that Jira task, or has unrelated work crept in?
3. Secrets: is there any token, password, key, or personal data in the code, in a screenshot, or in a committed file? Check `.env` is not committed and `.env.example` has names only.
4. Calculation: if marks, penalty, percentage, or grade logic changed, was it tested with at least one fully correct, one partially correct, and one late submission, with hand-checked expected numbers?
5. Status flow: does the change keep Submitted → Checked → Reviewed → Final in order, and does it keep editing blocked after the due date and after Final?
6. Override rule: can marks be overridden only with a written reason?
7. Build: does `npm run build` pass?
