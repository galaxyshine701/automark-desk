# Testing log

## Automated tests

Run with `npm test` (Node's built-in test runner, no extra packages).

| File | Tests | Jira | Covers |
|------|-------|------|--------|
| `tests/grading.test.js` | 4 | AMD-1 | grade cut-offs, just below each cut-off, 0 and 100, Pending |
| `tests/latePenalty.test.js` | 10 | AMD-1 | late days (on time, exactly due, 1 minute, 24 hours, 24 hours + 1 minute, 48 hours), broken dates, 5% per day |
| `tests/calculateResult.test.js` | 7 | AMD-1 | fully correct, partly correct, 2 days late, penalty bigger than marks, Pending project, Pending when late, real zero |
| `tests/checkMCQ.test.js` | 16 | AMD-2 | answer matching rules, missing correct answer, the option check used by the instructor form |
| `tests/storage.test.js` | 14 | AMD-3 | nothing saved, round trip, corrupted JSON, six wrong shapes, blocked read, full or blocked write, blocked reset, no localStorage |

**Result: 51 tests, 51 pass, 0 fail.** `npm run build` also passes.

## Hand-checked numbers

The expected numbers in the tests were worked out by hand first. They are not copied from the code's own output. The assignment is a 20-mark quiz.

| Case | Hand calculation | Expected result |
|------|------------------|-----------------|
| Fully correct, on time | 4 × 5 = 20 raw, no penalty | 20 / 20, 100%, A |
| 3 of 4 correct, on time | 3 × 5 = 15 raw, no penalty | 15 / 20, 75%, C |
| Fully correct, 2 days late | penalty 5% × 20 × 2 = 2; 20 − 2 = 18 | 18 / 20, 90%, A |
| 3 raw marks, 25 days late | penalty 5% × 20 × 25 = 25, more than the marks | 0 / 20, 0%, Fail (never negative) |
| Project, rubric not scored yet | no raw marks | Pending, not 0 |
| Project scored 0 | raw marks 0 | 0 marks, Fail (a real zero is not Pending) |

## Bugs found, fixed and re-tested

Tests were written first and run against the old code. They failed, then passed after the fix.

| # | Bug | Jira | Tests that failed before the fix | After the fix |
|---|-----|------|----------------------------------|---------------|
| 1 | Repeated spaces inside an answer (`cascading   style   sheets`) did not match the stored answer | AMD-2 | `checkMCQ: repeated spaces in the middle are collapsed` (got 0, expected 2) | passes |
| 2 | A question with no stored correct answer (undefined, null or empty) gave marks to a student whose answer was the word "undefined" or "null" | AMD-2 | three tests, one each for undefined, null and empty string (got 2, expected 0) | pass |
| 3 | The same bug inside a quiz with several questions: the total was too high | AMD-2 | `checkMCQ: marks add up across questions` (got 7, expected 2: 2 + 0 + 0) | passes |
| 4 | The instructor form accepted a correct answer that is not one of the four options, so every student would get 0 | AMD-2 | found by reading the form code; the helper `correctAnswerIsAnOption` has 6 tests and the form now refuses to save | passes |
| 5 | Saved data with the wrong shape (for example `{"assignments":"abc"}`) was loaded as it was and would crash the app | AMD-3 | 5 of the 6 wrong-shape tests (the stored `null` case already passed) | all 14 storage tests pass |
| 6 | A failed save (storage full or blocked) was silent | AMD-3 | round trip, full storage and blocked write tests (`saveState` returned nothing instead of true or false) | pass; the app shows a warning banner |
| 7 | "Reset demo data" threw an error when localStorage was blocked | AMD-3 | `resetState: blocked reset ... does not throw` and the no-localStorage test | pass |

Counts: AMD-2 had 5 failing tests before the fix (37 pass after). AMD-3 had 10 failing tests before the fix (51 pass after).

Also found during the work: the `styles.css` of the redesign was missing a closing brace in one `@media` block. `npm run build` failed, the brace was added, and the build passed before that code was committed.

## Manual check in the browser

- With saved data replaced by garbage in the browser console (`localStorage.setItem('atrm-v1','{"assignments":"abc","submissions":[]}')` then reload), the app opened with the demo data instead of a white screen (AMD-3 acceptance criterion).

## Not tested

- The warning banner for a failed save has no test that renders the page. The tests check that `saveState` returns `false`; the banner was checked by the build only. It was not tried with really full or blocked storage in a browser.
- The instructor form message for a wrong correct answer ("Question N: the correct answer ... does not match any of its four options") was checked by the build and by the tests of its helper, not by clicking through the form.
- There are no tests that render React components, and no browser end-to-end tests.
