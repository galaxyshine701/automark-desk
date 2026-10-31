---
name: assignment-review
description: Review a pull request for AutoMark Desk with a fixed checklist (Jira link, scope, secrets, marks calculation, status flow, override rule, tests, build). Use when asked to review a pull request, or before merging any change for an AMD Jira task.
---

# Assignment Review

Use this on every pull request in this project so every review covers the same things, in the same order.

## How to run it

1. Read the pull request description and the diff with the GitHub MCP tools (`gh pr diff <number>` also works if the GitHub CLI is installed). Note the Jira key (AMD-n).
2. Run `npm test` and `npm run build`. Keep the real output; do not guess it.
3. Go through the checklist below. For each item write PASS or FAIL and one line of evidence (file name and what you saw).
4. Do not edit code during the review. Only report.
5. Finish with a verdict: APPROVE only if every item is PASS, otherwise CHANGES NEEDED with the list of failing items.

## Checklist

1. **Jira link**: does the pull request description contain the Jira key, and does at least one commit message start with it (for example `AMD-2: ...`)?
2. **Scope**: does the change match only that Jira task? Flag unrelated files or extra features.
3. **Secrets**: any token, password, key or personal data in code, screenshots or committed files? `.env` must not be committed and `.env.example` must hold names only.
4. **Calculation**: if marks, penalty, percentage or grade logic changed, are there tests for one fully correct, one partly correct and one late submission, with expected numbers worked out by hand?
5. **Status flow**: does the change keep Submitted, Checked, Reviewed, Final in that order, and keep editing blocked after the due date and after Final?
6. **Override rule**: can marks be overridden only with a written reason?
7. **Tests**: does `npm test` pass, and does every bug fix come with a test that fails without the fix?
8. **Build**: does `npm run build` pass?

## Output format

```
Pull request: <title> (<Jira key>)
1 Jira link:   PASS/FAIL - <evidence>
2 Scope:       PASS/FAIL - <evidence>
3 Secrets:     PASS/FAIL - <evidence>
4 Calculation: PASS/FAIL - <evidence>
5 Status flow: PASS/FAIL - <evidence>
6 Override:    PASS/FAIL - <evidence>
7 Tests:       PASS/FAIL - <npm test summary line>
8 Build:       PASS/FAIL - <npm run build result>
Verdict: APPROVE / CHANGES NEEDED
```

Mark an item N/A only when it truly does not apply (for example item 4 on a README-only change), and say why.
